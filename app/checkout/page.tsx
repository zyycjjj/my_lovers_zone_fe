import Link from "next/link";

type PlanKey = "experience" | "pro" | "team";

const PLAN_MAP: Record<PlanKey, { name: string; price: string; desc: string }> = {
  experience: { name: "体验版", price: "¥1/7天", desc: "新用户专享，体验全部功能" },
  pro: { name: "专业版", price: "¥99/月", desc: "适合个人和小团队" },
  team: { name: "团队版", price: "¥299/月", desc: "适合团队协作使用" },
};

function resolvePlan(plan?: string): PlanKey {
  if (plan === "pro") return "pro";
  if (plan === "team") return "team";
  return "experience";
}

export default function CheckoutPage({
  searchParams,
}: {
  searchParams?: { plan?: string };
}) {
  const planKey = resolvePlan(searchParams?.plan);
  const plan = PLAN_MAP[planKey];

  // 可在部署平台配置不同套餐的外部支付链接（支付宝收款链接、微信收款链接、聚合收银台链接等）
  const unifiedPayLink = process.env.NEXT_PUBLIC_PAYMENT_LINK_UNIFIED || "";
  const alipayLink = process.env.NEXT_PUBLIC_PAYMENT_LINK_ALIPAY || "";
  const wechatPayLink = process.env.NEXT_PUBLIC_PAYMENT_LINK_WECHAT || "";
  const fallbackContact = process.env.NEXT_PUBLIC_PAYMENT_CONTACT || "请联系客服完成支付";

  return (
    <div className="min-h-screen bg-[#fafafa] px-4 py-8 text-[#18181b]">
      <div className="mx-auto max-w-[560px]">
        <div className="mb-4">
          <Link className="text-sm font-medium text-[#4A3168]" href="/pricing">
            返回套餐页
          </Link>
        </div>

        <section className="rounded-[20px] border border-[rgba(0,0,0,0.08)] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <h1 className="text-[24px] font-semibold text-[#27272A]">确认购买</h1>
          <p className="mt-2 text-sm text-[#737378]">{plan.desc}</p>

          <div className="mt-5 rounded-[16px] bg-[#F5F3F7] px-4 py-4">
            <div className="text-sm text-[#737378]">当前套餐</div>
            <div className="mt-1 text-[18px] font-semibold text-[#27272A]">{plan.name}</div>
            <div className="mt-1 text-sm text-[#4A3168]">{plan.price}</div>
          </div>

          <div className="mt-5 space-y-3">
            {unifiedPayLink ? (
              <a
                className="inline-flex h-11 w-full items-center justify-center rounded-[16px] bg-[#4A3168] text-sm font-medium text-white"
                href={unifiedPayLink}
                rel="noreferrer"
                target="_blank"
              >
                去支付
              </a>
            ) : null}

            {alipayLink ? (
              <a
                className="inline-flex h-11 w-full items-center justify-center rounded-[16px] border border-[#4A3168] text-sm font-medium text-[#4A3168]"
                href={alipayLink}
                rel="noreferrer"
                target="_blank"
              >
                支付宝支付
              </a>
            ) : null}

            {wechatPayLink ? (
              <a
                className="inline-flex h-11 w-full items-center justify-center rounded-[16px] border border-[#4A3168] text-sm font-medium text-[#4A3168]"
                href={wechatPayLink}
                rel="noreferrer"
                target="_blank"
              >
                微信支付
              </a>
            ) : null}
          </div>

          {!unifiedPayLink && !alipayLink && !wechatPayLink ? (
            <div className="mt-4 rounded-[12px] border border-[#F9CFE3] bg-[#FDF4F8] px-3 py-3 text-sm text-[#993D63]">
              尚未配置支付链接：{fallbackContact}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
