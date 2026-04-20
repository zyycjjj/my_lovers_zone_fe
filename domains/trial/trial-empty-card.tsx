"use client";

import {
  BoltIcon,
  ExperienceCard,
  ExperienceExampleChip,
} from "@/shared/ui/trial-experience";
import { examplePrompts } from "./trial-model";

export function TrialEmptyCard({
  activeExample,
  onExampleClick,
}: {
  activeExample: string;
  onExampleClick: (label: string) => void;
}) {
  return (
    <ExperienceCard className="min-h-[369px] px-6 py-8 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.08)] hover:translate-y-0 hover:shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.08)] lg:px-[25px] lg:py-[49px]">
      <div className="flex h-full flex-col items-center justify-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(135deg,#f5f3f7_0%,#fdf4f8_100%)] text-[#4a3168]">
          <BoltIcon className="h-10 w-10" />
        </div>

        <div className="mt-4 text-[20px] font-semibold leading-[28px] tracking-[-0.02em] text-[#27272a]">
          准备好了，开始创作吧！
        </div>
        <p className="mt-2 text-sm leading-5 text-[#737378]">在上方输入框描述你的需求，AI将为你生成内容</p>

        <div className="mt-6 w-full max-w-[448px]">
          <div className="text-left text-xs leading-4 text-[#737378]">试试这些示例：</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {examplePrompts.map((item) => (
              <ExperienceExampleChip
                active={activeExample === item}
                key={item}
                onClick={() => onExampleClick(item)}
              >
                {item}
              </ExperienceExampleChip>
            ))}
          </div>
        </div>
      </div>
    </ExperienceCard>
  );
}
