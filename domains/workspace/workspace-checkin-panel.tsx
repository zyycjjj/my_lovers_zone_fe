"use client";

import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "@/shared/lib/api";
import type { Goal } from "./workspace-goal-picker";
import { goals } from "./workspace-goal-picker";

export type MoodType = "energized" | "rushed" | "unsure" | "tired";

type MoodOption = {
  key: MoodType;
  label: string;
  icon: string;
  hint: string;
};

export const moods: MoodOption[] = [
  { key: "energized", label: "有状态", icon: "✨", hint: "状态好的时候，先生成一版能直接发的内容" },
  { key: "rushed", label: "赶时间", icon: "🔥", hint: "时间紧的话，先出标题再挑一条最快的发出去" },
  { key: "unsure", label: "找灵感", icon: "💡", hint: "不确定方向的时候，从最近做过的内容继续延伸" },
  { key: "tired", label: "先试试", icon: "☁️", hint: "累了就先来一条，不用追求完美" },
];

type PanelData = {
  todayCheckin: {
    mood: string;
    moodLabel: string;
    goalKey?: string | null;
    sourceHint?: string | null;
  } | null;
  continueHint: string | null;
  streak: number;
  moodHints: Record<string, string>;
  moodLabels: Record<string, string>;
};

type Props = {
  activeGoalKey: string | null;
  activeTool: string;
  onGoalSelect: (goal: Goal) => void;
  onGoalClear?: () => void;
};

export function WorkspaceCheckinPanel({ activeGoalKey, activeTool, onGoalSelect, onGoalClear }: Props) {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [panelData, setPanelData] = useState<PanelData | null>(null);
  const [loading, setLoading] = useState(false);
  const [continueHint, setContinueHint] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [checkedIn, setCheckedIn] = useState(false);

  // 加载面板数据
  useEffect(() => {
    let active = true;
    setLoading(true);

    apiRequest<PanelData>("/api/checkins/panel")
      .then((data) => {
        if (!active) return;
        setPanelData(data);
        setContinueHint(data.continueHint);
        setStreak(data.streak);
        if (data.todayCheckin) {
          setSelectedMood(data.todayCheckin.mood as MoodType);
          setCheckedIn(true);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // 选择心情后自动打卡
  const handleMoodSelect = useCallback(
    async (mood: MoodOption) => {
      setSelectedMood(mood.key);
      setCheckedIn(true);

      try {
        await apiRequest("/api/checkins", {
          method: "POST",
          body: { mood: mood.key },
        });
      } catch {
        // 静默失败，不影响主流程
      }
    },
    [],
  );

  // 选择目标时同步更新打卡数据
  const handleGoalSelectWithCheckin = useCallback(
    (goal: Goal) => {
      onGoalSelect(goal);

      if (selectedMood || checkedIn) {
        apiRequest("/api/checkins", {
          method: "POST",
          body: { mood: selectedMood ?? "energized", goalKey: goal.key },
        }).catch(() => {});
      }
    },
    [onGoalSelect, selectedMood, checkedIn],
  );

  const currentMoodHint = selectedMood
    ? moods.find((m) => m.key === selectedMood)?.hint
    : panelData?.todayCheckin
      ? panelData.moodHints[panelData.todayCheckin.mood] || ""
      : "";

  return (
    <div className="space-y-4">
      {/* 标题区 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[18px] font-semibold text-[#27272A]">今天的状态</h2>
          <p className="mt-1 text-sm text-[#737378]">选一个最符合你现在感觉的状态</p>
        </div>
        {streak >= 2 ? (
          <span className="flex items-center gap-1 rounded-full bg-[linear-gradient(135deg,#F5F3F7_0%,#FDF4F8_100%)] px-3 py-1.5 text-xs font-semibold text-[#D4668F]">
            🔥 连续 {streak} 天
          </span>
        ) : null}
      </div>

      {/* 心情选择 */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {moods.map((mood) => {
          const isActive = selectedMood === mood.key;
          const wasSelected = panelData?.todayCheckin?.mood === mood.key && !selectedMood;

          return (
            <button
              key={mood.key}
              onClick={() => handleMoodSelect(mood)}
              className={`group rounded-[16px] border px-3 py-3 text-left transition-all ${
                isActive
                  ? "border-[#8961F2] bg-[#F8F4FB] shadow-[0_0_0_3px_rgba(137,97,242,0.12)]"
                  : wasSelected
                    ? "border-[rgba(137,97,242,0.35)] bg-[#FAF8FD]"
                    : "border-[rgba(0,0,0,0.08)] bg-white hover:border-[rgba(137,97,242,0.3)]"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-lg">{mood.icon}</span>
                <span
                  className={`text-sm font-semibold transition-colors ${
                    isActive ? "text-[#8961F2]" : "text-[#27272A]"
                  }`}
                >
                  {mood.label}
                </span>
                {isActive ? (
                  <svg className="h-4 w-4 shrink-0 text-[#8961F2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : wasSelected ? (
                  <svg className="h-4 w-4 shrink-0 text-[#8961F2]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4 shrink-0 text-[#C4C4CC] group-hover:text-[#A3A3AD]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <circle cx="12" cy="12" r="9" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* 心情提示文案 */}
      {(currentMoodHint || panelData?.todayCheckin?.sourceHint) && (
        <div className="rounded-[14px] border border-[rgba(137,97,242,0.10)] bg-[#FAF8FF] px-4 py-3">
          <p className="text-sm leading-6 text-[#5833AF]">
            {currentMoodHint || panelData!.todayCheckin!.sourceHint}
          </p>
        </div>
      )}

      {/* 昨日联动提示 */}
      {continueHint && (
        <div className="rounded-[14px] border border-dashed border-[rgba(212,102,143,0.20)] bg-[#FEFCFD] px-4 py-3 flex items-start gap-2">
          <span className="mt-0.5 shrink-0 text-sm">💡</span>
          <p className="text-sm leading-6 text-[#993D63]">{continueHint}</p>
        </div>
      )}

      {/* 目标选择（复用现有 GoalPicker 的目标选项） */}
      <div>
        <div className="mb-2.5 text-sm font-medium text-[#737378]">今天打算做什么？</div>
        <div className="flex flex-wrap gap-2">
          {goals.map((goal) => {
            const isActive = activeGoalKey === goal.key;
            const isToolMatched = !activeGoalKey && activeTool === goal.defaultTool;

            return (
              <button
                key={goal.key}
                onClick={() => {
                  if (isActive) {
                    onGoalClear?.();
                  } else {
                    handleGoalSelectWithCheckin(goal);
                  }
                }}
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
    </div>
  );
}
