"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";
import { cn } from "../ui";

const actionBaseClass =
  "inline-flex items-center justify-center gap-2 rounded-[16px] text-sm font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-4";

export function ExperienceActionButton({
  className,
  disabled,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children?: ReactNode }) {
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
}: ComponentProps<typeof Link> & { children?: ReactNode }) {
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

