"use client";

import { UiButton } from "@/shared/ui/ui-button";
import type { PaymentOrder } from "./admin-model";

export function AdminPaymentOrdersPanel({
  loading,
  orders,
  onApprove,
  onReject,
  onRefresh,
}: {
  loading: boolean;
  orders: PaymentOrder[];
  onApprove: (orderId: number) => void;
  onReject: (orderId: number) => void;
  onRefresh: () => void;
}) {
  return (
    <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">支付订单</h2>
        <UiButton className="px-3 py-1 text-xs" onClick={onRefresh} variant="secondary">
          刷新
        </UiButton>
      </div>

      {loading && !orders.length ? <div className="text-sm text-slate-500">加载中...</div> : null}

      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="rounded-xl border border-rose-100 bg-rose-50/40 p-3 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="font-medium text-slate-800">
                #{order.id} · {order.orderNo}
              </div>
              <div className="text-xs text-slate-600">{order.status}</div>
            </div>
            <div className="mt-1 text-xs text-slate-600">
              user#{order.userId} · account#{order.accountId ?? "-"} · {order.planKey} · ¥
              {(order.amountFen / 100).toFixed(2)}
            </div>
            {order.paymentRef ? <div className="mt-1 text-xs text-slate-600">流水号：{order.paymentRef}</div> : null}
            {order.proofNote ? <div className="mt-1 text-xs text-slate-600">备注：{order.proofNote}</div> : null}
            <div className="mt-2 flex gap-2">
              <UiButton
                className="px-3 py-1 text-xs"
                disabled={order.status === "activated" || order.status === "rejected" || loading}
                onClick={() => onApprove(order.id)}
              >
                审核通过
              </UiButton>
              <UiButton
                className="px-3 py-1 text-xs"
                disabled={order.status === "activated" || order.status === "rejected" || loading}
                onClick={() => onReject(order.id)}
                variant="secondary"
              >
                驳回
              </UiButton>
            </div>
          </div>
        ))}
      </div>

      {!orders.length && !loading ? <div className="text-sm text-slate-500">暂无支付订单</div> : null}
    </div>
  );
}
