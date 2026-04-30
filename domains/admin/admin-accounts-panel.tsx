"use client";

import { useState } from "react";
import { UiButton } from "@/shared/ui/ui-button";
import type { Account, PlanConfigItem } from "./admin-model";

const PLAN_LABELS: Record<string, string> = {
  experience: "体验版",
  pro: "专业版",
  team: "终身版",
};

export function AdminAccountsPanel({
  accounts,
  plans,
  loading,
  onManualActivate,
  onRefresh,
}: {
  accounts: Account[];
  plans: PlanConfigItem[];
  loading: boolean;
  onManualActivate: (accountId: number, planKey: string, note?: string) => void;
  onRefresh: () => void;
}) {
  const [activateTarget, setActivateTarget] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [note, setNote] = useState("");

  const enabledPlans = plans.filter((p) => p.enabled);

  function handleActivate(accountId: number) {
    if (!selectedPlan) return;
    onManualActivate(accountId, selectedPlan, note || undefined);
    setActivateTarget(null);
    setSelectedPlan("");
    setNote("");
  }

  return (
    <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">用户管理</h2>
        <UiButton className="px-3 py-1 text-xs" onClick={onRefresh} variant="secondary">
          刷新
        </UiButton>
      </div>

      {loading && !accounts.length ? <div className="text-sm text-slate-500">加载中...</div> : null}

      <div className="space-y-3">
        {accounts.map((account) => {
          const isActivating = activateTarget === account.id;
          const hasSubscription = !!account.subscription;

          return (
            <div key={account.id} className="rounded-xl border border-rose-100 bg-rose-50/40 p-3 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-medium text-slate-800">
                  #{account.id} · {account.displayName || account.phone || "未设置昵称"}
                </div>
                <div className="flex items-center gap-2">
                  {hasSubscription ? (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                      {PLAN_LABELS[account.subscription!.planKey] || account.subscription!.planKey}
                      {account.subscription!.expiredAt
                        ? ` · 到 ${new Date(account.subscription!.expiredAt).toLocaleDateString()}`
                        : " · 永久"}
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                      未订阅
                    </span>
                  )}
                  <span className="rounded-full bg-slate-50 px-2 py-0.5 text-xs text-slate-400">
                    {account.phone || "无手机号"}
                  </span>
                </div>
              </div>

              {isActivating && (
                <div className="mt-3 rounded-lg border border-purple-200 bg-purple-50/50 p-3">
                  <div className="mb-2 text-xs font-medium text-slate-700">选择套餐并开通</div>
                  <div className="mb-2 flex flex-wrap gap-2">
                    {enabledPlans.map((plan) => (
                      <button
                        key={plan.key}
                        type="button"
                        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                          selectedPlan === plan.key
                            ? "border-purple-500 bg-purple-100 text-purple-700"
                            : "border-slate-200 bg-white text-slate-600 hover:border-purple-300"
                        }`}
                        onClick={() => setSelectedPlan(plan.key)}
                      >
                        {plan.name} · {plan.priceText}
                      </button>
                    ))}
                  </div>
                  <input
                    className="mb-2 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs outline-none focus:border-purple-400"
                    placeholder="备注（可选）"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <UiButton
                      className="px-3 py-1 text-xs"
                      disabled={!selectedPlan || loading}
                      onClick={() => handleActivate(account.id)}
                    >
                      确认开通
                    </UiButton>
                    <UiButton
                      className="px-3 py-1 text-xs"
                      variant="secondary"
                      onClick={() => {
                        setActivateTarget(null);
                        setSelectedPlan("");
                        setNote("");
                      }}
                    >
                      取消
                    </UiButton>
                  </div>
                </div>
              )}

              {!isActivating && (
                <div className="mt-2">
                  <UiButton
                    className="px-3 py-1 text-xs"
                    variant="secondary"
                    onClick={() => setActivateTarget(account.id)}
                  >
                    手动开通套餐
                  </UiButton>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!accounts.length && !loading ? <div className="text-sm text-slate-500">暂无注册用户</div> : null}
    </div>
  );
}
