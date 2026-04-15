"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";
import { cn } from "./ui";

export function ExperienceCard({
  children,
  className,
  tone = "default",
}: {
  children: ReactNode;
  className?: string;
  tone?: "default" | "soft" | "dark";
}) {
  const toneClass =
    tone === "dark"
      ? "bg-[linear-gradient(158deg,#4a3168_0%,#2d1b4e_100%)] text-white shadow-[0_18px_48px_rgba(74,49,104,0.24)]"
      : tone === "soft"
        ? "bg-[linear-gradient(148deg,#fdf4f8_0%,#f5f3f7_52%,#ffffff_100%)]"
        : "bg-[linear-gradient(143deg,#ffffff_0%,rgba(245,243,247,0.3)_100%)]";

  return (
    <section
      className={cn(
        "rounded-[20px] border border-[rgba(0,0,0,0.08)] shadow-[0_4px_6px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.08)] transition-transform duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(74,49,104,0.14)]",
        toneClass,
        className,
      )}
    >
      {children}
    </section>
  );
}

const actionBaseClass =
  "inline-flex items-center justify-center gap-2 rounded-[16px] text-sm font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-4";

export function ExperienceActionButton({
  className,
  disabled,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        actionBaseClass,
        "h-12 px-5 shadow-[0_10px_26px_rgba(74,49,104,0.18)]",
        disabled
          ? "cursor-not-allowed bg-[#a595ba] text-white/92"
          : "bg-[linear-gradient(135deg,#8d7ca9_0%,#9d8db8_100%)] text-white hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(74,49,104,0.24)] focus-visible:ring-[#4a3168]/16 active:translate-y-0",
        className,
      )}
      disabled={disabled}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}

export function ExperienceActionLink({
  className,
  children,
  ...props
}: ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        actionBaseClass,
        "h-9 bg-[linear-gradient(135deg,#d4668f_0%,#db789c_100%)] px-4 text-white shadow-[0_12px_24px_rgba(212,102,143,0.24)] hover:-translate-y-0.5 hover:shadow-[0_16px_28px_rgba(212,102,143,0.3)] focus-visible:ring-[#d4668f]/18 active:translate-y-0",
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}

export function ExperienceExampleChip({
  active,
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      className={cn(
        "inline-flex h-8 items-center justify-center rounded-[12px] bg-[#f5f3f7] px-3 text-sm font-medium text-[#4a3168] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#efe8f6] hover:shadow-[0_8px_18px_rgba(74,49,104,0.1)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4a3168]/10",
        active && "bg-[#ece5f5] shadow-[0_8px_18px_rgba(74,49,104,0.08)]",
        className,
      )}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}

export function ExperienceMetricTile({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[16px] border border-white/80 bg-white/60 px-[13px] py-[13px]">
      <div className="text-xs leading-4 text-[#737378]">{label}</div>
      <div className="mt-[4px] text-[20px] font-bold leading-7 tracking-[-0.02em] text-[#4a3168]">{value}</div>
    </div>
  );
}

export function ExperienceBadge() {
  return (
    <div className="inline-flex h-[30px] items-center gap-[6px] rounded-full border border-[#f9cfe3] bg-[#fdf4f8] px-3 text-sm font-medium text-[#993d63]">
      <span className="h-[6px] w-[6px] rounded-full bg-[#d4668f]" />
      <span>体验版</span>
    </div>
  );
}

export function BackIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 18L9 12L15 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.9"
      />
    </svg>
  );
}

export function BoltIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.5 2L6 13H11L10.5 22L18 11H13L13.5 2Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function SparkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.25 2.5L6.25 9.83333H9.58333L9.16667 16.1667L14.1667 8.83333H10.8333L11.25 2.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function TipIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      height="18"
      viewBox="0 0 18 18"
      width="18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 2.25C6.51472 2.25 4.5 4.26472 4.5 6.75C4.5 8.45529 5.44418 9.93928 6.83984 10.7081C7.05842 10.8285 7.2 11.0474 7.2 11.2969V12.375H10.8V11.2969C10.8 11.0474 10.9416 10.8285 11.1602 10.7081C12.5558 9.93928 13.5 8.45529 13.5 6.75C13.5 4.26472 11.4853 2.25 9 2.25Z"
        fill="currentColor"
      />
      <path d="M7.5 14.25H10.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <path d="M7.875 16H10.125" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

export function LaunchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 16L16 8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.9"
      />
      <path
        d="M9.5 8H16V14.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.9"
      />
    </svg>
  );
}
