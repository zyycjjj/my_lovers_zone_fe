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
  loadingTool: ToolKind | null;
  refineResult: RefineResult | null;
  resumedDraftPrompt: string;
  scriptResult: string;
  titleResult: string[];
  onCopy: (text: string) => void;
  onExampleClick: (example: string) => void;
  onGenerateTitlesFromScript: () => void;
  onRefineCurrentScript: () => void;
};

export function WorkspaceResultPanel({
  activeResultExists,
  activeTool,
  activeToolMeta,
  commissionResult,
  copiedText,
  examplePrompts,
  loadingTool,
  onCopy,
  onExampleClick,
  onGenerateTitlesFromScript,
  onRefineCurrentScript,
  refineResult,
  resumedDraftPrompt,
  scriptResult,
  titleResult,
}: Props) {
  return (
    <Card className="rounded-[20px] border border-[rgba(0,0,0,0.08)] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] sm:p-[25px]">
      {activeResultExists ? (
        <div className="space-y-5">
          <WorkspaceResultHeader copiedText={copiedText} />

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
