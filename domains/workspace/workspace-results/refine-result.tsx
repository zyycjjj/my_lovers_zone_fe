"use client";

import { Button, NoticePanel } from "@/shared/ui/ui";
import type { RefineResult } from "../workspace-model";
import { buildRefineCopyText } from "./refine-copy";

export function WorkspaceRefineResult({
  refine,
  onCopy,
}: {
  refine: RefineResult;
  onCopy: (text: string) => void;
}) {
  return (
    <div className="space-y-4">
      <NoticePanel className="rounded-[16px] px-4 py-4">
        <div className="text-xs uppercase tracking-[0.2em]">一句话总结</div>
        <div className="mt-2 text-base font-semibold leading-8">
          {refine.summaryLine || "这轮还没有总结结果"}
        </div>
      </NoticePanel>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <div className="text-sm font-semibold text-[#27272A]">卖点提炼</div>
          {refine.sellingPoints.map((item, index) => (
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
          {refine.suggestions.map((item, index) => (
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
        {refine.risks.map((risk, index) => (
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
        {refine.safeRewrites.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="rounded-[16px] border border-[rgba(0,0,0,0.08)] px-4 py-3 text-sm leading-7 text-[#27272A]"
          >
            {item}
          </div>
        ))}
      </div>

      <Button onClick={() => onCopy(buildRefineCopyText(refine))} type="button" variant="secondary">
        复制这轮整理结果
      </Button>
    </div>
  );
}

