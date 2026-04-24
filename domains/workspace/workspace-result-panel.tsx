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
  refineResult,
  resumedDraftPrompt,
  scriptResult,
  titleResult,
}: Props) {
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
            <div className="text-sm font-semibold text-[#4A3168]">建议下一步</div>
            <div className="mt-2 text-sm leading-7 text-[#6B5A78]">
              {activeTool === "title"
                ? "先挑 1 条最像你语气的标题试发，再保存这一组，明天可以接着做脚本。"
                : activeTool === "script"
                  ? "先复制脚本发一版，如果已经发布或排期，就点“复制并标记完成”留下连续记录。"
                  : activeTool === "refine"
                    ? "优先替换高风险表达，再把稳妥版本保存下来，后面可以复用成直播话术模板。"
                    : "把测算结果保存下来，再决定是否继续生成卖点或脚本。"}
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
