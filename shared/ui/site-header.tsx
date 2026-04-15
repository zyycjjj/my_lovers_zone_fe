"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearAuthSession, useAuthSession } from "../lib/session-store";
import { ButtonLink, cn } from "./ui";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/trial", label: "体验" },
  { href: "/workspace", label: "工作台" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const session = useAuthSession();

  return (
    <header className="sticky top-0 z-30 border-b border-[rgba(88,51,175,0.06)] bg-[rgba(248,246,255,0.76)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-[18px] border border-[rgba(88,51,175,0.12)] bg-white text-base font-semibold text-[var(--primary-700)] shadow-[0_8px_20px_rgba(36,20,74,0.06)]">
            M
          </span>
          <div className="min-w-0">
            <div className="truncate text-lg font-semibold tracking-[-0.03em] text-strong">Memory</div>
            <div className="truncate text-xs text-soft">轻陪跑式 AI 内容工作台</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 rounded-[18px] border border-[rgba(88,51,175,0.08)] bg-white/82 p-1 md:flex">
          {navItems.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-[14px] px-4 py-2 text-sm font-medium text-soft",
                  active && "bg-[rgba(112,70,214,0.1)] text-[var(--primary-700)]",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {session?.sessionToken ? (
            <>
              <ButtonLink href="/workspace" variant="secondary" className="hidden sm:inline-flex">
                进入工作台
              </ButtonLink>
              <button
                className="ui-btn ui-btn-ghost"
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
            <ButtonLink href="/login">登录 / 注册</ButtonLink>
          )}
        </div>
      </div>
    </header>
  );
}
