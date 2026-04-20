"use client";

import type { ReactNode } from "react";
import { cn } from "../ui";

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

