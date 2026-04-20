"use client";

import { AdminControlPanel } from "./admin-control-panel";
import { AdminEchoPanel } from "./admin-echo-panel";
import { AdminLiveActivity } from "./admin-live-activity";
import { AdminPaymentOrdersPanel } from "./admin-payment-orders-panel";
import { AdminSummaryPanel } from "./admin-summary-panel";
import { useAdmin } from "./use-admin";

export default function AdminScreen() {
  const admin = useAdmin();

  return (
    <div className="grid gap-6">
      <AdminControlPanel
        adminPass={admin.adminPass}
        error={admin.error}
        loading={admin.loading}
        onAdminPassChange={admin.setAdminPass}
        onFetchSummary={() => void admin.fetchSummary()}
        onSeedUsers={() => void admin.seedUsers()}
        onStartStream={() => admin.startStream()}
        streaming={admin.streaming}
        success={admin.success}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <AdminLiveActivity activities={admin.activities} />
        <AdminEchoPanel
          echoText={admin.echoText}
          echoToken={admin.echoToken}
          onEchoTextChange={admin.setEchoText}
          onEchoTokenChange={admin.setEchoToken}
          onSend={() => void admin.sendEcho()}
        />
      </div>

      <AdminSummaryPanel
        eventStats={admin.eventStats}
        logs={admin.logs}
        maskToken={admin.maskToken}
        onCopyToken={(value) => void admin.copyToken(value)}
        onToggleShowTokens={() => admin.setShowTokens((prev) => !prev)}
        showTokens={admin.showTokens}
        summary={admin.summary}
        users={admin.users}
      />

      <AdminPaymentOrdersPanel
        loading={admin.loading}
        onApprove={(orderId) => void admin.approvePaymentOrder(orderId)}
        onRefresh={() => void admin.fetchSummary()}
        onReject={(orderId) => void admin.rejectPaymentOrder(orderId)}
        orders={admin.paymentOrders}
      />
    </div>
  );
}
