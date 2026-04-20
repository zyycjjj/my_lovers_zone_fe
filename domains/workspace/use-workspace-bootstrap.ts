"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiClientError, apiRequest } from "@/shared/lib/api";
import { clearAuthSession, useAuthSession } from "@/shared/lib/session-store";
import type { AuthMe, RoutingResult, WorkspaceList, WorkspaceSummary } from "./workspace-model";

type Subscription = {
  id: number;
  planKey: "experience" | "pro" | "team";
  status: string;
  expiredAt?: string | null;
};

type PendingSummary = {
  count: number;
  latest?: {
    id: number;
    orderNo: string;
    status: "pending" | "paid" | "activated" | "rejected" | "refunded";
  } | null;
};

export function useWorkspaceBootstrap() {
  const router = useRouter();
  const session = useAuthSession();

  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [me, setMe] = useState<AuthMe | null>(null);
  const [workspaces, setWorkspaces] = useState<WorkspaceSummary[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [pendingSummary, setPendingSummary] = useState<PendingSummary | null>(null);

  useEffect(() => {
    if (!session?.sessionToken) {
      router.replace("/login");
      return;
    }

    let active = true;

    Promise.all([
      apiRequest<AuthMe>("/api/auth/me"),
      apiRequest<RoutingResult>("/api/auth/routing"),
      apiRequest<WorkspaceList>("/api/workspaces"),
      apiRequest<Subscription | null>("/api/payments/subscription/me"),
      apiRequest<PendingSummary>("/api/payments/pending/me"),
    ])
      .then(([nextMe, nextRouting, list, sub, pending]) => {
        if (!active) return;
        setMe(nextMe);
        setWorkspaces(list.items || []);
        setSubscription(sub);
        setPendingSummary(pending);

        if (nextRouting.routeType === "onboarding") {
          router.replace("/onboarding");
          return;
        }
        if (nextRouting.routeType === "workspace_select") {
          router.replace("/workspace/select");
          return;
        }

        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setPageError(
          err instanceof ApiClientError
            ? err.message
            : err instanceof Error
              ? err.message
              : "页面加载失败，请稍后再试",
        );
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [router, session?.sessionToken]);

  const displayName = useMemo(() => {
    if (!me) return "";
    return me.account.displayName || me.account.phone || `用户 ${me.account.id}`;
  }, [me]);

  async function handleLogout() {
    try {
      await apiRequest("/api/auth/logout", {
        method: "POST",
        body: { allDevices: false },
      });
    } catch {}
    clearAuthSession();
    router.replace("/login");
  }

  return {
    displayName,
    handleLogout,
    loading,
    me,
    pageError,
    pendingSummary,
    subscription,
    workspaces,
  };
}
