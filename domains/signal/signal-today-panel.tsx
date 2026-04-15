"use client";

import type { Signal } from "./signal-model";

export function SignalTodayPanel({ today }: { today: Signal | null }) {
  return (
    <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800">今日信号</h2>
      {today ? (
        <div className="mt-4 space-y-2 text-sm text-slate-700">
          <div className="rounded-xl border border-rose-100 bg-rose-50/60 px-4 py-3">
            <div>心情：{today.mood}</div>
            <div>状态：{today.status}</div>
            <div>留言：{today.message || "无"}</div>
          </div>
        </div>
      ) : (
        <div className="mt-4 text-sm text-slate-500">今日还没有提交</div>
      )}
    </div>
  );
}

