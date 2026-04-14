"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiRequest, ApiClientError } from "../lib/api";
import { getNumberAuthEnvironment, getSpToken } from "../lib/number-auth";
import { useAuthSession, useAuthSessionActions } from "../lib/session-store";
import {
  CommunityEntryCard,
  ContentRetentionCard,
  PromptInputCard,
  TodayCompanionCard,
} from "../components/business";
import { Button, ButtonLink, NoticePanel, SoftBadge } from "../components/ui";

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
  const [networkHint, setNetworkHint] = useState("正在判断当前环境是否适合快捷登录…");
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
          setNetworkHint("当前像是桌面环境，快捷登录更适合在手机浏览器中完成。");
          return;
        }
        if (env?.isWifi) {
          setNetworkHint("现在连接的是 Wi‑Fi，切到移动网络后，快捷登录会更稳一些。");
          return;
        }
        setNetworkHint("当前环境可以直接尝试手机号快捷登录。");
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
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <PromptInputCard
        badge={intent === "trial" ? "继续刚才那一轮" : "手机号快捷登录"}
        className="rounded-[36px] p-6 sm:p-8"
        description="这里不用密码。第一次登录会自动创建账号，后面把你的身份、主营类目和当前目标补齐，就能直接进入自己的主页。"
        footer={
          <>
            <Button
              className="min-w-[180px]"
              disabled={working}
              onClick={handleQuickLogin}
              type="button"
            >
              {working ? "正在连接快捷登录…" : "手机号快捷登录"}
            </Button>
            <ButtonLink href="/trial" variant="secondary">
              先回体验页
            </ButtonLink>
          </>
        }
        title="登录之后，结果、节奏和你的主页才会真正接起来"
      >
        <div className="grid gap-4">
          <NoticePanel tone="brand">{networkHint}</NoticePanel>

          {intent === "trial" ? (
            <NoticePanel tone="gold">
              你刚才在体验页填过的内容已经临时记住了。登录成功后，我们会把这轮继续接到你的主页里。
            </NoticePanel>
          ) : null}

          {error ? <NoticePanel tone="rose">{error}</NoticePanel> : null}

          {allowDevLogin ? (
            <div className="rounded-[22px] border border-dashed border-[rgba(88,51,175,0.16)] bg-[rgba(112,70,214,0.04)] p-4">
              <div className="text-sm font-medium text-strong">本地调试入口</div>
              <div className="mt-1 text-sm leading-7 text-soft">
                仅开发环境显示，方便先把登录、建档和工作台主链路一起跑通。
              </div>
              <button
                className="ui-btn ui-btn-secondary mt-4"
                disabled={working}
                onClick={handleDevLogin}
                type="button"
              >
                本地测试直接进入
              </button>
            </div>
          ) : null}
        </div>
      </PromptInputCard>

      <div className="grid gap-6">
        <TodayCompanionCard
          description="登录不是为了多一个门槛，而是为了把后面的页面、节奏和结果都挂到你自己的账号下。"
          items={[
            { title: "第一次会先认识你在做什么", meta: "建档", tone: "brand" },
            { title: "以后回来不用重说一遍", meta: "留存", tone: "sage" },
            { title: "直接回到自己的主页", meta: "工作台", tone: "rose" },
          ]}
          title="第一次登录之后，会发生什么"
        />

        <ContentRetentionCard
          actionHref="/trial"
          actionText="先回体验页"
          description="体验页和登录之间不是断开的。先试一轮，再登录继续，才会更像一个真的在帮你往前走的产品。"
          title="不是把你拦在登录页，而是把这轮接住"
        />

        <CommunityEntryCard
          actionHref="/workspace"
          actionText="登录后进入工作台"
          description="内容做下去这件事，不只是靠工具本身，还靠有人整理方向、有人跑通过程、有人告诉你今天先做哪一步。"
          title="后面还有主页、社群和长期留存，不止这一页。"
        />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="ui-card rounded-[32px] p-8 text-sm text-soft">正在准备登录入口…</div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
