"use client";

import { UiButton } from "@/shared/ui/ui-button";
import { moods, statuses } from "./signal-model";

type Props = {
  token: string;
  mood: string;
  status: string;
  message: string;
  error: string;
  loading: boolean;
  onTokenChange: (value: string) => void;
  onMoodChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onSubmit: () => void;
};

export function SignalForm({
  error,
  loading,
  message,
  mood,
  onMessageChange,
  onMoodChange,
  onStatusChange,
  onSubmit,
  onTokenChange,
  status,
  token,
}: Props) {
  return (
    <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-800">今日轻信号</h1>
      <p className="mt-2 text-sm text-slate-500">轻轻告诉我你的状态，我会懂</p>
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
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm text-slate-600">心情</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {moods.map((item) => (
                <UiButton
                  key={item.value}
                  onClick={() => onMoodChange(item.value)}
                  variant={mood === item.value ? "primary" : "secondary"}
                  className="px-4 py-2 text-sm"
                >
                  {item.label}
                </UiButton>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-600">状态</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {statuses.map((item) => (
                <UiButton
                  key={item.value}
                  onClick={() => onStatusChange(item.value)}
                  variant={status === item.value ? "primary" : "secondary"}
                  className="px-4 py-2 text-sm"
                >
                  {item.label}
                </UiButton>
              ))}
            </div>
          </div>
        </div>
        <div>
          <label className="text-sm text-slate-600">想说的话（可选）</label>
          <textarea
            value={message}
            onChange={(event) => onMessageChange(event.target.value)}
            className="mt-2 min-h-[120px] w-full rounded-xl border border-rose-100 bg-white px-4 py-3 text-sm text-slate-700 focus:border-rose-300 focus:outline-none"
            placeholder="例如：今天有点忙，但想你"
          />
        </div>
        {error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs text-rose-600">
            {error}
          </div>
        ) : null}
        <UiButton
          onClick={onSubmit}
          disabled={loading}
          variant="primary"
          className="px-6 py-2 text-sm"
        >
          {loading ? "提交中..." : "提交轻信号"}
        </UiButton>
      </div>
    </div>
  );
}

