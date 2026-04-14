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
      ? "bg-[linear-gradient(135deg,_#6d48eb_0%,_#4d2bb8_100%)] text-white shadow-[0_16px_34px_rgba(93,63,211,0.28)] hover:brightness-[1.03]"
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
      ? "bg-[linear-gradient(135deg,_#6d48eb_0%,_#4d2bb8_100%)] text-white shadow-[0_16px_34px_rgba(93,63,211,0.28)] hover:brightness-[1.03]"
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
