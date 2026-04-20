"use client";

import {
  ExperienceActionButton,
  ExperienceCard,
  SparkIcon,
} from "@/shared/ui/trial-experience";

export function TrialEditorCard({
  canContinue,
  count,
  maxLength,
  prompt,
  textareaRef,
  onGenerate,
  onPromptChange,
}: {
  canContinue: boolean;
  count: number;
  maxLength: number;
  prompt: string;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onGenerate: () => void;
  onPromptChange: (value: string) => void;
}) {
  return (
    <ExperienceCard className="p-6 lg:px-[25px] lg:py-[25px]">
      <div className="space-y-[15px]">
        <div className="text-[20px] font-semibold leading-[28px] tracking-[-0.02em] text-[#27272a]">
          描述你要生成的内容
        </div>

        <label className="block">
          <span className="sr-only">创作需求</span>
          <textarea
            ref={textareaRef}
            className="h-[122px] w-full resize-none rounded-[16px] border border-[#ececf0] bg-white px-4 py-3 text-base leading-6 text-[#27272a] outline-none transition-all duration-200 ease-out placeholder:text-[#a3a3ab] focus:border-[#b8aacb] focus:shadow-[0_0_0_4px_rgba(74,49,104,0.08)]"
            maxLength={maxLength}
            onChange={(event) => onPromptChange(event.target.value)}
            placeholder="例如：帮我写一篇春季新品发布的小红书文案，产品是连衣裙，强调设计感和舒适度..."
            value={prompt}
          />
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm leading-5 text-[#737378]">
            {count} / {maxLength} 字
          </div>
          <ExperienceActionButton
            className="w-full sm:w-[140px]"
            disabled={!canContinue}
            onClick={onGenerate}
          >
            <SparkIcon className="h-5 w-5" />
            <span>开始生成</span>
          </ExperienceActionButton>
        </div>
      </div>
    </ExperienceCard>
  );
}

