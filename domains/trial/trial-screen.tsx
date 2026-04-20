"use client";

import { TrialEditorCard } from "./trial-editor-card";
import { TrialEmptyCard } from "./trial-empty-card";
import { TrialHeaderBar } from "./trial-header";
import { TrialSidebar } from "./trial-sidebar";
import { useTrial } from "./use-trial";

export default function TrialPage() {
  const trial = useTrial();

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#18181b]">
      <TrialHeaderBar />

      <main className="mx-auto max-w-[1283px] px-4 pb-16 pt-6 lg:pt-6">
        <div className="max-w-[271px]">
          <h1 className="text-[24px] font-semibold leading-[30px] tracking-[-0.02em] text-[#18181b] lg:text-[30px] lg:leading-[38px]">
            开始创作你的内容
          </h1>
          <p className="mt-2 text-base leading-[26px] text-[#737378]">输入你的需求，AI将为你生成专业内容</p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,824px)_400px] lg:items-start">
          <div className="grid gap-6">
            <TrialEditorCard
              canContinue={trial.canContinue}
              count={trial.count}
              maxLength={trial.maxPromptLength}
              onGenerate={trial.generate}
              onPromptChange={trial.setPrompt}
              prompt={trial.prompt}
              textareaRef={trial.textareaRef}
            />
            <TrialEmptyCard activeExample={trial.activeExample} onExampleClick={trial.applyExample} />
          </div>

          <TrialSidebar todayLabel={trial.todayLabel} />
        </div>
      </main>
    </div>
  );
}
