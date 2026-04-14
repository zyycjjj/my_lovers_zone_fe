"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearAuthSession, useAuthSession } from "../lib/session-store";
import { ButtonLink, cn } from "./ui";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/login", label: "登录" },
  { href: "/workspace", label: "工作台" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const session = useAuthSession();

  return (
    <header className="sticky top-0 z-30 border-b border-[rgba(91,70,142,0.08)] bg-[rgba(250,246,255,0.68)] backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[rgba(93,63,211,0.18)] bg-[linear-gradient(180deg,_rgba(255,255,255,0.96)_0%,_rgba(241,234,255,0.92)_100%)] text-lg font-bold text-brand">
            M
          </span>
          <span className="space-y-0.5">
            <strong className="text-strong block text-lg font-semibold">
              Memory
            </strong>
            <span className="text-soft block text-xs">
              轻陪跑式 AI 内容工作台
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-2 rounded-full border border-[rgba(91,70,142,0.08)] bg-white/62 p-1 md:flex">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === item.href
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium text-soft",
                  active && "bg-white text-strong shadow-[0_10px_24px_rgba(74,42,179,0.08)]",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {session?.sessionToken ? (
            <>
              <span className="text-soft hidden text-xs sm:inline">
                已登录
              </span>
              <button
                className="rounded-full border border-[rgba(93,63,211,0.12)] bg-white/72 px-4 py-2 text-sm font-medium text-soft hover:bg-white"
                onClick={() => {
                  clearAuthSession();
                  router.push("/login");
                }}
                type="button"
              >
                退出
              </button>
            </>
          ) : (
            <ButtonLink href="/login" className="px-4 py-2.5">
              开始登录
            </ButtonLink>
          )}
        </div>
      </div>
    </header>
  );
}
