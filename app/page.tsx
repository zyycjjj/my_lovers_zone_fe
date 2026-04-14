import Link from "next/link";

const benefits = [
  {
    icon: "⚡",
    title: "3秒出稿",
    description: "告别熬夜写文案，AI帮你秒出结果",
  },
  {
    icon: "🎯",
    title: "直接可用",
    description: "生成即可发布，无需二次修改",
  },
  {
    icon: "📈",
    title: "数据支持",
    description: "基于10万+爆款案例训练",
  },
  {
    icon: "💪",
    title: "持续陪跑",
    description: "不只是工具，更是你的内容助手",
  },
];

const examples = [
  {
    title: "小红书种草文案",
    time: "刚刚生成",
    content: [
      "🌸 姐妹们！终于找到了这款神仙面膜！",
      "",
      "用了一周，皮肤状态真的肉眼可见变好了！毛孔细腻了，痘印也淡了不少～",
      "",
      "💕 最爱它的温和配方，敏感肌也能用！睡前敷20分钟，早上起来皮肤水润透亮，妆容都服帖了！",
      "",
      "📦 现在还有新人优惠，姐妹们冲！",
    ],
  },
  {
    title: "直播话术脚本",
    time: "2分钟前",
    content: [
      "【开场白】",
      "各位宝宝们晚上好！我是你们的老朋友小美～今天给大家带来了超级福利！",
      "",
      "【产品介绍】",
      "这款\"熬夜党救星面膜\"真的是我近期挖到的宝！一个大礼盒里有整整7片超值装！",
      "",
      "它的核心成分是",
      "以熬夜修护著称的专研配方，敷上脸冰冰凉凉超舒服！坚持用真的能感受到肤色更均匀哦～",
      "",
      "【价格对比】",
      "今天直播间专属价！限时限量！买1件到手还送了赠品！护肤真的别不舍得，早投资！",
      "",
      "【行动引导】",
      "宝们可以直接点购物袋，现在拍立减！库存不多了，喜欢的真的别犹豫～",
    ],
  },
];

const audiences = [
  {
    icon: "🛍️",
    title: "个体商家",
    description: "快速生成产品文案",
  },
  {
    icon: "📱",
    title: "直播主播",
    description: "一键生成话术脚本",
  },
  {
    icon: "✍️",
    title: "内容运营",
    description: "批量创作营销内容",
  },
  {
    icon: "👥",
    title: "团队主理人",
    description: "高效管理内容产出",
  },
];

const plans = [
  {
    name: "体验版",
    desc: "新用户专享，体验全部功能",
    price: "¥1",
    suffix: "/7天",
    features: ["每日50次生成", "全部AI模型", "10+内容模板", "7天历史记录", "社群支持"],
    action: "立即体验",
  },
  {
    name: "专业版",
    desc: "适合个人和小团队",
    price: "¥99",
    suffix: "/月",
    features: ["每日200次生成", "高级AI模型", "50+内容模板", "无限历史记录", "优先客服", "自定义模板"],
    action: "立即订阅",
    recommended: true,
  },
  {
    name: "团队版",
    desc: "适合团队协作使用",
    price: "¥299",
    suffix: "/月",
    features: ["无限次生成", "顶级AI模型", "无限模板库", "团队协作", "专属客服", "API接入"],
    action: "联系客服",
  },
];

const stats = [
  { value: "50,000+", label: "创作者用户" },
  { value: "1,000,000+", label: "内容生成量" },
  { value: "98%", label: "用户满意度" },
  { value: "4.9", label: "用户评分" },
];

function Brand() {
  return (
    <div className="flex items-center gap-2 lg:gap-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#4A3168_0%,#D4668F_100%)] shadow-[0_10px_40px_rgba(74,49,104,0.25)] lg:h-10 lg:w-10">
        <span className="text-sm font-semibold text-white lg:text-base">M</span>
      </div>
      <span className="text-sm font-semibold tracking-[-0.02em] text-[#27272a] lg:text-base">AI内容工作台</span>
    </div>
  );
}

function Header() {
  return (
    <div className="fixed inset-x-0 top-0 z-40 border-b border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.8)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between px-4 lg:h-[65px] lg:px-4">
        <Brand />
        <Link
          href="/login"
          className="inline-flex h-9 items-center justify-center rounded-2xl px-4 text-sm font-medium text-[#3f3f46] lg:h-10 lg:px-6"
        >
          登录
        </Link>
      </div>
    </div>
  );
}

function PrimaryButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex h-[60px] w-full items-center justify-center rounded-2xl bg-[#4a3168] text-[18px] font-medium text-white shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.1)] lg:h-16 lg:w-auto lg:min-w-[192px]"
    >
      {children}
    </Link>
  );
}

function SecondaryButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex h-[60px] w-full items-center justify-center rounded-2xl border-[1.5px] border-[#4a3168] bg-white text-[18px] font-medium text-[#4a3168] lg:h-16 lg:w-auto lg:min-w-[140px]"
    >
      {children}
    </Link>
  );
}

function SectionTitle({
  badge,
  title,
  description,
}: {
  badge?: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      {badge ? (
        <div className="inline-flex h-[30px] items-center justify-center rounded-full border border-[#f9cfe3] bg-[#fdf4f8] px-3 text-xs font-medium text-[#993d63]">
          {badge}
        </div>
      ) : null}
      <h2 className="text-[20px] font-semibold leading-[25px] tracking-[-0.01em] text-[#18181b] lg:text-[24px] lg:leading-[30px] lg:tracking-[-0.24px]">
        {title}
      </h2>
      <p className="text-base leading-[26px] text-[#737378]">{description}</p>
    </div>
  );
}

function ExampleCard({ title, time, content }: (typeof examples)[number]) {
  return (
    <div className="rounded-[20px] border border-[rgba(0,0,0,0.08)] bg-white p-6 shadow-[0_4px_6px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.08)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-lg font-medium text-[#27272a]">{title}</div>
          <div className="mt-1 text-xs text-[#737378]">{time}</div>
        </div>
        <div className="inline-flex h-[30px] items-center rounded-full border border-[#10b981] bg-[#d1fae5] px-3 text-sm font-medium text-[#10b981]">
          <span className="mr-2 h-1.5 w-1.5 rounded-full bg-[#10b981]" />
          已完成
        </div>
      </div>

      <div className="mt-4 space-y-1 text-base leading-[26px] text-[#3f3f46]">
        {content.map((line, index) => (
          <p key={`${title}-${index}`}>{line || "\u00A0"}</p>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2 pt-2">
        <button className="inline-flex h-10 items-center justify-center rounded-2xl border-[1.5px] border-[#4a3168] px-4 text-sm font-medium text-[#4a3168]">
          复制
        </button>
        <button className="inline-flex h-9 items-center justify-center rounded-2xl px-4 text-sm font-medium text-[#4a3168]">
          重新生成
        </button>
      </div>
    </div>
  );
}

function PlanCard({
  name,
  desc,
  price,
  suffix,
  features,
  action,
  recommended,
}: (typeof plans)[number]) {
  const buttonClass = recommended
    ? "bg-[#4a3168] text-white shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.1)]"
    : "border-[1.5px] border-[#4a3168] bg-white text-[#4a3168]";

  return (
    <div
      className={`relative rounded-[20px] border bg-white p-6 shadow-[0_4px_6px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.08)] ${
        recommended
          ? "border-2 border-[#4a3168] shadow-[0_10px_40px_rgba(74,49,104,0.25)]"
          : "border-[rgba(0,0,0,0.08)]"
      }`}
    >
      {recommended ? (
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
          <div className="inline-flex h-[22px] items-center rounded-full border border-[#f9cfe3] bg-[#fdf4f8] px-2 text-xs font-medium text-[#993d63]">
            推荐
          </div>
        </div>
      ) : null}

      <div className="text-[20px] font-semibold text-[#27272a]">{name}</div>
      <div className="mt-2 text-sm text-[#737378]">{desc}</div>

      <div className="mt-6 flex items-end gap-1">
        <div className="text-4xl font-bold leading-10 text-[#4a3168]">{price}</div>
        <div className="pb-1 text-base text-[#737378]">{suffix}</div>
      </div>

      <ul className="mt-6 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-[#3f3f46]">
            <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#eaf8f1] text-xs text-[#10b981]">
              ✓
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href={action === "联系客服" ? "/login" : "/trial"}
        className={`mt-6 inline-flex h-[51px] w-full items-center justify-center rounded-2xl text-base font-medium ${buttonClass}`}
      >
        {action}
      </Link>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="bg-[#fafafa] text-[#18181b]">
      <Header />

      <main className="pt-16 lg:pt-[65px]">
        <section className="relative overflow-hidden bg-[linear-gradient(125deg,#ffffff_0%,rgba(245,243,247,0.3)_50%,rgba(253,244,248,0.2)_100%)]">
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <div className="absolute left-[18%] top-20 h-72 w-72 rounded-full bg-[#d1c7dd] blur-[64px] lg:left-[74%]" />
            <div className="absolute left-10 top-28 h-96 w-96 rounded-full bg-[#f9cfe3] blur-[64px]" />
          </div>

          <div className="mx-auto max-w-[1280px] px-4 pb-16 pt-12 lg:px-4 lg:pb-20 lg:pt-20">
            <div className="mx-auto flex max-w-[672px] flex-col items-center text-center">
              <div className="inline-flex h-[30px] items-center justify-center rounded-full border border-[#f9cfe3] bg-[#fdf4f8] px-3 text-sm font-medium text-[#993d63]">
                已帮助 50,000+ 创作者生成内容
              </div>

              <h1 className="mt-6 text-4xl font-bold leading-[45px] tracking-[-0.02em] text-[#18181b] lg:text-[60px] lg:leading-[75px] lg:tracking-[-1.2px]">
                <span className="block">3秒生成</span>
                <span className="block bg-[linear-gradient(90deg,#4A3168_0%,#D4668F_100%)] bg-clip-text text-transparent">
                  可直接发布的内容
                </span>
              </h1>

              <p className="mt-6 max-w-[576px] text-lg leading-[29px] text-[#52525a] lg:text-[20px] lg:leading-[32.5px]">
                不用再为写文案发愁，AI帮你快速生成小红书、抖音、直播话术等各类营销内容
              </p>

              <div className="mt-6 flex w-full flex-col gap-4 lg:mt-8 lg:flex-row lg:justify-center">
                <PrimaryButton href="/trial">1元立即体验</PrimaryButton>
                <SecondaryButton href="/login">直接登录</SecondaryButton>
              </div>

              <p className="mt-6 text-sm text-[#737378]">💎 1元体验7天 · 随时可退 · 无需绑卡</p>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 lg:py-20">
          <div className="mx-auto max-w-[1280px] px-4">
            <SectionTitle title="为什么选择我们？" description="专为中国内容创作者打造的AI助手" />

            <div className="mt-12 grid gap-6 lg:grid-cols-4">
              {benefits.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[20px] border border-[rgba(0,0,0,0.08)] bg-white px-6 py-6 text-center shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.08)]"
                >
                  <div className="text-[36px] leading-10">{item.icon}</div>
                  <div className="mt-4 text-[20px] font-semibold leading-[27.5px] text-[#27272a]">{item.title}</div>
                  <div className="mt-2 text-sm leading-5 text-[#737378]">{item.description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[linear-gradient(107deg,#fafafa_0%,rgba(245,243,247,0.2)_100%)] py-16 lg:py-20">
          <div className="mx-auto max-w-[1280px] px-4">
            <SectionTitle title="看看AI生成的效果" description="真实案例，开箱即用" />

            <div className="mx-auto mt-12 flex max-w-[768px] flex-col gap-6">
              {examples.map((example) => (
                <ExampleCard key={example.title} {...example} />
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <button className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#d4668f] px-6 text-base font-medium text-white">
                查看更多示例
              </button>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 lg:py-20">
          <div className="mx-auto max-w-[1280px] px-4">
            <SectionTitle title="谁在使用AI内容工作台？" description="超过50,000+创作者的选择" />

            <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
              {audiences.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[20px] border border-[rgba(0,0,0,0.08)] bg-white px-6 py-6 text-center shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.08)]"
                >
                  <div className="text-5xl leading-[48px]">{item.icon}</div>
                  <div className="mt-4 text-[20px] font-semibold leading-[25px] text-[#27272a]">{item.title}</div>
                  <div className="mt-2 text-sm leading-5 text-[#737378]">{item.description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-[1280px] px-4">
            <SectionTitle badge="限时优惠" title="选择适合你的方案" description="7天无理由退款，零风险试用" />

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {plans.map((plan) => (
                <PlanCard key={plan.name} {...plan} />
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-[rgba(0,0,0,0.08)] bg-white py-16 lg:py-[65px]">
          <div className="mx-auto max-w-[1280px] px-4">
            <div className="grid grid-cols-2 gap-y-8 lg:grid-cols-4">
              {stats.map((item) => (
                <div key={item.label} className="text-center">
                  <div className="text-[30px] font-bold leading-9 text-[#4a3168] lg:text-4xl lg:leading-10">{item.value}</div>
                  <div className="mt-2 text-sm text-[#737378]">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.95)] shadow-[0_-20px_25px_rgba(0,0,0,0.08),0_-8px_10px_rgba(0,0,0,0.08)] backdrop-blur-xl lg:hidden">
        <div className="mx-auto max-w-[403px] px-4 py-4">
          <div className="text-center">
            <div className="text-base font-semibold leading-[26px] text-[#18181b]">现在开始，3秒生成你的第一条内容</div>
            <div className="mt-1 text-sm text-[#737378]">💎 1元体验7天，随时可退</div>
          </div>

          <div className="mt-4 flex gap-3">
            <Link
              href="/login"
              className="inline-flex h-[51px] flex-1 items-center justify-center rounded-2xl border-[1.5px] border-[#4a3168] bg-white text-base font-medium text-[#4a3168]"
            >
              直接登录
            </Link>
            <Link
              href="/trial"
              className="inline-flex h-[51px] flex-1 items-center justify-center rounded-2xl bg-[#4a3168] text-base font-medium text-white shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.1)]"
            >
              1元立即体验
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
