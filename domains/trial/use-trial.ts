"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthSession } from "@/shared/lib/session-store";
import { examplePrompts, formatMonthDay, maxPromptLength, promptTemplates, saveTrialDraft } from "./trial-model";

export function useTrial() {
  const router = useRouter();
  const session = useAuthSession();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [prompt, setPrompt] = useState("");

  const todayLabel = useMemo(() => formatMonthDay(new Date()), []);
  const count = prompt.length;
  const activeExample = useMemo(
    () => examplePrompts.find((item) => promptTemplates[item] === prompt) ?? "",
    [prompt],
  );
  const canContinue = prompt.trim().length > 0;

  function applyExample(label: string) {
    setPrompt(promptTemplates[label] ?? label);
    textareaRef.current?.focus();
  }

  function generate() {
    if (!canContinue) return;

    saveTrialDraft(prompt);

    if (session?.sessionToken) {
      router.push("/workspace");
      return;
    }

    router.push("/login?intent=trial");
  }

  return {
    activeExample,
    applyExample,
    canContinue,
    count,
    generate,
    maxPromptLength,
    prompt,
    setPrompt,
    textareaRef,
    todayLabel,
  };
}

