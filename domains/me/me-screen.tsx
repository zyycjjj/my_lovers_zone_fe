"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiClientError, apiRequest } from "@/shared/lib/api";
import { clearAuthSession, useAuthSession } from "@/shared/lib/session-store";
import { Button, ButtonLink, Card, NoticePanel } from "@/shared/ui/ui";
import { MeSkeleton } from "@/shared/ui/skeletons";
import { ErrorBoundary } from "@/shared/ui/error-boundary";
import type { AuthMe, EntitlementStatus } from "@/domains/workspace/workspace-model";

type ContentAsset = {
  id: number;
  toolKey: "title" | "script" | "refine" | "commission";
  title?: string | null;
  content: string;
  sourcePrompt?: string | null;
  status: "saved" | "completed" | "archived";
  completedAt?: string | null;
  createdAt: string;
};

export type ContentStats = {
  totalSaved: number;
  totalCompleted: number;
  totalAll: number;
  todayCreated: number;
  yesterdayCreated: number;
  latestAsset?: {
    id: number;
    toolKey: string;
    title?: string | null;
    status: string;
    createdAt: string;
  } | null;
};

type Subscription = {
  id: number;
  planKey: "experience" | "pro" | "team";
  status: string;
  expiredAt?: string | null;
};

type PendingSummary = {
  count: number;
  latest?: {
    id: number;
    orderNo: string;
    status: "pending" | "paid" | "activated" | "rejected" | "refunded";
  } | null;
};

const toolLabels: Record<ContentAsset["toolKey"], string> = {
  title: "标题",
  script: "脚本",
  refine: "话术",
  commission: "测算",
};

const toolContinueMap: Record<ContentAsset["toolKey"], { label: string; nextTool: string }> = {
  title: { label: "生成脚本", nextTool: "script" },
  script: { label: "提炼话术", nextTool: "refine" },
  refine: { label: "生成标题", nextTool: "title" },
  commission: { label: "生成脚本", nextTool: "script" },
};

