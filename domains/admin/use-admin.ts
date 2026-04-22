"use client";

import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/shared/lib/api";
import { useAuthSession } from "@/shared/lib/session-store";
import { useProfiles } from "@/shared/lib/use-client-token";
import {
  maskToken,
  type ActivityEvent,
  type EventLog,
  type PlanConfig,
  type PaymentConfig,
  type PaymentOrder,
  type SeedUsersResult,
  type Summary,
  type User,
} from "./admin-model";

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export function useAdmin() {
  const session = useAuthSession();
  const sessionToken = session?.sessionToken || "";
  const { profiles, setProfiles } = useProfiles();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<EventLog[]>([]);
  const [paymentOrders, setPaymentOrders] = useState<PaymentOrder[]>([]);
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>({});
  const [planConfig, setPlanConfig] = useState<PlanConfig>({ plans: [] });
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [echoToken, setEchoToken] = useState(() => profiles.girlfriend);
  const [echoText, setEchoText] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showTokens, setShowTokens] = useState(false);

  const eventStats = useMemo(() => {
    if (!summary) return [];
    return summary.events.map((item) => ({
      label: `${item.type} ${item.toolKey || ""}`.trim(),
      count: item.count,
    }));
  }, [summary]);

  useEffect(() => {
    if (!streaming) return;
    if (!sessionToken) {
      setStreaming(false);
      setError("请先登录管理员账号");
      return;
    }
    const url = new URL(`${apiBase}/api/event/stream`, window.location.origin);
    url.searchParams.set("sessionToken", sessionToken);
    const source = new EventSource(url.toString());
    source.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as ActivityEvent;
        setActivities((prev) => [data, ...prev].slice(0, 50));
      } catch {
        setActivities((prev) => [
          {
            type: "button_used",
            key: event.data,
            userId: 0,
            occurredAt: new Date().toISOString(),
          },
          ...prev,
        ]);
      }
    };
    source.onerror = () => {
      source.close();
      setStreaming(false);
      setError("实时流连接失败，请确认管理员账号权限和 API 地址");
    };
    return () => source.close();
  }, [sessionToken, streaming]);

  useEffect(() => {
    if (!profiles.girlfriend) return;
    if (!echoToken || echoToken === "girlfriend") {
      setEchoToken(profiles.girlfriend);
    }
  }, [profiles.girlfriend, echoToken]);

  function resetMessages() {
    setError("");
    setSuccess("");
  }

  function startStream() {
    resetMessages();
    setSuccess("实时流已开启");
    setStreaming(true);
  }

  function syncProfilesFromUsers(userList: User[]) {
    if (!userList.length) return;
    const next = { ...profiles };
    let changed = false;
    userList.forEach((user) => {
      if (user.role === "me" && user.token && user.token !== next.me) {
        next.me = user.token;
        changed = true;
      }
      if (user.role === "girlfriend" && user.token && user.token !== next.girlfriend) {
        next.girlfriend = user.token;
        changed = true;
      }
      if (user.role === "test" && user.token && user.token !== next.test) {
        next.test = user.token;
        changed = true;
      }
    });
    if (changed) setProfiles(next);
  }

  async function fetchSummary() {
    if (!sessionToken) {
      setError("请先登录管理员账号");
      return;
    }
    setLoading(true);
    resetMessages();
    try {
      const [data, userList, eventLogs, payments, config, plans] = await Promise.all([
        apiRequest<Summary>("/api/me/summary", {
          sessionToken,
        }),
        apiRequest<User[]>("/api/me/users", {
          sessionToken,
        }),
        apiRequest<EventLog[]>("/api/me/events", {
          sessionToken,
        }),
        apiRequest<PaymentOrder[]>("/api/me/payment-orders", {
          sessionToken,
        }),
        apiRequest<PaymentConfig>("/api/me/payment-config", {
          sessionToken,
        }),
        apiRequest<PlanConfig>("/api/me/plan-config", {
          sessionToken,
        }),
      ]);
      setSummary(data);
      setUsers(userList ?? []);
      setLogs(eventLogs ?? []);
      setPaymentOrders(payments ?? []);
      setPaymentConfig(config ?? {});
      setPlanConfig(plans ?? { plans: [] });
      syncProfilesFromUsers(userList ?? []);
      setSuccess("汇总已更新");
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载失败");
    } finally {
      setLoading(false);
    }
  }

  async function sendEcho() {
    if (!sessionToken) {
      setError("请先登录管理员账号");
      return;
    }
    if (!echoToken.trim() || !echoText.trim()) {
      setError("请填写 token 和回声内容");
      return;
    }
    resetMessages();
    try {
      await apiRequest("/api/echo", {
        sessionToken,
        body: { token: echoToken.trim(), text: echoText.trim() },
      });
      setEchoText("");
      await fetchSummary();
      setSuccess("回声已发送");
    } catch (err) {
      setError(err instanceof Error ? err.message : "发送失败");
    }
  }

  async function seedUsers() {
    if (!sessionToken) {
      setError("请先登录管理员账号");
      return;
    }
    resetMessages();
    try {
      const data = await apiRequest<SeedUsersResult>("/api/me/seed-users", {
        sessionToken,
        body: {},
        method: "POST",
      });
      setProfiles({
        me: data.me.token,
        girlfriend: data.girlfriend.token,
        test: data.test.token,
      });
      setSuccess("已生成三人 Token，已更新用户列表与首页入口");
      await fetchSummary();
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败");
    }
  }

  async function copyToken(value: string) {
    await navigator.clipboard.writeText(value);
  }

  async function approvePaymentOrder(orderId: number) {
    if (!sessionToken) {
      setError("请先登录管理员账号");
      return;
    }
    resetMessages();
    try {
      await apiRequest("/api/me/payment-orders/approve", {
        method: "POST",
        sessionToken,
        body: { orderId },
      });
      await fetchSummary();
      setSuccess("订单已审核通过并开通套餐");
    } catch (err) {
      setError(err instanceof Error ? err.message : "审核失败");
    }
  }

  async function rejectPaymentOrder(orderId: number) {
    if (!sessionToken) {
      setError("请先登录管理员账号");
      return;
    }
    resetMessages();
    try {
      await apiRequest("/api/me/payment-orders/reject", {
        method: "POST",
        sessionToken,
        body: { orderId },
      });
      await fetchSummary();
      setSuccess("订单已驳回");
    } catch (err) {
      setError(err instanceof Error ? err.message : "驳回失败");
    }
  }

  async function savePaymentConfig() {
    if (!sessionToken) {
      setError("请先登录管理员账号");
      return;
    }
    resetMessages();
    setLoading(true);
    try {
      const next = await apiRequest<PaymentConfig>("/api/me/payment-config", {
        method: "POST",
        sessionToken,
        body: paymentConfig,
      });
      setPaymentConfig(next || {});
      setSuccess("支付配置已保存");
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存配置失败");
    } finally {
      setLoading(false);
    }
  }

  async function savePlanConfig() {
    if (!sessionToken) {
      setError("请先登录管理员账号");
      return;
    }
    resetMessages();
    setLoading(true);
    try {
      const next = await apiRequest<PlanConfig>("/api/me/plan-config", {
        method: "POST",
        sessionToken,
        body: planConfig,
      });
      setPlanConfig(next || { plans: [] });
      setSuccess("套餐配置已保存");
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存套餐失败");
    } finally {
      setLoading(false);
    }
  }

  return {
    activities,
    copyToken,
    echoText,
    echoToken,
    error,
    eventStats,
    fetchSummary,
    loading,
    logs,
    paymentOrders,
    paymentConfig,
    planConfig,
    maskToken,
    approvePaymentOrder,
    seedUsers,
    rejectPaymentOrder,
    savePaymentConfig,
    savePlanConfig,
    sendEcho,
    setPaymentConfig,
    setPlanConfig,
    setEchoText,
    setEchoToken,
    setShowTokens,
    showTokens,
    startStream,
    streaming,
    success,
    summary,
    users,
  };
}
