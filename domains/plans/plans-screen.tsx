"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, NoticePanel } from "@/shared/ui/ui";
import { apiRequest, ApiClientError } from "@/shared/lib/api";
import { getAuthSessionSnapshot } from "@/shared/lib/session-store";
import { SiteHeader } from "@/shared/ui/site-header";
import { EmptyState } from "@/shared/ui/empty-state";

type PlanTask = {
  id: number;
  dayNumber: number;
  title: string;
  description: string | null;
  hint: string | null;
  toolKey: string | null;
  status: string;
  completedAt: string | null;
  assetId: number | null;
};

type ContentPlan = {
  id: number;
  title: string;
  description: string | null;
  type: string;
  status: string;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  tasks: PlanTask[];
};

type PlanProgress = {
  planId: number;
  status: string;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  progressPercent: number;
  currentDay: number | null;
};

const dayIcons = ["🎯", "📝", "🎬", "✨", "💰", "📂", "🔄"];
const dayColors = [
  "bg-[#8961F2]",
  "bg-[#D4668F]",
  "bg-[#4A3168]",
  "bg-[#E5A63E]",
  "bg-[#22C79A]",
  "bg-[#5B7BF5]",
  "bg-[#F06595]",
];

const toolKeyLabels: Record<string, string> = {
  title: "标题生成",
  script: "脚本生成",
  refine: "话术提炼",
  commission: "佣金测算",
  viral: "爆款复刻",
};

