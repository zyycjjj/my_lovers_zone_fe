import type { ReactNode } from "react";
import { ButtonLink, Card, SoftBadge, cn } from "./ui";

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
    <Card className={cn("space-y-6 rounded-[32px]", className)}>
      <div className="space-y-4">
        {badge ? <SoftBadge tone="brand">{badge}</SoftBadge> : null}
        <div className="text-[24px] font-semibold tracking-[-0.03em] text-strong">{title}</div>
        <p className="max-w-2xl text-sm leading-7 text-soft">{description}</p>
      </div>

      <div className="space-y-5">{children}</div>
      {footer ? <div className="flex flex-wrap gap-3">{footer}</div> : null}
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
    <Card className={cn("space-y-5 rounded-[32px]", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="text-base font-semibold text-strong">{title}</div>
          <div className="text-sm text-soft">{description}</div>
        </div>
        {badge}
      </div>
      {children}
    </Card>
  );
}

export function QuotaCard({
  title = "对话额度卡",
  used,
  total,
  items,
  className,
}: {
  title?: string;
  used: number;
  total: number;
  items: Array<{ label: string; value: string; tone?: "brand" | "rose" | "neutral" }>;
  className?: string;
}) {
  const percent = Math.max(0, Math.min(100, total ? (used / total) * 100 : 0));

  return (
    <Card className={cn("space-y-4 rounded-[28px]", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-muted">{title}</div>
          <div className="mt-1 text-[28px] font-semibold tracking-[-0.03em] text-strong">
            {Math.max(total - used, 0)}
          </div>
          <div className="text-sm text-soft">今日剩余额度</div>
        </div>

        <div className="text-right text-sm text-soft">
          <div>今日已使用</div>
          <div className="mt-1 text-[20px] font-semibold text-[var(--secondary-600)]">{used}</div>
        </div>
      </div>

      <div className="ui-progress-track">
        <div className="ui-progress-fill-rose" style={{ width: `${percent}%` }} />
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.label} className="ui-card-muted rounded-[18px] px-3 py-3">
            <div className="text-xs text-muted">{item.label}</div>
            <div
              className={cn(
                "mt-1 text-sm font-semibold",
                item.tone === "rose"
                  ? "text-[var(--secondary-700)]"
                  : item.tone === "brand"
                    ? "text-[var(--primary-700)]"
                    : "text-strong",
              )}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function ContentRetentionCard({
  title,
  description,
  actionHref,
  actionText,
  className,
}: {
  title: string;
  description: string;
  actionHref: string;
  actionText: string;
  className?: string;
}) {
  return (
    <Card className={cn("space-y-4 rounded-[28px]", className)}>
      <div className="space-y-2">
        <div className="text-sm font-medium text-muted">内容留存卡</div>
        <div className="text-base font-semibold text-strong">{title}</div>
        <p className="text-sm leading-7 text-soft">{description}</p>
      </div>

      <div className="rounded-[20px] border border-dashed border-[rgba(88,51,175,0.14)] bg-[rgba(112,70,214,0.04)] px-4 py-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(112,70,214,0.12)] text-lg">
          ✦
        </div>
        <div className="mt-3 text-sm text-soft">继续这一轮之后，结果和下一步建议都会留下来。</div>
        <ButtonLink className="mt-4 w-full" href={actionHref}>
          {actionText}
        </ButtonLink>
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
  items: Array<{
    title: string;
    description?: string;
    meta?: string;
    tone?: "brand" | "rose" | "sage";
  }>;
  className?: string;
}) {
  return (
    <Card className={cn("space-y-4 rounded-[28px]", className)}>
      <div className="space-y-2">
        <div className="text-sm font-medium text-muted">今日陪跑卡</div>
        <div className="text-base font-semibold text-strong">{title}</div>
        <p className="text-sm leading-7 text-soft">{description}</p>
      </div>

      <div className="grid gap-3">
        {items.map((item) => (
          <div
            key={item.title}
            className="rounded-[18px] border border-[rgba(88,51,175,0.08)] bg-white px-4 py-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-strong">{item.title}</div>
              {item.meta ? <SoftBadge tone={item.tone ?? "brand"}>{item.meta}</SoftBadge> : null}
            </div>
            {item.description ? (
              <div className="mt-1 text-sm leading-7 text-soft">{item.description}</div>
            ) : null}
          </div>
        ))}
      </div>
    </Card>
  );
}

export function CommunityEntryCard({
  title,
  description,
  actionText,
  actionHref,
  className,
}: {
  title: string;
  description: string;
  actionText: string;
  actionHref: string;
  className?: string;
}) {
  return (
    <section className={cn("ui-card-dark p-5 sm:p-6", className)}>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/12 text-sm">
            社
          </span>
          <div className="text-sm font-medium text-white/78">社群入口卡</div>
        </div>

        <div className="space-y-2">
          <div className="text-lg font-semibold text-white">{title}</div>
          <p className="text-sm leading-7 text-white/76">{description}</p>
        </div>

        <div className="flex -space-x-2">
          {["#f0b8d0", "#d4c2ff", "#f5d397"].map((color, index) => (
            <span
              key={index}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-xs font-semibold text-[#281a49]"
              style={{ backgroundColor: color }}
            >
              {index + 1}
            </span>
          ))}
        </div>

        <ButtonLink className="w-full" href={actionHref}>
          {actionText}
        </ButtonLink>
      </div>
    </section>
  );
}

export function PlanCard({
  name,
  price,
  description,
  features,
  recommended,
  actionText,
  actionHref,
  className,
}: {
  name: string;
  price: string;
  description: string;
  features: string[];
  recommended?: boolean;
  actionText: string;
  actionHref: string;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "space-y-5 rounded-[28px] p-5",
        recommended && "border-[rgba(112,70,214,0.22)] shadow-[0_20px_48px_rgba(88,51,175,0.16)]",
        className,
      )}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="text-base font-semibold text-strong">{name}</div>
          {recommended ? <SoftBadge tone="brand">推荐</SoftBadge> : null}
        </div>
        <div>
          <span className="text-[34px] font-semibold tracking-[-0.04em] text-strong">{price}</span>
        </div>
        <p className="text-sm leading-7 text-soft">{description}</p>
      </div>

      <ul className="space-y-2.5">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm leading-7 text-soft">
            <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[var(--primary-500)]" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <ButtonLink className="w-full" href={actionHref} variant={recommended ? "primary" : "secondary"}>
        {actionText}
      </ButtonLink>
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
    <Card className={cn("space-y-5 rounded-[32px]", className)}>
      <div className="space-y-2">
        <div className="text-base font-semibold text-strong">{title}</div>
        <p className="text-sm leading-7 text-soft">{description}</p>
      </div>
      <div className="grid gap-3">{rows}</div>
      {footer}
    </Card>
  );
}
