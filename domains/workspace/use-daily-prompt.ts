"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ContentStats } from "@/domains/me/me-screen";

const STORAGE_KEY = "memory_last_visit_date";

function getTodayKey() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function getLastVisitDate(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY);
}

function saveVisitDate(date: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, date);
}

export function useDailyPrompt(stats: ContentStats | null) {
  const [showPrompt, setShowPrompt] = useState(false);

  const promptMessage = useMemo(() => {
    if (!stats || !stats.latestAsset) return null;

    const toolLabelMap: Record<string, string> = {
      title: "标题生成",
      script: "脚本生成",
      refine: "话术提炼",
      commission: "佣金测算",
    };

    const toolLabel = toolLabelMap[stats.latestAsset.toolKey] || "内容生成";

    if (stats.todayCreated === 0 && stats.yesterdayCreated > 0) {
      return {
        title: "欢迎回来",
        text: `昨天你生成了 ${stats.yesterdayCreated} 条内容，上次做了「${stats.latestAsset.title || toolLabel}」。今天继续吗？`,
        actionLabel: "继续生成",
        actionHref: null,
      };
    }

    if (stats.totalAll > 0 && stats.todayCreated === 0) {
      return {
        title: "好久不见",
        text: `你已经保存了 ${stats.totalAll} 条内容。今天先生成一条，保持节奏。`,
        actionLabel: "开始生成",
        actionHref: null,
      };
    }

    return null;
  }, [stats]);

  const checkAndShow = useCallback(() => {
    const lastVisit = getLastVisitDate();
    const today = getTodayKey();

    if (!lastVisit) {
      // First visit ever — don't show "welcome back"
      saveVisitDate(today);
      setShowPrompt(false);
      return;
    }

    if (lastVisit === today) {
      // Already visited today
      setShowPrompt(false);
      return;
    }

    // New day visit — show prompt
    saveVisitDate(today);
    setShowPrompt(true);
  }, []);

  const dismiss = useCallback(() => setShowPrompt(false), []);

  useEffect(() => {
    checkAndShow();
  }, [checkAndShow]);

  return { showPrompt, promptMessage, dismiss };
}
