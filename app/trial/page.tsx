"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ContentRetentionCard,
  PromptInputCard,
  QuotaCard,
  ResultDisplayCard,
  TodayCompanionCard,
} from "../components/business";
import { ButtonLink, ChoicePill, FieldGroup, NoticePanel, SoftBadge } from "../components/ui";

type TrialMode = "title" | "script" | "explode";

const modeConfig: Record<
  TrialMode,
  {
    label: string;
    placeholder: string;
    previewTitle: string;
    previewLines: string[];
  }
> = {
  title: {
    label: "标题生成",
    placeholder: "例如：便携榨汁杯、夏季防晒衣、直播间引流话术",
    previewTitle: "你会先看到一版标题方向",
    previewLines: ["低门槛切入", "更适合短视频场景", "能继续追问细化"],
  },
  script: {
    label: "脚本生成",
    placeholder: "例如：护肤套装开箱、直播口播、短视频带货脚本",
    previewTitle: "你会先看到一版脚本骨架",
    previewLines: ["开场怎么说", "卖点怎么接", "结尾怎么收"],
  },
  explode: {
    label: "爆款复刻",
    placeholder: "例如：把链接、标题或爆款内容方向写进来",
    previewTitle: "你会先看到一版爆款拆解思路",
    previewLines: ["这条为什么能跑", "能借哪一部分", "怎么变成你的版本"],
  },
};

export default function TrialPage() {
  const router = useRouter();
  const [mode, setMode] = useState<TrialMode>("title");
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");

  const current = useMemo(() => modeConfig[mode], [mode]);

  function continueToLogin() {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(
        "memory.trialDraft",
        JSON.stringify({
          mode,
          topic,
          notes,
          updatedAt: Date.now(),
        }),
      );
    }

    router.push("/login?intent=trial");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.06fr)_380px]">
      <PromptInputCard
        badge="1 元体验"
        className="rounded-[36px] p-6 sm:p-8"
        description="先填一个今天最想做的方向，Memory 会先给你一版结果。体验版先看结果合不合手，觉得顺再继续。"
        footer={
          <>
            <button className="ui-btn ui-btn-primary min-w-[168px]" onClick={continueToLogin} type="button">
              开始这一轮体验
            </button>
            <ButtonLink href="/" variant="secondary">
              先回首页看看
            </ButtonLink>
          </>
        }
        title="先试一轮，看看结果是不是你想要的方向"
      >
        <div className="flex flex-wrap gap-2">
          {(["title", "script", "explode"] as TrialMode[]).map((item) => (
            <ChoicePill active={mode === item} key={item} onClick={() => setMode(item)}>
              {modeConfig[item].label}
            </ChoicePill>
          ))}
        </div>

        <div className="grid gap-4">
          <FieldGroup hint="先写最关键的主题就够了" label="你今天想做什么">
            <input
              className="ui-input"
              onChange={(event) => setTopic(event.target.value)}
              placeholder={current.placeholder}
              value={topic}
            />
          </FieldGroup>

          <FieldGroup hint="可选" label="补充一点背景">
            <textarea
              className="ui-input min-h-[132px] resize-none"
              onChange={(event) => setNotes(event.target.value)}
              placeholder="例如：客单价、目标人群、你现在最想解决的问题。"
              value={notes}
            />
          </FieldGroup>
        </div>

        <NoticePanel tone="gold">
          体验版先让你看方向，不会一次把全部能力都铺开。登录后，结果和后面的下一步才会真正留下来。
        </NoticePanel>
      </PromptInputCard>

      <div className="grid gap-6">
        <QuotaCard
          title="体验额度卡"
          used={0}
          total={4}
          items={[
            { label: "内容生成", value: "可用 3 条", tone: "brand" },
            { label: "爆款复刻", value: "可用 1 次", tone: "rose" },
            { label: "结果保存", value: "登录后开启", tone: "neutral" },
          ]}
        />

        <ResultDisplayCard
          badge={<SoftBadge tone="brand">{modeConfig[mode].label}</SoftBadge>}
          description="这就是体验页会先给到你的结果形态。"
          title={current.previewTitle}
        >
          <div className="grid gap-3">
            {current.previewLines.map((line, index) => (
              <div key={line} className="rounded-[18px] border border-[rgba(88,51,175,0.08)] bg-white px-4 py-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(112,70,214,0.1)] text-xs font-semibold text-[var(--primary-700)]">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-strong">{line}</span>
                </div>
              </div>
            ))}
          </div>
        </ResultDisplayCard>

        <TodayCompanionCard
          description="先看一版结果，再决定要不要往下展开，会比一开始就硬上完整功能轻很多。"
          items={[
            { title: "今天先把这一轮做出来", meta: "建议", tone: "brand" },
            { title: "结果合手再登录继续", meta: "下一步", tone: "rose" },
          ]}
          title="体验这页会更像一个试跑入口"
        />

        <ContentRetentionCard
          actionHref="/login?intent=trial"
          actionText="登录后继续这一轮"
          description="体验阶段不会把你的输入和结果长期留存。登录之后，才会真正接上你的主页、内容留存和后面的陪跑节奏。"
          title="觉得这轮方向对，就别让它白做"
        />
      </div>
    </div>
  );
}
