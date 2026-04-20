"use client";

export function WorkspaceResultHeader({ copiedText }: { copiedText: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <div className="text-[20px] font-semibold text-[#27272A]">你的内容已生成</div>
        <div className="mt-1 text-sm text-[#737378]">刚刚生成</div>
      </div>
      {copiedText ? (
        <span className="rounded-full bg-[#F5F3F7] px-3 py-1 text-xs font-medium text-[#4A3168]">
          {copiedText}
        </span>
      ) : null}
    </div>
  );
}
