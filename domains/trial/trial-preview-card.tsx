"use client";

import Link from "next/link";
import { ExperienceCard } from "@/shared/ui/trial-experience";
import type { TrialPreview } from "./trial-model";

export function TrialPreviewCard({
  preview,
}: {
  preview: TrialPreview;
}) {
  return (
    <ExperienceCard className="min-h-[369px] px-6 py-6 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.08)] hover:translate-y-0 hover:shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.08)] lg:px-[25px] lg:py-[25px]">
      <div className="space-y-5">
        <div className="space-y-2">
          <div className="text-[20px] font-semibold leading-[28px] tracking-[-0.02em] text-[#27272a]">
            {preview.title}
          </div>
          <p className="text-sm leading-6 text-[#737378]">
            先让你看到这一轮已经生成到什么程度，再决定要不要继续。
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[18px] border border-[rgba(0,0,0,0.08)] bg-[linear-gradient(180deg,#ffffff_0%,#fbf8fd_100%)] px-5 py-5">
          <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-[#27272a]">
            {preview.previewText}
          </pre>
          {preview.truncated ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.92)_48%,#ffffff_100%)]" />
          ) : null}
        </div>

        <div className="rounded-[16px] border border-[rgba(212,102,143,0.16)] bg-[rgba(253,244,248,0.72)] px-4 py-4 text-sm leading-6 text-[#7a4760]">
          {preview.continueHint}
          {preview.hiddenChars > 0 ? ` 当前还有约 ${preview.hiddenChars} 个字的完整内容未展开。` : ""}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm leading-6 text-[#737378]">
            修改上方需求后可以重新生成体验预览。
          </div>
          <Link
            className="inline-flex h-12 items-center justify-center rounded-[16px] bg-[#4a3168] px-5 text-sm font-medium text-white shadow-[0_10px_26px_rgba(74,49,104,0.18)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#5a3b7b] hover:shadow-[0_16px_34px_rgba(74,49,104,0.24)]"
            href="/login?intent=trial"
          >
            登录后继续
          </Link>
        </div>
      </div>
    </ExperienceCard>
  );
}
