"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiClientError, apiRequest } from "@/shared/lib/api";
import { useAuthSession } from "@/shared/lib/session-store";
import {
  emptyOnboardingForm,
  industryDelimiter,
  splitIndustries,
  type OnboardingPayload,
  type OnboardingStatus,
} from "./model";

export function useOnboardingPage() {
  const router = useRouter();
  const session = useAuthSession();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<OnboardingPayload>(emptyOnboardingForm);

  const selectedIndustries = useMemo(() => splitIndustries(form.industry), [form.industry]);
  const canSubmit = useMemo(
    () => Boolean(form.nickname.trim() && form.businessRole?.trim() && selectedIndustries.length),
    [form, selectedIndustries.length],
  );

  useEffect(() => {
    if (!session?.sessionToken) {
      router.replace("/login");
      return;
    }

    let active = true;
    apiRequest<OnboardingStatus>("/api/onboarding/status")
      .then((status) => {
        if (!active) return;
        if (status.completed) {
          router.replace("/workspace");
          return;
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "建档状态获取失败");
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [router, session?.sessionToken]);

  function updateField<Key extends keyof OnboardingPayload>(key: Key, value: OnboardingPayload[Key]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleIndustry(industry: string) {
    const next = selectedIndustries.includes(industry)
      ? selectedIndustries.filter((item) => item !== industry)
      : [...selectedIndustries, industry];
    updateField("industry", next.join(industryDelimiter));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError("");

    try {
      await apiRequest("/api/onboarding/profile", {
        method: "POST",
        body: {
          nickname: form.nickname.trim(),
          businessRole: form.businessRole?.trim(),
          industry: form.industry?.trim(),
          contentDirection: form.contentDirection?.trim() || undefined,
          targetPlatform: form.targetPlatform?.trim() || undefined,
          experienceLevel: form.experienceLevel?.trim() || undefined,
        },
      });
      router.replace("/workspace");
    } catch (err) {
      setError(
        err instanceof ApiClientError
          ? err.message
          : err instanceof Error
            ? err.message
            : "建档保存失败",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return {
    canSubmit,
    error,
    form,
    loading,
    selectedIndustries,
    submitting,
    submit,
    toggleIndustry,
    updateField,
  };
}
