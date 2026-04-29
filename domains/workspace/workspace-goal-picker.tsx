"use client";

import { useCallback } from "react";
import type { ToolKind } from "./workspace-model";

export type Goal = {
  key: string;
  label: string;
  description: string;
  defaultTool: ToolKind;
  prefillHint?: string;
};

export const goals: Goal[] = [
  {
    key: "publish",
    label: "发内容",
    description: "日常种草 / 朋友圈文案 / 短视频脚本",
    defaultTool: "script",
  },
  {
    key: "new_product",
    label: "上新",
    description: "新品标题 / 上新文案 / 卖点提炼",
    defaultTool: "title",
  },
  {
    key: "convert",
    label: "做转化",
    description: "直播话术 / 佣金测算 / 高风险词替换",
    defaultTool: "refine",
  },
];

type Props = {
  activeGoalKey: string | null;
  activeTool: ToolKind;
  onSelect: (goal: Goal) => void;
  onClear: () => void;
};

export function WorkspaceGoalPicker({ activeGoalKey, activeTool, onSelect, onClear }: Props) {
  const handleSelect = useCallback(
    (goal: Goal) => {
      if (activeGoalKey === goal.key) {
        onClear();
        return;
      }
      onSelect(goal);
    },
    [activeGoalKey, onSelect, onClear],
  );

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-[#737378]">今天想做什么？</div>
      <div className="flex flex-wrap gap-2">
        {goals.map((goal) => {
          const isActive = activeGoalKey === goal.key;
          const isToolMatched = !activeGoalKey && activeTool === goal.defaultTool;
          return (
            <button
              key={goal.key}
              onClick={() => handleSelect(goal)}
              className={`group rounded-[16px] border px-4 py-3 text-left transition-all ${
                isActive
                  ? "border-[#8961F2] bg-[#F8F4FB] shadow-[0_0_0_3px_rgba(137,97,242,0.12)]"
                  : isToolMatched
                    ? "border-[rgba(74,49,104,0.25)] bg-white hover:border-[#8961F2]/40"
                    : "border-[rgba(0,0,0,0.08)] bg-white hover:border-[rgba(74,49,104,0.25)]"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`text-sm font-semibold transition-colors ${
                    isActive ? "text-[#8961F2]" : "text-[#27272A]"
                  }`}
                >
                  {goal.label}
                </span>
                {isActive ? (
                  <svg className="h-4 w-4 shrink-0 text-[#8961F2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4 shrink-0 text-[#C4C4CC] group-hover:text-[#A3A3AD]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                )}
              </div>
              <p className="mt-1 text-xs leading-5 text-[#737378]">{goal.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
