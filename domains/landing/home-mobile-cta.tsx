"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthSession } from "@/shared/lib/session-store";

export function HomeMobileCtaBar() {
  const session = useAuthSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLoggedIn = mounted && session?.sessionToken;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.95)] shadow-[0_-20px_25px_rgba(0,0,0,0.08),0_-8px_10px_rgba(0,0,0,0.08)] backdrop-blur-xl lg:hidden">
      <div className="mx-auto max-w-[403px] px-4 py-4">
        <div className="text-center">
          <div className="text-base font-semibold leading-[26px] text-[#18181b]">
            {isLoggedIn ? "继续创作，生成你的下一条内容" : "现在开始，3秒生成你的第一条内容"}
          </div>
          <div className="mt-1 text-sm text-[#737378]">💎 1元体验7天，随时可退</div>
        </div>

        <div className="mt-4 flex gap-3">
          <Link
            href={isLoggedIn ? "/pricing" : "/login"}
            className="inline-flex h-[51px] flex-1 items-center justify-center rounded-2xl border-[1.5px] border-[#4a3168] bg-white text-base font-medium text-[#4a3168] shadow-[0_8px_18px_rgba(74,49,104,0.08)] hover:-translate-y-0.5 hover:bg-[#f8f4fb] hover:shadow-[0_12px_24px_rgba(74,49,104,0.14)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4a3168]/12"
          >
            {isLoggedIn ? "查看套餐" : "直接登录"}
          </Link>
          <Link
            href={isLoggedIn ? "/workspace" : "/trial"}
            className="inline-flex h-[51px] flex-1 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#4a3168_0%,#6f4d96_100%)] text-base font-medium text-white shadow-[0_14px_32px_rgba(74,49,104,0.2)] hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(74,49,104,0.26)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4a3168]/14"
          >
            {isLoggedIn ? "进入工作台" : "1元立即体验"}
          </Link>
        </div>
      </div>
    </div>
  );
}

