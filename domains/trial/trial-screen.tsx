"use client";

import { TrialEditorCard } from "./trial-editor-card";
import { TrialEmptyCard } from "./trial-empty-card";
import { TrialHeaderBar } from "./trial-header";
import { TrialPreviewCard } from "./trial-preview-card";
import { TrialSidebar } from "./trial-sidebar";
import { useTrial } from "./use-trial";

export default function TrialPage() {
  const trial = useTrial();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fafafa] text-[#18181b]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-[-96px] top-24 size-80 rounded-full bg-[#d8d1e1] opacity-35 blur-[72px]" />
        <div className="absolute left-[-72px] top-[42%] size-[420px] rounded-full bg-[#f6d6e4] opacity-35 blur-[72px]" />
      </div>
      <TrialHeaderBar />

      <main className="relative mx-auto max-w-[1283px] px-4 pb-16 pt-6 lg:pt-6">
        <div className="max-w-[300px]">
          <h1 className="text-[24px] font-semibold leading-[30px] tracking-[-0.02em] text-[#18181b] lg:text-[30px] lg:leading-[38px]">
            开始创作你的内容
          </h1>
          <p className="mt-2 text-base leading-[26px] text-[#737378]">输入你的需求，AI将为你生成专业内容</p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,824px)_398px] lg:items-start">
          <div className="grid gap-5">
            <TrialEditorCard
              canContinue={trial.canContinue}
              count={trial.count}
              error={trial.previewError}
              loading={trial.previewLoading}
              maxLength={trial.maxPromptLength}
              onGenerate={() => void trial.generate()}
              onPromptChange={trial.setPrompt}
              prompt={trial.prompt}
              textareaRef={trial.textareaRef}
            />
            {trial.preview ? (
              <TrialPreviewCard preview={trial.preview} />
            ) : (
              <TrialEmptyCard activeExample={trial.activeExample} onExampleClick={trial.applyExample} />
            )}
          </div>

          <TrialSidebar todayLabel={trial.todayLabel} />
        </div>
      </main>
    </div>
  );
}
