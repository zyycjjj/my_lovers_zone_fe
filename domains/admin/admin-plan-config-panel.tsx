"use client";

import { UiButton } from "@/shared/ui/ui-button";
import type { PlanConfig, PlanConfigItem } from "./admin-model";

type Props = {
  value: PlanConfig;
  loading: boolean;
  onChange: (next: PlanConfig) => void;
  onReload: () => void;
  onSave: () => void;
};

function toNumber(value: string, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function patchPlan(plan: PlanConfigItem, patch: Partial<PlanConfigItem>) {
  return { ...plan, ...patch };
}

export function AdminPlanConfigPanel({ loading, onChange, onReload, onSave, value }: Props) {
  function updatePlan(key: PlanConfigItem["key"], patch: Partial<PlanConfigItem>) {
    onChange({
      plans: value.plans.map((plan) => (plan.key === key ? patchPlan(plan, patch) : plan)),
    });
  }

  return (
    <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">套餐配置</h2>
        <div className="flex gap-2">
          <UiButton className="px-3 py-1 text-xs" onClick={onReload} variant="secondary">
            刷新
          </UiButton>
          <UiButton className="px-3 py-1 text-xs" onClick={onSave}>
            保存
          </UiButton>
        </div>
      </div>

      <div className="grid gap-4">
        {value.plans.map((plan) => (
          <section key={plan.key} className="rounded-xl border border-rose-100 bg-rose-50 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-slate-700">{plan.key}</div>
              <label className="flex items-center gap-2 text-xs text-slate-600">
                <input
                  checked={plan.enabled}
                  onChange={(e) => updatePlan(plan.key, { enabled: e.target.checked })}
                  type="checkbox"
                />
                启用
              </label>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <input
                className="rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm"
                onChange={(e) => updatePlan(plan.key, { name: e.target.value })}
                placeholder="套餐名称"
                value={plan.name}
              />
              <input
                className="rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm"
                onChange={(e) => updatePlan(plan.key, { priceText: e.target.value })}
                placeholder="价格展示，如 ¥9.9"
                value={plan.priceText}
              />
              <input
                className="rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm"
                onChange={(e) => updatePlan(plan.key, { suffix: e.target.value })}
                placeholder="价格后缀，如 /月"
                value={plan.suffix}
              />
              <input
                className="rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm"
                onChange={(e) => updatePlan(plan.key, { priceFen: toNumber(e.target.value, plan.priceFen) })}
                placeholder="价格（分）"
                type="number"
                value={plan.priceFen}
              />
              <input
                className="rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm"
                onChange={(e) => updatePlan(plan.key, { quotaLimit: toNumber(e.target.value, plan.quotaLimit) })}
                placeholder="额度"
                type="number"
                value={plan.quotaLimit}
              />
              <select
                className="rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm"
                onChange={(e) => updatePlan(plan.key, { quotaWindow: e.target.value as PlanConfigItem["quotaWindow"] })}
                value={plan.quotaWindow}
              >
                <option value="daily">每日额度</option>
                <option value="total">总额度</option>
              </select>
              <input
                className="rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm"
                onChange={(e) =>
                  updatePlan(plan.key, {
                    durationDays: e.target.value.trim() ? toNumber(e.target.value, plan.durationDays || 30) : null,
                  })
                }
                placeholder="有效天数，空为永久"
                type="number"
                value={plan.durationDays ?? ""}
              />
              <label className="flex items-center gap-2 rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-600">
                <input
                  checked={plan.recommended}
                  onChange={(e) => updatePlan(plan.key, { recommended: e.target.checked })}
                  type="checkbox"
                />
                推荐套餐
              </label>
            </div>
            <textarea
              className="mt-3 min-h-[64px] w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm"
              onChange={(e) => updatePlan(plan.key, { desc: e.target.value })}
              placeholder="套餐描述"
              value={plan.desc}
            />
            <textarea
              className="mt-3 min-h-[88px] w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm"
              onChange={(e) =>
                updatePlan(plan.key, {
                  features: e.target.value
                    .split("\n")
                    .map((item) => item.trim())
                    .filter(Boolean),
                })
              }
              placeholder="套餐权益，每行一条"
              value={plan.features.join("\n")}
            />
          </section>
        ))}
      </div>
      {loading ? <div className="mt-3 text-xs text-slate-500">保存/刷新中...</div> : null}
    </div>
  );
}
