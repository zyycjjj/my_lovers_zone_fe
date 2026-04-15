"use client";

import { ChoicePill, cn } from "@/shared/ui/ui";
import { tools, type ToolKind } from "./workspace-model";

export function ToolTabs({
  activeTool,
  onChange,
}: {
  activeTool: ToolKind;
  onChange: (next: ToolKind) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {tools.map((tool) => {
        const active = tool.key === activeTool;
        return (
          <ChoicePill
            key={tool.key}
            active={active}
            className={cn(
              "rounded-full border px-4 py-2 text-sm",
              active
                ? "border-[#4A3168] bg-[#F5F3F7] text-[#4A3168]"
                : "border-[#ECECF0] bg-white text-[#52525B]",
            )}
            onClick={() => onChange(tool.key)}
          >
            <span className="inline-flex items-center gap-2">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[rgba(74,49,104,0.08)] text-[11px] font-semibold text-[#4A3168]">
                {tool.icon}
              </span>
              {tool.label}
            </span>
          </ChoicePill>
        );
      })}
    </div>
  );
}

