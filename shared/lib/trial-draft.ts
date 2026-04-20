"use client";

export type TrialDraftSnapshot = {
  prompt: string;
  updatedAt: number;
  source: "experience_page";
};

const TRIAL_DRAFT_KEY = "memory.trialDraft";

export function saveTrialDraft(prompt: string) {
  if (typeof window === "undefined") return;

  window.sessionStorage.setItem(
    TRIAL_DRAFT_KEY,
    JSON.stringify({
      prompt,
      updatedAt: Date.now(),
      source: "experience_page",
    } satisfies TrialDraftSnapshot),
  );
}

export function readTrialDraft() {
  if (typeof window === "undefined") return null;

  const raw = window.sessionStorage.getItem(TRIAL_DRAFT_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<TrialDraftSnapshot>;
    if (!parsed.prompt || typeof parsed.prompt !== "string") return null;

    return {
      prompt: parsed.prompt,
      updatedAt: typeof parsed.updatedAt === "number" ? parsed.updatedAt : Date.now(),
      source: "experience_page" as const,
    };
  } catch {
    return null;
  }
}

export function clearTrialDraft() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(TRIAL_DRAFT_KEY);
}
