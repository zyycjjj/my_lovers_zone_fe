"use client";

import { Button, Card, ChoicePill, FieldGroup, NoticePanel } from "@/shared/ui/ui";
import { ToolTabs } from "./tool-tabs";
import { inputClassName, type ToolKind } from "./workspace-model";

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

        <FieldGroup label="内容描述">
          <textarea
            className="min-h-[122px] w-full resize-none rounded-[16px] border border-[#ECECF0] bg-white px-4 py-3 text-base leading-6 text-[#27272A] outline-none transition-colors placeholder:text-[#A3A3AB] focus:border-[#4A3168]"
            onChange={(event) => {
              const value = event.target.value;
              if (activeTool === "title") setTitleKeyword(value);
              if (activeTool === "script") setScriptKeyword(value);
              if (activeTool === "refine") setRefineText(value);
            }}
            placeholder={activeToolMeta.promptPlaceholder}
            value={
              activeTool === "title"
                ? titleKeyword
                : activeTool === "script"
                  ? scriptKeyword
                  : activeTool === "refine"
                    ? refineText
                    : ""
            }
          />
        </FieldGroup>

        {activeTool === "title" ? (
          <FieldGroup hint="选填" label="风格方向">
            <input
              className={inputClassName()}
              onChange={(event) => setTitleStyle(event.target.value)}
              placeholder="比如：口语感、情绪感、强转化"
              value={titleStyle}
            />
          </FieldGroup>
        ) : null}

        {activeTool === "script" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldGroup hint="选填" label="价格">
              <input
                className={inputClassName()}
                inputMode="decimal"
                onChange={(event) => setScriptPrice(event.target.value)}
                placeholder="比如：99"
                value={scriptPrice}
              />
            </FieldGroup>
            <FieldGroup hint="选填" label="目标人群">
              <input
                className={inputClassName()}
                onChange={(event) => setScriptAudience(event.target.value)}
                placeholder="比如：租房党、上班族"
                value={scriptAudience}
              />
            </FieldGroup>
            <FieldGroup className="sm:col-span-2" hint="选填" label="使用场景">
              <input
                className={inputClassName()}
                onChange={(event) => setScriptScene(event.target.value)}
                placeholder="比如：办公室、宿舍、通勤"
                value={scriptScene}
              />
            </FieldGroup>
            <FieldGroup className="sm:col-span-2" label="输出风格">
              <div className="flex flex-wrap gap-3">
                <ChoicePill active={scriptStyle === "short"} onClick={() => setScriptStyle("short")}>
                  短视频种草
                </ChoicePill>
                <ChoicePill active={scriptStyle === "live"} onClick={() => setScriptStyle("live")}>
                  直播口播
                </ChoicePill>
              </div>
            </FieldGroup>
          </div>
        ) : null}

        {activeTool === "commission" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldGroup label="商品价格">
              <input
                className={inputClassName()}
                inputMode="decimal"
                onChange={(event) => setCommissionPrice(event.target.value)}
                placeholder="比如：199"
                value={commissionPrice}
              />
            </FieldGroup>
            <FieldGroup label="佣金比例">
              <input
                className={inputClassName()}
                inputMode="decimal"
                onChange={(event) => setCommissionRate(event.target.value)}
                placeholder="比如：0.2"
                value={commissionRate}
              />
            </FieldGroup>
            <FieldGroup className="sm:col-span-2" hint="选填" label="平台扣点">
              <input
                className={inputClassName()}
                inputMode="decimal"
                onChange={(event) => setPlatformRate(event.target.value)}
                placeholder="比如：0.1"
                value={platformRate}
              />
            </FieldGroup>
          </div>
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
