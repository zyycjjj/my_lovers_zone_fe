"use client";

import { Card, NoticePanel } from "@/shared/ui/ui";
import type { ViralResult, ViralStructure, ViralMyVersion } from "../workspace-model";

type Props = {
  viralResult: ViralResult;
  onCopy: (text: string) => void;
};

function StructureSection({ structure }: { structure: ViralStructure }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[rgba(74,49,104,0.1)] text-xs font-semibold text-[#4A3168]">
          🔍
        </span>
        <h4 className="text-base font-semibold text-[#18181B]">爆款拆解</h4>
      </div>

      {structure.title ? (
        <div className="rounded-[14px] bg-[#F8F4FB] px-4 py-3">
          <div className="text-xs font-medium text-[#8961F2]">原标题</div>
          <div className="mt-1 text-sm text-[#27272A]">{structure.title}</div>
        </div>
      ) : null}

      {structure.hook ? (
        <div className="space-y-1">
          <div className="text-xs font-medium text-[#8961F2]">开场钩子策略</div>
          <div className="text-sm leading-7 text-[#27272A]">{structure.hook}</div>
        </div>
      ) : null}

      {structure.structure.length > 0 ? (
        <div className="space-y-2">
          <div className="text-xs font-medium text-[#8961F2]">内容结构</div>
          {structure.structure.map((step, i) => (
            <div key={i} className="flex gap-3 rounded-[12px] border border-[rgba(74,49,104,0.08)] bg-white px-3 py-2.5">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#4A3168] text-xs font-semibold text-white">
                {i + 1}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium text-[#27272A]">{step.step}</div>
                <div className="text-xs leading-5 text-[#737378]">{step.description}</div>
                <div className="mt-0.5 text-xs text-[#8961F2]">技巧：{step.technique}</div>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-3">
        {structure.rhythmStrategy ? (
          <div className="rounded-[12px] border border-[rgba(74,49,104,0.08)] bg-white px-3 py-2.5">
            <div className="text-xs font-medium text-[#8961F2]">节奏策略</div>
            <div className="mt-1 text-xs leading-5 text-[#27272A]">{structure.rhythmStrategy}</div>
          </div>
        ) : null}
        {structure.ctaAction ? (
          <div className="rounded-[12px] border border-[rgba(74,49,104,0.08)] bg-white px-3 py-2.5">
            <div className="text-xs font-medium text-[#8961F2]">转化动作</div>
            <div className="mt-1 text-xs leading-5 text-[#27272A]">{structure.ctaAction}</div>
          </div>
        ) : null}
        {structure.emotionalTrigger ? (
          <div className="rounded-[12px] border border-[rgba(74,49,104,0.08)] bg-white px-3 py-2.5">
            <div className="text-xs font-medium text-[#8961F2]">情绪触发</div>
            <div className="mt-1 text-xs leading-5 text-[#27272A]">{structure.emotionalTrigger}</div>
          </div>
        ) : null}
        {structure.targetAudience ? (
          <div className="rounded-[12px] border border-[rgba(74,49,104,0.08)] bg-white px-3 py-2.5">
            <div className="text-xs font-medium text-[#8961F2]">目标受众</div>
            <div className="mt-1 text-xs leading-5 text-[#27272A]">{structure.targetAudience}</div>
          </div>
        ) : null}
      </div>

      {structure.sellingPoints.length > 0 ? (
        <div className="space-y-1">
          <div className="text-xs font-medium text-[#8961F2]">卖点</div>
          <div className="flex flex-wrap gap-2">
            {structure.sellingPoints.map((sp, i) => (
              <span key={i} className="rounded-full bg-[#F5F3F7] px-3 py-1 text-xs text-[#4A3168]">{sp}</span>
            ))}
          </div>
        </div>
      ) : null}

      {structure.viralFactors.length > 0 ? (
        <div className="space-y-1">
          <div className="text-xs font-medium text-[#8961F2]">为什么会火</div>
          <ul className="space-y-1">
            {structure.viralFactors.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#27272A]">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4668F]" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {structure.risks.length > 0 ? (
        <NoticePanel tone="gold">
          <div className="text-xs font-semibold">合规风险提示</div>
          <ul className="mt-1 space-y-0.5">
            {structure.risks.map((r, i) => (
              <li key={i} className="text-xs">{r}</li>
            ))}
          </ul>
        </NoticePanel>
      ) : null}
    </div>
  );
}

function MyVersionSection({ myVersion, onCopy }: { myVersion: ViralMyVersion; onCopy: (text: string) => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[rgba(212,102,143,0.12)] text-xs font-semibold text-[#D4668F]">
          ✨
        </span>
        <h4 className="text-base font-semibold text-[#18181B]">我的定制版本</h4>
      </div>

      {myVersion.title ? (
        <div className="rounded-[14px] bg-[rgba(212,102,143,0.06)] px-4 py-3">
          <div className="text-xs font-medium text-[#D4668F]">生成标题</div>
          <div className="mt-1 text-sm font-medium text-[#27272A]">{myVersion.title}</div>
        </div>
      ) : null}

      {myVersion.hook ? (
        <div className="space-y-1">
          <div className="text-xs font-medium text-[#D4668F]">3秒钩子</div>
          <div className="text-sm leading-7 text-[#27272A]">{myVersion.hook}</div>
        </div>
      ) : null}

      {myVersion.content30s ? (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="text-xs font-medium text-[#D4668F]">30秒版本</div>
            <button
              type="button"
              className="rounded-[10px] bg-white px-2.5 py-1 text-xs text-[#4A3168] hover:bg-[#F5F3F7]"
              onClick={() => onCopy(myVersion.content30s)}
            >
              复制
            </button>
          </div>
          <div className="rounded-[12px] border border-[rgba(212,102,143,0.12)] bg-white px-3 py-2.5 text-sm leading-7 text-[#27272A]">
            {myVersion.content30s}
          </div>
        </div>
      ) : null}

      {myVersion.content60s ? (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="text-xs font-medium text-[#D4668F]">60秒版本</div>
            <button
              type="button"
              className="rounded-[10px] bg-white px-2.5 py-1 text-xs text-[#4A3168] hover:bg-[#F5F3F7]"
              onClick={() => onCopy(myVersion.content60s)}
            >
              复制
            </button>
          </div>
          <div className="rounded-[12px] border border-[rgba(212,102,143,0.12)] bg-white px-3 py-2.5 text-sm leading-7 text-[#27272A]">
            {myVersion.content60s}
          </div>
        </div>
      ) : null}

      {myVersion.sellingPoints.length > 0 ? (
        <div className="space-y-1">
          <div className="text-xs font-medium text-[#D4668F]">适配卖点</div>
          <div className="flex flex-wrap gap-2">
            {myVersion.sellingPoints.map((sp, i) => (
              <span key={i} className="rounded-full bg-[rgba(212,102,143,0.1)] px-3 py-1 text-xs text-[#D4668F]">{sp}</span>
            ))}
          </div>
        </div>
      ) : null}

      {myVersion.ctaLine ? (
        <div className="space-y-1">
          <div className="text-xs font-medium text-[#D4668F]">转化引导</div>
          <div className="text-sm text-[#27272A]">{myVersion.ctaLine}</div>
        </div>
      ) : null}

      {myVersion.adaptationNotes.length > 0 ? (
        <div className="space-y-1">
          <div className="text-xs font-medium text-[#8961F2]">适配说明</div>
          <ul className="space-y-1">
            {myVersion.adaptationNotes.map((n, i) => (
              <li key={i} className="text-xs leading-5 text-[#737378]">• {n}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export function WorkspaceViralResult({ viralResult, onCopy }: Props) {
  const { structure, myVersion } = viralResult;

  return (
    <div className="space-y-6">
      <StructureSection structure={structure} />

      {myVersion ? (
        <>
          <div className="border-t border-[rgba(0,0,0,0.06)]" />
          <MyVersionSection myVersion={myVersion} onCopy={onCopy} />
        </>
      ) : (
        <NoticePanel tone="brand">
          拆解完成，但生成你的定制版本时出了点问题。你可以直接参考拆解结果，自己调整一下。
        </NoticePanel>
      )}
    </div>
  );
}
