"use client";

import Link from "next/link";
import { ExperienceCard } from "@/shared/ui/trial-experience";
import { useAuthSession } from "@/shared/lib/session-store";
import type { TrialPreview } from "./trial-model";

export function TrialPreviewCard({
  preview,
  onRegenerate,
  regenerating,
}: {
  preview: TrialPreview;
  onRegenerate: () => void;
  regenerating: boolean;
}) {
  const session = useAuthSession();
  const ctaHref = session?.sessionToken ? "/#plans" : "/login?intent=trial";
  const ctaText = "立即解锁";

  async function copyPreview() {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    await navigator.clipboard.writeText(preview.previewText);
  }

  return (
    <ExperienceCard className="min-h-[369px] px-6 py-6 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.08)] hover:translate-y-0 hover:shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.08)] lg:px-[25px] lg:py-[25px]">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-[20px] font-semibold leading-[28px] tracking-[-0.02em] text-[#27272a]">
            你的内容已生成
          </div>
          <div className="text-sm text-[#4A3168]">查看历史</div>
        </div>

        <div className="rounded-[20px] bg-[#FDF4F8] p-4">
          <div className="text-[20px] font-semibold leading-[28px] text-[#27272a]">解锁完整内容</div>
          <div className="mt-1 text-sm text-[#737378]">升级后立即查看完整内容</div>
          <div className="mt-3 flex items-end gap-1">
            <div className="text-[32px] font-semibold leading-none text-[#27272a]">¥1</div>
            <div className="pb-1 text-sm text-[#52525B]">/7天</div>
          </div>
          <Link
            className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-[16px] bg-[#D4668F] text-sm font-medium text-white"
            href={ctaHref}
          >
            {ctaText}
          </Link>
          <div className="mt-2 text-center text-xs text-[#A3A3AB]">7天无理由退款 · 随时可取消</div>
        </div>

        <div className="relative overflow-hidden rounded-[20px] border border-[rgba(0,0,0,0.08)] bg-white p-4">
          <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-[#27272a]">
            {preview.previewText}
          </pre>
          {preview.truncated ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.92)_48%,#ffffff_100%)]" />
          ) : null}
        </div>

        <div className="rounded-[16px] border border-[#ECECF0] bg-white px-4 py-3">
          <div className="text-sm font-medium text-[#737378]">还有更多精彩内容</div>
          <div className="mt-1 text-sm text-[#737378]">
            完整内容已生成，解锁后即可复制使用
            {preview.hiddenChars > 0 ? `（还有约 ${preview.hiddenChars} 字未展开）` : ""}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button
            className="inline-flex h-11 items-center justify-center rounded-[16px] border border-[#4A3168] text-sm font-medium text-[#4A3168]"
            onClick={onRegenerate}
            type="button"
          >
            {regenerating ? "生成中" : "再来一版"}
          </button>
          <button
            className="inline-flex h-11 items-center justify-center rounded-[16px] border border-[#4A3168] text-sm font-medium text-[#4A3168]"
            onClick={() => void copyPreview()}
            type="button"
          >
            复制预览
          </button>
          <Link
            className="inline-flex h-11 items-center justify-center rounded-[16px] bg-[#4A3168] text-sm font-medium text-white"
            href={ctaHref}
          >
            解锁完整
          </Link>
        </div>
      </div>
    </ExperienceCard>
  );
}
