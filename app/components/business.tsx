import type { ReactNode } from "react";
import { Card, SoftBadge, cn } from "./ui";

export function PromptInputCard({
  title,
  description,
  badge,
  children,
  footer,
  className,
}: {
  title: string;
  description: string;
  badge?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("rounded-[34px]", className)}>
      <div className="space-y-6">
        <div className="rounded-[28px] border border-[rgba(91,70,142,0.1)] bg-[linear-gradient(180deg,_rgba(255,255,255,0.92)_0%,_rgba(244,241,250,0.8)_100%)] p-5">
          {badge ? <SoftBadge tone="brand">{badge}</SoftBadge> : null}
          <div className="text-strong mt-4 text-base font-semibold">{title}</div>
          <div className="text-soft mt-2 text-sm leading-7">{description}</div>
        </div>

        <div className="space-y-5">{children}</div>
        {footer ? <div className="flex flex-wrap gap-3">{footer}</div> : null}
      </div>
    </Card>
  );
}

export function ResultDisplayCard({
  title,
  description,
  badge,
  children,
  className,
}: {
  title: string;
  description: string;
  badge?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("rounded-[34px]", className)}>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-strong text-base font-semibold">{title}</div>
            <div className="text-soft mt-1 text-sm">{description}</div>
          </div>
          {badge}
        </div>
        {children}
      </div>
    </Card>
  );
}

export function TodayCompanionCard({
  title,
  description,
  items,
  className,
}: {
  title: string;
  description: string;
  items: Array<{ title: string; description: string }>;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "rounded-[32px] bg-[linear-gradient(180deg,_rgba(255,255,255,0.94)_0%,_rgba(241,234,255,0.84)_100%)]",
        className,
      )}
    >
      <div className="space-y-4">
        <div className="heading-serif text-strong text-[28px] leading-tight">{title}</div>
        <p className="text-soft text-sm leading-7">{description}</p>
        <div className="grid gap-3">
          {items.map((item) => (
            <div
              key={item.title}
              className="rounded-[22px] border border-[rgba(91,70,142,0.1)] bg-white/82 px-4 py-4"
            >
              <div className="text-strong text-sm font-semibold">{item.title}</div>
              <div className="text-soft mt-1 text-sm leading-7">{item.description}</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export function StatusSummaryCard({
  title,
  description,
  rows,
  footer,
  className,
}: {
  title: string;
  description: string;
  rows: ReactNode[];
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("rounded-[34px]", className)}>
      <div className="space-y-5">
        <div>
          <div className="text-strong text-sm font-semibold">{title}</div>
          <div className="text-soft mt-1 text-sm leading-7">{description}</div>
        </div>

        <div className="grid gap-3">{rows}</div>
        {footer}
      </div>
    </Card>
  );
}
