"use client";

import { UiButton } from "@/shared/ui/ui-button";

export function TitleFormCard({
  error,
  keyword,
  loading,
  style,
  token,
  onKeywordChange,
  onStyleChange,
  onSubmit,
  onTokenChange,
}: {
  token: string;
  keyword: string;
  style: string;
  loading: boolean;
  error: string;
  onTokenChange: (value: string) => void;
  onKeywordChange: (value: string) => void;
  onStyleChange: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-800">标题生成</h1>
      <p className="mt-2 text-sm text-slate-500">一键输出 20 条爆款标题</p>
      <div className="mt-5 grid gap-4">
        {!token ? (
          <div>
            <label className="text-sm text-slate-600">访问 Token</label>
            <input
              value={token}
              onChange={(event) => onTokenChange(event.target.value)}
              className="mt-2 w-full rounded-xl border border-rose-100 bg-rose-50 px-4 py-2 text-sm text-slate-700 focus:border-rose-300 focus:outline-none"
            />
          </div>
        ) : null}
        <div>
          <label className="text-sm text-slate-600">商品关键词</label>
          <input
            value={keyword}
            onChange={(event) => onKeywordChange(event.target.value)}
            className="mt-2 w-full rounded-xl border border-rose-100 bg-white px-4 py-2 text-sm text-slate-700 focus:border-rose-300 focus:outline-none"
            placeholder="例如：香薰蜡烛"
          />
        </div>
        <div>
          <label className="text-sm text-slate-600">风格（可选）</label>
          <input
            value={style}
            onChange={(event) => onStyleChange(event.target.value)}
            className="mt-2 w-full rounded-xl border border-rose-100 bg-white px-4 py-2 text-sm text-slate-700 focus:border-rose-300 focus:outline-none"
            placeholder="例如：温柔、治愈、口语化"
          />
        </div>
        {error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs text-rose-600">
            {error}
          </div>
        ) : null}
        <UiButton onClick={onSubmit} disabled={loading} variant="primary" className="px-6 py-2 text-sm">
          {loading ? "生成中..." : "生成标题"}
        </UiButton>
      </div>
    </div>
  );
}

