"use client";

import Link from "next/link";
import { useAuthSession } from "@/shared/lib/session-store";

export function TrialPreviewActions({
  onRegenerate,
  onCopyPreview,
  regenerating,
}: {
  onRegenerate: () => void;
  onCopyPreview: () => void;
  regenerating: boolean;
}) {
  const session = useAuthSession();
  const unlockHref = session?.sessionToken ? "/pricing" : "/login?intent=trial";

  return (
    <section className="fixed inset-x-0 bottom-0 z-30 border-t border-[rgba(0,0,0,0.08)] bg-white/95 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur-md lg:hidden">
      <div className="mx-auto grid w-full max-w-[430px] grid-cols-[1fr_1fr_1.15fr] gap-3 px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-3">
        <button
          className="inline-flex h-12 items-center justify-center rounded-[16px] border border-[#DCCEE9] bg-white text-sm font-medium text-[#4A3168]"
          onClick={onRegenerate}
          type="button"
        >
          {regenerating ? "生成中" : "再来一版"}
        </button>
        <button
          className="inline-flex h-12 items-center justify-center rounded-[16px] border border-[#DCCEE9] bg-white text-sm font-medium text-[#4A3168]"
          onClick={onCopyPreview}
          type="button"
        >
          复制预览
        </button>
        <Link
          className="inline-flex h-12 items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,#4A3168_0%,#6B3F93_100%)] text-sm font-semibold text-white shadow-[0_10px_22px_rgba(74,49,104,0.28)]"
          href={unlockHref}
          prefetch={false}
        >
          解锁完整
        </Link>
      </div>
    </section>
  );
}
