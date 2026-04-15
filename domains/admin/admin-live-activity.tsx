"use client";

import type { ActivityEvent } from "./admin-model";

export function AdminLiveActivity({ activities }: { activities: ActivityEvent[] }) {
  return (
    <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800">实时事件</h2>
      {activities.length ? (
        <ul className="mt-4 space-y-3 text-sm text-slate-700">
          {activities.map((item, index) => (
            <li
              key={`${item.occurredAt}-${index}`}
              className="rounded-xl border border-rose-100 bg-rose-50/60 px-4 py-3"
            >
              {item.key} · {item.occurredAt}
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4 text-sm text-slate-500">开启实时流后会显示按钮事件</div>
      )}
    </div>
  );
}

