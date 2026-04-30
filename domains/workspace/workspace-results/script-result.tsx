"use client";

import ReactMarkdown from "react-markdown";
import { Button, NoticePanel } from "@/shared/ui/ui";
import type { ToolKind } from "../workspace-model";

const mdComponents = {
  h1: ({ children }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="mb-3 mt-5 text-lg font-bold text-[#27272A] first:mt-0">{children}</h1>
  ),
  h2: ({ children }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mb-2 mt-4 text-base font-bold text-[#27272A] first:mt-0">{children}</h2>
  ),
  h3: ({ children }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mb-2 mt-3 text-sm font-bold text-[#3D2856] first:mt-0">{children}</h3>
  ),
  p: ({ children }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mb-2 leading-7 text-[#27272A] last:mb-0">{children}</p>
  ),
  ul: ({ children }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="mb-2 list-disc space-y-1 pl-5 text-[#27272A] last:mb-0">{children}</ul>
  ),
  ol: ({ children }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="mb-2 list-decimal space-y-1 pl-5 text-[#27272A] last:mb-0">{children}</ol>
  ),
  li: ({ children }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-7">{children}</li>
  ),
  strong: ({ children }: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-[#3D2856]">{children}</strong>
  ),
  em: ({ children }: React.HTMLAttributes<HTMLElement>) => (
    <em className="text-[#993D63]">{children}</em>
  ),
  blockquote: ({ children }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="my-2 border-l-3 border-[#D4668F] bg-[#FDF4F8] py-2 pl-4 pr-3 text-sm text-[#7A4760]">
      {children}
    </blockquote>
  ),
  code: ({ children, className }: React.HTMLAttributes<HTMLElement>) => {
    if (className) {
      return (
        <code className="rounded-md bg-[#F3F0FF] px-1.5 py-0.5 text-xs text-[#5B3FA0]">
          {children}
        </code>
      );
    }
    return (
      <code className="rounded bg-[#F3F0FF] px-1 py-0.5 text-xs text-[#5B3FA0]">
        {children}
      </code>
    );
  },
  pre: ({ children }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className="my-2 overflow-x-auto rounded-xl bg-[#1E1B2E] p-4 text-sm text-[#E2DFF0]">
      {children}
    </pre>
  ),
  hr: () => <hr className="my-4 border-[rgba(0,0,0,0.08)]" />,
  a: ({ children, href }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} className="text-[#993D63] underline hover:text-[#D4668F]" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
};

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

        <div className="rounded-[18px] border border-[rgba(0,0,0,0.06)] bg-white px-5 py-5 text-sm leading-7">
          <ReactMarkdown components={mdComponents}>{script}</ReactMarkdown>
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
