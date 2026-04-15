"use client";

import { Button, Card, NoticePanel } from "@/shared/ui/ui";
import type { CommissionResult, RefineResult, ToolKind } from "./workspace-model";

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
  refineResult: RefineResult | null;
  scriptResult: string;
  titleResult: string[];
  onCopy: (text: string) => void;
  onExampleClick: (example: string) => void;
};

export function WorkspaceResultPanel({
  activeResultExists,
  activeTool,
  activeToolMeta,
  commissionResult,
  copiedText,
  examplePrompts,
  onCopy,
  onExampleClick,
  refineResult,
  scriptResult,
  titleResult,
}: Props) {
  return (
    <Card className="rounded-[20px] border border-[rgba(0,0,0,0.08)] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] sm:p-[25px]">
      {activeResultExists ? (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-[20px] font-semibold text-[#27272A]">这轮结果</div>
              <div className="mt-1 text-sm text-[#737378]">先看这一轮结果，再决定下一步怎么继续。</div>
            </div>
            {copiedText ? (
              <span className="rounded-full bg-[#F5F3F7] px-3 py-1 text-xs font-medium text-[#4A3168]">
                {copiedText}
              </span>
            ) : null}
          </div>

          {activeTool === "title" && titleResult.length ? (
            <div className="space-y-4">
              <div className="grid gap-3">
                {titleResult.map((title, index) => (
                  <div
                    key={`${title}-${index}`}
                    className="rounded-[16px] border border-[rgba(0,0,0,0.08)] bg-white px-4 py-4 text-sm leading-7 text-[#27272A]"
                  >
                    <span className="mr-2 font-semibold text-[#4A3168]">{index + 1}.</span>
                    {title}
                  </div>
                ))}
              </div>
              <Button
                onClick={() =>
                  onCopy(titleResult.map((item, index) => `${index + 1}. ${item}`).join("\n"))
                }
                type="button"
                variant="secondary"
              >
                复制这一组标题
              </Button>
            </div>
          ) : null}

          {activeTool === "script" && scriptResult ? (
            <div className="space-y-4">
              <pre className="whitespace-pre-wrap rounded-[16px] border border-[rgba(0,0,0,0.08)] bg-[#FAFAFA] px-4 py-4 text-sm leading-7 text-[#27272A]">
                {scriptResult}
              </pre>
              <Button onClick={() => onCopy(scriptResult)} type="button" variant="secondary">
                复制这版脚本
              </Button>
            </div>
          ) : null}

          {activeTool === "refine" && refineResult ? (
            <div className="space-y-4">
              <NoticePanel className="rounded-[16px] px-4 py-4">
                <div className="text-xs uppercase tracking-[0.2em]">一句话总结</div>
                <div className="mt-2 text-base font-semibold leading-8">
                  {refineResult.summaryLine || "这轮还没有总结结果"}
                </div>
              </NoticePanel>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="text-sm font-semibold text-[#27272A]">卖点提炼</div>
                  {refineResult.sellingPoints.map((item, index) => (
                    <div
                      key={`${item}-${index}`}
                      className="rounded-[16px] border border-[rgba(0,0,0,0.08)] px-4 py-3 text-sm leading-7 text-[#27272A]"
                    >
                      {item}
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <div className="text-sm font-semibold text-[#27272A]">合规建议</div>
                  {refineResult.suggestions.map((item, index) => (
                    <div
                      key={`${item}-${index}`}
                      className="rounded-[16px] border border-[rgba(0,0,0,0.08)] px-4 py-3 text-sm leading-7 text-[#27272A]"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-sm font-semibold text-[#27272A]">风险提示</div>
                {refineResult.risks.map((risk, index) => (
                  <div
                    key={`${risk.type}-${index}`}
                    className="rounded-[16px] border border-[rgba(212,102,143,0.2)] bg-[#FFF7FA] px-4 py-3 text-sm leading-7 text-[#27272A]"
                  >
                    <div className="font-medium text-[#993D63]">{risk.type}</div>
                    <div className="mt-1 text-[#737378]">{risk.matches.join("、")}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="text-sm font-semibold text-[#27272A]">更稳妥的表达</div>
                {refineResult.safeRewrites.map((item, index) => (
                  <div
                    key={`${item}-${index}`}
                    className="rounded-[16px] border border-[rgba(0,0,0,0.08)] px-4 py-3 text-sm leading-7 text-[#27272A]"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <Button
                onClick={() =>
                  onCopy(
                    [
                      `一句话总结：${refineResult.summaryLine}`,
                      "",
                      "卖点提炼：",
                      ...refineResult.sellingPoints.map((item) => `- ${item}`),
                      "",
                      "合规建议：",
                      ...refineResult.suggestions.map((item) => `- ${item}`),
                      "",
                      "更稳妥的表达：",
                      ...refineResult.safeRewrites.map((item) => `- ${item}`),
                    ].join("\n"),
                  )
                }
                type="button"
                variant="secondary"
              >
                复制这轮整理结果
              </Button>
            </div>
          ) : null}

          {activeTool === "commission" && commissionResult ? (
            <div className="space-y-4">
              <NoticePanel className="rounded-[16px] px-4 py-4" tone="gold">
                <div className="text-xs uppercase tracking-[0.2em]">预计佣金</div>
                <div className="mt-2 text-[32px] font-semibold leading-none">
                  {commissionResult.commission} 元
                </div>
                <div className="mt-3 text-sm leading-7">{commissionResult.sellingPoint}</div>
              </NoticePanel>
              <div className="space-y-3">
                {commissionResult.comparisons.map((item) => (
                  <div
                    key={`${item.price}-${item.commission}`}
                    className="flex items-center justify-between rounded-[16px] border border-[rgba(0,0,0,0.08)] px-4 py-4 text-sm"
                  >
                    <span className="text-[#737378]">售价 {item.price} 元</span>
                    <span className="font-semibold text-[#27272A]">佣金 {item.commission} 元</span>
                  </div>
                ))}
              </div>
              <Button
                onClick={() =>
                  onCopy(
                    [
                      `预计佣金：${commissionResult.commission} 元`,
                      commissionResult.sellingPoint,
                      ...commissionResult.comparisons.map(
                        (item) => `售价 ${item.price} 元，佣金 ${item.commission} 元`,
                      ),
                    ].join("\n"),
                  )
                }
                type="button"
                variant="secondary"
              >
                复制测算结果
              </Button>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="space-y-6 py-4 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(135deg,#F5F3F7_0%,#FDF4F8_100%)] text-[32px]">
            ✦
          </div>
          <div className="space-y-2">
            <div className="text-[20px] font-semibold text-[#27272A]">{activeToolMeta.emptyTitle}</div>
            <p className="mx-auto max-w-[480px] text-sm leading-7 text-[#737378]">
              {activeToolMeta.emptyDescription}
            </p>
          </div>
          <div className="space-y-3">
            <div className="text-xs text-[#737378]">💡 试试这些示例：</div>
            <div className="flex flex-wrap justify-center gap-2">
              {examplePrompts.map((example) => (
                <button
                  key={example}
                  className="rounded-[12px] bg-[#F5F3F7] px-3 py-2 text-sm text-[#4A3168]"
                  onClick={() => onExampleClick(example)}
                  type="button"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

