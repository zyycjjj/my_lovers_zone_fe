"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import {
  BackIcon,
  BoltIcon,
  ExperienceActionButton,
  ExperienceActionLink,
  ExperienceBadge,
  ExperienceCard,
  ExperienceExampleChip,
  ExperienceMetricTile,
  LaunchIcon,
  SparkIcon,
  TipIcon,
} from "@/shared/ui/trial-experience";
import { useAuthSession } from "@/shared/lib/session-store";

const MAX_PROMPT_LENGTH = 500;

const examplePrompts = [
  "小红书美妆种草",
  "直播带货话术",
  "抖音短视频脚本",
  "产品详情页文案",
];

const promptTemplates: Record<string, string> = {
  小红书美妆种草:
    "帮我写一篇春季新品发布的小红书文案，产品是连衣裙，强调设计感和舒适度，语气真实自然一点。",
  直播带货话术:
    "帮我写一段直播带货话术，产品是补水面膜，突出适合熬夜党和敏感肌，节奏要利落一些。",
  抖音短视频脚本:
    "帮我写一个抖音短视频脚本，产品是便携榨汁杯，强调上班族早晨快速做早餐的场景。",
  产品详情页文案:
    "帮我整理一版产品详情页文案，产品是轻薄防晒衣，要突出透气、防晒和通勤穿搭感。",
};

function formatMonthDay(date: Date) {
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

function saveTrialDraft(prompt: string) {
  if (typeof window === "undefined") return;

  window.sessionStorage.setItem(
    "memory.trialDraft",
    JSON.stringify({
      prompt,
      updatedAt: Date.now(),
      source: "experience_page",
    }),
  );
}

function HeaderBar() {
  return (
    <div className="sticky top-0 z-30 border-b border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.8)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[1283px] items-center justify-between px-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-base font-medium text-[#27272a] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:text-[#4a3168] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4a3168]/12"
        >
          <BackIcon className="text-[#27272a]" />
          <span>返回首页</span>
        </Link>
        <ExperienceBadge />
      </div>
    </div>
  );
}

export default function TrialPage() {
  const router = useRouter();
  const session = useAuthSession();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [prompt, setPrompt] = useState("");

  const todayLabel = formatMonthDay(new Date());
  const count = prompt.length;
  const activeExample = examplePrompts.find((item) => promptTemplates[item] === prompt) ?? "";
  const canContinue = prompt.trim().length > 0;

  function applyExample(label: string) {
    setPrompt(promptTemplates[label] ?? label);
    textareaRef.current?.focus();
  }

  function handleGenerate() {
    if (!canContinue) return;

    saveTrialDraft(prompt);

    if (session?.sessionToken) {
      router.push("/workspace");
      return;
    }

    router.push("/login?intent=trial");
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#18181b]">
      <HeaderBar />

      <main className="mx-auto max-w-[1283px] px-4 pb-16 pt-6 lg:pt-6">
        <div className="max-w-[271px]">
          <h1 className="text-[24px] font-semibold leading-[30px] tracking-[-0.02em] text-[#18181b] lg:text-[30px] lg:leading-[38px]">
            开始创作你的内容
          </h1>
          <p className="mt-2 text-base leading-[26px] text-[#737378]">输入你的需求，AI将为你生成专业内容</p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,824px)_400px] lg:items-start">
          <div className="grid gap-6">
            <ExperienceCard className="p-6 lg:px-[25px] lg:py-[25px]">
              <div className="space-y-[15px]">
                <div className="text-[20px] font-semibold leading-[28px] tracking-[-0.02em] text-[#27272a]">
                  描述你要生成的内容
                </div>

                <label className="block">
                  <span className="sr-only">创作需求</span>
                  <textarea
                    ref={textareaRef}
                    className="h-[122px] w-full resize-none rounded-[16px] border border-[#ececf0] bg-white px-4 py-3 text-base leading-6 text-[#27272a] outline-none transition-all duration-200 ease-out placeholder:text-[#a3a3ab] focus:border-[#b8aacb] focus:shadow-[0_0_0_4px_rgba(74,49,104,0.08)]"
                    maxLength={MAX_PROMPT_LENGTH}
                    onChange={(event) => setPrompt(event.target.value)}
                    placeholder="例如：帮我写一篇春季新品发布的小红书文案，产品是连衣裙，强调设计感和舒适度..."
                    value={prompt}
                  />
                </label>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm leading-5 text-[#737378]">{count} / {MAX_PROMPT_LENGTH} 字</div>
                  <ExperienceActionButton
                    className="w-full sm:w-[140px]"
                    disabled={!canContinue}
                    onClick={handleGenerate}
                  >
                    <SparkIcon className="h-5 w-5" />
                    <span>开始生成</span>
                  </ExperienceActionButton>
                </div>
              </div>
            </ExperienceCard>

            <ExperienceCard className="min-h-[369px] px-6 py-8 lg:px-[25px] lg:py-[49px]">
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(135deg,#f5f3f7_0%,#fdf4f8_100%)] text-[#4a3168]">
                  <BoltIcon className="h-10 w-10" />
                </div>

                <div className="mt-4 text-[20px] font-semibold leading-[28px] tracking-[-0.02em] text-[#27272a]">
                  准备好了，开始创作吧！
                </div>
                <p className="mt-2 text-sm leading-5 text-[#737378]">
                  在上方输入框描述你的需求，AI将为你生成内容
                </p>

                <div className="mt-6 w-full max-w-[448px]">
                  <div className="text-left text-xs leading-4 text-[#737378]">💡 试试这些示例：</div>
                  <div className="mt-3 flex flex-wrap justify-center gap-2">
                    {examplePrompts.map((item) => (
                      <ExperienceExampleChip
                        active={activeExample === item}
                        key={item}
                        onClick={() => applyExample(item)}
                      >
                        {item}
                      </ExperienceExampleChip>
                    ))}
                  </div>
                </div>
              </div>
            </ExperienceCard>
          </div>

          <div className="grid gap-6">
            <ExperienceCard className="bg-[linear-gradient(161deg,#f5f3f7_0%,rgba(253,244,248,0.5)_100%)] px-6 py-6 lg:px-[25px] lg:py-[25px]">
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

            <ExperienceCard tone="soft" className="px-6 py-6 lg:px-[25px] lg:py-[25px]">
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
                开始你的创作之旅！🚀
              </div>
            </ExperienceCard>

            <ExperienceCard tone="dark" className="px-6 py-6 lg:px-6 lg:py-6">
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

            <ExperienceCard className="px-6 py-6 text-center lg:px-[25px] lg:py-[25px]">
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
        </div>
      </main>
    </div>
  );
}
