"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminControlPanel } from "./admin-control-panel";
import { AdminPlanConfigPanel } from "./admin-plan-config-panel";
import { AdminPaymentConfigPanel } from "./admin-payment-config-panel";
import { AdminPaymentOrdersPanel } from "./admin-payment-orders-panel";
import { useAdmin } from "./use-admin";
import { useAuthSession } from "@/shared/lib/session-store";
import { apiRequest } from "@/shared/lib/api";

export default function AdminScreen() {
  const admin = useAdmin();
  const router = useRouter();
  const session = useAuthSession();
  const [authState, setAuthState] = useState<"checking" | "ok" | "forbidden">("checking");

  useEffect(() => {
    if (!session?.sessionToken) {
      return;
    }
    void (async () => {
      try {
        await apiRequest("/api/me/admin-check", { sessionToken: session.sessionToken, timeoutMs: 10000 });
        setAuthState("ok");
      } catch {
        setAuthState("forbidden");
      }
    })();
  }, [session?.sessionToken]);

  const resolvedAuthState = session?.sessionToken ? authState : "no_session";

  if (resolvedAuthState === "checking") {
    return <div className="rounded-2xl border border-rose-100 bg-white p-6 text-sm text-slate-600">正在校验管理员权限...</div>;
  }

  if (resolvedAuthState === "no_session") {
    return (
      <div className="rounded-2xl border border-rose-100 bg-white p-6">
        <h1 className="text-xl font-semibold text-slate-800">请先登录</h1>
        <p className="mt-2 text-sm text-slate-600">管理员页面需要先登录账号。</p>
        <button
          className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-[#4A3168] px-4 text-sm font-medium text-white"
          onClick={() => router.replace("/login?intent=admin")}
          type="button"
        >
          去登录
        </button>
      </div>
    );
  }

  if (resolvedAuthState === "forbidden") {
    return (
      <div className="rounded-2xl border border-rose-100 bg-white p-6">
        <h1 className="text-xl font-semibold text-slate-800">无管理员权限</h1>
        <p className="mt-2 text-sm text-slate-600">当前账号不在管理员白名单，请联系系统管理员配置。</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <AdminControlPanel
        error={admin.error}
        loading={admin.loading}
        onFetchSummary={() => void admin.fetchSummary()}
        success={admin.success}
      />

      <AdminPaymentOrdersPanel
        loading={admin.loading}
        onApprove={(orderId) => void admin.approvePaymentOrder(orderId)}
        onRefresh={() => void admin.fetchSummary()}
        onReject={(orderId) => void admin.rejectPaymentOrder(orderId)}
        orders={admin.paymentOrders}
      />

      <AdminPaymentConfigPanel
        loading={admin.loading}
        onChange={(patch) => admin.setPaymentConfig((prev) => ({ ...prev, ...patch }))}
        onReload={() => void admin.fetchSummary()}
        onSave={() => void admin.savePaymentConfig()}
        value={admin.paymentConfig}
      />

      <AdminPlanConfigPanel
        loading={admin.loading}
        onChange={admin.setPlanConfig}
        onReload={() => void admin.fetchSummary()}
        onSave={() => void admin.savePlanConfig()}
        value={admin.planConfig}
      />
    </div>
  );
}
