"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { UiButton } from "@/shared/ui/ui-button";
import { apiRequest } from "@/shared/lib/api";
import { useClientToken } from "@/shared/lib/use-client-token";

type ScriptResult = {
  text: string;
};

const mdComponents = {
  h1: ({ children }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="mb-3 mt-5 text-lg font-bold text-slate-800 first:mt-0">{children}</h1>
  ),
  h2: ({ children }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mb-2 mt-4 text-base font-bold text-slate-800 first:mt-0">{children}</h2>
  ),
  h3: ({ children }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mb-2 mt-3 text-sm font-bold text-slate-700 first:mt-0">{children}</h3>
  ),
  p: ({ children }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mb-2 leading-7 text-slate-700 last:mb-0">{children}</p>
  ),
  ul: ({ children }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="mb-2 list-disc space-y-1 pl-5 text-slate-700 last:mb-0">{children}</ul>
  ),
  ol: ({ children }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="mb-2 list-decimal space-y-1 pl-5 text-slate-700 last:mb-0">{children}</ol>
  ),
  li: ({ children }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-7">{children}</li>
  ),
  strong: ({ children }: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-slate-900">{children}</strong>
  ),
  blockquote: ({ children }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="my-2 border-l-3 border-rose-300 bg-rose-50 py-2 pl-4 pr-3 text-sm text-rose-700">
      {children}
    </blockquote>
  ),
  code: ({ children, className }: React.HTMLAttributes<HTMLElement>) => {
    if (className) {
      return (
        <code className="rounded-md bg-purple-50 px-1.5 py-0.5 text-xs text-purple-700">
          {children}
        </code>
      );
    }
    return (
      <code className="rounded bg-purple-50 px-1 py-0.5 text-xs text-purple-700">
        {children}
      </code>
    );
  },
  pre: ({ children }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className="my-2 overflow-x-auto rounded-xl bg-slate-800 p-4 text-sm text-slate-200">
      {children}
    </pre>
  ),
  hr: () => <hr className="my-4 border-slate-200" />,
  a: ({ children, href }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} className="text-rose-600 underline hover:text-rose-500" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
};

export default function ScriptPage() {
  const { token, setToken } = useClientToken();
  const [keyword, setKeyword] = useState("");
  const [price, setPrice] = useState("");
  const [audience, setAudience] = useState("");
  const [scene, setScene] = useState("");
  const [style, setStyle] = useState<"short" | "live">("short");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!token) {
      setError("请先填写 token");
      return;
    }
    if (!keyword.trim()) {
      setError("请输入商品关键词");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest<ScriptResult>("/api/tool/script", {
        token,
        body: {
          keyword,
          price: price ? Number(price) : undefined,
          audience: audience || undefined,
          scene: scene || undefined,
          style,
        },
      });
      setResult(data.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-800">脚本生成</h1>
        <p className="mt-2 text-sm text-slate-500">
          短视频种草 / 直播口播脚本一键生成
        </p>
        <div className="mt-5 grid gap-4">
          {!token ? (
            <div>
              <label className="text-sm text-slate-600">访问 Token</label>
              <input
                value={token}
                onChange={(event) => setToken(event.target.value)}
                className="mt-2 w-full rounded-xl border border-rose-100 bg-rose-50 px-4 py-2 text-sm text-slate-700 focus:border-rose-300 focus:outline-none"
              />
            </div>
          ) : null}
          <div>
            <label className="text-sm text-slate-600">商品关键词</label>
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              className="mt-2 w-full rounded-xl border border-rose-100 bg-white px-4 py-2 text-sm text-slate-700 focus:border-rose-300 focus:outline-none"
              placeholder="例如：家用小风扇"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm text-slate-600">价格（可选）</label>
              <input
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                className="mt-2 w-full rounded-xl border border-rose-100 bg-white px-4 py-2 text-sm text-slate-700 focus:border-rose-300 focus:outline-none"
                placeholder="例如：99"
              />
            </div>
            <div>
              <label className="text-sm text-slate-600">目标人群（可选）</label>
              <input
                value={audience}
                onChange={(event) => setAudience(event.target.value)}
                className="mt-2 w-full rounded-xl border border-rose-100 bg-white px-4 py-2 text-sm text-slate-700 focus:border-rose-300 focus:outline-none"
                placeholder="例如：上班族"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-600">使用场景（可选）</label>
            <input
              value={scene}
              onChange={(event) => setScene(event.target.value)}
              className="mt-2 w-full rounded-xl border border-rose-100 bg-white px-4 py-2 text-sm text-slate-700 focus:border-rose-300 focus:outline-none"
              placeholder="例如：通勤、夏天宿舍"
            />
          </div>
          <div>
            <label className="text-sm text-slate-600">风格</label>
            <div className="mt-2 flex gap-2">
              <UiButton
                onClick={() => setStyle("short")}
                variant={style === "short" ? "primary" : "secondary"}
                className="px-4 py-2 text-sm"
              >
                短视频种草
              </UiButton>
              <UiButton
                onClick={() => setStyle("live")}
                variant={style === "live" ? "primary" : "secondary"}
                className="px-4 py-2 text-sm"
              >
                直播口播
              </UiButton>
            </div>
          </div>
          {error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs text-rose-600">
              {error}
            </div>
          ) : null}
          <UiButton
            onClick={submit}
            disabled={loading}
            variant="primary"
            className="px-6 py-2 text-sm"
          >
            {loading ? "生成中..." : "生成脚本"}
          </UiButton>
        </div>
      </div>
      <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">生成结果</h2>
        <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/50 p-5 text-sm">
          {result ? (
            <ReactMarkdown components={mdComponents}>{result}</ReactMarkdown>
          ) : (
            <p className="text-slate-400">等待生成内容...</p>
          )}
        </div>
      </div>
    </div>
  );
}
