"use client";

import { Card } from "@/shared/ui/ui";
import type { CommissionResult, RefineResult, ToolKind } from "./workspace-model";
import { WorkspaceCommissionResult } from "./workspace-results/commission-result";
import { WorkspaceEmptyState } from "./workspace-results/empty-state";
import { WorkspaceResultHeader } from "./workspace-results/header";
import { WorkspaceRefineResult } from "./workspace-results/refine-result";
import { WorkspaceScriptResult } from "./workspace-results/script-result";
import { WorkspaceTitleResult } from "./workspace-results/title-result";

type ToolMeta = {
  emptyTitle: string;
  emptyDescription: string;
};

type Props = {
  activeTool: ToolKind;
  activeResultExists: boolean;
  activeToolMeta: ToolMeta;
  commissionResult: CommissionResult | null;
  copiedText: string;
  examplePrompts: string[];
  isSavingAsset: boolean;
  loadingTool: ToolKind | null;
  refineResult: RefineResult | null;
  resumedDraftPrompt: string;
  scriptResult: string;
  titleResult: string[];
  onCopy: (text: string) => void;
  onCopyAndComplete: () => void;
  onExampleClick: (example: string) => void;
  onGenerateTitlesFromScript: () => void;
  onRefineCurrentScript: () => void;
  onSaveCurrentResult: () => void;
  nextActions?: NextAction[];
};

type NextAction = {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "ghost";
};

export function WorkspaceResultPanel({
  activeResultExists,
  activeTool,
  activeToolMeta,
  commissionResult,
  copiedText,
  examplePrompts,
  isSavingAsset,
  loadingTool,
  onCopy,
  onCopyAndComplete,
  onExampleClick,
  onGenerateTitlesFromScript,
  onRefineCurrentScript,
  onSaveCurrentResult,
  nextActions,
  refineResult,
  resumedDraftPrompt,
  scriptResult,
  titleResult,
}: Props) {
  const nextTips: Record<ToolKind, string> = {
    title:
      "挑一条最像你语气的标题先发，保存这组后明天可以接着做脚本。",
    script:
      "复制脚本发一版，如果已发布或排期，点「复制并标记完成」留记录。",
    refine:
      "优先替换高风险表达，再把稳妥版本保存为直播话术模板。",
    commission:
      "保存测算结果，再决定是否继续生成卖点或完整脚本。",
  };
  return (
    <Card className="rounded-[20px] border border-[rgba(0,0,0,0.08)] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] sm:p-[25px]">
      {activeResultExists ? (
        <div className="space-y-5">
          <WorkspaceResultHeader
            copiedText={copiedText}
            isSaving={isSavingAsset}
            onCopyAndComplete={onCopyAndComplete}
            onSave={onSaveCurrentResult}
          />

          <div className="rounded-[18px] border border-[rgba(74,49,104,0.12)] bg-[#F8F4FB] px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-[#4A3168]">建议下一步</div>
                <div className="mt-1 text-sm leading-7 text-[#6B5A78]">{nextTips[activeTool]}</div>
              </div>
              {nextActions?.length ? (
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {nextActions.map((action) => (
                    <button
                      key={action.label}
                      disabled={loadingTool !== null}
                      onClick={action.onClick}
                      className={`rounded-[12px] px-3 py-1.5 text-xs font-medium transition-colors ${
                        action.variant === "primary"
                          ? "bg-[#8961F2] text-white hover:bg-[#7046D6]"
                          : action.variant === "secondary"
                            ? "bg-white text-[#4A3168] border border-[rgba(74,49,104,0.2)] hover:bg-[#F5F3F7]"
                            : "text-[#737378] hover:text-[#4A3168]"
                      }`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          {activeTool === "title" && titleResult.length ? (
            <WorkspaceTitleResult titles={titleResult} onCopy={onCopy} />
          ) : null}

          {activeTool === "script" && scriptResult ? (
            <WorkspaceScriptResult
              loadingTool={loadingTool}
              onCopy={onCopy}
              onGenerateTitles={onGenerateTitlesFromScript}
              onRefine={onRefineCurrentScript}
              originPrompt={resumedDraftPrompt}
              script={scriptResult}
            />
          ) : null}

          {activeTool === "refine" && refineResult ? (
            <WorkspaceRefineResult refine={refineResult} onCopy={onCopy} />
          ) : null}

          {activeTool === "commission" && commissionResult ? (
            <WorkspaceCommissionResult commission={commissionResult} onCopy={onCopy} />
          ) : null}
        </div>
      ) : (
        <WorkspaceEmptyState
          description={activeToolMeta.emptyDescription}
          examples={examplePrompts}
          onExampleClick={onExampleClick}
          title={activeToolMeta.emptyTitle}
        />
      )}
    </Card>
  );
}
