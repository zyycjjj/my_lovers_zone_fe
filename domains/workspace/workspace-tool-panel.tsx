"use client";

import { Button, Card, NoticePanel } from "@/shared/ui/ui";
import { ToolTabs } from "./tool-tabs";
import type { ToolKind } from "./workspace-model";
import { WorkspaceCommissionFields } from "./workspace-tool-panel/commission-fields";
import { WorkspacePromptField } from "./workspace-tool-panel/prompt-field";
import { WorkspaceScriptFields } from "./workspace-tool-panel/script-fields";
import { WorkspaceTitleStyleField } from "./workspace-tool-panel/title-style-field";

type ToolMeta = {
  label: string;
  short: string;
  description: string;
  promptLabel: string;
  promptPlaceholder: string;
};

type Props = {
  activeTool: ToolKind;
  activeToolMeta: ToolMeta;
  loadingTool: ToolKind | null;
  toolError: string;
  titleKeyword: string;
  titleStyle: string;
  scriptKeyword: string;
  scriptPrice: string;
  scriptAudience: string;
  scriptScene: string;
  scriptStyle: "short" | "live";
  refineText: string;
  commissionPrice: string;
  commissionRate: string;
  platformRate: string;
  onToolChange: (next: ToolKind) => void;
  onSubmit: () => void;
  setTitleKeyword: (value: string) => void;
  setTitleStyle: (value: string) => void;
  setScriptKeyword: (value: string) => void;
  setScriptPrice: (value: string) => void;
  setScriptAudience: (value: string) => void;
  setScriptScene: (value: string) => void;
  setScriptStyle: (value: "short" | "live") => void;
  setRefineText: (value: string) => void;
  setCommissionPrice: (value: string) => void;
  setCommissionRate: (value: string) => void;
  setPlatformRate: (value: string) => void;
};

export function WorkspaceToolPanel({
  activeTool,
  activeToolMeta,
  commissionPrice,
  commissionRate,
  loadingTool,
  onSubmit,
  onToolChange,
  platformRate,
  refineText,
  scriptAudience,
  scriptKeyword,
  scriptPrice,
  scriptScene,
  scriptStyle,
  setCommissionPrice,
  setCommissionRate,
  setPlatformRate,
  setRefineText,
  setScriptAudience,
  setScriptKeyword,
  setScriptPrice,
  setScriptScene,
  setScriptStyle,
  setTitleKeyword,
  setTitleStyle,
  titleKeyword,
  titleStyle,
  toolError,
}: Props) {
  return (
    <Card className="rounded-[20px] border border-[rgba(0,0,0,0.08)] bg-[linear-gradient(135deg,rgba(255,255,255,1)_0%,rgba(245,243,247,0.3)_100%)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] sm:p-[25px]">
      <div className="space-y-5">
        <ToolTabs activeTool={activeTool} onChange={onToolChange} />

        <div className="space-y-2">
          <div className="text-[20px] font-semibold text-[#27272A]">
            {activeToolMeta.promptLabel}
          </div>
          <p className="text-sm leading-7 text-[#737378]">{activeToolMeta.description}</p>
        </div>

        <WorkspacePromptField
          activeTool={activeTool}
          onRefineTextChange={setRefineText}
          onScriptKeywordChange={setScriptKeyword}
          onTitleKeywordChange={setTitleKeyword}
          placeholder={activeToolMeta.promptPlaceholder}
          refineText={refineText}
          scriptKeyword={scriptKeyword}
          titleKeyword={titleKeyword}
        />

        {activeTool === "title" ? (
          <WorkspaceTitleStyleField onTitleStyleChange={setTitleStyle} titleStyle={titleStyle} />
        ) : null}

        {activeTool === "script" ? (
          <WorkspaceScriptFields
            onScriptAudienceChange={setScriptAudience}
            onScriptPriceChange={setScriptPrice}
            onScriptSceneChange={setScriptScene}
            onScriptStyleChange={setScriptStyle}
            scriptAudience={scriptAudience}
            scriptPrice={scriptPrice}
            scriptScene={scriptScene}
            scriptStyle={scriptStyle}
          />
        ) : null}

        {activeTool === "commission" ? (
          <WorkspaceCommissionFields
            commissionPrice={commissionPrice}
            commissionRate={commissionRate}
            onCommissionPriceChange={setCommissionPrice}
            onCommissionRateChange={setCommissionRate}
            onPlatformRateChange={setPlatformRate}
            platformRate={platformRate}
          />
        ) : null}

        {toolError ? <NoticePanel>{toolError}</NoticePanel> : null}

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-[#737378]">{activeToolMeta.short}</div>
          <Button
            className="rounded-[16px] bg-[#4A3168] px-6 py-3 text-white hover:bg-[#3D2856]"
            disabled={loadingTool === activeTool}
            onClick={onSubmit}
            type="button"
          >
            {loadingTool === activeTool ? "正在生成..." : `开始${activeToolMeta.label}`}
          </Button>
        </div>
      </div>
    </Card>
  );
}