export default function PlansScreen() {
  const router = useRouter();
  const [plans, setPlans] = useState<ContentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<ContentPlan | null>(null);
  const [progress, setProgress] = useState<PlanProgress | null>(null);
  const [updatingTaskId, setUpdatingTaskId] = useState<number | null>(null);

  useEffect(() => {
    const session = getAuthSessionSnapshot();
    if (!session?.sessionToken) {
      router.replace("/login");
      return;
    }
    loadPlans();
  }, [router]);

  async function loadPlans() {
    setLoading(true);
    try {
      const data = await apiRequest<{ items: ContentPlan[]; total: number }>("/api/content-plans?limit=20");
      setPlans(data.items || []);
      if (data.items?.length && !selectedPlan) {
        const active = data.items.find((p) => p.status === "active") || data.items[0];
        selectPlan(active);
      }
    } catch {
      setError("加载计划列表失败");
    } finally {
      setLoading(false);
    }
  }

  async function selectPlan(plan: ContentPlan) {
    setSelectedPlan(plan);
    try {
      const prog = await apiRequest<PlanProgress>(`/api/content-plans/${plan.id}/progress`);
      setProgress(prog);
    } catch {
      setProgress(null);
    }
  }

  async function createPlan() {
    setCreating(true);
    setError("");
    try {
      const plan = await apiRequest<ContentPlan>("/api/content-plans", {
        method: "POST",
        body: { title: "7天内容计划" },
      });
      setPlans([plan, ...plans]);
      selectPlan(plan);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "创建计划失败");
    } finally {
      setCreating(false);
    }
  }

  async function updateTaskStatus(task: PlanTask, newStatus: string) {
    if (!selectedPlan) return;
    setUpdatingTaskId(task.id);
    try {
      await apiRequest(`/api/content-plans/${selectedPlan.id}/tasks/${task.id}`, {
        method: "PATCH",
        body: { status: newStatus },
      });
      // 重新加载计划详情
      const updated = await apiRequest<ContentPlan>(`/api/content-plans/${selectedPlan.id}`);
      setSelectedPlan(updated);
      setPlans(plans.map((p) => (p.id === updated.id ? updated : p)));
      // 重新加载进度
      const prog = await apiRequest<PlanProgress>(`/api/content-plans/${selectedPlan.id}/progress`);
      setProgress(prog);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "更新任务状态失败");
    } finally {
      setUpdatingTaskId(null);
    }
  }

  async function archivePlan() {
    if (!selectedPlan) return;
    try {
      await apiRequest(`/api/content-plans/${selectedPlan.id}/archive`, { method: "PATCH" });
      loadPlans();
      setSelectedPlan(null);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "归档失败");
    }
  }

  function handleToolClick(toolKey: string) {
    if (toolKey === "viral") {
      router.push("/viral");
    } else {
      router.push(`/workspace?continueFrom=${toolKey}`);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        <SiteHeader />
        <main className="mx-auto max-w-[900px] px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-sm text-[#737378]">加载中...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <SiteHeader />

      <main className="mx-auto max-w-[900px] px-4 py-6 sm:px-6 lg:px-8">
        <section className="mb-8 space-y-2">
          <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-[#18181B] sm:text-[30px]">
            7天内容计划
          </h1>
          <p className="text-base leading-relaxed text-[#737378]">
            每天一个任务，AI陪跑7天，内容产出有章法
          </p>
        </section>

        {error ? <NoticePanel className="mb-4" tone="rose">{error}</NoticePanel> : null}

        {/* 计划列表 + 创建 */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex flex-1 flex-wrap gap-2">
            {plans.map((plan) => (
              <button
                key={plan.id}
                type="button"
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  selectedPlan?.id === plan.id
                    ? "border-[#4A3168] bg-[#F5F3F7] text-[#4A3168]"
                    : "border-[#ECECF0] bg-white text-[#52525B] hover:border-[#D4C8E0]"
                }`}
                onClick={() => selectPlan(plan)}
              >
                {plan.title}
                {plan.status === "completed" ? " ✅" : plan.status === "archived" ? " 📦" : ""}
              </button>
            ))}
          </div>
          <Button
            className="shrink-0 rounded-full bg-[#4A3168] px-4 py-2 text-sm text-white hover:bg-[#3D2856]"
            disabled={creating}
            onClick={createPlan}
          >
            {creating ? "创建中..." : "+ 新计划"}
          </Button>
        </div>

        {/* 选中计划详情 */}
        {selectedPlan ? (
          <div className="space-y-4">
            {/* 进度条 */}
            {progress ? (
              <Card className="rounded-[20px] border border-[rgba(74,49,104,0.12)] bg-[linear-gradient(135deg,rgba(137,97,242,0.06)_0%,rgba(212,102,143,0.06)_100%)] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-[#4A3168]">
                      进度 {progress.progressPercent}%
                    </div>
                    <div className="mt-1 text-xs text-[#737378]">
                      {progress.completedTasks}/{progress.totalTasks} 天完成
                      {progress.currentDay ? ` · 当前：第${progress.currentDay}天` : ""}
                    </div>
                  </div>
                  {selectedPlan.status === "active" ? (
                    <button
                      type="button"
                      className="rounded-full border border-[rgba(74,49,104,0.2)] px-3 py-1 text-xs text-[#4A3168] hover:bg-[#F5F3F7]"
                      onClick={archivePlan}
                    >
                      归档
                    </button>
                  ) : null}
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[rgba(74,49,104,0.1)]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#8961F2] to-[#D4668F] transition-all duration-500"
                    style={{ width: `${progress.progressPercent}%` }}
                  />
                </div>
              </Card>
            ) : null}

            {/* 7天任务列表 */}
            <div className="space-y-3">
              {selectedPlan.tasks.map((task, i) => {
                const isCompleted = task.status === "completed";
                const isInProgress = task.status === "in_progress";
                const isPending = task.status === "pending";
                const isCurrent = progress?.currentDay === task.dayNumber;

                return (
                  <Card
                    key={task.id}
                    className={`rounded-[18px] border p-4 transition-all sm:p-5 ${
                      isCurrent
                        ? "border-[rgba(74,49,104,0.3)] bg-[linear-gradient(135deg,rgba(137,97,242,0.04)_0%,rgba(212,102,143,0.04)_100%)] shadow-[0_2px_8px_rgba(137,97,242,0.1)]"
                        : isCompleted
                          ? "border-[rgba(0,0,0,0.04)] bg-[#FAFAFA]"
                          : "border-[rgba(0,0,0,0.08)] bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* 天数图标 */}
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white text-sm ${
                          isCompleted
                            ? "bg-[#22C79A]"
                            : dayColors[i % dayColors.length]
                        }`}
                      >
                        {isCompleted ? "✓" : dayIcons[i % dayIcons.length]}
                      </div>

                      {/* 任务内容 */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-[#8961F2]">Day {task.dayNumber}</span>
                          {isCurrent ? (
                            <span className="rounded-full bg-[#8961F2] px-2 py-0.5 text-[10px] font-semibold text-white">
                              今天
                            </span>
                          ) : null}
                        </div>
                        <div className={`text-sm font-semibold ${isCompleted ? "text-[#A1A1AA] line-through" : "text-[#18181B]"}`}>
                          {task.title}
                        </div>
                        {task.description ? (
                          <div className={`mt-0.5 text-xs leading-5 ${isCompleted ? "text-[#A1A1AA]" : "text-[#737378]"}`}>
                            {task.description}
                          </div>
                        ) : null}
                        {task.hint && !isCompleted ? (
                          <div className="mt-1 text-xs text-[#8961F2]">💡 {task.hint}</div>
                        ) : null}

                        {/* 操作按钮 */}
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          {task.toolKey && !isCompleted ? (
                            <button
                              type="button"
                              className="rounded-full bg-[#4A3168] px-3 py-1 text-xs text-white hover:bg-[#3D2856]"
                              onClick={() => handleToolClick(task.toolKey!)}
                            >
                              去{toolKeyLabels[task.toolKey] || "生成"} →
                            </button>
                          ) : null}

                          {isPending && (
                            <button
                              type="button"
                              disabled={updatingTaskId === task.id}
                              className="rounded-full border border-[rgba(74,49,104,0.2)] px-3 py-1 text-xs text-[#4A3168] hover:bg-[#F5F3F7]"
                              onClick={() => updateTaskStatus(task, "in_progress")}
                            >
                              开始
                            </button>
                          )}

                          {(isPending || isInProgress) && (
                            <button
                              type="button"
                              disabled={updatingTaskId === task.id}
                              className="rounded-full border border-[rgba(34,199,154,0.3)] px-3 py-1 text-xs text-[#22C79A] hover:bg-[rgba(34,199,154,0.06)]"
                              onClick={() => updateTaskStatus(task, "completed")}
                            >
                              完成
                            </button>
                          )}

                          {isCompleted && task.completedAt ? (
                            <span className="text-[10px] text-[#A1A1AA]">
                              完成于 {new Date(task.completedAt).toLocaleDateString("zh-CN")}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : plans.length === 0 ? (
          <EmptyState
            icon={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            }
            title="还没有制定计划"
            description="创建一个7天内容计划，每天一个任务，内容产出有章法"
            actionLabel="创建计划"
            actionOnClick={createPlan}
          />
        ) : null}
      </main>
    </div>
  );
}
