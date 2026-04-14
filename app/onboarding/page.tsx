"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest, ApiClientError } from "../lib/api";
import { useAuthSession } from "../lib/session-store";
import {
  Button,
  Card,
  ChoicePill,
  FieldGroup,
  InfoPanel,
  NoticePanel,
  SectionHeading,
  SoftBadge,
} from "../components/ui";

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

const businessRoles = ["个体商家", "带货博主", "直播运营", "内容主理人"];
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

  const canSubmit = useMemo(
    () =>
      Boolean(
        form.nickname.trim() &&
          form.businessRole?.trim() &&
          form.industry?.trim() &&
          form.currentGoal?.trim(),
      ),
    [form],
  );

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
        <p className="text-soft text-sm">正在确认你的建档状态…</p>
      </Card>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 xl:grid-cols-[0.84fr_1.16fr]">
      <Card className="surface-card-strong rounded-[34px] p-6 sm:p-8">
        <div className="space-y-6">
          <SoftBadge tone="brand">首次建档</SoftBadge>
          <SectionHeading
            eyebrow="只补最重要的几项"
            title="先把你现在的经营状态说清楚"
            description="我们先不用问得很重。先把身份、主营类目和当前目标收好，后面的结果就会更贴近你。"
          />

          <div className="grid gap-3">
            {[
              ["你现在主要是谁", "比如个体商家、带货博主、直播运营。"],
              ["你现在主要卖什么", "先知道类目，标题和脚本会更贴近。"],
              ["你现在最想解决什么", "先知道目标，给你的第一轮就会更准。"],
            ].map(([title, description]) => (
              <InfoPanel
                key={title}
                className="surface-card-muted"
                description={description}
                title={title}
              />
            ))}
          </div>
        </div>
      </Card>

      <Card className="rounded-[34px] p-6 sm:p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <FieldGroup label="怎么称呼你">
              <input
                className="input-base"
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, nickname: event.target.value }))
                }
                placeholder="比如：阿遥"
                value={form.nickname}
              />
            </FieldGroup>

            <FieldGroup label="主营类目">
              <input
                className="input-base"
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, industry: event.target.value }))
                }
                placeholder="比如：家居、零食、个护"
                value={form.industry}
              />
            </FieldGroup>
          </div>

          <div className="space-y-3">
            <span className="text-strong text-sm font-semibold">你的身份</span>
            <div className="flex flex-wrap gap-3">
              {businessRoles.map((item) => (
                <ChoicePill
                  key={item}
                  active={form.businessRole === item}
                  onClick={() => setForm((prev) => ({ ...prev, businessRole: item }))}
                >
                  {item}
                </ChoicePill>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-strong text-sm font-semibold">当前目标</span>
            <div className="flex flex-wrap gap-3">
              {goals.map((item) => (
                <ChoicePill
                  key={item}
                  active={form.currentGoal === item}
                  onClick={() => setForm((prev) => ({ ...prev, currentGoal: item }))}
                >
                  {item}
                </ChoicePill>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <FieldGroup hint="选填" label="内容方向">
              <input
                className="input-base"
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, contentDirection: event.target.value }))
                }
                placeholder="比如：种草、直播、复盘"
                value={form.contentDirection}
              />
            </FieldGroup>
            <FieldGroup hint="选填" label="目标平台">
              <input
                className="input-base"
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, targetPlatform: event.target.value }))
                }
                placeholder="比如：小红书、抖音"
                value={form.targetPlatform}
              />
            </FieldGroup>
            <FieldGroup hint="选填" label="当前经验">
              <input
                className="input-base"
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, experienceLevel: event.target.value }))
                }
                placeholder="比如：刚开始、稳定更新中"
                value={form.experienceLevel}
              />
            </FieldGroup>
          </div>

          {error ? <NoticePanel tone="rose">{error}</NoticePanel> : null}

          <div className="flex flex-wrap items-center gap-3">
            <Button
              className="min-w-[160px] py-3.5 text-[15px]"
              disabled={!canSubmit || submitting}
              type="submit"
            >
              {submitting ? "正在保存资料…" : "进入工作台"}
            </Button>
            <div className="text-soft text-sm">先把最重要的几项填完就够了。</div>
          </div>
        </form>
      </Card>
    </div>
  );
}
