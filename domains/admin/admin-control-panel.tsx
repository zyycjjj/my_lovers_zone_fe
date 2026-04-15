"use client";

import { UiButton } from "@/shared/ui/ui-button";

type Props = {
  adminPass: string;
  loading: boolean;
  streaming: boolean;
  success: string;
  error: string;
  onAdminPassChange: (value: string) => void;
  onFetchSummary: () => void;
  onStartStream: () => void;
  onSeedUsers: () => void;
};

export function AdminControlPanel({
  adminPass,
  error,
  loading,
  onAdminPassChange,
  onFetchSummary,
  onSeedUsers,
  onStartStream,
  streaming,
  success,
}: Props) {
  return (
    <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-800">Admin 控制台</h1>
      <p className="mt-2 text-sm text-slate-500">实时事件流、汇总数据、回声发送</p>
      <div className="mt-5 grid gap-4">
        <div>
          <label className="text-sm text-slate-600">Admin Pass</label>
          <input
            value={adminPass}
            onChange={(event) => onAdminPassChange(event.target.value)}
            className="mt-2 w-full rounded-xl border border-rose-100 bg-rose-50 px-4 py-2 text-sm text-slate-700 focus:border-rose-300 focus:outline-none"
            placeholder="与你后端 ADMIN_PASS 保持一致"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <UiButton onClick={onFetchSummary} disabled={loading} variant="primary">
            {loading ? "加载中..." : "获取汇总"}
          </UiButton>
          <UiButton onClick={onStartStream} variant="secondary">
            {streaming ? "实时流已开启" : "开启实时流"}
          </UiButton>
          <UiButton onClick={onSeedUsers} variant="secondary">
            一键生成三人 Token
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

