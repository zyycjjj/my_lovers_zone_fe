"use client";

import { Button } from "@/shared/ui/ui";

export function WorkspaceTitleResult({
  titles,
  onCopy,
  assetId,
}: {
  titles: string[];
  onCopy: (text: string) => void;
  assetId?: number;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="text-sm font-semibold text-[#27272A]">生成结果</div>
        {assetId ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2 py-0.5 text-xs font-medium text-[#166534]">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            已自动保存
          </span>
        ) : null}
      </div>
      <div className="grid gap-3">
        {titles.map((title, index) => (
          <div
            key={`${title}-${index}`}
            className="rounded-[16px] border border-[rgba(0,0,0,0.08)] bg-white px-4 py-4 text-sm leading-7 text-[#27272A]"
          >
            <span className="mr-2 font-semibold text-[#4A3168]">{index + 1}.</span>
            {title}
          </div>
        ))}
      </div>
      <Button onClick={() => onCopy(titles.map((item, index) => `${index + 1}. ${item}`).join("\n"))} type="button" variant="secondary">
        复制这一组标题
      </Button>
    </div>
  );
}

