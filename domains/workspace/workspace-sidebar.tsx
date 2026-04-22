"use client";

import { ButtonLink } from "@/shared/ui/ui";
import { type AuthMe, type EntitlementStatus, type WorkspaceSummary } from "./workspace-model";

type ToolMeta = {
  label: string;
};

type Props = {
  activeToolMeta: ToolMeta;
  activeTips: string[];
  displayName: string;
  entitlement: EntitlementStatus | null;
  me: AuthMe | null;
  onLogout: () => void;
  workspaces: WorkspaceSummary[];
};

export function WorkspaceSidebar({
  activeTips,
  entitlement,
}: Props) {
  const quotaTotal = entitlement?.limit ?? 0;
  const quotaUsed = entitlement?.used ?? 0;
  const quotaRemain = entitlement?.remaining ?? 0;
  const quotaPercent = quotaTotal > 0 ? Math.min((quotaUsed / quotaTotal) * 100, 100) : 0;
  const quotaTitle = entitlement?.limitWindow === "total" ? "体验剩余额度" : "今日剩余额度";

  return (
    <aside className="space-y-6">
      <section className="rounded-[20px] border border-[rgba(0,0,0,0.08)] bg-[linear-gradient(161deg,#F5F3F7_0%,rgba(253,244,248,0.5)_100%)] p-[25px] shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[18px] font-medium leading-[1.4] text-[#27272A]">{quotaTitle}</div>
            <div className="mt-3 flex items-center gap-6 text-sm text-[#737378]">
              <span>已使用 {quotaUsed} 次</span>
              <span>总计 {quotaTotal} 次</span>
            </div>
          </div>
          <div className="text-[30px] font-semibold leading-none tracking-[-0.03em] text-[#4A3168]">{quotaRemain}</div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#ECECF0]">
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,#D4668F_0%,#4A3168_100%)]"
            style={{ width: `${quotaPercent}%` }}
          />
        </div>
        <div className="mt-3 text-sm text-[#737378]">
          {entitlement?.active ? `${entitlement.planLabel} · ${entitlement.resetHint}` : "开通套餐后立即获得生成额度"}
        </div>
      </section>

      <section className="rounded-[20px] border border-[rgba(0,0,0,0.08)] bg-[linear-gradient(161deg,#FDF9FC_0%,#F7EEF4_100%)] p-[25px] shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[18px] font-medium leading-[1.4] text-[#27272A]">今日陪跑</div>
            <div className="mt-1 text-sm text-[#737378]">4月15日</div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#E87CAD_0%,#D4668F_100%)] text-white shadow-[0_10px_24px_rgba(212,102,143,0.25)]">
            <span className="text-base">✦</span>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-[16px] border border-white bg-white/70 px-4 py-3">
            <div className="text-sm text-[#737378]">今日生成</div>
            <div className="mt-1 text-[24px] font-semibold leading-none tracking-[-0.03em] text-[#4A3168]">5</div>
          </div>
          <div className="rounded-[16px] border border-white bg-white/70 px-4 py-3">
            <div className="text-sm text-[#737378]">累计生成</div>
            <div className="mt-1 text-[24px] font-semibold leading-none tracking-[-0.03em] text-[#4A3168]">5</div>
          </div>
        </div>
        <div className="mt-4 rounded-[16px] border border-white bg-white/85 px-3 py-3 text-center text-sm text-[#52525B]">
          {quotaRemain > 0 ? "先生成一版能发的内容，再继续细修下一步。" : "额度用完时，先保留当前结果，明天或升级后继续。"}
        </div>
      </section>

      <section className="rounded-[20px] bg-[#4A3168] p-5 text-white shadow-[0_12px_32px_rgba(74,49,104,0.2)]">
        <div className="text-[18px] font-medium">💡 专业提示</div>
        <ul className="mt-4 space-y-2">
          {activeTips.map((tip) => (
            <li key={tip} className="flex gap-2 text-sm leading-6 text-white/90">
              <span className="text-[#F5A5C8]">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-[20px] border border-[rgba(0,0,0,0.08)] bg-white p-[25px] text-center shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#D4668F_0%,#E87CAD_100%)] text-white">
          <span className="text-lg">↗</span>
        </div>
        <div className="mt-3 text-[18px] font-medium leading-[1.4] text-[#27272A]">升级套餐</div>
        <div className="mt-1 text-sm text-[#737378]">解锁完整内容、额度和社群入口</div>
        <ButtonLink className="mt-4 w-full" href="/pricing">
          查看套餐
        </ButtonLink>
      </section>
    </aside>
  );
}
