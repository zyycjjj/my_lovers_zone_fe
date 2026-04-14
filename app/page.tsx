import { ButtonLink, Card, InfoPanel, SectionHeading, SoftBadge } from "./components/ui";

const entryPoints = [
  {
    title: "标题先定下来",
    description: "先把今天要发的那条标题方向挑出来，不用一上来就把所有事做满。",
    tone: "brand" as const,
  },
  {
    title: "脚本先出一版",
    description: "短视频和直播都先给你能继续讲下去的一版，后面再慢慢磨细节。",
    tone: "rose" as const,
  },
  {
    title: "爆款先拆思路",
    description: "先看别人为什么能跑，再生成你自己的版本，少一点盲目试错。",
    tone: "sage" as const,
  },
];

const steps = [
  {
    title: "先认一下你在做什么",
    description: "只问几项最重要的信息：你是谁、卖什么、这阶段最想解决什么。",
  },
  {
    title: "给你一版今天就能用的内容",
    description: "不是讲一堆复杂功能，而是先把标题、脚本、复刻方向做出来。",
  },
  {
    title: "第二天回来还能继续",
    description: "你不用再从零开始，昨天做到哪、今天该怎么接着做，会更顺一点。",
  },
];

const fitFor = ["个体商家", "带货博主", "直播运营", "内容主理人"];

export default function HomePage() {
  return (
    <div className="space-y-7 lg:space-y-9">
      <section className="grid gap-6 xl:grid-cols-[1.18fr_0.82fr]">
        <Card className="surface-card-strong overflow-hidden rounded-[34px] p-6 sm:p-8 lg:p-10">
          <div className="space-y-7">
            <div className="flex flex-wrap items-center gap-3">
              <SoftBadge tone="brand">轻陪跑式 AI 内容工作台</SoftBadge>
              <SoftBadge>标题</SoftBadge>
              <SoftBadge>脚本</SoftBadge>
              <SoftBadge>爆款复刻</SoftBadge>
            </div>

            <SectionHeading
              eyebrow="今天先做一轮"
              title="先把内容做出来，再把节奏慢慢稳住"
              description="Memory 不想把你直接推到一堆复杂系统里。它先帮你把今天最重要的一轮做出来，再让你第二天回来时不至于又从零开始。"
            />

            <div className="grid gap-3 md:grid-cols-3">
              {entryPoints.map((item) => (
                <InfoPanel
                  key={item.title}
                  className="surface-card-muted rounded-[26px]"
                  description={item.description}
                  title={item.title}
                  tone={item.tone}
                />
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <ButtonLink href="/login" className="min-w-[148px]">
                手机号登录开始
              </ButtonLink>
              <ButtonLink href="/workspace" variant="secondary">
                直接看看工作台
              </ButtonLink>
            </div>
          </div>
        </Card>

        <div className="grid gap-6">
          <Card className="rounded-[30px] bg-[linear-gradient(180deg,_rgba(255,255,255,0.94)_0%,_rgba(241,234,255,0.84)_100%)]">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <SoftBadge tone="rose">不是冷工具</SoftBadge>
              </div>
              <h3 className="heading-serif text-strong text-[28px] leading-tight">
                它会尽量告诉你
                <br />
                现在先做哪一步
              </h3>
              <div className="grid gap-3">
                <InfoPanel
                  description="先把一条标题和一版脚本做出来。"
                  title="今天先把最小的一轮做完"
                  tone="brand"
                />
                <InfoPanel
                  description="如果今天状态一般，也先把最轻的一步往前推。"
                  title="状态不稳的时候也能继续"
                  tone="rose"
                />
                <InfoPanel
                  description="明天回来，还能接着昨天那一轮继续做。"
                  title="不用每天都重新开始"
                />
              </div>
            </div>
          </Card>

          <Card className="rounded-[30px] bg-[#22173d] text-white">
            <div className="space-y-4">
              <SoftBadge tone="rose">Memory 的差异化</SoftBadge>
              <div className="text-2xl font-semibold leading-tight">
                经营压力大的时候，
                <br />
                你也不需要每天都重来一遍。
              </div>
              <p className="text-sm leading-7 text-white/78">
                结果、下一步、第二天继续，这三件事一起接住，
                才不是一次性 AI 工具。
              </p>
            </div>
          </Card>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <Card className="rounded-[32px]">
          <SectionHeading
            eyebrow="怎么开始"
            title="第一次来，也不会很重"
            description="第一阶段不做复杂后台，只把最影响结果的第一步收好。"
          />

          <div className="mt-6 space-y-3">
            {steps.map((item, index) => (
              <InfoPanel
                key={item.title}
                className="relative pl-16"
                description={item.description}
                title={item.title}
              >
                <span className="absolute left-5 top-5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-soft text-sm font-semibold text-brand-ink">
                  {index + 1}
                </span>
              </InfoPanel>
            ))}
          </div>
        </Card>

        <Card className="rounded-[32px]">
          <SectionHeading
            eyebrow="适合谁"
            title="适合先把内容节奏稳下来的人"
            description="不是一上来就逼你做复杂运营，而是先把每天该做的一轮接住。"
          />

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {fitFor.map((item) => (
              <div
                key={item}
                className="rounded-[22px] border border-[rgba(91,70,142,0.1)] bg-[linear-gradient(180deg,_rgba(255,255,255,0.88)_0%,_rgba(244,241,250,0.82)_100%)] px-4 py-4 text-sm font-medium text-strong"
              >
                {item}
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[28px] border border-[rgba(93,63,211,0.12)] bg-[linear-gradient(180deg,_rgba(241,234,255,0.7)_0%,_rgba(255,255,255,0.84)_100%)] px-5 py-5">
            <div className="text-strong text-sm font-semibold">现在就能开始的入口</div>
            <div className="text-soft mt-2 text-sm leading-7">
              先登录，补最少的信息，直接进入工作台。后面的模板、社群和更多能力，会在你真正开始用之后再慢慢接上。
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
