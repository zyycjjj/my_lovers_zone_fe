"use client";

import { Button } from "@/shared/ui/ui";

export function WorkspaceTitleResult({
  titles,
  onCopy,
}: {
  titles: string[];
  onCopy: (text: string) => void;
}) {
  return (
    <div className="space-y-4">
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

