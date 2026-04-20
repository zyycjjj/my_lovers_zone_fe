"use client";

import { UiButton } from "@/shared/ui/ui-button";

type Props = {
  loading: boolean;
  success: string;
  error: string;
  onFetchSummary: () => void;
};

export function AdminControlPanel({
  error,
  loading,
  onFetchSummary,
  success,
}: Props) {
  return (
    <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-800">Admin 控制台</h1>
      <p className="mt-2 text-sm text-slate-500">管理员账号登录后可使用：支付订单审核、支付配置维护</p>
      <div className="mt-5 grid gap-4">
        <div className="flex flex-wrap gap-2">
          <UiButton onClick={onFetchSummary} disabled={loading} variant="primary">
            {loading ? "加载中..." : "获取汇总"}
          </UiButton>
        </div>
        {success ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs text-emerald-700">
            {success}
          </div>
        ) : null}
        {error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs text-rose-600">
            {error}
          </div>
        ) : null}
      </div>
    </div>
  );
}
