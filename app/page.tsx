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
              eyebrow="轻一点开始"
              title="帮你把内容先做出来，也帮你更稳地继续做下去"
              description="标题、脚本、爆款复刻先给你一个清晰起点。先用手机号登录，简单填几项信息，就能更快进入自己的主页。"
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
              <ButtonLink href="/login">手机号登录开始</ButtonLink>
              <ButtonLink href="#how-it-starts" variant="secondary">
                先看看怎么开始
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

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]" id="how-it-starts">
        <Card>
          <SectionHeading
            eyebrow="怎么开始"
            title="第一次来，也不会很重"
            description="Memory 会先认识你在做什么，再把后面的结果和页面慢慢贴近你。"
          />

          <div className="mt-6 space-y-3">
            <div className="rounded-2xl border border-[--border-soft] bg-white/80 px-4 py-4">
              <div className="text-sm font-semibold text-[--text-strong]">
                先认识你一下
              </div>
              <div className="mt-1 text-sm leading-7 text-[--text-soft]">
                先了解你的身份、主营类目和当前目标。
              </div>
            </div>
            <div className="rounded-2xl border border-[--border-soft] bg-white/80 px-4 py-4">
              <div className="text-sm font-semibold text-[--text-strong]">
                记住你的偏好
              </div>
              <div className="mt-1 text-sm leading-7 text-[--text-soft]">
                以后再回来，不用每次都重新介绍自己。
              </div>
            </div>
            <div className="rounded-2xl border border-[--border-soft] bg-white/80 px-4 py-4">
              <div className="text-sm font-semibold text-[--text-strong]">
                回来继续就行
              </div>
              <div className="mt-1 text-sm leading-7 text-[--text-soft]">
                今天没做完，明天回来还能顺着往下走。
              </div>
            </div>
          </div>
        </Card>

        <Card className="rounded-[32px]">
          <SectionHeading
            eyebrow="适合谁"
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
              从这里开始就够了
            </div>
            <div className="mt-2 text-sm leading-7 text-[--text-soft]">
              先用手机号登录，简单填几项信息，后面每次回来都会更省心一点。
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
