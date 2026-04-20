"use client";

import { FieldGroup } from "@/shared/ui/ui";
import type { ToolKind } from "../workspace-model";

export function WorkspacePromptField({
  activeTool,
  placeholder,
  refineText,
  scriptKeyword,
  titleKeyword,
  onRefineTextChange,
  onScriptKeywordChange,
  onTitleKeywordChange,
}: {
  activeTool: ToolKind;
  placeholder: string;
  titleKeyword: string;
  scriptKeyword: string;
  refineText: string;
  onTitleKeywordChange: (value: string) => void;
  onScriptKeywordChange: (value: string) => void;
  onRefineTextChange: (value: string) => void;
}) {
  const value =
    activeTool === "title"
      ? titleKeyword
      : activeTool === "script"
        ? scriptKeyword
        : activeTool === "refine"
          ? refineText
          : "";

  return (
    <FieldGroup label="内容描述">
      <textarea
        className="min-h-[122px] w-full resize-none rounded-[16px] border border-[#ECECF0] bg-white px-4 py-3 text-base leading-6 text-[#27272A] outline-none transition-colors placeholder:text-[#A3A3AB] focus:border-[#4A3168]"
        onChange={(event) => {
          const next = event.target.value;
          if (activeTool === "title") onTitleKeywordChange(next);
          if (activeTool === "script") onScriptKeywordChange(next);
          if (activeTool === "refine") onRefineTextChange(next);
        }}
        placeholder={placeholder}
        value={value}
      />
    </FieldGroup>
  );
}

