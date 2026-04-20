import Link from "next/link";
import type { ReactNode } from "react";

export function HomePrimaryButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex h-[60px] w-full items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#4a3168_0%,#6f4d96_100%)] text-[18px] font-medium text-white shadow-[0_12px_30px_rgba(74,49,104,0.18)] hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(74,49,104,0.26)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4a3168]/18 active:translate-y-0 active:shadow-[0_10px_22px_rgba(74,49,104,0.2)] lg:h-16 lg:w-auto lg:min-w-[192px]"
    >
      {children}
    </Link>
  );
}

export function HomeSecondaryButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex h-[60px] w-full items-center justify-center rounded-2xl border-[1.5px] border-[#4a3168] bg-white text-[18px] font-medium text-[#4a3168] shadow-[0_8px_20px_rgba(74,49,104,0.06)] hover:-translate-y-1 hover:bg-[#f8f4fb] hover:shadow-[0_14px_28px_rgba(74,49,104,0.12)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4a3168]/12 active:translate-y-0 lg:h-16 lg:w-auto lg:min-w-[140px]"
    >
      {children}
    </Link>
  );
}

