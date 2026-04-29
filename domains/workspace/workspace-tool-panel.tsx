"use client";

import { Button, Card, NoticePanel } from "@/shared/ui/ui";
import type { Goal } from "./workspace-goal-picker";
import { ToolTabs } from "./tool-tabs";
import type { ToolKind } from "./workspace-model";
import { WorkspaceCommissionFields } from "./workspace-tool-panel/commission-fields";
import { WorkspacePromptField } from "./workspace-tool-panel/prompt-field";
import { WorkspaceScriptFields } from "./workspace-tool-panel/script-fields";
import { WorkspaceTitleStyleField } from "./workspace-tool-panel/title-style-field";

const goalHints: Record<string, string> = {
  publish: "输入今天要发布的内容主题或产品关键词，AI 会帮你生成适合发布的文案",
  new_product: "输入新上架的商品名称或关键词，AI 会生成吸引人的标题和文案",
  convert: "粘贴需要优化的话术或脚本，AI 会提炼卖点并替换高风险表达",
};

type ToolMeta = {
  label: string;
  promptLabel: string;
  promptPlaceholder: string;
};

type Props = {
  activeTool: ToolKind;
  activeToolMeta: ToolMeta;
  loadingTool: ToolKind | null;
  toolError: string;
  activeGoalKey: string | null;
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
  activeGoalKey,
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

        <div>
          <div className="text-[20px] font-semibold text-[#27272A]">
            {activeToolMeta.promptLabel}
          </div>
          {activeGoalKey && goalHints[activeGoalKey] ? (
            <p className="mt-1 text-sm leading-6 text-[#8961F2]">{goalHints[activeGoalKey]}</p>
          ) : null}
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

        <div className="flex justify-end">
          <Button
            className="rounded-[16px] bg-[#4A3168] px-6 py-3 text-white hover:bg-[#3D2856]"
            disabled={loadingTool === activeTool}
            onClick={onSubmit}
            type="button"
          >
            {loadingTool === activeTool ? "正在生成" : "开始生成"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
