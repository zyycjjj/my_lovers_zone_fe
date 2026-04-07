"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiRequest, ApiClientError } from "../lib/api";
import { getNumberAuthEnvironment, getSpToken } from "../lib/number-auth";
import { useAuthSession, useAuthSessionActions } from "../lib/session-store";
import { Button, ButtonLink, Card, SectionHeading, SoftBadge } from "../components/ui";

type NumberAuthTokenDto = {
  accessToken: string;
  jwtToken: string;
  accessTokenExpiredAt: string;
  jwtTokenExpiredAt: string;
};

type RoutingResult = {
  routeType: "onboarding" | "workspace_home" | "workspace_select";
  workspaceId?: number;
  reason: string;
};

type NumberLoginResponse = {
  account: {
    id: number;
    phone?: string;
    displayName?: string;
    status: string;
  };
  session: {
    sessionToken: string;
    refreshToken?: string;
    expiredAt: string;
  };
  routing: RoutingResult;
};

function resolveRoute(routing: RoutingResult) {
  if (routing.routeType === "onboarding") return "/onboarding";
  if (routing.routeType === "workspace_select") return "/workspace/select";
  return "/workspace";
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session = useAuthSession();
  const { setSession } = useAuthSessionActions();
  const [isPreparing, setIsPreparing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [networkHint, setNetworkHint] = useState("");

  const intent = useMemo(() => searchParams.get("intent") ?? "", [searchParams]);

  useEffect(() => {
    if (session?.sessionToken) {
      router.replace("/workspace");
    }
  }, [router, session?.sessionToken]);

  useEffect(() => {
    let active = true;

    getNumberAuthEnvironment()
      .then((env) => {
        if (!active) return;
        if (env?.isPc) {
          setNetworkHint("当前像是桌面环境，快捷登录更适合在手机浏览器里调起。");
          return;
        }
        if (env?.isWifi) {
          setNetworkHint("当前连接了 Wi‑Fi，建议切到移动网络后再尝试快捷登录。");
          return;
        }
        setNetworkHint("当前环境可以先尝试手机号快捷登录。");
      })
      .catch(() => {
        if (active) {
          setNetworkHint("号码认证 SDK 尚未就绪，先加载完成后再试。");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  async function submitLogin(spToken: string) {
    setIsSubmitting(true);
    setError("");

    try {
      const response = await apiRequest<NumberLoginResponse>("/api/auth/number-login", {
        method: "POST",
        body: { spToken },
        retryOnUnauthorized: false,
      });

      setSession({
        sessionToken: response.session.sessionToken,
        refreshToken: response.session.refreshToken || "",
        expiredAt: response.session.expiredAt,
      });

      router.replace(resolveRoute(response.routing));
    } catch (err) {
      const message =
        err instanceof ApiClientError
          ? err.message
          : err instanceof Error
            ? err.message
            : "登录失败，请稍后再试";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleQuickLogin() {
    setIsPreparing(true);
    setError("");

    try {
      const tokenInfo = await apiRequest<NumberAuthTokenDto>("/api/auth/number-auth-token", {
        retryOnUnauthorized: false,
      });
      const result = await getSpToken({
        accessToken: tokenInfo.accessToken,
        jwtToken: tokenInfo.jwtToken,
      });
      await submitLogin(result.spToken || "");
    } catch (err) {
      const message =
        err instanceof ApiClientError
          ? err.message
          : err instanceof Error
            ? err.message
            : "快捷登录暂时不可用";
      setError(message);
    } finally {
      setIsPreparing(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
      <Card className="rounded-[32px]">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <SoftBadge tone="brand">正式登录路径</SoftBadge>
            {intent === "trial" ? <SoftBadge tone="sage">从首页入口过来</SoftBadge> : null}
          </div>

          <SectionHeading
            eyebrow="手机号登录"
            title="手机号快捷登录"
            description="当前以手机号快捷登录为主。登录成功后会自动创建账号，并把你送到该去的下一步。"
          />

          <div className="space-y-3 rounded-3xl border border-[--border-soft] bg-white/80 p-5">
            <div className="text-sm font-semibold text-[--text-strong]">快捷登录说明</div>
            <p className="text-sm leading-7 text-[--text-soft]">
              推荐在手机浏览器里使用。当前网络不适合快捷认证时，可以稍后再试。
            </p>
            <div className="rounded-2xl bg-[--slate-soft] px-4 py-4 text-sm leading-7 text-[--text-soft]">
              {networkHint || "正在检查当前环境…"}
            </div>
          </div>

          <div className="space-y-3">
            <Button
              className="w-full py-3.5 text-[15px]"
              disabled={isPreparing || isSubmitting}
              onClick={handleQuickLogin}
              type="button"
            >
              {isPreparing || isSubmitting ? "正在连接手机号快捷登录…" : "手机号快捷登录"}
            </Button>

            {error ? (
              <div className="rounded-2xl border border-[rgba(191,92,49,0.18)] bg-[--brand-soft] px-4 py-4 text-sm leading-7 text-[--brand-ink]">
                {error}
              </div>
            ) : null}
          </div>
        </div>
      </Card>

      <div className="space-y-6">
        <Card className="rounded-[32px] bg-[linear-gradient(180deg,_rgba(255,255,255,0.86)_0%,_rgba(255,245,238,0.86)_100%)]">
          <div className="space-y-4">
            <h2 className="heading-serif text-[28px] leading-tight text-[--text-strong]">
              登录后会自动接上的事
            </h2>

            <div className="grid gap-3">
              <div className="rounded-2xl border border-[--border-soft] bg-white/80 px-4 py-4">
                <div className="text-sm font-semibold text-[--text-strong]">
                  自动建账号
                </div>
                <div className="mt-1 text-sm leading-7 text-[--text-soft]">
                  第一次用这个手机号登录，会自动创建正式账号。
                </div>
              </div>
              <div className="rounded-2xl border border-[--border-soft] bg-white/80 px-4 py-4">
                <div className="text-sm font-semibold text-[--text-strong]">
                  自动建个人空间
                </div>
                <div className="mt-1 text-sm leading-7 text-[--text-soft]">
                  这版先把个人空间和 owner 成员关系接好。
                </div>
              </div>
              <div className="rounded-2xl border border-[--border-soft] bg-white/80 px-4 py-4">
                <div className="text-sm font-semibold text-[--text-strong]">
                  自动分流
                </div>
                <div className="mt-1 text-sm leading-7 text-[--text-soft]">
                  没建档就去补 3 项，建完档就直接回到当前工作入口。
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="rounded-[32px]">
          <div className="space-y-4">
            <div className="text-sm font-semibold text-[--text-strong]">
              登录后会保留
            </div>
            <div className="grid gap-3">
              <div className="rounded-2xl border border-[--border-soft] bg-white/80 px-4 py-4 text-sm text-[--text-soft]">
                当前会话
              </div>
              <div className="rounded-2xl border border-[--border-soft] bg-white/80 px-4 py-4 text-sm text-[--text-soft]">
                当前工作空间
              </div>
              <div className="rounded-2xl border border-[--border-soft] bg-white/80 px-4 py-4 text-sm text-[--text-soft]">
                你已经补过的建档信息
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/" variant="ghost">
                回首页
              </ButtonLink>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
