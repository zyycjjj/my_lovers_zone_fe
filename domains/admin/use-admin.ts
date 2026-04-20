"use client";

import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/shared/lib/api";
import { useProfiles } from "@/shared/lib/use-client-token";
import {
  adminPassStorageKey,
  maskToken,
  type ActivityEvent,
  type EventLog,
  type PaymentOrder,
  type SeedUsersResult,
  type Summary,
  type User,
} from "./admin-model";

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export function useAdmin() {
  const { profiles, setProfiles } = useProfiles();
  const [adminPass, setAdminPass] = useState("");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<EventLog[]>([]);
  const [paymentOrders, setPaymentOrders] = useState<PaymentOrder[]>([]);
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
    if (typeof window === "undefined") return;
    if (adminPass) return;
    const stored = localStorage.getItem(adminPassStorageKey);
    if (stored) setAdminPass(stored);
  }, [adminPass]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (adminPass) {
      localStorage.setItem(adminPassStorageKey, adminPass);
    } else {
      localStorage.removeItem(adminPassStorageKey);
    }
  }, [adminPass]);

  useEffect(() => {
    if (!streaming) return;
    const url = new URL(`${apiBase}/api/event/stream`, window.location.origin);
    const trimmedPass = adminPass.trim();
    if (trimmedPass) url.searchParams.set("adminPass", trimmedPass);
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
      setError("实时流连接失败，请确认 Admin Pass 和 API 地址");
    };
    return () => source.close();
  }, [adminPass, streaming]);

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
    setLoading(true);
    resetMessages();
    try {
      const trimmedPass = adminPass.trim();
      const [data, userList, eventLogs, payments] = await Promise.all([
        apiRequest<Summary>("/api/me/summary", {
          adminPass: trimmedPass || undefined,
        }),
        apiRequest<User[]>("/api/me/users", {
          adminPass: trimmedPass || undefined,
        }),
        apiRequest<EventLog[]>("/api/me/events", {
          adminPass: trimmedPass || undefined,
        }),
        apiRequest<PaymentOrder[]>("/api/me/payment-orders", {
          adminPass: trimmedPass || undefined,
        }),
      ]);
      setSummary(data);
      setUsers(userList ?? []);
      setLogs(eventLogs ?? []);
      setPaymentOrders(payments ?? []);
      syncProfilesFromUsers(userList ?? []);
      setSuccess("汇总已更新");
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载失败");
    } finally {
      setLoading(false);
    }
  }

  async function sendEcho() {
    if (!echoToken.trim() || !echoText.trim()) {
      setError("请填写 token 和回声内容");
      return;
    }
    resetMessages();
    try {
      const trimmedPass = adminPass.trim();
      await apiRequest("/api/echo", {
        adminPass: trimmedPass || undefined,
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
    resetMessages();
    try {
      const trimmedPass = adminPass.trim();
      const data = await apiRequest<SeedUsersResult>("/api/me/seed-users", {
        adminPass: trimmedPass || undefined,
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
    resetMessages();
    try {
      const trimmedPass = adminPass.trim();
      await apiRequest("/api/me/payment-orders/approve", {
        method: "POST",
        adminPass: trimmedPass || undefined,
        body: { orderId },
      });
      await fetchSummary();
      setSuccess("订单已审核通过并开通套餐");
    } catch (err) {
      setError(err instanceof Error ? err.message : "审核失败");
    }
  }

  async function rejectPaymentOrder(orderId: number) {
    resetMessages();
    try {
      const trimmedPass = adminPass.trim();
      await apiRequest("/api/me/payment-orders/reject", {
        method: "POST",
        adminPass: trimmedPass || undefined,
        body: { orderId },
      });
      await fetchSummary();
      setSuccess("订单已驳回");
    } catch (err) {
      setError(err instanceof Error ? err.message : "驳回失败");
    }
  }

  return {
    activities,
    adminPass,
    copyToken,
    echoText,
    echoToken,
    error,
    eventStats,
    fetchSummary,
    loading,
    logs,
    paymentOrders,
    maskToken,
    approvePaymentOrder,
    seedUsers,
    rejectPaymentOrder,
    sendEcho,
    setAdminPass,
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
