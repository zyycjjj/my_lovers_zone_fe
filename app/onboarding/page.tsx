"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest, ApiClientError } from "../lib/api";
import { useAuthSession } from "../lib/session-store";
import { Button, Card, SectionHeading, SoftBadge } from "../components/ui";

type OnboardingStatus = {
  completed: boolean;
  profileExists: boolean;
  workspaceId?: number;
  nextStep: string;
};

type OnboardingPayload = {
  nickname: string;
  businessRole?: string;
  industry?: string;
  currentGoal?: string;
  contentDirection?: string;
  targetPlatform?: string;
  experienceLevel?: string;
};

const businessRoles = ["商家", "主播", "运营", "主理人"];
const goals = ["起号", "提升转化", "稳定更新", "补内容节奏"];

export default function OnboardingPage() {
  const router = useRouter();
  const session = useAuthSession();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<OnboardingPayload>({
    nickname: "",
    businessRole: "",
    industry: "",
    currentGoal: "",
    contentDirection: "",
    targetPlatform: "",
    experienceLevel: "",
  });

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

  const canSubmit = useMemo(() => {
    return (
      form.nickname.trim() &&
      form.businessRole?.trim() &&
      form.industry?.trim() &&
      form.currentGoal?.trim()
    );
  }, [form]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
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
          currentGoal: form.currentGoal?.trim(),
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

  if (loading) {
    return (
      <Card className="mx-auto max-w-3xl rounded-[32px] p-8">
        <p className="text-sm text-[--text-soft]">正在确认你的建档状态…</p>
      </Card>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.84fr_1.16fr]">
      <Card className="rounded-[32px]">
        <div className="space-y-5">
          <SoftBadge tone="brand">首次建档</SoftBadge>
          <SectionHeading
            eyebrow="首次建档"
            title="先补 3 项就够了"
            description="先把最影响结果的内容补上：你的身份、主营类目和当前目标。这样后面给你的结果会更贴近。"
          />

          <div className="space-y-3 rounded-3xl border border-[--border-soft] bg-[rgba(255,255,255,0.8)] p-5">
            <div className="text-sm font-semibold text-[--text-strong]">
              为什么先收这几项
            </div>
            <div className="text-sm leading-7 text-[--text-soft]">
              先知道你是谁、在做什么、眼下最想解决什么，就够开始第一轮了。
            </div>
          </div>
        </div>
      </Card>

      <Card className="rounded-[32px]">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-[--text-strong]">
                你想我怎么称呼你
              </span>
              <input
                className="w-full rounded-2xl border border-[--border-soft] bg-white/80 px-4 py-3 text-sm text-[--text-strong] outline-none placeholder:text-[--text-muted] focus:border-[rgba(191,92,49,0.28)]"
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, nickname: event.target.value }))
                }
                placeholder="比如：阿遥"
                value={form.nickname}
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-[--text-strong]">
                主营类目
              </span>
              <input
                className="w-full rounded-2xl border border-[--border-soft] bg-white/80 px-4 py-3 text-sm text-[--text-strong] outline-none placeholder:text-[--text-muted] focus:border-[rgba(191,92,49,0.28)]"
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, industry: event.target.value }))
                }
                placeholder="比如：家居、个护、零食"
                value={form.industry}
              />
            </label>
          </div>

          <div className="space-y-3">
            <span className="text-sm font-semibold text-[--text-strong]">
              你的身份
            </span>
            <div className="flex flex-wrap gap-3">
              {businessRoles.map((item) => {
                const active = form.businessRole === item;
                return (
                  <button
                    key={item}
                    className={`rounded-full border px-4 py-2 text-sm ${
                      active
                        ? "border-[rgba(191,92,49,0.22)] bg-[--brand-soft] text-[--brand-ink]"
                        : "border-[--border-soft] bg-white/70 text-[--text-soft]"
                    }`}
                    onClick={() => setForm((prev) => ({ ...prev, businessRole: item }))}
                    type="button"
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-sm font-semibold text-[--text-strong]">
              当前目标
            </span>
            <div className="flex flex-wrap gap-3">
              {goals.map((item) => {
                const active = form.currentGoal === item;
                return (
                  <button
                    key={item}
                    className={`rounded-full border px-4 py-2 text-sm ${
                      active
                        ? "border-[rgba(191,92,49,0.22)] bg-[--brand-soft] text-[--brand-ink]"
                        : "border-[--border-soft] bg-white/70 text-[--text-soft]"
                    }`}
                    onClick={() => setForm((prev) => ({ ...prev, currentGoal: item }))}
                    type="button"
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm text-[--text-soft]">内容方向</span>
              <input
                className="w-full rounded-2xl border border-[--border-soft] bg-white/80 px-4 py-3 text-sm text-[--text-strong] outline-none placeholder:text-[--text-muted] focus:border-[rgba(191,92,49,0.28)]"
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    contentDirection: event.target.value,
                  }))
                }
                placeholder="选填"
                value={form.contentDirection}
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm text-[--text-soft]">目标平台</span>
              <input
                className="w-full rounded-2xl border border-[--border-soft] bg-white/80 px-4 py-3 text-sm text-[--text-strong] outline-none placeholder:text-[--text-muted] focus:border-[rgba(191,92,49,0.28)]"
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    targetPlatform: event.target.value,
                  }))
                }
                placeholder="选填"
                value={form.targetPlatform}
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm text-[--text-soft]">当前经验</span>
              <input
                className="w-full rounded-2xl border border-[--border-soft] bg-white/80 px-4 py-3 text-sm text-[--text-strong] outline-none placeholder:text-[--text-muted] focus:border-[rgba(191,92,49,0.28)]"
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    experienceLevel: event.target.value,
                  }))
                }
                placeholder="选填"
                value={form.experienceLevel}
              />
            </label>
          </div>

          {error ? (
            <div className="rounded-2xl border border-[rgba(191,92,49,0.18)] bg-[--brand-soft] px-4 py-4 text-sm leading-7 text-[--brand-ink]">
              {error}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button disabled={!canSubmit || submitting} type="submit">
              {submitting ? "正在保存并进入工作台…" : "保存并开始"}
            </Button>
            <Button
              onClick={() => router.push("/workspace")}
              type="button"
              variant="secondary"
            >
              先去看当前工作台
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
