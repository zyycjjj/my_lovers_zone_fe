import type { ReactNode } from "react";
import { cn } from "./cn";

export function InfoPanel({
  title,
  description,
  tone = "neutral",
  className,
  children,
}: {
  title: string;
  description: string;
  tone?: "neutral" | "brand" | "rose" | "sage";
  className?: string;
  children?: ReactNode;
}) {
  const toneClass =
    tone === "brand"
      ? "bg-[rgba(112,70,214,0.06)] border-[rgba(112,70,214,0.12)]"
      : tone === "rose"
        ? "bg-[rgba(227,95,151,0.06)] border-[rgba(227,95,151,0.12)]"
        : tone === "sage"
          ? "bg-[rgba(22,199,154,0.06)] border-[rgba(22,199,154,0.12)]"
          : "bg-white border-[rgba(88,51,175,0.08)]";

  return (
    <div className={cn("rounded-[24px] border px-5 py-5", toneClass, className)}>
      <div className="text-[15px] font-semibold text-strong">{title}</div>
      <div className="mt-2 text-sm leading-7 text-soft">{description}</div>
      {children}
    </div>
  );
}

export function MetricPanel({
  label,
  value,
  hint,
  className,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("ui-card-muted px-4 py-4", className)}>
      <div className="text-xs font-medium tracking-[0.08em] text-muted">{label}</div>
      <div className="mt-2 text-[28px] font-semibold tracking-[-0.03em] text-strong">{value}</div>
      {hint ? <div className="mt-2 text-sm text-soft">{hint}</div> : null}
    </div>
  );
}

export function NoticePanel({
  children,
  tone = "brand",
  className,
}: {
  children: ReactNode;
  tone?: "brand" | "rose" | "gold" | "neutral";
  className?: string;
}) {
  const toneClass =
    tone === "brand"
      ? "bg-[rgba(112,70,214,0.08)] text-[var(--primary-700)] border-[rgba(112,70,214,0.12)]"
      : tone === "rose"
        ? "bg-[rgba(227,95,151,0.08)] text-[var(--secondary-700)] border-[rgba(227,95,151,0.12)]"
        : tone === "gold"
          ? "bg-[rgba(245,158,11,0.08)] text-[#8a5a0a] border-[rgba(245,158,11,0.18)]"
          : "bg-[rgba(245,245,251,1)] text-soft border-[rgba(88,51,175,0.08)]";

  return (
    <div className={cn("rounded-[20px] border px-4 py-4 text-sm leading-7", toneClass, className)}>
      {children}
    </div>
  );
}

export function EmptyStatePanel({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-[24px] border border-dashed border-[rgba(88,51,175,0.14)] bg-white px-5 py-10 text-sm leading-7 text-soft",
        className,
      )}
    >
      {children}
    </div>
  );
}

