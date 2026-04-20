"use client";

import Link from "next/link";
import { ExperienceCard } from "@/shared/ui/trial-experience";
import { useAuthSession } from "@/shared/lib/session-store";
import type { TrialPreview } from "./trial-model";

export function TrialPreviewCard({
  preview,
}: {
  preview: TrialPreview;
}) {
  const session = useAuthSession();
  const ctaHref = session?.sessionToken ? "/pricing" : "/login?intent=trial";
  const ctaText = "立即解锁";

  return (
    <ExperienceCard className="min-h-[369px] px-6 py-6 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.08)] hover:translate-y-0 hover:shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.08)] lg:px-[25px] lg:py-[25px]">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-[20px] font-semibold leading-[28px] tracking-[-0.02em] text-[#27272a]">
            你的内容已生成
          </div>
          <div className="text-sm text-[#4A3168]">查看历史</div>
        </div>

        <div className="rounded-[20px] bg-[linear-gradient(135deg,#4A3168_0%,#2D1B42_100%)] p-4 text-white shadow-[0_12px_28px_rgba(74,49,104,0.24)]">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-[#F5A5C8]">✦</div>
          <div className="mt-4 text-center text-[20px] font-semibold leading-[28px]">解锁完整内容</div>
          <div className="mt-1 text-center text-sm text-white/80">升级后立即查看完整内容</div>
          <div className="mt-3 flex items-end justify-center gap-1">
            <div className="text-[32px] font-semibold leading-none">¥1</div>
            <div className="pb-1 text-sm text-white/70">/7天</div>
          </div>
          <div className="mt-3 rounded-[16px] bg-white/5 px-3 py-3 text-sm text-white/90">
            <div>完整高质量文案</div>
            <div className="mt-1">一键复制使用</div>
            <div className="mt-1">无限次重新生成</div>
            <div className="mt-1">保存到历史记录</div>
          </div>
          <Link
            className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-[16px] bg-[#D4668F] text-sm font-semibold text-white shadow-[0_8px_20px_rgba(212,102,143,0.3)]"
            href={ctaHref}
            prefetch={false}
          >
            {ctaText}
          </Link>
          <div className="mt-2 text-center text-xs text-white/60">7天无理由退款 · 随时可取消</div>
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
      </div>
    </ExperienceCard>
  );
}
