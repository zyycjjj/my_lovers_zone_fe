"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest, ApiClientError } from "../lib/api";
import { clearAuthSession, useAuthSession } from "../lib/session-store";
import { Button, ButtonLink, Card, SectionHeading, SoftBadge } from "../components/ui";

type AuthMe = {
  account: {
    id: number;
    phone?: string;
    displayName?: string;
    status: string;
  };
  currentWorkspace: WorkspaceSummary | null;
  onboardingCompleted: boolean;
};

type WorkspaceSummary = {
  id: number;
  name: string;
  type: string;
  role: string;
  status: string;
};

type RoutingResult = {
  routeType: "onboarding" | "workspace_home" | "workspace_select";
  workspaceId?: number;
  reason: string;
};

type WorkspaceList = {
  items: WorkspaceSummary[];
};

function getWorkspaceTypeLabel(type?: string) {
  return type === "team" ? "团队空间" : "个人空间";
}

function getWorkspaceRoleLabel(role?: string) {
  if (role === "admin") return "管理员";
  if (role === "editor") return "编辑成员";
  return "主理人";
}

export default function WorkspacePage() {
  const router = useRouter();
  const session = useAuthSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [me, setMe] = useState<AuthMe | null>(null);
  const [workspaces, setWorkspaces] = useState<WorkspaceSummary[]>([]);

  useEffect(() => {
    if (!session?.sessionToken) {
      router.replace("/login");
      return;
    }

    let active = true;

    Promise.all([
      apiRequest<AuthMe>("/api/auth/me"),
      apiRequest<RoutingResult>("/api/auth/routing"),
      apiRequest<WorkspaceList>("/api/workspaces"),
    ])
      .then(([nextMe, nextRouting, list]) => {
        if (!active) return;
        setMe(nextMe);
        setWorkspaces(list.items || []);

        if (nextRouting.routeType === "onboarding") {
          router.replace("/onboarding");
          return;
        }
        if (nextRouting.routeType === "workspace_select") {
          router.replace("/workspace/select");
          return;
        }

        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setError(
          err instanceof ApiClientError
            ? err.message
            : err instanceof Error
              ? err.message
              : "工作台加载失败",
        );
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [router, session?.sessionToken]);

  const displayName = useMemo(() => {
    if (!me) return "";
    return me.account.displayName || me.account.phone || `用户 ${me.account.id}`;
  }, [me]);

  if (loading) {
    return (
      <Card className="mx-auto max-w-3xl rounded-[32px] p-8">
        <p className="text-sm text-[--text-soft]">正在进入你的工作台…</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <Card className="rounded-[32px] bg-[linear-gradient(180deg,_rgba(255,255,255,0.9)_0%,_rgba(255,245,238,0.86)_100%)]">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <SoftBadge tone="brand">我的主页</SoftBadge>
              {me?.onboardingCompleted ? <SoftBadge tone="sage">已完成建档</SoftBadge> : null}
            </div>

            <SectionHeading
              eyebrow="欢迎回来"
              title={`欢迎回来，${displayName}`}
              description="你的基础信息已经记住了。今天回来，可以先从这里把资料理顺，再继续往下做。"
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[--border-soft] bg-white/80 px-4 py-4">
                <div className="text-xs uppercase tracking-[0.2em] text-[--text-muted]">
                  我的空间
                </div>
                <div className="mt-2 text-base font-semibold text-[--text-strong]">
                  {me?.currentWorkspace?.name || "还没有空间名称"}
                </div>
                <div className="mt-1 text-sm text-[--text-soft]">
                  {getWorkspaceRoleLabel(me?.currentWorkspace?.role)} / {getWorkspaceTypeLabel(me?.currentWorkspace?.type)}
                </div>
              </div>
              <div className="rounded-2xl border border-[--border-soft] bg-white/80 px-4 py-4">
                <div className="text-xs uppercase tracking-[0.2em] text-[--text-muted]">
                  资料状态
                </div>
                <div className="mt-2 text-base font-semibold text-[--text-strong]">
                  {me?.onboardingCompleted ? "已准备好" : "还差一点"}
                </div>
                <div className="mt-1 text-sm text-[--text-soft]">
                  {me?.onboardingCompleted ? "下次回来，会更快回到这里。" : "把资料补完整，后面会更贴近你。"}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/onboarding" variant="secondary">
                修改资料
              </ButtonLink>
              {workspaces.length > 1 ? (
                <ButtonLink href="/workspace/select" variant="ghost">
                  切换空间
                </ButtonLink>
              ) : null}
            </div>
          </div>
        </Card>

        <Card className="rounded-[32px]">
          <div className="space-y-4">
            <div className="text-sm font-semibold text-[--text-strong]">
              今天建议
            </div>
            <div className="rounded-2xl border border-[--border-soft] bg-[--slate-soft] px-4 py-4 text-sm leading-7 text-[--text-soft]">
              先看一眼资料是不是还准确。主营类目和当前目标越清楚，后面给你的内容就越贴近。
            </div>

            <div className="grid gap-3">
              <div className="rounded-2xl border border-[--border-soft] bg-white/80 px-4 py-4 text-sm text-[--text-soft]">
                登录手机号：{me?.account.phone || "已登录"}
              </div>
              <div className="rounded-2xl border border-[--border-soft] bg-white/80 px-4 py-4 text-sm text-[--text-soft]">
                空间数：{workspaces.length}
              </div>
              <div className="rounded-2xl border border-[--border-soft] bg-white/80 px-4 py-4 text-sm text-[--text-soft]">
                建档状态：{me?.onboardingCompleted ? "已完成" : "待补充"}
              </div>
            </div>

            <Button
              onClick={() => {
                clearAuthSession();
                router.replace("/login");
              }}
              type="button"
              variant="secondary"
            >
              退出登录
            </Button>
          </div>
        </Card>
      </section>

      {error ? (
        <Card className="rounded-[28px] border-[rgba(191,92,49,0.18)] bg-[--brand-soft]">
          <p className="text-sm leading-7 text-[--brand-ink]">{error}</p>
        </Card>
      ) : null}
    </div>
  );
}
