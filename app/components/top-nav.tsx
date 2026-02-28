"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useClientToken, useProfiles } from "../lib/use-client-token";

const items = [
  { href: "/script", label: "脚本" },
  { href: "/title", label: "标题" },
  { href: "/commission", label: "佣金" },
  { href: "/refine", label: "话术" },
  { href: "/signal", label: "轻信号" },
];

export default function TopNav() {
  const { token } = useClientToken();
  const { profiles } = useProfiles();

  const role = useMemo(() => {
    if (!token) return "guest";
    if (token === profiles.girlfriend) return "girlfriend";
    if (token === profiles.test) return "test";
    if (token === profiles.me) return "me";
    return "guest";
  }, [profiles, token]);

  const showAdmin = role === "me" || role === "test";

  return (
    <nav className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
      {items.map((item) => (
        <Link key={item.href} href={item.href} className="hover:text-rose-600">
          {item.label}
        </Link>
      ))}
      {showAdmin ? (
        <Link href="/admin" className="hover:text-rose-600">
          Admin
        </Link>
      ) : null}
    </nav>
  );
}
