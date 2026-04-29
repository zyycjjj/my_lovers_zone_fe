"use client";

import { useCallback, useRef } from "react";
import { apiRequest } from "@/shared/lib/api";

type TrackAction =
  | "content.saved"
  | "content.completed"
  | "content.copied"
  | "content.continued"
  | "content.deleted"
  | "tool.used"
  | "goal.selected"
  | "plan.created"
  | "task.completed"
  | "quota.checked"
  | "upgrade.clicked";

interface TrackOptions {
  toolKey?: string;
  metadata?: Record<string, string | number | boolean>;
}

// 本地缓存队列，用于离线或失败重试
const pendingQueue: Array<{ action: TrackAction; options?: TrackOptions }> = [];

let flushTimeout: ReturnType<typeof setTimeout> | null = null;

async function flushQueue() {
  if (pendingQueue.length === 0) return;

  const batch = [...pendingQueue];
  pendingQueue.length = 0;

  try {
    // 批量发送事件
    await Promise.all(
      batch.map((item) =>
        apiRequest("/api/event", {
          method: "POST",
          body: {
            type: item.action.includes(".") ? "button_used" : "tool_used",
            key: item.action,
          },
        }).catch(() => {
          // 失败的重新加入队列（最多保留100条）
          if (pendingQueue.length < 100) {
            pendingQueue.push(item);
          }
        }),
      ),
    );
  } catch {
    // 网络错误时，将所有事件重新放回队列
    if (batch.length + pendingQueue.length < 100) {
      pendingQueue.push(...batch);
    }
  }
}

function scheduleFlush() {
  if (flushTimeout) return;
  flushTimeout = setTimeout(() => {
    flushTimeout = null;
    flushQueue().catch(() => {});
  }, 1000); // 1秒后批量发送
}

/**
 * 行为追踪 Hook
 * 用于记录用户行为数据，支持：
 * - 内容操作（保存、完成、复制、继续生成、删除）
 * - 工具使用（标题、脚本、优化、转化）
 * - 目标选择
 * - 计划创建和任务完成
 */
export function useTracking() {
  const isTracking = useRef(true);

  const track = useCallback((action: TrackAction, options?: TrackOptions) => {
    if (!isTracking.current) return;

    // 添加到队列
    pendingQueue.push({ action, options });

    // 调度批量发送
    scheduleFlush();

    // 开发环境下打印日志
    if (process.env.NODE_ENV === "development") {
      console.log(`[Track] ${action}`, options);
    }
  }, []);

  // 快捷方法
  const trackContentSaved = useCallback(
    (toolKey?: string) => track("content.saved", { toolKey }),
    [track],
  );

  const trackContentCompleted = useCallback(
    (toolKey?: string) => track("content.completed", { toolKey }),
    [track],
  );

  const trackContentCopied = useCallback(
    (toolKey?: string) => track("content.copied", { toolKey }),
    [track],
  );

  const trackContentContinued = useCallback(
    (toolKey?: string) => track("content.continued", { toolKey }),
    [track],
  );

  const trackContentDeleted = useCallback(
    () => track("content.deleted"),
    [track],
  );

  const trackToolUsed = useCallback(
    (toolKey: string) => track(`tool.${toolKey}used` as any, { toolKey }),
    [track],
  );

  const trackGoalSelected = useCallback(
    (goal: string) => track("goal.selected", { metadata: { goal } }),
    [track],
  );

  const trackPlanCreated = useCallback(
    () => track("plan.created"),
    [track],
  );

  const trackTaskCompleted = useCallback(
    (dayNumber: number) =>
      track("task.completed", { metadata: { dayNumber } }),
    [track],
  );

  // 页面卸载前刷新队列
  const flushBeforeUnload = useCallback(() => {
    if (pendingQueue.length > 0) {
      // 使用 sendBeacon 确保数据发送
      const payload = JSON.stringify(pendingQueue.map(item => ({
        type: item.action.includes(".") ? "button_used" : "tool_used",
        key: item.action,
      })));
      
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          "/api/event",
          new Blob([payload], { type: "application/json" }),
        );
      }
      pendingQueue.length = 0;
    }
  }, []);

  return {
    track,
    trackContentSaved,
    trackContentCompleted,
    trackContentCopied,
    trackContentContinued,
    trackContentDeleted,
    trackToolUsed,
    trackGoalSelected,
    trackPlanCreated,
    trackTaskCompleted,
    flushBeforeUnload,
  };
}
