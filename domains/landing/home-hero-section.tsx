import { HomePrimaryButton, HomeSecondaryButton } from "./home-buttons";

export function HomeHeroSection() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(125deg,#ffffff_0%,rgba(245,243,247,0.3)_50%,rgba(253,244,248,0.2)_100%)]">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute left-[18%] top-20 h-72 w-72 rounded-full bg-[#d1c7dd] blur-3xl lg:left-[74%]" />
        <div className="absolute left-10 top-28 h-96 w-96 rounded-full bg-[#f9cfe3] blur-3xl" />
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
            写文案不用自己憋着了，小红书、抖音、直播话术都能直接出
          </p>

          <div className="mt-6 flex w-full flex-col gap-4 lg:mt-8 lg:flex-row lg:justify-center">
            <HomePrimaryButton href="/trial">1元立即体验</HomePrimaryButton>
            <HomeSecondaryButton href="/login">直接登录</HomeSecondaryButton>
          </div>

          <p className="mt-6 text-sm text-[#737378]">💎 1元体验7天 · 随时可退 · 无需绑卡</p>
        </div>
      </div>
    </section>
  );
}

