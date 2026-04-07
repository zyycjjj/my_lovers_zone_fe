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
        "surface-card rounded-[28px] p-5 sm:p-6",
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
  tone?: "neutral" | "brand" | "sage";
}) {
  const toneClass =
    tone === "brand"
      ? "bg-[--brand-soft] text-[--brand-ink] border-[rgba(191,92,49,0.16)]"
      : tone === "sage"
        ? "bg-[--sage-soft] text-[#365246] border-[rgba(70,110,90,0.14)]"
        : "bg-[--slate-soft] text-[--text-soft] border-[--border-soft]";

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
        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[--brand]">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="heading-serif text-[28px] leading-tight text-[--text-strong] sm:text-[34px]">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-sm leading-7 text-[--text-soft] sm:text-[15px]">
          {description}
        </p>
      ) : null}
    </div>
  );
}

const baseButtonClass =
  "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold";

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
      ? "bg-[--text-strong] text-white shadow-[0_12px_32px_rgba(17,24,39,0.16)] hover:bg-[#0f172a]"
      : variant === "secondary"
        ? "border border-[--border-strong] bg-white/80 text-[--text-strong] hover:bg-white"
        : "text-[--text-soft] hover:text-[--text-strong]";

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
      ? "bg-[--text-strong] text-white shadow-[0_12px_32px_rgba(17,24,39,0.16)] hover:bg-[#0f172a]"
      : variant === "secondary"
        ? "border border-[--border-strong] bg-white/80 text-[--text-strong] hover:bg-white"
        : "text-[--text-soft] hover:text-[--text-strong]";

  return (
    <button
      className={cn(baseButtonClass, variantClass, "disabled:cursor-not-allowed disabled:opacity-60", className)}
      {...props}
    />
  );
}
