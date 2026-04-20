"use client";

import type { ReactNode } from "react";

export function WorkspaceEmptyState({
  title,
  description,
  examples,
  onExampleClick,
}: {
  title: string;
  description: string;
  examples: string[];
  onExampleClick: (example: string) => void;
}) {
  return (
    <div className="space-y-6 py-4 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(135deg,#F5F3F7_0%,#FDF4F8_100%)] text-[32px]">
        ✦
      </div>
      <div className="space-y-2">
        <div className="text-[20px] font-semibold text-[#27272A]">{title}</div>
        <p className="mx-auto max-w-[480px] text-sm leading-7 text-[#737378]">{description}</p>
      </div>
      <ExampleChips examples={examples} onExampleClick={onExampleClick} />
    </div>
  );
}

function ExampleChips({
  examples,
  onExampleClick,
}: {
  examples: string[];
  onExampleClick: (example: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="text-xs text-[#737378]">💡 试试这些示例：</div>
      <div className="flex flex-wrap justify-center gap-2">
        {examples.map((example) => (
          <ExampleChip key={example} onClick={() => onExampleClick(example)}>
            {example}
          </ExampleChip>
        ))}
      </div>
    </div>
  );
}

function ExampleChip({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      className="rounded-[12px] bg-[#F5F3F7] px-3 py-2 text-sm text-[#4A3168]"
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

