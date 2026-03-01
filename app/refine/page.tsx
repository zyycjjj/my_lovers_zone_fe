"use client";

import { useState } from "react";
import { UiButton } from "../components/ui-button";
import { apiRequest } from "../lib/api";
import { useClientToken } from "../lib/use-client-token";

type RefineResult = {
  summaryLine: string;
  sellingPoints: string[];
  risks: string[];
  suggestions: string[];
  safeRewrites: string[];
};

export default function RefinePage() {
  const { token, setToken } = useClientToken();
  const [text, setText] = useState("");
  const [result, setResult] = useState<RefineResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!token) {
      setError("请先填写 token");
      return;
    }
    if (!text.trim()) {
      setError("请输入话术内容");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest<RefineResult>("/api/tool/refine", {
        token,
        body: { text },
      });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "提炼失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-800">话术提炼</h1>
        <p className="mt-2 text-sm text-slate-500">合规提醒与卖点提炼</p>
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
            <label className="text-sm text-slate-600">原始话术</label>
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              className="mt-2 min-h-[140px] w-full rounded-xl border border-rose-100 bg-white px-4 py-3 text-sm text-slate-700 focus:border-rose-300 focus:outline-none"
              placeholder="粘贴你的话术内容"
            />
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
            {loading ? "提炼中..." : "开始提炼"}
          </UiButton>
        </div>
      </div>
      <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">提炼结果</h2>
        {result ? (
          <div className="mt-4 grid gap-5 text-sm text-slate-700">
            <div className="rounded-xl border border-rose-100 bg-rose-50/60 px-4 py-3">
              <div className="text-xs text-rose-500">一句话总结</div>
              <div className="mt-1 text-base font-medium text-slate-800">
                {result.summaryLine || "暂无"}
              </div>
            </div>
            <div className="grid gap-2">
              <div className="text-xs text-rose-500">卖点提炼</div>
              {result.sellingPoints.length ? (
                result.sellingPoints.map((item, index) => (
                  <div
                    key={`${item}-${index}`}
                    className="rounded-xl border border-rose-100 bg-white px-4 py-2"
                  >
                    {item}
                  </div>
                ))
              ) : (
                <div className="text-sm text-slate-500">暂无</div>
              )}
            </div>
            <div className="grid gap-2">
              <div className="text-xs text-rose-500">风险提示</div>
              {result.risks.length ? (
                result.risks.map((item, index) => (
                  <div
                    key={`${item}-${index}`}
                    className="rounded-xl border border-rose-100 bg-white px-4 py-2"
                  >
                    {item}
                  </div>
                ))
              ) : (
                <div className="text-sm text-slate-500">暂无</div>
              )}
            </div>
            <div className="grid gap-2">
              <div className="text-xs text-rose-500">合规建议</div>
              {result.suggestions.length ? (
                result.suggestions.map((item, index) => (
                  <div
                    key={`${item}-${index}`}
                    className="rounded-xl border border-rose-100 bg-white px-4 py-2"
                  >
                    {item}
                  </div>
                ))
              ) : (
                <div className="text-sm text-slate-500">暂无</div>
              )}
            </div>
            <div className="grid gap-2">
              <div className="text-xs text-rose-500">安全替代表达</div>
              {result.safeRewrites.length ? (
                result.safeRewrites.map((item, index) => (
                  <div
                    key={`${item}-${index}`}
                    className="rounded-xl border border-rose-100 bg-white px-4 py-2"
                  >
                    {item}
                  </div>
                ))
              ) : (
                <div className="text-sm text-slate-500">暂无</div>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-4 text-sm text-slate-500">等待提炼...</div>
        )}
      </div>
    </div>
  );
}
