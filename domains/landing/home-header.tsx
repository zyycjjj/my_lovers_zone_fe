import Link from "next/link";
import { HomeBrand } from "./home-brand";

export function HomeHeader() {
  return (
    <div className="fixed inset-x-0 top-0 z-40 border-b border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.8)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between px-4 lg:h-[65px] lg:px-4">
        <HomeBrand />
        <Link
          href="/login"
          className="inline-flex h-9 items-center justify-center rounded-2xl px-4 text-sm font-medium text-[#3f3f46] hover:-translate-y-0.5 hover:bg-[rgba(74,49,104,0.06)] hover:text-[#4a3168] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a3168]/20 lg:h-10 lg:px-6"
        >
          登录
        </Link>
      </div>
    </div>
  );
}

