"use client";

import Link from "next/link";
import { BackIcon, ExperienceBadge } from "@/shared/ui/trial-experience";

export function TrialHeaderBar() {
  return (
    <div className="sticky top-0 z-30 border-b border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.8)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[1283px] items-center justify-between px-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-base font-medium text-[#27272a] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:text-[#4a3168] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4a3168]/12"
        >
          <BackIcon className="text-[#27272a]" />
          <span>返回首页</span>
        </Link>
        <ExperienceBadge />
      </div>
    </div>
  );
}

