"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest, ApiClientError } from "../lib/api";
import { useAuthSession } from "../lib/session-store";
import { Button, Card } from "../components/ui";

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
  contentDirection?: string;
  targetPlatform?: string;
  experienceLevel?: string;
};

const businessRoles = [
  { id: "individual", label: "个体商家", icon: "🛍️" },
  { id: "streamer", label: "直播主播", icon: "📱" },
  { id: "content", label: "内容运营", icon: "✍️" },
  { id: "team", label: "团队主理人", icon: "👥" },
  { id: "other", label: "其他", icon: "✨" },
];

const industries = [
  { id: "beauty", label: "美妆护肤", icon: "💄" },
  { id: "fashion", label: "服装饰品", icon: "👗" },
  { id: "food", label: "食品饮料", icon: "🥤" },
  { id: "digital", label: "数码电器", icon: "📱" },
  { id: "home", label: "家居生活", icon: "🪑" },
  { id: "education", label: "知识教育", icon: "📘" },
  { id: "service", label: "服务行业", icon: "🤝" },
  { id: "other", label: "其他", icon: "✨" },
];

const INDUSTRY_DELIMITER = "、";

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
    contentDirection: "",
    targetPlatform: "",
    experienceLevel: "",
  });

  const selectedIndustries = useMemo(
    () =>
      form.industry
        ?.split(INDUSTRY_DELIMITER)
        .map((item) => item.trim())
        .filter(Boolean) ?? [],
    [form.industry],
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

  const canSubmit = useMemo(
    () =>
      Boolean(
        form.nickname.trim() &&
          form.businessRole?.trim() &&
          selectedIndustries.length,
      ),
    [form, selectedIndustries.length],
  );

  function toggleIndustry(industry: string) {
    setForm((prev) => {
      const selected = prev.industry
        ?.split(INDUSTRY_DELIMITER)
        .map((item) => item.trim())
        .filter(Boolean) ?? [];
      const next = selected.includes(industry)
        ? selected.filter((item) => item !== industry)
        : [...selected, industry];

      return {
        ...prev,
        industry: next.join(INDUSTRY_DELIMITER),
      };
    });
  }

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
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
          <p className="text-soft text-sm">正在确认你的建档状态…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50/50 to-white">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-strong mb-3 text-2xl font-semibold sm:text-3xl">
            很高兴认识你！
          </h1>
          <p className="text-soft text-base">
            为了更好地帮助你生成内容，我们想快速了解一下你的情况。
            只需要1分钟 · 随时可以修改
          </p>
        </div>

        <div className="mb-6 flex justify-center gap-2">
          <div className="h-2 w-2 rounded-full bg-brand-500" />
          <div className="h-2 w-2 rounded-full bg-gray-300" />
          <div className="h-2 w-2 rounded-full bg-gray-300" />
        </div>

        <Card className="rounded-2xl p-6 sm:p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-strong text-sm font-medium">
                怎么称呼你
                <span className="text-rose-500">*</span>
              </label>
              <input
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-base transition-colors placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, nickname: event.target.value }))
                }
                placeholder="比如：阿遥"
                value={form.nickname}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-white text-xs font-bold">
                  1
                </div>
                <label className="text-strong text-sm font-medium">
                  你现在主要是谁？
                </label>
              </div>
              <p className="text-soft text-xs ml-8">
                帮助我们了解你的角色定位
              </p>
              <div className="grid grid-cols-2 gap-2">
                {businessRoles.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, businessRole: item.label }))}
                    className={`rounded-lg border px-4 py-3 text-sm font-medium transition-all ${
                      form.businessRole === item.label
                        ? "border-[#4A3168] bg-[#F5F3F7] text-[#4A3168] shadow-sm"
                        : "border-[rgba(0,0,0,0.08)] bg-white text-[#3F3F46] hover:bg-gray-50"
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-white text-xs font-bold">
                  2
                </div>
                <label className="text-strong text-sm font-medium">
                  你卖什么或做什么内容？
                </label>
                <span className="rounded-full bg-[rgba(112,70,214,0.08)] px-2 py-0.5 text-[11px] font-medium text-(--primary-700)">
                  可多选
                </span>
              </div>
              <p className="text-soft text-xs ml-8">
                让AI更懂你的业务领域，适合同时经营多个品类的主播
              </p>
              <div className="ml-8 rounded-2xl border border-[rgba(88,51,175,0.08)] bg-[rgba(248,246,255,0.85)] px-4 py-3">
                <p className="text-sm font-medium text-[#4A3168]">
                  多品类经营也没关系
                </p>
                <p className="mt-1 text-xs leading-6 text-[#616479]">
                  可以按你现在正在卖的主营方向多选，后续进入工作台后也可以继续调整。
                </p>
              </div>
              {selectedIndustries.length ? (
                <div className="ml-8 rounded-2xl border border-[#E6DEF7] bg-[#FAF8FF] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-medium text-(--primary-700)">
                      已选择 {selectedIndustries.length} 项主营方向
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          industry: "",
                        }))
                      }
                      className="text-xs font-medium text-[#7D7E8E] hover:text-[#4A3168]"
                    >
                      清空
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedIndustries.map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-[#4A3168] shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
              <div className="grid grid-cols-2 gap-2">
                {industries.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleIndustry(item.label)}
                    className={`rounded-xl border px-4 py-3.5 text-sm font-medium transition-all ${
                      selectedIndustries.includes(item.label)
                        ? "border-[#4A3168] bg-[#F5F3F7] text-[#4A3168] shadow-sm"
                        : "border-[rgba(0,0,0,0.08)] bg-white text-[#3F3F46] hover:border-[rgba(88,51,175,0.18)] hover:bg-gray-50"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {error ? (
              <div className="rounded-lg bg-rose-50 p-4 text-rose-600 text-sm">
                {error}
              </div>
            ) : null}

            <div className="pt-4">
              <Button
                className="w-full rounded-lg bg-brand-500 px-6 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-brand-600 hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                disabled={!canSubmit || submitting}
                type="submit"
              >
                {submitting ? "正在保存资料…" : "进入工作台"}
              </Button>
              <p className="text-soft mt-3 text-center text-sm">
                带有 * 的为必填项
              </p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
