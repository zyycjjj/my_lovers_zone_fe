"use client";

import { UiButton } from "@/shared/ui/ui-button";
import type { PaymentConfig } from "./admin-model";

type Props = {
  value: PaymentConfig;
  loading: boolean;
  onChange: (patch: Partial<PaymentConfig>) => void;
  onSave: () => void;
  onReload: () => void;
};

export function AdminPaymentConfigPanel({ loading, onChange, onReload, onSave, value }: Props) {
  return (
    <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">支付配置</h2>
        <div className="flex gap-2">
          <UiButton className="px-3 py-1 text-xs" onClick={onReload} variant="secondary">
            刷新
          </UiButton>
          <UiButton className="px-3 py-1 text-xs" onClick={onSave}>
            保存
          </UiButton>
        </div>
      </div>
      <div className="grid gap-3">
        <input
          className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-2 text-sm"
          onChange={(e) => onChange({ unifiedLink: e.target.value })}
          placeholder="统一支付链接（可选）"
          value={value.unifiedLink || ""}
        />
        <input
          className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-2 text-sm"
          onChange={(e) => onChange({ alipayLink: e.target.value })}
          placeholder="支付宝链接（可选）"
          value={value.alipayLink || ""}
        />
        <input
          className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-2 text-sm"
          onChange={(e) => onChange({ wechatLink: e.target.value })}
          placeholder="微信链接（可选）"
          value={value.wechatLink || ""}
        />
        <input
          className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-2 text-sm"
          onChange={(e) => onChange({ alipayQrImage: e.target.value })}
          placeholder="支付宝收款码图片URL（可选）"
          value={value.alipayQrImage || ""}
        />
        <input
          className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-2 text-sm"
          onChange={(e) => onChange({ wechatQrImage: e.target.value })}
          placeholder="微信收款码图片URL（可选）"
          value={value.wechatQrImage || ""}
        />
        <textarea
          className="min-h-[88px] rounded-xl border border-rose-100 bg-rose-50 px-4 py-2 text-sm"
          onChange={(e) => onChange({ contactText: e.target.value })}
          placeholder="未配置支付时提示文案"
          value={value.contactText || ""}
        />
      </div>
      {loading ? <div className="mt-3 text-xs text-slate-500">保存/刷新中...</div> : null}
    </div>
  );
}
