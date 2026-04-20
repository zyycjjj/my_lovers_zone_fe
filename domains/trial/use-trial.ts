"use client";

import { useMemo, useRef, useState } from "react";
import { ApiClientError, apiRequest } from "@/shared/lib/api";
import { saveTrialDraft } from "@/shared/lib/trial-draft";
import { examplePrompts, formatMonthDay, maxPromptLength, promptTemplates, type TrialPreview } from "./trial-model";

export function useTrial() {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [prompt, setPrompt] = useState("");
  const [preview, setPreview] = useState<TrialPreview | null>(null);
  const [previewError, setPreviewError] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);

  const todayLabel = useMemo(() => formatMonthDay(new Date()), []);
  const count = prompt.length;
  const activeExample = useMemo(
    () => examplePrompts.find((item) => promptTemplates[item] === prompt) ?? "",
    [prompt],
  );
  const canContinue = prompt.trim().length > 0;

  function applyExample(label: string) {
    setPrompt(promptTemplates[label] ?? label);
    setPreview(null);
    setPreviewError("");
    textareaRef.current?.focus();
  }

  async function generate() {
    if (!canContinue) return;

    saveTrialDraft(prompt);

    setPreviewLoading(true);
    setPreviewError("");

    try {
      const result = await apiRequest<TrialPreview>("/api/trial/preview", {
        method: "POST",
        timeoutMs: 25000,
        body: {
          prompt: prompt.trim(),
        },
        retryOnUnauthorized: false,
      });
      setPreview(result);
    } catch (error) {
      setPreviewError(
        error instanceof ApiClientError
          ? error.message
          : error instanceof Error
            ? error.message
            : "这轮体验预览暂时没有跑通，请稍后再试。",
      );
    } finally {
      setPreviewLoading(false);
    }
  }

  function updatePrompt(value: string) {
    setPrompt(value);
    setPreview(null);
    setPreviewError("");
  }

  return {
    activeExample,
    applyExample,
    canContinue,
    count,
    generate,
    maxPromptLength,
    prompt,
    preview,
    previewError,
    previewLoading,
    setPrompt: updatePrompt,
    textareaRef,
    todayLabel,
  };
}
