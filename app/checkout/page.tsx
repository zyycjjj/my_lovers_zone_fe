"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ApiClientError, apiRequest } from "@/shared/lib/api";

type PlanKey = "experience" | "pro" | "team";
type PaymentOrder = {
  id: number;
  orderNo: string;
  planKey: PlanKey;
  amountFen: number;
  status: "pending" | "paid" | "activated" | "rejected" | "refunded";
  paymentRef?: string | null;
  proofNote?: string | null;
  createdAt: string;
};

const PLAN_MAP: Record<PlanKey, { name: string; price: string; desc: string }> = {
  experience: { name: "体验版", price: "¥1/7天", desc: "新用户专享，体验全部功能" },
  pro: { name: "专业版", price: "¥99/月", desc: "适合个人和小团队" },
  team: { name: "团队版", price: "¥299/月", desc: "适合团队协作使用" },
};

function resolvePlan(plan?: string | null): PlanKey {
  if (plan === "pro") return "pro";
  if (plan === "team") return "team";
  return "experience";
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const planKey = resolvePlan(searchParams.get("plan"));
  const plan = PLAN_MAP[planKey];

  const unifiedPayLink = process.env.NEXT_PUBLIC_PAYMENT_LINK_UNIFIED || "";
  const alipayLink = process.env.NEXT_PUBLIC_PAYMENT_LINK_ALIPAY || "";
  const wechatPayLink = process.env.NEXT_PUBLIC_PAYMENT_LINK_WECHAT || "";
  const fallbackContact = process.env.NEXT_PUBLIC_PAYMENT_CONTACT || "请联系客服完成支付";

  const [order, setOrder] = useState<PaymentOrder | null>(null);
  const [paymentRef, setPaymentRef] = useState("");
  const [proofNote, setProofNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const hasPaymentLink = useMemo(
    () => Boolean(unifiedPayLink || alipayLink || wechatPayLink),
    [alipayLink, unifiedPayLink, wechatPayLink],
  );

  async function createOrder() {
    setLoading(true);
    setMessage("");
    try {
      const created = await apiRequest<PaymentOrder>("/api/payments/orders", {
        method: "POST",
        body: { planKey },
      });
      setOrder(created);
      setMessage("订单已创建，请先完成支付，再提交凭证。");
    } catch (err) {
      setMessage(err instanceof ApiClientError ? err.message : "创建订单失败");
    } finally {
      setLoading(false);
    }
  }

  async function submitProof() {
    if (!order) return;
    setLoading(true);
    setMessage("");
    try {
      const updated = await apiRequest<PaymentOrder>(`/api/payments/orders/${order.id}/proof`, {
        method: "POST",
        body: { paymentRef, note: proofNote },
      });
      setOrder(updated);
      setMessage("凭证已提交，等待审核开通。");
    } catch (err) {
      setMessage(err instanceof ApiClientError ? err.message : "提交凭证失败");
    } finally {
      setLoading(false);
    }
  }

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

          <button
            className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-[16px] bg-[#4A3168] text-sm font-medium text-white disabled:opacity-60"
            disabled={loading}
            onClick={() => void createOrder()}
            type="button"
          >
            {loading ? "处理中" : "创建订单"}
          </button>

          {order ? (
            <div className="mt-4 rounded-[12px] border border-[#ECECF0] bg-white px-3 py-3 text-sm text-[#52525B]">
              <div>订单号：{order.orderNo}</div>
              <div className="mt-1">状态：{order.status}</div>
            </div>
          ) : null}

          <div className="mt-5 space-y-3">
            {unifiedPayLink ? (
              <a
                className="inline-flex h-11 w-full items-center justify-center rounded-[16px] border border-[#4A3168] text-sm font-medium text-[#4A3168]"
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

          {!hasPaymentLink ? (
            <div className="mt-4 rounded-[12px] border border-[#F9CFE3] bg-[#FDF4F8] px-3 py-3 text-sm text-[#993D63]">
              尚未配置支付链接：{fallbackContact}
            </div>
          ) : null}

          <div className="mt-5 space-y-3">
            <input
              className="h-11 w-full rounded-[12px] border border-[#ECECF0] px-3 text-sm outline-none"
              onChange={(e) => setPaymentRef(e.target.value)}
              placeholder="支付流水号（可选）"
              value={paymentRef}
            />
            <textarea
              className="min-h-[96px] w-full rounded-[12px] border border-[#ECECF0] px-3 py-2 text-sm outline-none"
              onChange={(e) => setProofNote(e.target.value)}
              placeholder="备注：支付时间、金额截图说明等（可选）"
              value={proofNote}
            />
            <button
              className="inline-flex h-11 w-full items-center justify-center rounded-[16px] bg-[#D4668F] text-sm font-medium text-white disabled:opacity-60"
              disabled={!order || loading}
              onClick={() => void submitProof()}
              type="button"
            >
              提交支付凭证
            </button>
          </div>

          {message ? (
            <div className="mt-4 rounded-[12px] border border-[#ECECF0] bg-[#FAFAFA] px-3 py-3 text-sm text-[#52525B]">
              {message}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
