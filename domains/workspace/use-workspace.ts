"use client";

import { useEffect, useRef } from "react";
import { clearTrialDraft, readTrialDraft } from "@/shared/lib/trial-draft";
import { useWorkspaceBootstrap } from "./use-workspace-bootstrap";
import { useWorkspaceTools } from "./use-workspace-tools";

export function useWorkspace() {
  const bootstrap = useWorkspaceBootstrap();
  const toolsState = useWorkspaceTools(bootstrap.refreshEntitlement);
  const hasResumedDraftRef = useRef(false);
  const hasHandledContinueRef = useRef(false);
  const { resumeTrialDraft, selectTool, setTitleKeyword, setScriptKeyword, setRefineText, setCommissionPrice } = toolsState;

  // 处理从 /me 页跳转过来的继续生成参数（?continueFrom=xxx&keyword=xxx）
  useEffect(() => {
    if (hasHandledContinueRef.current) return;
    if (bootstrap.loading) return;
    hasHandledContinueRef.current = true;

    // 只在客户端读取 URL 参数（避免 SSR 问题）
    if (typeof window === "undefined") return;

    const sp = new URLSearchParams(window.location.search);
    const continueFrom = sp.get("continueFrom") as ("title" | "script" | "refine" | "commission" | null);
    const keyword = sp.get("keyword");
    if (!continueFrom || !keyword?.trim()) return;

    // 切换到对应工具并预填关键词
    selectTool(continueFrom);
    switch (continueFrom) {
      case "title":
        setTitleKeyword(keyword.trim());
        break;
      case "script":
        setScriptKeyword(keyword.trim());
        break;
      case "refine":
        setRefineText(keyword.trim());
        break;
      case "commission":
        setCommissionPrice(keyword.trim());
        break;
    }

    // 清理 URL 参数，避免刷新后重复预填
    window.history.replaceState({}, "", "/workspace");
  }, [bootstrap.loading, selectTool, setTitleKeyword, setScriptKeyword, setRefineText, setCommissionPrice]);

  useEffect(() => {
    if (hasResumedDraftRef.current) return;
    if (bootstrap.loading || bootstrap.pageError || !bootstrap.me) return;

    const draft = readTrialDraft();
    hasResumedDraftRef.current = true;
    if (!draft?.prompt.trim()) return;

    clearTrialDraft();
    void resumeTrialDraft(draft.prompt);
  }, [bootstrap.loading, bootstrap.me, bootstrap.pageError, resumeTrialDraft]);

  return { ...bootstrap, ...toolsState };
}
