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
    <header className="sticky top-0 z-30 border-b border-[rgba(184,169,151,0.12)] bg-[rgba(252,250,246,0.72)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[rgba(191,92,49,0.18)] bg-[--brand-soft] text-lg font-bold text-[--brand]">
            M
          </span>
          <span className="space-y-0.5">
            <strong className="block text-lg font-semibold text-[--text-strong]">
              Memory
            </strong>
            <span className="block text-xs text-[--text-soft]">
              轻陪跑式 AI 内容工作台
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
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
                  "rounded-full px-4 py-2 text-sm font-medium text-[--text-soft]",
                  active && "bg-white/80 text-[--text-strong] shadow-[0_8px_24px_rgba(15,23,42,0.06)]",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {session.sessionToken ? (
            <>
              <span className="hidden text-xs text-[--text-soft] sm:inline">
                已连接第一阶段会话
              </span>
              <button
                className="rounded-full border border-[--border-soft] px-4 py-2 text-sm font-medium text-[--text-soft] hover:bg-white/70"
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
