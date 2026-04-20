"use client";

import { Button, NoticePanel } from "@/shared/ui/ui";
import type { ToolKind } from "../workspace-model";

function splitParagraphs(script: string) {
  return script
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function WorkspaceScriptResult({
  script,
  originPrompt,
  loadingTool,
  onCopy,
  onGenerateTitles,
  onRefine,
}: {
  script: string;
  originPrompt?: string;
  loadingTool: ToolKind | null;
  onCopy: (text: string) => void;
  onGenerateTitles: () => void;
  onRefine: () => void;
}) {
  const paragraphs = splitParagraphs(script);
  const charCount = script.trim().length;
  const topicCount = Math.max(
    1,
    (script.match(/#/g)?.length ?? 0) + (script.match(/话题|标签/g)?.length ?? 0),
  );

  return (
    <div className="space-y-5">
      <NoticePanel className="rounded-[18px] px-4 py-4" tone="brand">
        <div className="text-sm leading-7">完整内容已生成，继续生成可获得更多版本。</div>
      </NoticePanel>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[18px] border border-[rgba(0,0,0,0.08)] bg-[#FAFAFA] px-4 py-4">
          <div className="text-xs uppercase tracking-[0.12em] text-[#737378]">字数</div>
          <div className="mt-2 text-base font-semibold text-[#27272A]">{charCount}</div>
        </div>
        <div className="rounded-[18px] border border-[rgba(0,0,0,0.08)] bg-[#FAFAFA] px-4 py-4">
          <div className="text-xs uppercase tracking-[0.12em] text-[#737378]">话题标签</div>
          <div className="mt-2 text-base font-semibold text-[#27272A]">{topicCount}</div>
        </div>
        <div className="rounded-[18px] border border-[rgba(0,0,0,0.08)] bg-[#FAFAFA] px-4 py-4">
          <div className="text-xs uppercase tracking-[0.12em] text-[#737378]">内容质量</div>
          <div className="mt-2 text-base font-semibold text-[#27272A]">95%</div>
        </div>
      </div>

      <div className="rounded-[22px] border border-[rgba(74,49,104,0.12)] bg-[linear-gradient(180deg,#ffffff_0%,#faf7fd_100%)] p-5 shadow-[0_12px_30px_rgba(74,49,104,0.08)]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-[#27272A]">脚本正文</div>
            <div className="mt-1 text-sm leading-6 text-[#737378]">{originPrompt?.trim() || "根据你的需求生成"}</div>
          </div>
          <Button onClick={() => onCopy(script)} type="button" variant="secondary">
            复制预览
          </Button>
        </div>

        <div className="space-y-3">
          {paragraphs.length ? (
            paragraphs.map((paragraph, index) => (
              <div
                key={`${paragraph.slice(0, 16)}-${index}`}
                className="rounded-[18px] border border-[rgba(0,0,0,0.06)] bg-white px-4 py-4 text-sm leading-7 text-[#27272A]"
              >
                <div className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-[#8A7C98]">
                  {index === 0 ? "开场" : `段落 ${index + 1}`}
                </div>
                <div>{paragraph}</div>
              </div>
            ))
          ) : (
            <pre className="whitespace-pre-wrap rounded-[18px] border border-[rgba(0,0,0,0.06)] bg-white px-4 py-4 text-sm leading-7 text-[#27272A]">
              {script}
            </pre>
          )}
        </div>
      </div>

      <div className="rounded-[20px] border border-[rgba(212,102,143,0.16)] bg-[rgba(253,244,248,0.68)] px-5 py-5">
        <div className="text-sm font-semibold text-[#7A4760]">继续优化</div>
        <div className="mt-2 text-sm leading-7 text-[#7A4760]">可继续提炼话术或生成标题。</div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button
            className="rounded-[16px] bg-[#4A3168] px-5 py-3 text-white hover:bg-[#3D2856]"
            disabled={loadingTool === "refine"}
            onClick={onRefine}
            type="button"
          >
            {loadingTool === "refine" ? "正在提炼" : "话术提炼"}
          </Button>
          <Button disabled={loadingTool === "title"} onClick={onGenerateTitles} type="button" variant="secondary">
            {loadingTool === "title" ? "正在生成" : "标题生成"}
          </Button>
        </div>
      </div>
    </div>
  );
}
