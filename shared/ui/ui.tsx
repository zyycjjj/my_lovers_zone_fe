import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function Card({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <section className={cn("ui-card p-5 sm:p-6", className)}>{children}</section>;
}

export function SoftBadge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "brand" | "sage" | "rose";
}) {
  const toneClass =
    tone === "brand"
      ? "ui-badge-brand"
      : tone === "sage"
        ? "ui-badge-sage"
        : tone === "rose"
          ? "ui-badge-rose"
          : "ui-badge-neutral";

  return <span className={cn("ui-badge", toneClass)}>{children}</span>;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("space-y-3", align === "center" && "text-center")}>
      {eyebrow ? (
        <span className="text-[13px] font-semibold tracking-[0.08em] text-[var(--primary-700)]">
          {eyebrow}
        </span>
      ) : null}
      <div
        className={cn(
          "max-w-4xl text-[34px] font-semibold tracking-[-0.04em] text-strong sm:text-[42px] lg:text-[52px]",
          align === "center" && "mx-auto",
        )}
      >
        {title}
      </div>
      {description ? (
        <p
          className={cn(
            "max-w-2xl text-[15px] leading-7 text-soft sm:text-base",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

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

  return <div className={cn("rounded-[20px] border px-4 py-4 text-sm leading-7", toneClass, className)}>{children}</div>;
}

export function EmptyStatePanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
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

export function ChoicePill({
  active,
  children,
  onClick,
  className,
}: {
  active: boolean;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      className={cn("ui-pill", active && "ui-pill-active", className)}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

export function FieldGroup({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("space-y-2.5", className)}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-strong">{label}</span>
        {hint ? <span className="text-xs text-muted">{hint}</span> : null}
      </div>
      {children}
    </label>
  );
}

const baseButtonClass = "ui-btn";

export function ButtonLink({
  className,
  variant = "primary",
  ...props
}: ComponentProps<typeof Link> & {
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
}) {
  const variantClass =
    variant === "primary"
      ? "ui-btn-primary"
      : variant === "secondary"
        ? "ui-btn-secondary"
        : "ui-btn-ghost";

  return <Link className={cn(baseButtonClass, variantClass, className)} {...props} />;
}

export function Button({
  className,
  variant = "primary",
  ...props
}: ComponentProps<"button"> & {
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
}) {
  const variantClass =
    variant === "primary"
      ? "ui-btn-primary"
      : variant === "secondary"
        ? "ui-btn-secondary"
        : "ui-btn-ghost";

  return <button className={cn(baseButtonClass, variantClass, className)} {...props} />;
}
