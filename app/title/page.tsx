"use client";

import { useState } from "react";
import { apiRequest } from "../lib/api";
import { useClientToken } from "../lib/use-client-token";

type TitleResult = {
  titles: string[];
};

export default function TitlePage() {
  const { token, setToken } = useClientToken();
  const [keyword, setKeyword] = useState("");
  const [style, setStyle] = useState("");
  const [titles, setTitles] = useState<string[]>([]);
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
      const data = await apiRequest<TitleResult>("/api/tool/title", {
        token,
        body: { keyword, style: style || undefined },
      });
      setTitles(data.titles ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-800">标题生成</h1>
        <p className="mt-2 text-sm text-slate-500">
          一键输出 20 条爆款标题
        </p>
        <div className="mt-5 grid gap-4">
          <div>
            <label className="text-sm text-slate-600">访问 Token</label>
            <input
              value={token}
              onChange={(event) => setToken(event.target.value)}
              className="mt-2 w-full rounded-xl border border-rose-100 bg-rose-50 px-4 py-2 text-sm text-slate-700 focus:border-rose-300 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-slate-600">商品关键词</label>
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              className="mt-2 w-full rounded-xl border border-rose-100 bg-white px-4 py-2 text-sm text-slate-700 focus:border-rose-300 focus:outline-none"
              placeholder="例如：香薰蜡烛"
            />
          </div>
          <div>
            <label className="text-sm text-slate-600">风格（可选）</label>
            <input
              value={style}
              onChange={(event) => setStyle(event.target.value)}
              className="mt-2 w-full rounded-xl border border-rose-100 bg-white px-4 py-2 text-sm text-slate-700 focus:border-rose-300 focus:outline-none"
              placeholder="例如：温柔、治愈、口语化"
            />
          </div>
          {error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs text-rose-600">
              {error}
            </div>
          ) : null}
          <button
            onClick={submit}
            disabled={loading}
            className="rounded-full bg-rose-500 px-6 py-2 text-sm font-medium text-white hover:bg-rose-600 disabled:opacity-60"
          >
            {loading ? "生成中..." : "生成标题"}
          </button>
        </div>
      </div>
      <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">生成结果</h2>
        {titles.length ? (
          <ul className="mt-4 grid gap-2 text-sm text-slate-700">
            {titles.map((title, index) => (
              <li
                key={`${title}-${index}`}
                className="rounded-xl border border-rose-100 bg-rose-50/60 px-4 py-2"
              >
                {title}
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-4 text-sm text-slate-500">等待生成内容...</div>
        )}
      </div>
    </div>
  );
}
