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

  return (
    <div className="space-y-5">
      <NoticePanel className="rounded-[18px] px-4 py-4" tone="brand">
        <div className="text-xs uppercase tracking-[0.2em]">这轮已经先帮你起好了第一版</div>
        <div className="mt-2 text-sm leading-7">
          现在最顺的下一步，一般是先看内容节奏，再决定要不要继续整理成更稳的表达，或者顺手抽一组标题。
        </div>
      </NoticePanel>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[18px] border border-[rgba(0,0,0,0.08)] bg-[#FAFAFA] px-4 py-4">
          <div className="text-xs uppercase tracking-[0.12em] text-[#737378]">结果状态</div>
          <div className="mt-2 text-base font-semibold text-[#27272A]">首版内容已生成</div>
          <div className="mt-1 text-sm leading-6 text-[#737378]">这版已经可以继续拿去细修，不需要再从空白开始。</div>
        </div>
        <div className="rounded-[18px] border border-[rgba(0,0,0,0.08)] bg-[#FAFAFA] px-4 py-4">
          <div className="text-xs uppercase tracking-[0.12em] text-[#737378]">内容长度</div>
          <div className="mt-2 text-base font-semibold text-[#27272A]">{charCount} 字</div>
          <div className="mt-1 text-sm leading-6 text-[#737378]">如果你准备继续发短视频或直播，这个长度已经够你再往下调节节奏。</div>
        </div>
        <div className="rounded-[18px] border border-[rgba(0,0,0,0.08)] bg-[#FAFAFA] px-4 py-4">
          <div className="text-xs uppercase tracking-[0.12em] text-[#737378]">来源需求</div>
          <div className="mt-2 line-clamp-3 text-sm leading-6 text-[#27272A]">
            {originPrompt?.trim() || "当前这轮内容来自你在工作台里填写的脚本需求。"}
          </div>
        </div>
      </div>

      <div className="rounded-[22px] border border-[rgba(74,49,104,0.12)] bg-[linear-gradient(180deg,#ffffff_0%,#faf7fd_100%)] p-5 shadow-[0_12px_30px_rgba(74,49,104,0.08)]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-[#27272A]">脚本正文</div>
            <div className="mt-1 text-sm leading-6 text-[#737378]">先通读一遍，再决定要不要继续提炼或补标题。</div>
          </div>
          <Button onClick={() => onCopy(script)} type="button" variant="secondary">
            复制这版脚本
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
        <div className="text-sm font-semibold text-[#7A4760]">接下来可以直接继续</div>
        <div className="mt-2 text-sm leading-7 text-[#7A4760]">
          如果你想先把表达收得更稳，可以继续做话术提炼；如果你准备发内容了，就顺手先出一组标题。
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button
            className="rounded-[16px] bg-[#4A3168] px-5 py-3 text-white hover:bg-[#3D2856]"
            disabled={loadingTool === "refine"}
            onClick={onRefine}
            type="button"
          >
            {loadingTool === "refine" ? "正在提炼..." : "继续做话术提炼"}
          </Button>
          <Button disabled={loadingTool === "title"} onClick={onGenerateTitles} type="button" variant="secondary">
            {loadingTool === "title" ? "正在出标题..." : "顺手生成一组标题"}
          </Button>
        </div>
      </div>
    </div>
  );
}