function formatDateTime(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getDateKey(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function getTodayKey() {
  return getDateKey(new Date().toISOString());
}

function getYesterdayKey() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return getDateKey(date.toISOString());
}

function buildContinueHint(asset?: ContentAsset | null, stats?: ContentStats | null, streak = 0) {
  if (!asset) {
    if (streak >= 3) return `连续 ${streak} 天来开工了，选个目标开始今天的内容吧。`;
    return "先从一个明确的方向开始，生成后保存下来，明天就能接着用。";
  }
  if (stats && stats.todayCreated === 0) {
    const toolLabel = asset.title || toolLabels[asset.toolKey as ContentAsset["toolKey"]] || "内容";
    if (streak >= 2) return `上次做了「${toolLabel}」，连续 ${streak} 天了，今天继续？`;
    return `上次做了「${toolLabel}」，今天还没开始，先生成一条吧。`;
  }
  if (asset.status === "completed") {
    const toolLabel = asset.title || toolLabels[asset.toolKey as ContentAsset["toolKey"]] || "内容";
    if (streak >= 3) return `已完成「${toolLabel}」，这几天做得不少了，试试新方向？`;
    return `上次完成了「${toolLabel}」，今天可以继续做下一条转化内容。`;
  }
  const toolLabel = asset.title || toolLabels[asset.toolKey as ContentAsset["toolKey"]] || "内容";
  return `上次保存了「${toolLabel}」，今天先把它整理到可发布版本。`;
}

function buildTodaySuggestion(
  quotaRemaining: number,
  planLabel: string | undefined,
  savedCount: number,
  completedCount: number,
  todayCount: number,
  streak = 0,
): { text: string; actionLabel: string; actionHref: string } {
  if (streak >= 3 && todayCount === 0) {
    return { text: `连续 ${streak} 天开工了，今天选个目标出一条新的吧。`, actionLabel: "开始生成", actionHref: "/workspace" };
  }
  if (streak >= 5) {
    return { text: `连续 ${streak} 天的老用户了，保持这个频率，一周下来效果很明显。`, actionLabel: "继续生成", actionHref: "/workspace" };
  }
  if (planLabel === "体验版" && savedCount > 0 && quotaRemaining <= 0) {
    return { text: "体验额度已用完，升级后可继续生成并解锁更多权益。", actionLabel: "查看套餐", actionHref: "/pricing" };
  }
  if (savedCount > 0 && completedCount === 0) {
    return { text: "你已有保存的内容，先把其中一条标记为完成，再继续生成新的。", actionLabel: "去完成", actionHref: "#assets" };
  }
  if (todayCount === 0 && quotaRemaining > 0) {
    return { text: "今天还没有生成内容，建议先生成一条能直接发出去的标题或脚本。", actionLabel: "开始生成", actionHref: "/workspace" };
  }
  if (quotaRemaining <= 2) {
    return { text: "剩余额度不多了，优先把最重要的内容先生成出来。", actionLabel: "开始生成", actionHref: "/workspace" };
  }
  return { text: "每天至少出一条，存下来就是自己的内容库。", actionLabel: "继续生成", actionHref: "/workspace" };
}

/** 构建跳转到工作台的 URL，预填上下文 */
function buildWorkspaceContinueUrl(asset: ContentAsset): string {
  const base = "/workspace";
  const params = new URLSearchParams();
  // 用 sourcePrompt 或 title 或 content 前缀作为预填关键词
  const keyword = asset.sourcePrompt?.trim() || asset.title?.trim() || asset.content.trim().slice(0, 60);
  params.set("continueFrom", asset.toolKey);
  params.set("keyword", keyword.slice(0, 100));
  return `${base}?${params.toString()}`;
}

export default function MeScreen() {
  const router = useRouter();
  const session = useAuthSession();
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [me, setMe] = useState<AuthMe | null>(null);
  const [entitlement, setEntitlement] = useState<EntitlementStatus | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [pendingSummary, setPendingSummary] = useState<PendingSummary | null>(null);
  const [assets, setAssets] = useState<ContentAsset[]>([]);
  const [contentStats, setContentStats] = useState<ContentStats | null>(null);
  const [checkinStreak, setCheckinStreak] = useState(0);
  const [completingId, setCompletingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [copyingId, setCopyingId] = useState<number | null>(null);
  // 筛选状态：status(全部/已保存/已完成) + toolKey(全部工具/标题/脚本/话术/测算)
  const [filterStatus, setFilterStatus] = useState<"all" | "saved" | "completed">("all");
  const [filterTool, setFilterTool] = useState<ContentAsset["toolKey"] | "all">("all");
  // 展开的内容 ID 集合
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!session?.sessionToken) {
      router.replace("/login");
      return;
    }

    let active = true;
    setLoading(true);
    setPageError("");

    Promise.all([
      apiRequest<AuthMe>("/api/auth/me"),
      apiRequest<EntitlementStatus>("/api/payments/entitlement/me"),
      apiRequest<Subscription | null>("/api/payments/subscription/me"),
      apiRequest<PendingSummary>("/api/payments/pending/me"),
      apiRequest<ContentAsset[]>("/api/content-assets/me?limit=50"),
      apiRequest<ContentStats>("/api/content-assets/stats/me").catch(() => null),
      apiRequest<{ streak: number }>("/api/checkins/streak").then((d) => d.streak ?? 0).catch(() => 0),
    ])
      .then(([nextMe, nextEntitlement, nextSubscription, nextPending, nextAssets, nextStats, nextStreak]) => {
        if (!active) return;
        setMe(nextMe);
        setEntitlement(nextEntitlement);
        setSubscription(nextSubscription);
        setPendingSummary(nextPending);
        setAssets(nextAssets || []);
        setContentStats(nextStats);
        setCheckinStreak(nextStreak);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setPageError(
          err instanceof ApiClientError
            ? err.message
            : err instanceof Error
              ? err.message
              : "我的页加载失败，请稍后再试",
        );
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [router, session?.sessionToken]);

  const displayName = useMemo(() => {
    if (!me) return "";
    return me.account.displayName || me.account.phone || `用户 ${me.account.id}`;
  }, [me]);

  const todayAssets = useMemo(
    () => assets.filter((item) => getDateKey(item.createdAt) === getTodayKey()),
    [assets],
  );
  const yesterdayAssets = useMemo(
    () => assets.filter((item) => getDateKey(item.createdAt) === getYesterdayKey()),
    [assets],
  );
  const savedAssets = useMemo(() => assets.filter((item) => item.status === "saved"), [assets]);
  const completedAssets = useMemo(() => assets.filter((item) => item.status === "completed"), [assets]);
  const latestAsset = assets[0];
  const quotaTotal = entitlement?.limit ?? 0;
  const quotaUsed = entitlement?.used ?? 0;
  const quotaRemaining = entitlement?.remaining ?? 0;
  const quotaPercent = quotaTotal > 0 ? Math.min((quotaUsed / quotaTotal) * 100, 100) : 0;

  async function handleLogout() {
    try {
      await apiRequest("/api/auth/logout", {
        method: "POST",
        body: { allDevices: false },
      });
    } catch {}
    clearAuthSession();
    router.replace("/login");
  }

  async function handleComplete(assetId: number) {
    setCompletingId(assetId);
    setActionMessage("");
    try {
      const updated = await apiRequest<ContentAsset>(`/api/content-assets/${assetId}/complete`, {
        method: "POST",
      });
      setAssets((current) => current.map((item) => (item.id === assetId ? updated : item)));
      setContentStats((prev) =>
        prev ? { ...prev, totalCompleted: prev.totalCompleted + 1, totalSaved: Math.max(0, prev.totalSaved - 1) } : prev,
      );
      setActionMessage("标记完成，明天接着做下一条。");
      window.setTimeout(() => setActionMessage(""), 2400);
    } catch (err) {
      setActionMessage(
        err instanceof ApiClientError
          ? err.message
          : err instanceof Error
            ? err.message
            : "标记失败，请稍后再试。",
      );
    } finally {
      setCompletingId(null);
    }
  }

  async function handleDelete(assetId: number) {
    if (!window.confirm("删除后找不回来，确定删？")) return;
    setDeletingId(assetId);
    setActionMessage("");
    try {
      await apiRequest(`/api/content-assets/${assetId}`, { method: "DELETE" });
      setAssets((current) => current.filter((item) => item.id !== assetId));
      setActionMessage("删掉了。");
      window.setTimeout(() => setActionMessage(""), 1600);
    } catch (err) {
      setActionMessage(
        err instanceof ApiClientError ? err.message : err instanceof Error ? err.message : "删除失败，请稍后再试。",
      );
    } finally {
      setDeletingId(null);
    }
  }

  /** 复制单条内容到剪贴板 */
  const handleCopy = useCallback(async (asset: ContentAsset) => {
    setCopyingId(asset.id);
    try {
      const text = asset.content.trim();
      await navigator.clipboard.writeText(text);
      setActionMessage("已复制到剪贴板。");
      window.setTimeout(() => setActionMessage(""), 2000);
    } catch {
      setActionMessage("复制失败，请手动选择文字复制。");
      window.setTimeout(() => setActionMessage(""), 2500);
    } finally {
      setCopyingId(null);
    }
  }, []);

  /** 切换内容展开/收起 */
  const toggleExpand = useCallback((id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  /** 跳转到工作台继续操作 */
  const handleContinue = useCallback((asset: ContentAsset) => {
    router.push(buildWorkspaceContinueUrl(asset));
  }, [router]);

  const filteredAssets = useMemo(
    () => {
      let result = assets;
      if (filterStatus !== "all") result = result.filter((a) => a.status === filterStatus);
      if (filterTool !== "all") result = result.filter((a) => a.toolKey === filterTool);
      return result;
    },
    [assets, filterStatus, filterTool],
  );

  // 各工具类型的数量统计
  const toolCounts = useMemo(() => {
    const counts: Record<string, number> = { all: assets.length };
    for (const t of ["title", "script", "refine", "commission"] as const) {
      counts[t] = assets.filter((a) => a.toolKey === t).length;
    }
    return counts;
  }, [assets]);

  if (loading) {
    return <MeSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#18181B]">
      <header className="sticky top-0 z-20 border-b border-[rgba(0,0,0,0.08)] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link className="flex items-center gap-3" href="/workspace">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F3F7] text-base font-semibold text-[#4A3168]">
              M
            </span>
            <span className="text-lg font-semibold text-[#27272A]">Memory</span>
          </Link>
          <div className="flex items-center gap-2">
            <ButtonLink className="min-h-10 rounded-[14px] px-4" href="/workspace" variant="secondary">
              工作台
            </ButtonLink>
            <Button className="min-h-10 rounded-[14px] px-4" onClick={() => void handleLogout()} variant="ghost">
              退出
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8">
        <ErrorBoundary fallbackTitle="我的页出了点问题" fallbackDescription="内容记录暂时无法显示，刷新后重试。">
        <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-[#737378]">{displayName}</span>
              {checkinStreak >= 2 ? (
                <span className="rounded-full bg-[linear-gradient(135deg,#F5F3F7_0%,#FDF4F8_100%)] px-3 py-1 text-xs font-semibold text-[#D4668F] border border-[rgba(212,102,143,0.18)]">
                  连续 {checkinStreak} 天
                </span>
              ) : null}
            </div>
            <h1 className="mt-2 text-[28px] font-semibold text-[#18181B] sm:text-[34px]">
              内容都在这儿
            </h1>
            <p className="mt-2 max-w-[620px] text-sm leading-7 text-[#737378]">
              {buildContinueHint(latestAsset, contentStats, checkinStreak)}
            </p>
          </div>
          <ButtonLink href="/workspace">去生成</ButtonLink>
        </section>

        {pageError ? (
          <NoticePanel className="mb-6" tone="rose">
            {pageError}
          </NoticePanel>
        ) : null}

        {actionMessage ? (
          <NoticePanel className="mb-6" tone="brand">
            {actionMessage}
          </NoticePanel>
        ) : null}

        {pendingSummary?.count ? (
          <NoticePanel className="mb-6" tone="gold">
            你有 {pendingSummary.count} 笔订单待处理，最新订单状态为 {pendingSummary.latest?.status || "pending"}。
          </NoticePanel>
        ) : null}

        {/* 统计卡片 */}
        <section className="grid gap-5 md:grid-cols-4">
          <Card className="rounded-[20px] border border-[rgba(0,0,0,0.08)] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
            <div className="text-sm text-[#737378]">当前套餐</div>
            <div className="mt-2 text-[22px] font-semibold text-[#27272A]">
              {entitlement?.planLabel || subscription?.planKey || "未开通"}
            </div>
            <div className="mt-2 text-sm text-[#737378]">
              {subscription?.expiredAt ? `到期 ${formatDateTime(subscription.expiredAt)}` : entitlement?.resetHint || "开通后获得生成额度"}
            </div>
            {entitlement?.planLabel === "体验版" && quotaRemaining <= 0 ? (
              <ButtonLink className="mt-3 w-full rounded-[12px]" href="/pricing" variant="secondary">
                升级套餐
              </ButtonLink>
            ) : null}
          </Card>
          <Card className="rounded-[20px] border border-[rgba(0,0,0,0.08)] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
            <div className="text-sm text-[#737378]">剩余额度</div>
            <div className="mt-2 text-[30px] font-semibold leading-none text-[#4A3168]">{quotaRemaining}</div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#ECECF0]">
              <div className="h-full rounded-full bg-[#D4668F]" style={{ width: `${quotaPercent}%` }} />
            </div>
          </Card>
          <Card className="rounded-[20px] border border-[rgba(0,0,0,0.08)] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
            <div className="text-sm text-[#737378]">今日生成</div>
            <div className="mt-2 text-[30px] font-semibold leading-none text-[#4A3168]">{contentStats?.todayCreated ?? todayAssets.length}</div>
            <div className="mt-2 text-sm text-[#737378]">昨日 {contentStats?.yesterdayCreated ?? yesterdayAssets.length} 条</div>
          </Card>
          <Card className="rounded-[20px] border border-[rgba(0,0,0,0.08)] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
            <div className="text-sm text-[#737378]">已存内容</div>
            <div className="mt-2 text-[30px] font-semibold leading-none text-[#4A3168]">{contentStats?.totalAll ?? assets.length}</div>
            <div className="mt-2 text-sm text-[#737378]">{contentStats?.totalCompleted ?? completedAssets.length} 条已完成</div>
          </Card>
        </section>

        {/* 主内容区：左侧列表 + 右侧栏 */}
        <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* ====== 内容列表（核心入口） ====== */}
          <Card className="rounded-[20px] border border-[rgba(0,0,0,0.08)] bg-white p-0 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
            {/* 筛选栏 */}
            <div className="border-b border-[rgba(0,0,0,0.08)] px-5 py-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-lg font-semibold text-[#27272A]">内容记录</div>
                  <div className="mt-1 text-sm text-[#737378]">点「继续做」直接跳工作台接着生成。</div>
                </div>
              </div>

              {/* 双层筛选：状态 tab + 工具类型 chip */}
              <div className="mt-3 flex flex-col gap-3">
                {/* 状态筛选 */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#A1A1AA] shrink-0">状态：</span>
                  <div className="flex rounded-full bg-[#FAFAFA] p-1">
                    {(["all", "saved", "completed"] as const).map((tab) => {
                      const labels = { all: "全部", saved: "已存", completed: "已完成" };
                      return (
                        <button
                          key={tab}
                          onClick={() => setFilterStatus(tab)}
                          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                            filterStatus === tab ? "bg-white text-[#4A3168] shadow-sm" : "text-[#737378]"
                          }`}
                        >
                          {labels[tab]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 工具类型筛选 */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-[#A1A1AA] shrink-0">类型：</span>
                  {([
                    { key: "all" as const, label: "全部" },
                    ...(["title", "script", "refine", "commission"] as const).map((k) => ({ key: k, label: toolLabels[k] })),
                  ]).map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setFilterTool(t.key)}
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                        filterTool === t.key
                          ? "bg-[#4A3168] text-white"
                          : "bg-[#F5F3F7] text-[#6B5A78] hover:bg-[#EBE5F1]"
                      }`}
                    >
                      {t.label}
                      {t.key !== "all" && toolCounts[t.key!] > 0 ? (
                        <span className="ml-1 opacity-60">{toolCounts[t.key!]}</span>
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 内容列表 */}
            <div className="divide-y divide-[rgba(0,0,0,0.06)]">
              {filteredAssets.length ? (
                filteredAssets.map((asset) => {
                  const isExpanded = expandedIds.has(asset.id);
                  const continueInfo = toolContinueMap[asset.toolKey];
                  const isLongText = asset.content.length > 120;

                  return (
                    <article key={asset.id} className="group px-5 py-4 transition-colors hover:bg-[#FAFAFA]/80">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 flex-1">
                          {/* 头部行：标签 + 时间 + 状态 */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-[#F5F3F7] px-2.5 py-0.5 text-xs font-medium text-[#4A3168]">
                              {toolLabels[asset.toolKey]}
                            </span>
                            <span className="text-xs text-[#A1A1AA]">{formatDateTime(asset.createdAt)}</span>
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                              asset.status === "completed"
                                ? "bg-[#ECFDF5] text-[#059669]"
                                : "bg-[#FFF8EB] text-[#D97706]"
                            }`}>
                              {asset.status === "completed" ? "已完成" : "已存"}
                            </span>
                          </div>

                          {/* 标题 */}
                          <h2 className="mt-2 text-base font-semibold text-[#27272A]">
                            {asset.title || toolLabels[asset.toolKey]}
                          </h2>

                          {/* 来源提示 */}
                          {asset.sourcePrompt ? (
                            <p className="mt-0.5 truncate text-xs text-[#A1A1AA]">{asset.sourcePrompt}</p>
                          ) : null}

                          {/* 正文内容（可展开） */}
                          <div className="relative mt-2">
                            <p
                              className={`whitespace-pre-line text-sm leading-7 ${isLongText && !isExpanded ? "line-clamp-3" : ""} text-[#52525B]`}
                              onClick={isLongText ? () => void toggleExpand(asset.id) : undefined}
                              role={isLongText ? "button" : undefined}
                              tabIndex={isLongText ? 0 : undefined}
                            >
                              {asset.content}
                            </p>
                            {isLongText ? (
                              <button
                                onClick={() => void toggleExpand(asset.id)}
                                className="mt-1 text-xs font-medium text-[#8961F2] hover:text-[#7046D6]"
                              >
                                {isExpanded ? "收起" : "展开全部"}
                              </button>
                            ) : null}
                          </div>
                        </div>

                        {/* 操作按钮组 */}
                        <div className="flex flex-wrap items-center gap-2 shrink-0 mt-2 sm:mt-0">
                          {/* 继续做：跳工作台 */}
                          <Button
                            className="min-h-9 rounded-[12px] px-3 text-xs"
                            onClick={() => void handleContinue(asset)}
                            variant="primary"
                          >
                            {continueInfo.label}
                          </Button>

                          {/* 复制内容 */}
                          <button
                            disabled={copyingId === asset.id}
                            onClick={() => void handleCopy(asset)}
                            className={`min-h-9 rounded-[12px] border px-3 text-xs font-medium transition-colors ${
                              copyingId === asset.id
                                ? "border-[#D4CFCF] bg-[#FAFAFA] text-[#A1A1AA]"
                                : "border-[rgba(74,49,104,0.18)] bg-white text-[#4A3168] hover:bg-[#F5F3F7]"
                            }`}
                          >
                            {copyingId === asset.id ? "已复制" : "复制"}
                          </button>

                          {/* 标记完成（仅未完成的显示） */}
                          {asset.status !== "completed" ? (
                            <Button
                              className="min-h-9 rounded-[12px] px-3 text-xs"
                              disabled={completingId === asset.id}
                              onClick={() => void handleComplete(asset.id)}
                              variant="ghost"
                            >
                              {completingId === asset.id ? "…" : "完成"}
                            </Button>
                          ) : null}

                          {/* 删除 */}
                          <button
                            disabled={deletingId === asset.id}
                            onClick={() => void handleDelete(asset.id)}
                            className="min-h-9 w-9 flex items-center justify-center rounded-full text-[#C4C4CC] opacity-0 transition-opacity hover:bg-[rgba(239,68,68,0.08)] hover:text-[#EF4444] group-hover:opacity-100"
                            title="删除"
                          >
                            {deletingId === asset.id ? "…" : ""}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })
              ) : assets.length ? (
                /* 有数据但当前筛选无匹配 */
                <div className="px-5 py-12 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F3F7]">
                    <svg className="h-5 w-5 text-[#A1A1AA]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                  </div>
                  <div className="text-base font-semibold text-[#27272A]">这个分类下还没有内容</div>
                  <div className="mx-auto mt-2 max-w-[360px] text-sm leading-7 text-[#737378]">
                    换个筛选项看看，或者去工作台生成几条。
                  </div>
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <button
                      onClick={() => { setFilterStatus("all"); setFilterTool("all"); }}
                      className="text-sm font-medium text-[#8961F2] hover:underline"
                    >
                      清除筛选
                    </button>
                    <span className="text-[#D4D4D8]">|</span>
                    <ButtonLink className="text-sm" href="/workspace">去生成</ButtonLink>
                  </div>
                </div>
              ) : (
                /* 完全没有内容 */
                <div className="px-5 py-12 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F3F7]">
                    <svg className="h-5 w-5 text-[#A1A1AA]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-5m0 0V7m0 5h5m-5 0H7l3-3" />
                    </svg>
                  </div>
                  <div className="text-base font-semibold text-[#27272A]">还没存过内容</div>
                  <div className="mx-auto mt-2 max-w-[360px] text-sm leading-7 text-[#737378]">
                    在工作台生成的内容可以存到这里，之后随时回来查看或继续用。
                  </div>
                  <ButtonLink className="mt-5" href="/workspace">
                    开始生成第一条
                  </ButtonLink>
                </div>
              )}
            </div>
          </Card>

          {/* 右侧栏 */}
          <aside className="space-y-6">
            {/* 今日建议 */}
            <Card className="rounded-[20px] border border-[rgba(0,0,0,0.08)] bg-[#F8F4FB] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
              <div className="text-lg font-semibold text-[#27272A]">接下来做什么</div>
              <div className="mt-3 text-sm leading-7 text-[#6B5A78]">
                {buildTodaySuggestion(
                  quotaRemaining,
                  entitlement?.planLabel,
                  contentStats?.totalSaved ?? savedAssets.length,
                  contentStats?.totalCompleted ?? completedAssets.length,
                  contentStats?.todayCreated ?? todayAssets.length,
                  checkinStreak,
                ).text}
              </div>
              <ButtonLink
                className="mt-4 w-full"
                href={buildTodaySuggestion(
                  quotaRemaining,
                  entitlement?.planLabel,
                  contentStats?.totalSaved ?? savedAssets.length,
                  contentStats?.totalCompleted ?? completedAssets.length,
                  contentStats?.todayCreated ?? todayAssets.length,
                  checkinStreak,
                ).actionHref}
              >
                {buildTodaySuggestion(
                  quotaRemaining,
                  entitlement?.planLabel,
                  contentStats?.totalSaved ?? savedAssets.length,
                  contentStats?.totalCompleted ?? completedAssets.length,
                  contentStats?.todayCreated ?? todayAssets.length,
                  checkinStreak,
                ).actionLabel}
              </ButtonLink>
            </Card>

            {/* 昨日记录（可点击跳转） */}
            <Card className="rounded-[20px] border border-[rgba(0,0,0,0.08)] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold text-[#27272A]">昨天做的</div>
                {(contentStats?.yesterdayCreated ?? yesterdayAssets.length) > 0 ? (
                  <span className="rounded-full bg-[#F5F3F7] px-3 py-1 text-xs font-medium text-[#4A3168]">
                    共 {contentStats?.yesterdayCreated ?? yesterdayAssets.length} 条
                  </span>
                ) : null}
              </div>
              <div className="mt-4 space-y-3">
                {yesterdayAssets.length ? (
                  yesterdayAssets.slice(0, 4).map((asset) => (
                    <Link
                      key={asset.id}
                      href={buildWorkspaceContinueUrl(asset)}
                      className="group block rounded-[16px] border border-[rgba(0,0,0,0.08)] bg-[#FAFAFA] px-4 py-3 transition-colors hover:border-[#8961F2]/30 hover:bg-[#F8F4FB]"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <div className="text-sm font-medium text-[#27272A] group-hover:text-[#4A3168]">
                            {asset.title || toolLabels[asset.toolKey]}
                          </div>
                          <div className="mt-0.5 text-xs text-[#737378]">
                            {toolLabels[asset.toolKey]} · {asset.status === "completed" ? "已完成" : "已存"}
                          </div>
                        </div>
                        <span className="shrink-0 text-xs text-[#8961F2] opacity-0 transition-opacity group-hover:opacity-100">
                          继续 &rarr;
                        </span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="rounded-[16px] border border-dashed border-[rgba(0,0,0,0.12)] bg-[#FAFAFA] px-4 py-4 text-sm leading-7 text-[#737378]">
                    昨天没存过内容，今天存第一条后这里会自动出现。
                  </div>
                )}
              </div>
            </Card>

            {/* 社群入口 */}
            <Card className="rounded-[20px] border border-[rgba(0,0,0,0.08)] bg-[#4A3168] p-5 text-white shadow-[0_12px_32px_rgba(74,49,104,0.2)]">
              <div className="text-lg font-semibold">社群</div>
              <div className="mt-3 text-sm leading-7 text-white/80">
                付费后进社群，后续在这里放入群方式和运营任务。
              </div>
              <ButtonLink className="mt-4 w-full bg-white text-[#4A3168] hover:bg-[#F5F3F7]" href="/pricing">
                查看套餐
              </ButtonLink>
            </Card>
          </aside>
        </section>
        </ErrorBoundary>
      </main>
    </div>
  );
}
