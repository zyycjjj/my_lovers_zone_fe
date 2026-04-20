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
    <section className="fixed inset-x-0 bottom-0 z-30 border-t border-[rgba(0,0,0,0.08)] bg-white/95 backdrop-blur-md lg:hidden">
      <div className="mx-auto grid w-full max-w-[430px] grid-cols-3 gap-3 px-4 py-4">
        <button
          className="inline-flex h-11 items-center justify-center rounded-[16px] border border-[#4A3168] text-sm font-medium text-[#4A3168]"
          onClick={onRegenerate}
          type="button"
        >
          {regenerating ? "生成中" : "再来一版"}
        </button>
        <button
          className="inline-flex h-11 items-center justify-center rounded-[16px] border border-[#4A3168] text-sm font-medium text-[#4A3168]"
          onClick={onCopyPreview}
          type="button"
        >
          复制预览
        </button>
        <Link
          className="inline-flex h-11 items-center justify-center rounded-[16px] bg-[#4A3168] text-sm font-medium text-white"
          href={unlockHref}
        >
          解锁完整
        </Link>
      </div>
    </section>
  );
}
