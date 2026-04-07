import { ButtonLink, Card, SectionHeading, SoftBadge } from "./components/ui";

const fitFor = ["个体商家", "带货博主", "直播运营", "小团队主理人"];
const quickPreview = ["一版标题", "一版脚本", "一版爆款复刻思路"];
const promises = [
  "先给你一版能继续往下走的内容起点",
  "做完今天这一轮，明天还能接着继续",
  "结果之外，也会告诉你下一步怎么做",
];

export default function HomePage() {
  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <Card className="surface-card-strong overflow-hidden rounded-[32px] p-6 sm:p-8">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <SoftBadge tone="brand">AI 内容工作台</SoftBadge>
              <SoftBadge>标题</SoftBadge>
              <SoftBadge>脚本</SoftBadge>
              <SoftBadge>爆款复刻</SoftBadge>
            </div>

            <SectionHeading
              eyebrow="Warm, Calm, Ready"
              title="帮你把内容先做出来，也帮你更稳地继续做下去"
              description="标题、脚本、爆款复刻先给你一版能继续往下做的结果。登录后补几项关键信息，再回到你的工作入口继续。"
            />

            <div className="grid gap-3 sm:grid-cols-3">
              {quickPreview.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-[--border-soft] bg-white/70 px-4 py-4 text-sm text-[--text-soft]"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <ButtonLink href="/login">直接登录开始</ButtonLink>
              <ButtonLink href="/workspace" variant="secondary">
                看当前工作台
              </ButtonLink>
            </div>
          </div>
        </Card>

        <Card className="flex flex-col justify-between rounded-[32px] bg-[linear-gradient(180deg,_rgba(255,240,231,0.88)_0%,_rgba(255,255,255,0.82)_100%)] p-6">
          <div className="space-y-4">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[--brand]">
                你会先看到什么
            </span>
            <div className="space-y-3">
              {promises.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-[rgba(191,92,49,0.12)] bg-white/78 px-4 py-4 text-sm leading-7 text-[--text-soft]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-3xl bg-[#18202d] px-5 py-5 text-sm leading-7 text-white/88">
            <div className="mb-1 text-base font-semibold text-white">
              它不是冷工具
            </div>
            <p>
              不只给你一版结果，还会尽量告诉你现在先做哪一步。
              有时候不是做不到，是很难每天都从零再来一遍。
            </p>
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <SectionHeading
            eyebrow="What You See First"
            title="登录之后，不会直接扔给你一堆功能"
            description="第一次来，先补几项最影响结果的信息。已经用过的人，会更快回到自己该继续的那一步。"
          />

          <div className="mt-6 space-y-3">
            <div className="rounded-2xl border border-[--border-soft] bg-white/80 px-4 py-4">
              <div className="text-sm font-semibold text-[--text-strong]">
                第一次登录
              </div>
              <div className="mt-1 text-sm leading-7 text-[--text-soft]">
                补你的身份、主营类目和当前目标。
              </div>
            </div>
            <div className="rounded-2xl border border-[--border-soft] bg-white/80 px-4 py-4">
              <div className="text-sm font-semibold text-[--text-strong]">
                已经建档
              </div>
              <div className="mt-1 text-sm leading-7 text-[--text-soft]">
                直接进当前工作空间，先把今天这一步接住。
              </div>
            </div>
            <div className="rounded-2xl border border-[--border-soft] bg-white/80 px-4 py-4">
              <div className="text-sm font-semibold text-[--text-strong]">
                多空间场景
              </div>
              <div className="mt-1 text-sm leading-7 text-[--text-soft]">
                不用重新找入口，直接接着当前这一步继续。
              </div>
            </div>
          </div>
        </Card>

        <Card className="rounded-[32px]">
          <SectionHeading
            eyebrow="Who It Fits"
            title="适合先把内容经营稳住的人"
            description="不是一上来就逼你进复杂后台，而是先帮你把每天做内容这件事接住。"
          />

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {fitFor.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-[--border-soft] bg-[rgba(255,255,255,0.78)] px-4 py-4 text-sm font-medium text-[--text-strong]"
              >
                {item}
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-3xl border border-[--border-soft] bg-[rgba(244,246,248,0.78)] px-5 py-5">
            <div className="text-sm font-semibold text-[--text-strong]">
              先从这里开始
            </div>
            <div className="mt-2 text-sm leading-7 text-[--text-soft]">
              先登录，补几项最关键的信息，再回到你的工作入口。之后生成、复刻和结果页会继续接在这条主链路上。
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
