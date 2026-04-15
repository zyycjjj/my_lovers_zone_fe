"use client";

import Image from "next/image";
import { UiButton } from "@/shared/ui/ui-button";
import type { EventLog, Summary, User } from "./admin-model";

type Props = {
  eventStats: Array<{ label: string; count: number }>;
  logs: EventLog[];
  showTokens: boolean;
  summary: Summary | null;
  users: User[];
  onCopyToken: (value: string) => void;
  onToggleShowTokens: () => void;
  maskToken: (value: string) => string;
};

export function AdminSummaryPanel({
  eventStats,
  logs,
  maskToken,
  onCopyToken,
  onToggleShowTokens,
  showTokens,
  summary,
  users,
}: Props) {
  return (
    <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800">今日汇总</h2>
      {summary ? (
        <div className="mt-4 grid gap-6 text-sm text-slate-700 md:grid-cols-2">
          <div className="space-y-2">
            <div className="text-xs text-rose-500">事件统计</div>
            {eventStats.length ? (
              eventStats.map((item, index) => (
                <div
                  key={`${item.label}-${index}`}
                  className="flex items-center justify-between rounded-xl border border-rose-100 bg-rose-50/60 px-4 py-2"
                >
                  <span>{item.label}</span>
                  <span className="font-medium text-rose-600">{item.count}</span>
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-500">暂无事件</div>
            )}
          </div>

          <div className="space-y-2">
            <div className="text-xs text-rose-500">最近轻信号</div>
            {summary.latestSignal ? (
              <div className="rounded-xl border border-rose-100 bg-white px-4 py-3">
                <div>心情：{summary.latestSignal.mood}</div>
                <div>状态：{summary.latestSignal.status}</div>
                <div>留言：{summary.latestSignal.message || "无"}</div>
              </div>
            ) : (
              <div className="text-sm text-slate-500">暂无</div>
            )}
          </div>

          <div className="space-y-2">
            <div className="text-xs text-rose-500">回声列表</div>
            {summary.echoes.length ? (
              summary.echoes.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-rose-100 bg-white px-4 py-2"
                >
                  {item.text}
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-500">暂无</div>
            )}
          </div>

          <div className="space-y-2">
            <div className="text-xs text-rose-500">最新照片</div>
            {summary.photos.length ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {summary.photos.map((item) => (
                  <div key={item.id} className="overflow-hidden rounded-xl border border-rose-100">
                    <Image
                      src={item.url}
                      alt="photo"
                      width={320}
                      height={200}
                      className="h-32 w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-slate-500">暂无</div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-rose-500">
              <span>用户列表</span>
              <UiButton
                onClick={onToggleShowTokens}
                variant="secondary"
                className="px-3 py-1 text-xs"
              >
                {showTokens ? "隐藏完整 token" : "显示完整 token"}
              </UiButton>
            </div>
            {users.length ? (
              users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-xl border border-rose-100 bg-white px-4 py-2"
                >
                  <span>
                    #{user.id} · {user.role ?? "user"} {user.name ? `· ${user.name}` : ""}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">
                      {showTokens ? user.token : maskToken(user.token)}
                    </span>
                    <UiButton
                      onClick={() => onCopyToken(user.token)}
                      variant="secondary"
                      className="px-3 py-1 text-xs"
                    >
                      复制
                    </UiButton>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-500">暂无用户</div>
            )}
          </div>

          <div className="space-y-2">
            <div className="text-xs text-rose-500">操作记录</div>
            {logs.length ? (
              logs.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-rose-100 bg-rose-50/60 px-4 py-2"
                >
                  用户#{item.userId} · {item.type} {item.toolKey ? `(${item.toolKey})` : ""} ·{" "}
                  {item.count} · {item.date}
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-500">暂无记录</div>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-4 text-sm text-slate-500">尚未加载汇总</div>
      )}
    </div>
  );
}

