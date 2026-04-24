"use client";

import { Button } from "@/shared/ui/ui";

export function WorkspaceResultHeader({
  copiedText,
  isSaving,
  onCopyAndComplete,
  onSave,
}: {
  copiedText: string;
  isSaving: boolean;
  onCopyAndComplete: () => void;
  onSave: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <div className="text-[20px] font-semibold text-[#27272A]">你的内容已生成</div>
        <div className="mt-1 text-sm text-[#737378]">刚刚生成</div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {copiedText ? (
          <span className="rounded-full bg-[#F5F3F7] px-3 py-1 text-xs font-medium text-[#4A3168]">
            {copiedText}
          </span>
        ) : null}
        <Button disabled={isSaving} onClick={onSave} type="button" variant="secondary">
          {isSaving ? "保存中" : "保存内容"}
        </Button>
        <Button disabled={isSaving} onClick={onCopyAndComplete} type="button">
          复制并标记完成
        </Button>
      </div>
    </div>
  );
}
