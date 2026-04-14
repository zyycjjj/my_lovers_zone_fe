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
  return (
    <section
      className={cn(
        "surface-card rounded-[30px] p-5 sm:p-6",
        className,
      )}
    >
      {children}
    </section>
  );
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
      ? "bg-brand-soft text-brand-ink border-[rgba(93,63,211,0.16)]"
      : tone === "sage"
        ? "bg-sage-soft text-[#365246] border-[rgba(70,110,90,0.14)]"
        : tone === "rose"
          ? "bg-rose-soft text-[#a34377] border-[rgba(203,96,146,0.16)]"
          : "bg-slate-soft text-soft border-soft";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        toneClass,
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-2">
      {eyebrow ? (
        <span className="text-brand text-[11px] font-semibold uppercase tracking-[0.24em]">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="heading-serif text-strong text-[30px] leading-[1.18] sm:text-[38px]">
        {title}
      </h2>
      {description ? (
        <p className="text-soft max-w-2xl text-sm leading-7 sm:text-[15px]">
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
      ? "border-[rgba(93,63,211,0.12)] bg-[linear-gradient(180deg,_rgba(241,234,255,0.8)_0%,_rgba(255,255,255,0.88)_100%)]"
      : tone === "rose"
        ? "border-[rgba(203,96,146,0.12)] bg-[linear-gradient(180deg,_rgba(255,234,243,0.72)_0%,_rgba(255,255,255,0.88)_100%)]"
        : tone === "sage"
          ? "border-[rgba(70,110,90,0.14)] bg-[linear-gradient(180deg,_rgba(238,248,242,0.8)_0%,_rgba(255,255,255,0.88)_100%)]"
          : "border-[rgba(91,70,142,0.1)] bg-white/82";

  return (
    <div className={cn("rounded-[24px] border px-5 py-5", toneClass, className)}>
      <div className="text-strong text-sm font-semibold">{title}</div>
      <div className="text-soft mt-2 text-sm leading-7">{description}</div>
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
    <div className={cn("surface-card-muted rounded-[24px] px-5 py-5", className)}>
      <div className="text-muted text-xs uppercase tracking-[0.2em]">{label}</div>
      <div className="text-strong mt-2 text-lg font-semibold">{value}</div>
      {hint ? <div className="text-soft mt-2 text-sm">{hint}</div> : null}
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
      ? "border-[rgba(93,63,211,0.16)] bg-brand-soft text-brand-ink"
      : tone === "rose"
        ? "border-[rgba(203,96,146,0.16)] bg-rose-soft text-[#a34377]"
        : tone === "gold"
          ? "border-[rgba(232,176,61,0.22)] bg-gold-soft text-[#7a5e1c]"
          : "border-[rgba(91,70,142,0.1)] bg-slate-soft text-soft";

  return (
    <div className={cn("rounded-[22px] border px-4 py-4 text-sm leading-7", toneClass, className)}>
      {children}
    </div>
  );
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
        "rounded-[24px] border border-dashed border-[rgba(91,70,142,0.14)] bg-white/76 px-5 py-10 text-sm leading-7 text-soft",
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
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
        active
          ? "border-[rgba(93,63,211,0.18)] bg-brand-soft text-brand-ink"
          : "border-[rgba(91,70,142,0.1)] bg-white/72 text-soft hover:bg-white",
        className,
      )}
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
    <label className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-strong text-sm font-semibold">{label}</span>
        {hint ? <span className="text-muted text-xs">{hint}</span> : null}
      </div>
      {children}
    </label>
  );
}

const baseButtonClass =
  "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60";

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
      ? "bg-[linear-gradient(135deg,_var(--primary-500)_0%,_var(--primary-700)_100%)] text-white shadow-[0_16px_34px_rgba(93,63,211,0.28)] hover:brightness-[1.03]"
      : variant === "secondary"
        ? "border border-[rgba(93,63,211,0.18)] bg-white/86 text-strong hover:bg-white"
        : "bg-transparent text-soft hover:bg-white/55 hover:text-strong";

  return (
    <Link
      className={cn(baseButtonClass, variantClass, className)}
      {...props}
    />
  );
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
      ? "bg-[linear-gradient(135deg,_var(--primary-500)_0%,_var(--primary-700)_100%)] text-white shadow-[0_16px_34px_rgba(93,63,211,0.28)] hover:brightness-[1.03]"
      : variant === "secondary"
        ? "border border-[rgba(93,63,211,0.18)] bg-white/86 text-strong hover:bg-white"
        : "bg-transparent text-soft hover:bg-white/55 hover:text-strong";

  return (
    <button
      className={cn(baseButtonClass, variantClass, className)}
      {...props}
    />
  );
}
