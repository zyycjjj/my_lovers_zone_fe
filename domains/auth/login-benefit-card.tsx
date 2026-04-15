import { GiftIcon, InlineIconCircle } from "./login-icons";

export function LoginBenefitCard() {
  return (
    <section className="flex items-center gap-4 rounded-[20px] bg-[linear-gradient(166deg,#4a3168_0%,#2d1b4e_100%)] px-6 py-6 text-white shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.08)]">
      <InlineIconCircle>
        <GiftIcon />
      </InlineIconCircle>
      <div>
        <div className="text-[20px] font-semibold">新用户专享福利</div>
        <div className="mt-1 text-[14px] text-white/80">1元体验7天全部功能 · 随时可退款</div>
      </div>
    </section>
  );
}

