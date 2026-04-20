"use client";

export function WorkspaceResultHeader({ copiedText }: { copiedText: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <div className="text-[20px] font-semibold text-[#27272A]">这轮结果</div>
        <div className="mt-1 text-sm text-[#737378]">先看这一轮结果，再决定下一步怎么继续。</div>
      </div>
      {copiedText ? (
        <span className="rounded-full bg-[#F5F3F7] px-3 py-1 text-xs font-medium text-[#4A3168]">
          {copiedText}
        </span>
      ) : null}
    </div>
  );
}

