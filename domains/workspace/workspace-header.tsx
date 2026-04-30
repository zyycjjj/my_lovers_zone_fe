"use client";

import Link from "next/link";

type PlanKey = "experience" | "pro" | "team";

const PLAN_LABELS: Record<PlanKey, string> = {
  experience: "体验版",
  pro: "专业版",
  team: "终身版",
};

const PLAN_STYLES: Record<PlanKey, { border: string; bg: string; text: string; dot: string }> = {
  experience: {
    border: "border-[#F9CFE3]",
    bg: "bg-[#FDF4F8]",
    text: "text-[#993D63]",
    dot: "bg-[#D4668F]",
  },
  pro: {
    border: "border-[#D4CFF7]",
    bg: "bg-[#F3F0FF]",
    text: "text-[#5B3FA0]",
    dot: "bg-[#8961F2]",
  },
  team: {
    border: "border-[#FDE68A]",
    bg: "bg-[#FFFBEB]",
    text: "text-[#92400E]",
    dot: "bg-[#F59E0B]",
  },
};

export function WorkspaceHeader({ planKey }: { planKey?: PlanKey | null }) {
  const key = planKey && PLAN_LABELS[planKey] ? planKey : "experience";
  const label = PLAN_LABELS[key];
  const style = PLAN_STYLES[key];

  return (
    <header className="sticky top-0 z-20 border-b border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.8)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1283px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#F5F3F7_0%,#FDF4F8_100%)] text-base font-semibold text-[#4A3168]">
            M
          </div>
          <div className="text-lg font-semibold text-[#27272A]">Memory</div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            className="inline-flex h-9 items-center rounded-[14px] border border-[rgba(0,0,0,0.08)] bg-white px-4 text-sm font-medium text-[#52525B] hover:border-[#F9CFE3] hover:text-[#993D63]"
            href="/me"
          >
            我的
          </Link>
          <div className={`inline-flex items-center gap-2 rounded-full border ${style.border} ${style.bg} px-3 py-1.5 text-sm font-medium ${style.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
            {label}
          </div>
        </div>
      </div>
    </header>
  );
}
