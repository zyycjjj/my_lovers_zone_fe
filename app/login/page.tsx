"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiRequest, ApiClientError } from "../lib/api";
import { getNumberAuthEnvironment, getSpToken } from "../lib/number-auth";
import { useAuthSession, useAuthSessionActions } from "../lib/session-store";
import { Button, ButtonLink, Card, InfoPanel, NoticePanel, SectionHeading, SoftBadge } from "../components/ui";

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

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session = useAuthSession();
  const { setSession } = useAuthSessionActions();
  const [isPreparing, setIsPreparing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [networkHint, setNetworkHint] = useState("");
  const [allowDevLogin, setAllowDevLogin] = useState(false);

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
          setNetworkHint("现在像是桌面环境，快捷登录更适合在手机浏览器里完成。");
          return;
        }
        if (env?.isWifi) {
          setNetworkHint("当前连接了 Wi‑Fi，切到移动网络后，快捷认证会更稳一点。");
          return;
        }
        setNetworkHint("当前环境可以先尝试手机号快捷登录。");
      })
      .catch(() => {
        if (active) {
          setNetworkHint("号码认证 SDK 正在准备中，稍等一下再试。");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setAllowDevLogin(window.location.hostname !== "love.zychenyao.cn");
  }, []);

  function finishLogin(response: NumberLoginResponse) {
    setSession({
      sessionToken: response.session.sessionToken,
      refreshToken: response.session.refreshToken || "",
      expiredAt: response.session.expiredAt,
    });

    router.replace(resolveRoute(response.routing));
  }

  async function submitLogin(spToken: string) {
    setIsSubmitting(true);
    setError("");

    try {
      const response = await apiRequest<NumberLoginResponse>("/api/auth/number-login", {
        method: "POST",
        body: { spToken },
        retryOnUnauthorized: false,
      });

      finishLogin(response);
    } catch (err) {
      setError(
        err instanceof ApiClientError
          ? err.message
          : err instanceof Error
            ? err.message
            : "登录失败，请稍后再试",
      );
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
      setError(
        err instanceof ApiClientError
          ? err.message
          : err instanceof Error
            ? err.message
            : "快捷登录暂时不可用",
      );
    } finally {
      setIsPreparing(false);
    }
  }

  async function handleDevLogin() {
    setIsSubmitting(true);
    setError("");

    try {
      const response = await apiRequest<NumberLoginResponse>("/api/auth/dev-login", {
        method: "POST",
        body: {
          phone: "13900000000",
          displayName: "本地测试用户",
        },
        retryOnUnauthorized: false,
      });

      finishLogin(response);
    } catch (err) {
      setError(
        err instanceof ApiClientError
          ? err.message
          : err instanceof Error
            ? err.message
            : "本地测试登录失败",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const working = isPreparing || isSubmitting;

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <Card className="surface-card-strong rounded-[34px] p-6 sm:p-8">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <SoftBadge tone="brand">手机号快捷登录</SoftBadge>
            {intent === "trial" ? <SoftBadge tone="rose">继续刚才那一轮</SoftBadge> : null}
          </div>

          <SectionHeading
            eyebrow="第一步"
            title="先登录，再把你的主页接起来"
            description="第一次来，只需要先把登录走通。后面会顺着你的身份、类目和目标，给你更贴近的内容结果。"
          />

          <div className="surface-card-muted rounded-[28px] p-5">
            <div className="text-strong text-sm font-semibold">登录前提醒</div>
            <p className="text-soft mt-2 text-sm leading-7">
              推荐在手机浏览器中使用。当前网络不适合快捷认证时，也可以稍后再试。
            </p>
            <div className="bg-slate-soft text-soft mt-4 rounded-[20px] px-4 py-4 text-sm leading-7">
              {networkHint || "正在确认当前环境…"}
            </div>
          </div>

          <div className="space-y-3">
            <Button
              className="w-full py-3.5 text-[15px]"
              disabled={working}
              onClick={handleQuickLogin}
              type="button"
            >
              {working ? "正在连接手机号快捷登录…" : "手机号快捷登录"}
            </Button>

            {allowDevLogin ? (
              <Button
                className="w-full py-3.5 text-[15px]"
                disabled={working}
                onClick={handleDevLogin}
                type="button"
                variant="secondary"
              >
                本地测试直接进入
              </Button>
            ) : null}

            {error ? <NoticePanel tone="rose">{error}</NoticePanel> : null}
          </div>
        </div>
      </Card>

      <div className="grid gap-6">
        <Card className="rounded-[32px] bg-[linear-gradient(180deg,_rgba(255,255,255,0.94)_0%,_rgba(241,234,255,0.84)_100%)]">
          <div className="space-y-4">
            <h2 className="heading-serif text-strong text-[30px] leading-tight">
              登录之后会更轻一点
            </h2>
            <div className="grid gap-3">
              {[
                ["先认一下你在做什么", "会先知道你的身份、主营类目和当前目标。"],
                ["以后回来不用重说一遍", "登录后会保留你的账号和主页入口。"],
                ["先回到自己的工作台", "资料收好之后，后面每天回来就顺手很多。"],
              ].map(([title, text]) => (
                <InfoPanel
                  key={title}
                  className="rounded-[22px] px-4 py-4"
                  description={text}
                  title={title}
                />
              ))}
            </div>
          </div>
        </Card>

        <Card className="rounded-[32px]">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <SoftBadge tone="sage">登录后会保留</SoftBadge>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {["你的手机号", "你的资料", "你的主页入口"].map((item) => (
                <div
                  key={item}
                  className="rounded-[22px] border border-[rgba(91,70,142,0.1)] bg-white/78 px-4 py-4 text-sm text-soft"
                >
                  {item}
                </div>
              ))}
            </div>

            {allowDevLogin ? (
              <NoticePanel className="rounded-[24px] px-5 py-5" tone="brand">
                当前是本地预览环境，可以直接进入测试账号，把整条链路先跑通。
              </NoticePanel>
            ) : null}

            <div className="flex justify-start">
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

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <Card className="mx-auto max-w-3xl rounded-[32px] p-8">
          <p className="text-soft text-sm">正在准备登录入口…</p>
        </Card>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
