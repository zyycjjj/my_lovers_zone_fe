"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../lib/api";
import { useProfiles } from "../lib/use-client-token";

type ActivityEvent = {
  type: "button_used";
  key: string;
  userId: number;
  occurredAt: string;
};

type Summary = {
  date: string;
  events: { id: number; type: string; toolKey: string; count: number }[];
  latestSignal?: {
    id: number;
    mood: string;
    status: string;
    message?: string;
    createdAt: string;
  } | null;
  echoes: { id: number; text: string; createdAt: string }[];
  photos: { id: number; url: string; createdAt: string }[];
};

type User = {
  id: number;
  token: string;
  role?: "me" | "girlfriend" | "test" | "user";
  name?: string;
  createdAt: string;
};

type EventLog = {
  id: number;
  userId: number;
  type: string;
  toolKey: string;
  count: number;
  date: string;
  updatedAt: string;
};

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export default function AdminPage() {
  const { profiles } = useProfiles();
  const [adminPass, setAdminPass] = useState("");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<EventLog[]>([]);
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [echoToken, setEchoToken] = useState(() => profiles.girlfriend);
  const [echoText, setEchoText] = useState("");
  const [error, setError] = useState("");
  const [showTokens, setShowTokens] = useState(false);

  const startStream = () => {
    if (!adminPass) {
      setError("请先填写 Admin Pass");
      return;
    }
    setStreaming(true);
  };

  useEffect(() => {
    if (!streaming || !adminPass) return;
    const url = new URL(`${apiBase}/api/event/stream`, window.location.origin);
    url.searchParams.set("adminPass", adminPass);
    const source = new EventSource(url.toString());
    source.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as ActivityEvent;
        setActivities((prev) => [data, ...prev].slice(0, 50));
      } catch {
        setActivities((prev) => [
          {
            type: "button_used",
            key: event.data,
            userId: 0,
            occurredAt: new Date().toISOString(),
          },
          ...prev,
        ]);
      }
    };
    source.onerror = () => {
      source.close();
      setStreaming(false);
    };
    return () => source.close();
  }, [adminPass, streaming]);

  const fetchSummary = async () => {
    if (!adminPass) {
      setError("请先填写 Admin Pass");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const [data, userList, eventLogs] = await Promise.all([
        apiRequest<Summary>("/api/me/summary", { adminPass }),
        apiRequest<User[]>("/api/me/users", { adminPass }),
        apiRequest<EventLog[]>("/api/me/events", { adminPass }),
      ]);
      setSummary(data);
      setUsers(userList ?? []);
      setLogs(eventLogs ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载失败");
    } finally {
      setLoading(false);
    }
  };

  const sendEcho = async () => {
    if (!adminPass) {
      setError("请先填写 Admin Pass");
      return;
    }
    if (!echoToken.trim() || !echoText.trim()) {
      setError("请填写 token 和回声内容");
      return;
    }
    setError("");
    try {
      await apiRequest("/api/echo", {
        adminPass,
        body: { token: echoToken.trim(), text: echoText.trim() },
      });
      setEchoText("");
      await fetchSummary();
    } catch (err) {
      setError(err instanceof Error ? err.message : "发送失败");
    }
  };

  const eventStats = useMemo(() => {
    if (!summary) return [];
    return summary.events.map((item) => ({
      label: `${item.type} ${item.toolKey || ""}`.trim(),
      count: item.count,
    }));
  }, [summary]);

  const maskToken = (value: string) => {
    if (value.length <= 8) return value;
    return `${value.slice(0, 3)}***${value.slice(-3)}`;
  };

  const copyToken = async (value: string) => {
    await navigator.clipboard.writeText(value);
  };

  return (
    <div className="grid gap-6">
      <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-800">Admin 控制台</h1>
        <p className="mt-2 text-sm text-slate-500">
          实时事件流、汇总数据、回声发送
        </p>
        <div className="mt-5 grid gap-4">
          <div>
            <label className="text-sm text-slate-600">Admin Pass</label>
            <input
              value={adminPass}
              onChange={(event) => setAdminPass(event.target.value)}
              className="mt-2 w-full rounded-xl border border-rose-100 bg-rose-50 px-4 py-2 text-sm text-slate-700 focus:border-rose-300 focus:outline-none"
              placeholder="与你后端 ADMIN_PASS 保持一致"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={fetchSummary}
              disabled={loading}
              className="rounded-full bg-rose-500 px-6 py-2 text-sm font-medium text-white hover:bg-rose-600 disabled:opacity-60"
            >
              {loading ? "加载中..." : "获取汇总"}
            </button>
            <button
              onClick={startStream}
              className="rounded-full border border-rose-200 px-6 py-2 text-sm text-rose-600 hover:bg-rose-50"
            >
              {streaming ? "实时流已开启" : "开启实时流"}
            </button>
            <button
              onClick={async () => {
                if (!adminPass) {
                  setError("请先填写 Admin Pass");
                  return;
                }
                setError("");
                try {
                  await apiRequest("/api/me/seed-users", {
                    adminPass,
                    body: {},
                    method: "POST",
                  });
                  await fetchSummary();
                } catch (err) {
                  setError(err instanceof Error ? err.message : "生成失败");
                }
              }}
              className="rounded-full border border-rose-200 px-6 py-2 text-sm text-rose-600 hover:bg-rose-50"
            >
              一键生成三人 Token
            </button>
          </div>
          {error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs text-rose-600">
              {error}
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
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
            <div className="mt-4 text-sm text-slate-500">
              开启实时流后会显示按钮事件
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">发送回声</h2>
          <div className="mt-4 grid gap-3">
            <input
              value={echoToken}
              onChange={(event) => setEchoToken(event.target.value)}
              className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-2 text-sm text-slate-700 focus:border-rose-300 focus:outline-none"
              placeholder="要发送的用户 token"
            />
            <input
              value={echoText}
              onChange={(event) => setEchoText(event.target.value)}
              className="rounded-xl border border-rose-100 bg-white px-4 py-2 text-sm text-slate-700 focus:border-rose-300 focus:outline-none"
              placeholder="一句温柔的话"
            />
            <button
              onClick={sendEcho}
              className="rounded-full bg-rose-500 px-6 py-2 text-sm font-medium text-white hover:bg-rose-600"
            >
              发送回声
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">今日汇总</h2>
        {summary ? (
          <div className="mt-4 grid gap-6 text-sm text-slate-700 md:grid-cols-2">
            <div className="space-y-2">
              <div className="text-xs text-rose-500">事件统计</div>
              {eventStats.length ? (
                eventStats.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-xl border border-rose-100 bg-rose-50/60 px-4 py-2"
                  >
                    <span>{item.label}</span>
                    <span className="font-medium text-rose-600">
                      {item.count}
                    </span>
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
                    <div
                      key={item.id}
                      className="overflow-hidden rounded-xl border border-rose-100"
                    >
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
                <button
                  onClick={() => setShowTokens((prev) => !prev)}
                  className="rounded-full border border-rose-200 px-3 py-1 text-xs text-rose-600 hover:bg-rose-50"
                >
                  {showTokens ? "隐藏完整 token" : "显示完整 token"}
                </button>
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
                      <button
                        onClick={() => copyToken(user.token)}
                        className="rounded-full border border-rose-200 px-3 py-1 text-xs text-rose-600 hover:bg-rose-50"
                      >
                        复制
                      </button>
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
                    用户#{item.userId} · {item.type}{" "}
                    {item.toolKey ? `(${item.toolKey})` : ""} · {item.count} ·{" "}
                    {item.date}
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
    </div>
  );
}
