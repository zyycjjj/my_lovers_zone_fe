"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../ui";

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

