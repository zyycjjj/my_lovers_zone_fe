"use client";

import { useEffect, useRef } from "react";
import { clearTrialDraft, readTrialDraft } from "@/shared/lib/trial-draft";
import { useWorkspaceBootstrap } from "./use-workspace-bootstrap";
import { useWorkspaceTools } from "./use-workspace-tools";

export function useWorkspace() {
  const bootstrap = useWorkspaceBootstrap();
  const toolsState = useWorkspaceTools(bootstrap.refreshEntitlement);
  const hasResumedDraftRef = useRef(false);
  const { resumeTrialDraft } = toolsState;

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
