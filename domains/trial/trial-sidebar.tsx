"use client";

import {
  ExperienceActionLink,
  ExperienceCard,
  ExperienceMetricTile,
  LaunchIcon,
  SparkIcon,
  TipIcon,
} from "@/shared/ui/trial-experience";

export function TrialSidebar({
  todayLabel,
}: {
  todayLabel: string;
}) {
  return (
    <div className="grid gap-6">
      <ExperienceCard className="bg-[linear-gradient(161deg,#f5f3f7_0%,rgba(253,244,248,0.5)_100%)] px-6 py-6 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.08)] hover:translate-y-0 hover:shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.08)] lg:px-[25px] lg:py-[25px]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[18px] font-medium leading-[25px] text-[#27272a]">今日剩余额度</div>
            <div className="mt-3 flex items-center justify-between gap-4 text-sm leading-5 text-[#737378]">
              <span>已使用 5 次</span>
              <span>总计 50 次</span>
            </div>
          </div>
          <div className="text-[24px] font-bold leading-8 tracking-[-0.03em] text-[#4a3168]">45</div>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#ececf0]">
          <div className="h-full w-[10%] rounded-full bg-[linear-gradient(90deg,#4a3168_0%,#d4668f_100%)]" />
        </div>
      </ExperienceCard>

      <ExperienceCard tone="soft" className="px-6 py-6 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.08)] hover:translate-y-0 hover:shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.08)] lg:px-[25px] lg:py-[25px]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[18px] font-medium leading-[25px] text-[#27272a]">今日陪跑</div>
            <div className="mt-0.5 text-sm leading-5 text-[#737378]">{todayLabel}</div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#e87cad_0%,#d4668f_100%)] text-white shadow-[0_10px_30px_rgba(212,102,143,0.2)]">
            <SparkIcon className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <ExperienceMetricTile label="今日生成" value="5" />
          <ExperienceMetricTile label="累计生成" value="5" />
        </div>

        <div className="mt-4 rounded-[16px] border border-white bg-white/80 px-[13px] py-[13px] text-center text-sm leading-5 text-[#3f3f46]">
          开始你的创作之旅
        </div>
      </ExperienceCard>

      <ExperienceCard tone="dark" className="px-6 py-6 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.08)] hover:translate-y-0 hover:shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.08)] lg:px-6 lg:py-6">
        <div className="flex items-center gap-2 text-[18px] font-medium leading-[25px] text-white">
          <TipIcon className="h-[18px] w-[18px] text-[#ffe58d]" />
          <span>专业提示</span>
        </div>

        <ul className="mt-4 space-y-2 text-sm leading-5 text-white/90">
          {[
            "描述越详细，生成内容越精准",
            "可以指定平台、风格、字数等",
            "对生成结果不满意可重新生成",
          ].map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-[#f5a5c8]">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </ExperienceCard>

      <ExperienceCard className="px-6 py-6 text-center shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.08)] hover:translate-y-0 hover:shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.08)] lg:px-[25px] lg:py-[25px]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#d4668f_0%,#e87cad_100%)] text-white">
          <LaunchIcon className="h-6 w-6" />
        </div>

        <div className="mt-3 text-[18px] font-medium leading-[25px] text-[#27272a]">升级专业版</div>
        <div className="mt-1 text-sm leading-5 text-[#737378]">解锁更多功能和模板</div>

        <ExperienceActionLink className="mt-4 w-full" href="/#plans">
          查看套餐
        </ExperienceActionLink>
      </ExperienceCard>
    </div>
  );
}
