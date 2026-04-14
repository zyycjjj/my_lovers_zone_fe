import {
  CommunityEntryCard,
  ContentRetentionCard,
  PlanCard,
  QuotaCard,
  TodayCompanionCard,
} from "./components/business";
import { ButtonLink, Card, InfoPanel, SectionHeading, SoftBadge } from "./components/ui";

const featureRows = [
  {
    title: "先给你一版能发的内容",
    description: "标题、脚本、爆款拆解先出结果，不让你第一步就卡在空白页。",
  },
  {
    title: "不是只给结果，也给下一步",
    description: "你不一定每天状态都稳，所以结果之后会顺手告诉你下一步先做什么。",
  },
  {
    title: "第二天回来，不用重来",
    description: "这一轮做过什么、还差什么，会留下来，后面接着做就行。",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-8 lg:space-y-10">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_380px]">
        <Card className="rounded-[36px] p-6 sm:p-8 lg:p-10">
          <div className="space-y-7">
            <div className="flex flex-wrap items-center gap-2.5">
              <SoftBadge tone="brand">1 元体验</SoftBadge>
              <SoftBadge>3 条生成</SoftBadge>
              <SoftBadge tone="rose">1 次爆款复刻</SoftBadge>
            </div>

            <SectionHeading
              eyebrow="AI 内容工作台"
              title="先把今天这轮内容做出来，再把后面的节奏接住"
              description="Memory 不想一上来就让你学一堆复杂后台。它先给你一版能发的内容，再把下一步、内容留存和后续节奏一起接起来。"
            />

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="ui-card-muted rounded-[20px] px-4 py-4">
                <div className="text-sm font-medium text-muted">内容方向</div>
                <div className="mt-2 text-[22px] font-semibold tracking-[-0.03em] text-strong">标题</div>
              </div>
              <div className="ui-card-muted rounded-[20px] px-4 py-4">
                <div className="text-sm font-medium text-muted">表达载体</div>
                <div className="mt-2 text-[22px] font-semibold tracking-[-0.03em] text-strong">脚本</div>
              </div>
              <div className="ui-card-muted rounded-[20px] px-4 py-4">
                <div className="text-sm font-medium text-muted">增长入口</div>
                <div className="mt-2 text-[22px] font-semibold tracking-[-0.03em] text-strong">爆款复刻</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/trial" className="min-w-[160px]">
                开始 1 元体验
              </ButtonLink>
              <ButtonLink href="/login" variant="secondary" className="min-w-[160px]">
                登录 / 注册
              </ButtonLink>
            </div>
          </div>
        </Card>

        <div className="grid gap-6">
          <QuotaCard
            used={1}
            total={4}
            items={[
              { label: "内容生成", value: "剩余 3 条", tone: "brand" },
              { label: "爆款复刻", value: "剩余 1 次", tone: "rose" },
              { label: "今天建议", value: "先做标题", tone: "neutral" },
            ]}
            title="体验额度卡"
          />

          <TodayCompanionCard
            title="今天先别把自己逼太满"
            description="Memory 会先帮你把最小的一轮往前推，不让你一上来就同时解决所有问题。"
            items={[
              { title: "先定标题方向", meta: "第一步", tone: "brand" },
              { title: "再补一版脚本", meta: "第二步", tone: "sage" },
              { title: "有力气再做爆款复刻", meta: "可选", tone: "rose" },
            ]}
          />

          <CommunityEntryCard
            actionHref="/login"
            actionText="登录后查看社群入口"
            description="不是只有工具，还有人在这里分享今天的结果、踩过的坑和跑通的方法。"
            title="做内容这件事，不一定要自己一个人扛。"
          />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)]">
        <ContentRetentionCard
          actionHref="/login"
          actionText="先把这一轮接起来"
          description="今天做出来的标题、脚本和复刻方向会留下来。明天回来，不用重新从空白页开始。"
          title="它不是一锤子买卖的 AI 工具"
        />

        <Card className="rounded-[32px]">
          <div className="space-y-5">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted">为什么有人会留下来</div>
              <div className="text-[28px] font-semibold tracking-[-0.03em] text-strong">
                因为它不只给结果，
                <br />
                还会把后面那一步接住。
              </div>
            </div>

            <div className="grid gap-3">
              {featureRows.map((item, index) => (
                <InfoPanel
                  key={item.title}
                  className="relative pl-14"
                  description={item.description}
                  title={item.title}
                >
                  <span className="absolute left-5 top-5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(112,70,214,0.1)] text-xs font-semibold text-[var(--primary-700)]">
                    {index + 1}
                  </span>
                </InfoPanel>
              ))}
            </div>
          </div>
        </Card>
      </section>

      <section className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="套餐卡"
            title="先用低门槛开始，再决定要不要长期留下来"
            description="第一阶段先把体验、月卡和终身卡做清楚，别让定价拖慢判断。"
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <PlanCard
            actionHref="/trial"
            actionText="先试这一轮"
            description="适合先看结果合不合手。"
            features={["3 条内容生成", "1 次爆款复刻", "当天体验有效"]}
            name="1 元体验"
            price="¥1"
          />
          <PlanCard
            actionHref="/login"
            actionText="登录后开通"
            description="最适合先把每天的节奏稳住。"
            features={["每日 10 条生成", "模板与内容留存", "社群入口"]}
            name="月度会员"
            price="¥9.9"
            recommended
          />
          <PlanCard
            actionHref="/login"
            actionText="登录后开通"
            description="适合已经确定长期会持续使用的人。"
            features={["每日 5 条生成", "永久模板", "社群入口"]}
            name="终身版"
            price="¥66"
          />
        </div>
      </section>
    </div>
  );
}
