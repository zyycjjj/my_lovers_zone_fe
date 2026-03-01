"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { UiButton } from "./components/ui-button";
import { apiRequest } from "./lib/api";
import { useClientToken, useProfiles } from "./lib/use-client-token";

type EchoItem = {
  id: number;
  text: string;
  createdAt: string;
};

type Photo = {
  id: number;
  url: string;
  createdAt: string;
};

  type EchoResponse = EchoItem[] | { items: EchoItem[] };

type ProfileResponse = {
  role?: "me" | "girlfriend" | "test" | "user" | null;
  name?: string | null;
};

type ActivityEvent = {
  type: "button_used";
  key: string;
  userId: number;
  occurredAt: string;
};

const loveKeyLabels: Record<string, string> = {
  hug: "给你抱抱",
  miss: "想你了",
  ok: "我很好",
  busy: "忙但想你",
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
  const [loveToast, setLoveToast] = useState<{
    visible: boolean;
    message: string;
  }>({ visible: false, message: "" });
  const [showReward, setShowReward] = useState(false);
  const [lovePhotos, setLovePhotos] = useState<Photo[]>([]);
  const [photoUploading, setPhotoUploading] = useState(false);
  const rewardInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [serverRole, setServerRole] = useState<ProfileResponse["role"]>(null);
  const [activityPass, setActivityPass] = useState("");
  const [activityStreamOn, setActivityStreamOn] = useState(false);
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [activityError, setActivityError] = useState("");
  const [activitySuccess, setActivitySuccess] = useState("");
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
      const storedPass = localStorage.getItem("love.adminPass");
      if (storedPass) setActivityPass(storedPass);
    }
  }, []);

  const derivedRole = useMemo(() => {
    if (!token) return "guest";
    if (token === profiles.girlfriend) return "girlfriend";
    if (token === profiles.test) return "test";
    if (token === profiles.me) return "me";
    return "guest";
  }, [profiles, token]);

  const role =
    serverRole && serverRole !== "user" ? serverRole : derivedRole;

  const isGirlfriend = role === "girlfriend";
  const heroTitle = isGirlfriend
    ? "给你的轻信号小站"
    : "送给她的轻信号小站，也送给你的带货工具箱";
  const heroDesc = isGirlfriend
    ? "不打扰、不监控，只在需要时轻轻回应。今天的状态、一次按钮，都是爱的提示。"
    : "不打扰、不监控，只在需要时轻轻回应。今天的状态、一次按钮、一句话回声，都是爱的提示。";
  const heroTagline = isGirlfriend ? "只想轻轻回应" : "温柔与效率兼得";
  const messageTitle = isGirlfriend ? "他发来的话" : "她发来的话";
  const emptyMessageText = isGirlfriend
    ? "还没有收到他的话。"
    : "还没有收到她的话。";

  const fetchEcho = useCallback(async () => {
    if (!token) return;
    setEchoLoading(true);
    setError("");
    try {
      const data = await apiRequest<EchoResponse>("/api/echo/latest", { token });
      const items = Array.isArray(data) ? data : data.items ?? [];
      setEchoes(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "回声加载失败");
    } finally {
      setEchoLoading(false);
    }
  }, [token]);

  const loadLovePhotos = useCallback(async () => {
    if (!token) return;
    try {
      const data = await apiRequest<Photo[]>("/api/photo/latest", { token });
      setLovePhotos(data ?? []);
    } catch {
      setLovePhotos([]);
    }
  }, [token]);

  useEffect(() => {
    fetchEcho();
    loadLovePhotos();
  }, [fetchEcho, loadLovePhotos]);

  useEffect(() => {
    if (!token) {
      setServerRole(null);
      return;
    }
    let active = true;
    apiRequest<ProfileResponse>("/api/echo/profile", { token })
      .then((data) => {
        if (active) setServerRole(data?.role ?? "user");
      })
      .catch(() => {
        if (active) setServerRole(null);
      });
    return () => {
      active = false;
    };
  }, [token]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("love.adminPass", activityPass);
  }, [activityPass]);

  const canSeeActivity = role === "me" || role === "test";

  const resolvePhotoUrl = useCallback(
    (url: string) => {
      if (!url) return url;
      if (url.startsWith("http")) return url;
      if (!apiBase) return url;
      return `${apiBase}${url}`;
    },
    [apiBase],
  );

  const latestLoveMessage = useMemo(() => {
    const latest = activities.find((item) =>
      item.key.startsWith("girlfriend."),
    );
    if (!latest) return "";
    const key = latest.key.split(".")[1] ?? latest.key;
    return loveKeyLabels[key] ?? latest.key;
  }, [activities]);

  const latestEchoText = echoes[0]?.text?.trim() ?? "";
  const latestMessage = isGirlfriend
    ? latestEchoText
    : latestEchoText || latestLoveMessage;

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
      setActivitySuccess("");
      setActivityError("实时流连接失败，请检查 Admin Pass");
    };
    return () => source.close();
  }, [activityPass, activityStreamOn, apiBase, canSeeActivity]);

  const sendLoveEvent = async (key: string) => {
    if (!token) {
      setError("请先填写你的访问 token");
      setLoveToast({ visible: true, message: "请先填写你的访问 token" });
      setTimeout(() => {
        setLoveToast({ visible: false, message: "" });
      }, 2000);
      return;
    }
    setError("");
    try {
      const targetToken =
        role === "me"
          ? profiles.girlfriend
          : role === "girlfriend"
            ? profiles.me
            : "";
      await apiRequest("/api/event", {
        token,
        body: {
          type: "button_used",
          key: `${role}.${key}`,
          targetToken: targetToken || undefined,
        },
      });
      setLoveToast({ visible: true, message: "已发送给对方" });
      setShowReward(true);
      setTimeout(() => {
        setLoveToast({ visible: false, message: "" });
      }, 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "发送失败";
      setError(message);
      setLoveToast({ visible: true, message });
      setTimeout(() => {
        setLoveToast({ visible: false, message: "" });
      }, 2000);
    }
  };

  const uploadLovePhoto = async (file: File) => {
    if (!token) {
      setLoveToast({ visible: true, message: "请先填写你的访问 token" });
      setTimeout(() => {
        setLoveToast({ visible: false, message: "" });
      }, 2000);
      return;
    }
    setPhotoUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const targetToken =
        role === "me"
          ? profiles.girlfriend
          : role === "girlfriend"
            ? profiles.me
            : "";
      if (targetToken) form.append("targetToken", targetToken);
      await apiRequest("/api/photo", { token, body: form, isForm: true });
      await loadLovePhotos();
      setLoveToast({ visible: true, message: "照片已发送" });
      setTimeout(() => {
        setLoveToast({ visible: false, message: "" });
      }, 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "上传失败";
      setLoveToast({ visible: true, message });
      setTimeout(() => {
        setLoveToast({ visible: false, message: "" });
      }, 2000);
    } finally {
      setPhotoUploading(false);
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
    setActivitySuccess("实时流已开启");
    setActivityStreamOn(true);
  };

  const showTokenConfig = role !== "girlfriend";
  const showTools = role !== "girlfriend";

  return (
    <div className="space-y-10">
      <section className="grid gap-6 rounded-3xl bg-white/80 p-8 shadow-sm">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-rose-400">
            {heroTagline}
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
            {heroTitle}
          </h1>
          <p className="max-w-2xl text-base text-slate-600">
            {heroDesc}
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
                    <UiButton
                      onClick={() => link && window.open(link, "_blank")}
                      variant="primary"
                      className="flex-1 px-4 py-2 text-sm"
                    >
                      打开链接
                    </UiButton>
                    <UiButton
                      onClick={() => copyLink(link)}
                      variant="secondary"
                      className="flex-1 px-4 py-2 text-sm"
                    >
                      复制
                    </UiButton>
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
            <UiButton
              onClick={() => sendLoveEvent("hug")}
              variant="primary"
              className="rounded-2xl px-4 py-3 text-sm"
            >
              给你抱抱
            </UiButton>
            <UiButton
              onClick={() => sendLoveEvent("miss")}
              variant="secondary"
              className="rounded-2xl px-4 py-3 text-sm"
            >
              想你了
            </UiButton>
            <UiButton
              onClick={() => sendLoveEvent("ok")}
              variant="ghost"
              className="rounded-2xl px-4 py-3 text-sm shadow-sm"
            >
              我很好
            </UiButton>
            <UiButton
              onClick={() => sendLoveEvent("busy")}
              variant="ghost"
              className="rounded-2xl px-4 py-3 text-sm shadow-sm"
            >
              忙但想你
            </UiButton>
          </div>
          {error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-600">
              {error}
            </div>
          ) : null}
          <div className="space-y-3 rounded-2xl border border-rose-100 bg-rose-50/60 p-4">
            <div className="text-sm text-slate-600">奖励照片</div>
            {showReward ? (
              <div className="flex items-center gap-2">
                <UiButton
                  onClick={() => rewardInputRef.current?.click()}
                  variant="secondary"
                  className="px-4 py-2 text-sm"
                  disabled={photoUploading}
                >
                  {photoUploading ? "上传中..." : "拍照上传"}
                </UiButton>
                <input
                  ref={rewardInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  capture="environment"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) uploadLovePhoto(file);
                    if (event.target) event.target.value = "";
                  }}
                  className="hidden"
                />
              </div>
            ) : null}
            {lovePhotos.length ? (
              role === "girlfriend" ? (
                <div className="overflow-hidden rounded-xl border border-rose-100 bg-white">
                  <Image
                    src={resolvePhotoUrl(lovePhotos[0]?.url ?? "")}
                    alt="reward"
                    width={240}
                    height={180}
                    unoptimized
                    className="h-24 w-full object-cover"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {lovePhotos.slice(0, 4).map((photo) => (
                    <button
                      key={photo.id}
                      className="overflow-hidden rounded-xl border border-rose-100 bg-white"
                      onClick={() => setPreviewUrl(resolvePhotoUrl(photo.url))}
                      aria-label="查看大图"
                    >
                      <Image
                        src={resolvePhotoUrl(photo.url)}
                        alt="reward"
                        width={240}
                        height={180}
                        unoptimized
                        className="h-24 w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )
            ) : (
              <div className="text-xs text-slate-500">还没有照片</div>
            )}
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">
              {messageTitle}
            </h3>
            <UiButton
              onClick={fetchEcho}
              variant="ghost"
              className="px-2 py-1 text-xs"
            >
              刷新
            </UiButton>
          </div>
          {echoLoading ? (
            <div className="text-sm text-slate-500">加载中...</div>
          ) : latestMessage ? (
            <div className="rounded-xl border border-rose-100 bg-rose-50/60 px-4 py-3 text-sm text-slate-700">
              {latestMessage}
            </div>
          ) : (
            <div className="text-sm text-slate-500">{emptyMessageText}</div>
          )}
        </div>
      </section>
      {previewUrl ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setPreviewUrl(null)}
        >
          <div className="max-h-[90vh] max-w-[90vw] overflow-hidden rounded-2xl shadow-2xl">
            <Image
              src={previewUrl}
              alt="reward full"
              width={1200}
              height={900}
              unoptimized
              className="h-auto w-full"
            />
          </div>
        </div>
      ) : null}

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
              <UiButton
                onClick={startActivityStream}
                variant="secondary"
                className="px-5 py-2 text-sm"
              >
                {activityStreamOn ? "已开启" : "开启实时流"}
              </UiButton>
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
              {activitySuccess ? (
                <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs text-emerald-600">
                  {activitySuccess}
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

      {showTools ? (
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
      ) : null}
      {loveToast.visible ? (
        <div className="fixed bottom-4 right-4 z-50 rounded-xl bg-rose-500 px-4 py-2 text-sm text-white shadow-lg">
          {loveToast.message}
        </div>
      ) : null}
    </div>
  );
}
