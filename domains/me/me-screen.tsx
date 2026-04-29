"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
  const [filterTab, setFilterTab] = useState<"all" | "saved" | "completed">("all");
  const [deletingId, setDeletingId] = useState<number | null>(null);

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
      apiRequest<ContentAsset[]>("/api/content-assets/me?limit=30"),
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
      setActionMessage("已标记完成，明天会更容易接着做。");
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
    if (!window.confirm("确定要删除这条内容记录吗？")) return;
    setDeletingId(assetId);
    setActionMessage("");
    try {
      await apiRequest(`/api/content-assets/${assetId}`, { method: "DELETE" });
      setAssets((current) => current.filter((item) => item.id !== assetId));
      setActionMessage("已删除。");
      window.setTimeout(() => setActionMessage(""), 1600);
    } catch (err) {
      setActionMessage(
        err instanceof ApiClientError ? err.message : err instanceof Error ? err.message : "删除失败，请稍后再试。",
      );
    } finally {
      setDeletingId(null);
    }
  }

  const filteredAssets = useMemo(
    () => (filterTab === "all" ? assets : assets.filter((a) => a.status === filterTab)),
    [assets, filterTab],
  );

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
                  🔥 连续 {checkinStreak} 天
                </span>
              ) : null}
            </div>
            <h1 className="mt-2 text-[28px] font-semibold text-[#18181B] sm:text-[34px]">
              今天继续做内容
            </h1>
            <p className="mt-2 max-w-[620px] text-sm leading-7 text-[#737378]">
              {buildContinueHint(latestAsset, contentStats, checkinStreak)}
            </p>
          </div>
          <ButtonLink href="/workspace">开始生成</ButtonLink>
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
            <div className="text-sm text-[#737378]">已保存内容</div>
            <div className="mt-2 text-[30px] font-semibold leading-none text-[#4A3168]">{contentStats?.totalSaved ?? savedAssets.length}</div>
            <div className="mt-2 text-sm text-[#737378]">累计完成 {contentStats?.totalCompleted ?? completedAssets.length} 条</div>
          </Card>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <Card className="rounded-[20px] border border-[rgba(0,0,0,0.08)] bg-white p-0 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
            <div className="border-b border-[rgba(0,0,0,0.08)] px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold text-[#27272A]">内容记录</div>
                  <div className="mt-1 text-sm text-[#737378]">保存、完成和明天继续都从这里接住。</div>
                </div>
                <div className="flex rounded-full bg-[#FAFAFA] p-1">
                  {(["all", "saved", "completed"] as const).map((tab) => {
                    const labels = { all: "全部", saved: "已保存", completed: "已完成" };
                    return (
                      <button
                        key={tab}
                        onClick={() => setFilterTab(tab)}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                          filterTab === tab ? "bg-white text-[#4A3168] shadow-sm" : "text-[#737378]"
                        }`}
                      >
                        {labels[tab]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="divide-y divide-[rgba(0,0,0,0.08)]">
              {filteredAssets.length ? (
                filteredAssets.map((asset) => (
                  <article key={asset.id} className="group px-5 py-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-[#F5F3F7] px-3 py-1 text-xs font-medium text-[#4A3168]">
                            {toolLabels[asset.toolKey]}
                          </span>
                          <span className="text-xs text-[#737378]">{formatDateTime(asset.createdAt)}</span>
                          <span className="text-xs text-[#737378]">
                            {asset.status === "completed" ? "已完成" : asset.status === "saved" ? "已保存" : "已归档"}
                          </span>
                        </div>
                        <h2 className="mt-3 text-base font-semibold text-[#27272A]">{asset.title || toolLabels[asset.toolKey]}</h2>
                        {asset.sourcePrompt ? (
                          <p className="mt-1 text-sm text-[#737378]">来源：{asset.sourcePrompt}</p>
                        ) : null}
                        <p className="mt-3 line-clamp-3 whitespace-pre-line text-sm leading-7 text-[#52525B]">
                          {asset.content}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {asset.status !== "completed" ? (
                          <Button
                            className="min-h-10 rounded-[14px] px-4"
                            disabled={completingId === asset.id}
                            onClick={() => void handleComplete(asset.id)}
                            variant="secondary"
                          >
                            {completingId === asset.id ? "标记中" : "标记完成"}
                          </Button>
                        ) : null}
                        <button
                          disabled={deletingId === asset.id}
                          onClick={() => void handleDelete(asset.id)}
                          className="min-h-10 w-10 flex items-center justify-center rounded-full text-[#C4C4CC] opacity-0 transition-opacity hover:bg-[rgba(239,68,68,0.08)] hover:text-[#EF4444] group-hover:opacity-100"
                          title="删除"
                        >
                          {deletingId === asset.id ? "…" : "✕"}
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              ) : assets.length ? (
                <div className="px-5 py-12 text-center">
                  <div className="text-base font-semibold text-[#27272A]">该筛选下没有内容</div>
                  <div className="mx-auto mt-2 max-w-[360px] text-sm leading-7 text-[#737378]">
                    切换到「全部」查看所有内容记录。
                  </div>
                </div>
              ) : (
                <div className="px-5 py-12 text-center">
                  <div className="text-base font-semibold text-[#27272A]">还没有保存内容</div>
                  <div className="mx-auto mt-2 max-w-[360px] text-sm leading-7 text-[#737378]">
                    去工作台生成一条标题、脚本或话术，保存后这里会变成你的连续记录。
                  </div>
                  <ButtonLink className="mt-5" href="/workspace">
                    去工作台
                  </ButtonLink>
                </div>
              )}
            </div>
          </Card>

          <aside className="space-y-6">
            <Card className="rounded-[20px] border border-[rgba(0,0,0,0.08)] bg-[#F8F4FB] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
              <div className="text-lg font-semibold text-[#27272A]">今日建议</div>
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

            <Card className="rounded-[20px] border border-[rgba(0,0,0,0.08)] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold text-[#27272A]">昨日记录</div>
                {(contentStats?.yesterdayCreated ?? yesterdayAssets.length) > 0 ? (
                  <span className="rounded-full bg-[#F5F3F7] px-3 py-1 text-xs font-medium text-[#4A3168]">
                    共 {contentStats?.yesterdayCreated ?? yesterdayAssets.length} 条
                  </span>
                ) : null}
              </div>
              <div className="mt-4 space-y-3">
                {yesterdayAssets.length ? (
                  yesterdayAssets.slice(0, 3).map((asset) => (
                    <div key={asset.id} className="rounded-[16px] border border-[rgba(0,0,0,0.08)] bg-[#FAFAFA] px-4 py-3">
                      <div className="text-sm font-medium text-[#27272A]">{asset.title || toolLabels[asset.toolKey]}</div>
                      <div className="mt-1 text-xs text-[#737378]">
                        {toolLabels[asset.toolKey]} · {asset.status === "completed" ? "已完成" : "已保存"}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[16px] border border-dashed border-[rgba(0,0,0,0.12)] bg-[#FAFAFA] px-4 py-4 text-sm leading-7 text-[#737378]">
                    昨天还没有内容记录，今天保存第一条后，明天就能从这里接着做。
                  </div>
                )}
              </div>
            </Card>

            <Card className="rounded-[20px] border border-[rgba(0,0,0,0.08)] bg-[#4A3168] p-5 text-white shadow-[0_12px_32px_rgba(74,49,104,0.2)]">
              <div className="text-lg font-semibold">社群入口</div>
              <div className="mt-3 text-sm leading-7 text-white/80">
                付费后承接到社群，后续这里会放入进群方式和运营任务。
              </div>
              <ButtonLink className="mt-4 w-full bg-white text-[#4A3168] hover:bg-[#F5F3F7]" href="/pricing">
                查看权益
              </ButtonLink>
            </Card>
          </aside>
        </section>
        </ErrorBoundary>
      </main>
    </div>
  );
}
