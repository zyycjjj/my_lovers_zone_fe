"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { apiRequest } from "./lib/api";
import { useClientToken, useProfiles } from "./lib/use-client-token";

type EchoItem = {
  id: number;
  text: string;
  createdAt: string;
};

type EchoResponse = {
  items: EchoItem[];
};

type ActivityEvent = {
  type: "button_used";
  key: string;
  userId: number;
  occurredAt: string;
};

const tools = [
  { title: "脚本生成", desc: "短视频/直播口播脚本", href: "/script" },
  { title: "标题生成", desc: "爆款标题一键产出", href: "/title" },
  { title: "佣金计算", desc: "收益预估与对比", href: "/commission" },
  { title: "话术提炼", desc: "合规建议与卖点提炼", href: "/refine" },
  { title: "轻信号", desc: "今日状态轻轻告诉我", href: "/signal" },
];

export default function Home() {
  const { token, setToken } = useClientToken();
  const { profiles, setProfiles } = useProfiles();
  const [origin, setOrigin] = useState("");
  const [echoes, setEchoes] = useState<EchoItem[]>([]);
  const [echoLoading, setEchoLoading] = useState(false);
  const [error, setError] = useState("");
  const [activityPass, setActivityPass] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("love.adminPass") ?? "";
  });
  const [activityStreamOn, setActivityStreamOn] = useState(false);
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [activityError, setActivityError] = useState("");
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const role = useMemo(() => {
    if (!token) return "guest";
    if (token === profiles.girlfriend) return "girlfriend";
    if (token === profiles.test) return "test";
    if (token === profiles.me) return "me";
    return "guest";
  }, [profiles, token]);

  const fetchEcho = useCallback(async () => {
    if (!token) return;
    setEchoLoading(true);
    setError("");
    try {
      const data = await apiRequest<EchoResponse>("/api/echo/latest", { token });
      setEchoes(data.items ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "回声加载失败");
    } finally {
      setEchoLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchEcho();
  }, [fetchEcho]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("love.adminPass", activityPass);
  }, [activityPass]);

  const canSeeActivity = role === "me" || role === "test";

  useEffect(() => {
    if (!canSeeActivity || !activityStreamOn || !activityPass) return;
    const url = new URL(`${apiBase}/api/event/stream`, window.location.origin);
    url.searchParams.set("adminPass", activityPass);
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
      setActivityStreamOn(false);
    };
    return () => source.close();
  }, [activityPass, activityStreamOn, apiBase, canSeeActivity]);

  const sendLoveEvent = async (key: string) => {
    if (!token) {
      setError("请先填写你的访问 token");
      return;
    }
    setError("");
    try {
      await apiRequest("/api/event", {
        token,
        body: { type: "button_used", key: `${role}.${key}` },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "发送失败");
    }
  };

  const updateProfile = (key: keyof typeof profiles, value: string) => {
    setProfiles({ ...profiles, [key]: value.trim() });
  };

  const buildLink = (value: string) =>
    value ? `${origin}/?t=${encodeURIComponent(value)}` : "";

  const copyLink = async (value: string) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
  };

  const startActivityStream = () => {
    if (!activityPass.trim()) {
      setActivityError("请填写 Admin Pass 才能查看点击记录");
      return;
    }
    setActivityError("");
    setActivityStreamOn(true);
  };

  const showTokenConfig = role !== "girlfriend";

  return (
    <div className="space-y-10">
      <section className="grid gap-6 rounded-3xl bg-white/80 p-8 shadow-sm">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-rose-400">
            温柔与效率兼得
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
            送给她的轻信号小站，也送给你的带货工具箱
          </h1>
          <p className="max-w-2xl text-base text-slate-600">
            不打扰、不监控，只在需要时轻轻回应。今天的状态、一次按钮、
            一句话回声，都是爱的提示。
          </p>
        </div>
        {showTokenConfig ? (
          <div className="grid gap-4 rounded-2xl border border-rose-100 bg-rose-50/60 p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <span className="text-sm font-medium text-slate-700">
                当前访问 Token
              </span>
              <input
                value={token}
                onChange={(event) => setToken(event.target.value)}
                className="w-full rounded-full border border-rose-200 bg-white px-4 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
                placeholder="在链接里带上 ?t=你的token"
              />
            </div>
            <div className="text-xs text-slate-500">
              访问链接格式：{origin || "https://love.zychenyao.cn"}?t=你的token
            </div>
          </div>
        ) : null}
      </section>

      {showTokenConfig ? (
        <section className="grid gap-6">
          <h2 className="text-xl font-semibold text-slate-800">
            访问入口（三人）
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: "测试", key: "test" as const },
              { label: "女朋友", key: "girlfriend" as const },
              { label: "你自己", key: "me" as const },
            ].map((item) => {
              const link = buildLink(profiles[item.key]);
              return (
                <div
                  key={item.key}
                  className="flex flex-col gap-3 rounded-2xl border border-rose-100 bg-white p-5 shadow-sm"
                >
                  <div className="text-sm font-semibold text-slate-700">
                    {item.label}
                  </div>
                  <input
                    value={profiles[item.key]}
                    onChange={(event) =>
                      updateProfile(item.key, event.target.value)
                    }
                    className="rounded-full border border-rose-100 bg-rose-50 px-4 py-2 text-sm text-slate-700 focus:border-rose-300 focus:outline-none"
                    placeholder="设置专属 token"
                  />
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="truncate">{link || "请先填写 token"}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => link && window.open(link, "_blank")}
                      className="flex-1 rounded-full bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600"
                    >
                      打开链接
                    </button>
                    <button
                      onClick={() => copyLink(link)}
                      className="flex-1 rounded-full border border-rose-200 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                    >
                      复制
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800">爱的按钮</h3>
          <p className="text-sm text-slate-500">
            点一下就好，我会收到你的小心意。
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => sendLoveEvent("hug")}
              className="rounded-2xl bg-rose-500 px-4 py-3 text-sm font-medium text-white hover:bg-rose-600"
            >
              给你抱抱
            </button>
            <button
              onClick={() => sendLoveEvent("miss")}
              className="rounded-2xl bg-rose-100 px-4 py-3 text-sm font-medium text-rose-700 hover:bg-rose-200"
            >
              想你了
            </button>
            <button
              onClick={() => sendLoveEvent("ok")}
              className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-rose-600 shadow-sm hover:bg-rose-50"
            >
              我很好
            </button>
            <button
              onClick={() => sendLoveEvent("busy")}
              className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-rose-600 shadow-sm hover:bg-rose-50"
            >
              忙但想你
            </button>
          </div>
          {error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-600">
              {error}
            </div>
          ) : null}
        </div>

        <div className="space-y-4 rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">最近回声</h3>
            <button
              onClick={fetchEcho}
              className="text-xs text-rose-500 hover:text-rose-600"
            >
              刷新
            </button>
          </div>
          {echoLoading ? (
            <div className="text-sm text-slate-500">加载中...</div>
          ) : echoes.length ? (
            <ul className="space-y-3 text-sm text-slate-700">
              {echoes.map((item) => (
                <li
                  key={item.id}
                  className="rounded-xl border border-rose-100 bg-rose-50/60 px-4 py-3"
                >
                  {item.text}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-slate-500">
              还没有回声，去 Admin 发一句话给她吧。
            </div>
          )}
        </div>
      </section>

      {canSeeActivity ? (
        <section className="grid gap-6">
          <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  点击记录
                </h3>
                <p className="text-sm text-slate-500">
                  实时查看她/测试的按钮点击
                </p>
              </div>
              <button
                onClick={startActivityStream}
                className="rounded-full border border-rose-200 px-5 py-2 text-sm text-rose-600 hover:bg-rose-50"
              >
                {activityStreamOn ? "已开启" : "开启实时流"}
              </button>
            </div>
            <div className="mt-4 grid gap-3">
              <input
                value={activityPass}
                onChange={(event) => setActivityPass(event.target.value)}
                className="w-full rounded-xl border border-rose-100 bg-rose-50 px-4 py-2 text-sm text-slate-700 focus:border-rose-300 focus:outline-none"
                placeholder="Admin Pass（与后端 ADMIN_PASS 一致）"
              />
              {activityError ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs text-rose-600">
                  {activityError}
                </div>
              ) : null}
              {activities.length ? (
                <ul className="space-y-3 text-sm text-slate-700">
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
                <div className="text-sm text-slate-500">
                  开启实时流后会显示按钮点击
                </div>
              )}
            </div>
          </div>
        </section>
      ) : null}

      <section className="grid gap-4">
        <h2 className="text-xl font-semibold text-slate-800">工具入口</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.title}
              href={tool.href}
              className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-rose-200"
            >
              <h3 className="text-base font-semibold text-slate-800">
                {tool.title}
              </h3>
              <p className="mt-2 text-sm text-slate-500">{tool.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
