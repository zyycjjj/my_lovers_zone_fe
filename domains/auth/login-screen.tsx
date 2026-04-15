"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiRequest, ApiClientError } from "@/shared/lib/api";
import { getNumberAuthEnvironment, getSpToken } from "@/shared/lib/number-auth";
import { useAuthSession, useAuthSessionActions } from "@/shared/lib/session-store";
import { cn } from "@/shared/ui/ui";

type NumberAuthTokenDto = {
  accessToken: string;
  jwtToken: string;
  accessTokenExpiredAt: string;
  jwtTokenExpiredAt: string;
};

type PasswordCaptchaDto = {
  captchaId: string;
  imageData: string;
  expiredAt: string;
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

type FormMode = "login" | "register";
type FieldName = "phone" | "password" | "confirmPassword" | "captcha";
type FieldErrors = Partial<Record<FieldName | "form", string>>;

function resolveRoute(routing: RoutingResult) {
  if (routing.routeType === "onboarding") return "/onboarding";
  if (routing.routeType === "workspace_select") return "/workspace/select";
  return "/workspace";
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiClientError) return error.message;
  if (error instanceof Error) return error.message;
  return fallback;
}

function PhoneIcon() {
  return (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 20 20">
      <path
        d="M6.667 2.917h6.666a1.25 1.25 0 0 1 1.25 1.25v11.666a1.25 1.25 0 0 1-1.25 1.25H6.667a1.25 1.25 0 0 1-1.25-1.25V4.167a1.25 1.25 0 0 1 1.25-1.25Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path d="M8.75 14.583h2.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 20 20">
      <path
        d="M5.833 8.333a1.25 1.25 0 0 1 1.25-1.25h5.834a1.25 1.25 0 0 1 1.25 1.25v6.25a1.25 1.25 0 0 1-1.25 1.25H7.083a1.25 1.25 0 0 1-1.25-1.25v-6.25Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M7.917 7.083V5.833a2.083 2.083 0 1 1 4.166 0v1.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function CaptchaIcon() {
  return (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 20 20">
      <path
        d="M5.417 6.667 10 3.75l4.583 2.917v6.666L10 16.25l-4.583-2.917V6.667Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M7.917 10h4.166M7.917 12.5h2.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function BoltBadge() {
  return (
    <div className="mx-auto flex size-14 items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,#4a3168_0%,#6a447f_52%,#d4668f_100%)] text-white shadow-[0_10px_40px_rgba(74,49,104,0.25)]">
      <svg aria-hidden="true" className="size-8" fill="none" viewBox="0 0 32 32">
        <path
          d="M17.147 5.333 9.333 17.058h6.217L14.853 26.667l7.814-11.725H16.45l.697-9.609Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

function GiftIcon() {
  return (
    <svg aria-hidden="true" className="size-7" fill="none" viewBox="0 0 28 28">
      <path
        d="M5.833 10.5h16.334v10.5a1.75 1.75 0 0 1-1.75 1.75H7.583A1.75 1.75 0 0 1 5.833 21V10.5Zm0 0h16.334v-3.5a1.75 1.75 0 0 0-1.75-1.75H7.583A1.75 1.75 0 0 0 5.833 7v3.5Zm8.167-5.25v17.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
      />
      <path
        d="M13.417 5.833H11.96A2.626 2.626 0 0 1 9.333 3.208v0A2.626 2.626 0 0 1 11.959.583c1.415 0 2.63.992 2.913 2.379l.295 1.454h-1.75Zm1.166 0h1.458a2.626 2.626 0 0 0 2.626-2.625v0A2.626 2.626 0 0 0 16.04.583c-1.414 0-2.63.992-2.912 2.379l-.296 1.454h1.75Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
      />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="5.75" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6.55 6.35a1.5 1.5 0 1 1 2.42 1.18c-.57.45-.97.77-.97 1.47"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <circle cx="8" cy="11.4" r=".75" fill="currentColor" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 20 20">
      <path
        d="m11.667 5-5 5 5 5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function ModeSwitch({
  mode,
  onChange,
}: {
  mode: FormMode;
  onChange: (mode: FormMode) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-1 rounded-[18px] bg-[#f5f2f8] p-1">
      {[
        { value: "login" as const, label: "密码登录" },
        { value: "register" as const, label: "手机号注册" },
      ].map((item) => {
        const active = item.value === mode;
        return (
          <button
            key={item.value}
            className={cn(
              "flex h-10 items-center justify-center rounded-[14px] text-sm font-medium",
              active
                ? "bg-white text-[#4a3168] shadow-[0_8px_22px_rgba(74,49,104,0.08)]"
                : "text-[#737378] hover:text-[#4a3168]",
            )}
            onClick={() => onChange(item.value)}
            type="button"
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="text-[14px] font-medium text-[#3f3f46]">{label}</div>
      <div className="mt-2">{children}</div>
      <div className="min-h-[20px] pt-2 text-[13px] leading-5 text-[#ef4444]">{error || ""}</div>
    </label>
  );
}

function AuthInput({
  icon,
  error,
  className,
  ...props
}: React.ComponentProps<"input"> & {
  icon: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#a3a3ab]">{icon}</div>
      <input
        {...props}
        className={cn(
          "h-[50px] w-full rounded-[16px] border bg-white pl-12 pr-4 text-[16px] text-[#18181b] outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] placeholder:text-[#a3a3ab] focus:border-[#4a3168] focus:shadow-[0_0_0_4px_rgba(74,49,104,0.08)]",
          error ? "border-[#ef4444]" : "border-[rgba(0,0,0,0.08)]",
          className,
        )}
      />
    </div>
  );
}

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session = useAuthSession();
  const { setSession } = useAuthSessionActions();

  const [mode, setMode] = useState<FormMode>("login");
  const [isPreparing, setIsPreparing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshingCaptcha, setIsRefreshingCaptcha] = useState(false);
  const [quickLoginAvailable, setQuickLoginAvailable] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [captcha, setCaptcha] = useState<PasswordCaptchaDto | null>(null);

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [captchaCode, setCaptchaCode] = useState("");

  const intent = searchParams.get("intent") ?? "";
  const working = isPreparing || isSubmitting;

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
        setQuickLoginAvailable(Boolean(env && !env.isPc && !env.isWifi));
      })
      .catch(() => {
        if (active) {
          setQuickLoginAvailable(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    void refreshPasswordCaptcha(true);
  }, []);

  function finishLogin(response: NumberLoginResponse) {
    setSession({
      sessionToken: response.session.sessionToken,
      refreshToken: response.session.refreshToken || "",
      expiredAt: response.session.expiredAt,
    });

    router.replace(resolveRoute(response.routing));
  }

  async function refreshPasswordCaptcha(silent = false) {
    setIsRefreshingCaptcha(true);
    if (!silent) {
      setFieldErrors((current) => ({ ...current, captcha: "", form: "" }));
    }

    try {
      const response = await apiRequest<PasswordCaptchaDto>("/api/auth/password-captcha", {
        retryOnUnauthorized: false,
      });
      setCaptcha(response);
      setCaptchaCode("");
    } catch (error) {
      const message = getErrorMessage(error, "图形验证码刷新失败");
      setFieldErrors((current) => ({ ...current, captcha: message }));
    } finally {
      setIsRefreshingCaptcha(false);
    }
  }

  async function submitQuickLogin(spToken: string) {
    const response = await apiRequest<NumberLoginResponse>("/api/auth/number-login", {
      method: "POST",
      body: { spToken },
      retryOnUnauthorized: false,
    });

    finishLogin(response);
  }

  async function handleQuickLogin() {
    setIsPreparing(true);
    setFieldErrors({});

    try {
      const tokenInfo = await apiRequest<NumberAuthTokenDto>("/api/auth/number-auth-token", {
        retryOnUnauthorized: false,
      });
      const result = await getSpToken({
        accessToken: tokenInfo.accessToken,
        jwtToken: tokenInfo.jwtToken,
      });

      await submitQuickLogin(result.spToken || "");
    } catch (error) {
      setFieldErrors({
        form: getErrorMessage(error, "一键登录暂时不可用，请先用手机号和密码继续。"),
      });
    } finally {
      setIsPreparing(false);
    }
  }

  function patchFieldError(name: FieldName, value: string) {
    setFieldErrors((current) => ({
      ...current,
      [name]: value,
      form: "",
    }));
  }

  function validateForm() {
    const nextErrors: FieldErrors = {};

    if (!/^1\d{10}$/.test(phone.trim())) {
      nextErrors.phone = "请输入手机号";
    }

    if (password.length < 8) {
      nextErrors.password = "密码至少需要 8 位";
    } else {
      const kinds = [/[a-zA-Z]/.test(password), /\d/.test(password), /[^a-zA-Z0-9]/.test(password)].filter(Boolean).length;
      if (kinds < 2) {
        nextErrors.password = "请混合字母、数字或符号";
      }
    }

    if (mode === "register" && password !== confirmPassword) {
      nextErrors.confirmPassword = "两次输入的密码不一致";
    }

    if (!captcha?.captchaId) {
      nextErrors.captcha = "请先刷新验证码";
    } else if (!/^[a-zA-Z0-9]{4,8}$/.test(captchaCode.trim())) {
      nextErrors.captcha = "请输入图形验证码";
    }

    return nextErrors;
  }

  function mapApiError(message: string) {
    if (message.includes("手机号")) {
      return { phone: message };
    }
    if (message.includes("验证码")) {
      return { captcha: message };
    }
    if (message.includes("密码")) {
      return {
        [mode === "register" && message.includes("一致") ? "confirmPassword" : "password"]: message,
      } as FieldErrors;
    }
    return { form: message };
  }

  async function handlePasswordAuth() {
    const nextErrors = validateForm();
    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});

    try {
      const response = await apiRequest<NumberLoginResponse>(
        mode === "register" ? "/api/auth/password-register" : "/api/auth/password-login",
        {
          method: "POST",
          body: {
            phone: phone.trim(),
            password,
            captchaId: captcha?.captchaId,
            captchaCode: captchaCode.trim().toUpperCase(),
          },
          retryOnUnauthorized: false,
        },
      );

      finishLogin(response);
    } catch (error) {
      const message = getErrorMessage(error, mode === "register" ? "注册失败，请稍后再试" : "登录失败，请稍后再试");
      setFieldErrors(mapApiError(message));
      await refreshPasswordCaptcha(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fafafa] px-4 py-6 sm:px-6 sm:py-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-[-72px] top-16 size-72 rounded-full bg-[#d1c7dd] opacity-40 blur-[64px]" />
        <div className="absolute left-[-48px] top-[36%] size-96 rounded-full bg-[#f9cfe3] opacity-40 blur-[64px]" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-[448px] flex-col justify-center gap-6 sm:min-h-[calc(100vh-4rem)]">
        <Link
          className="inline-flex items-center gap-2 self-start text-[15px] font-medium text-[#52525a] hover:text-[#18181b]"
          href="/"
        >
          <ArrowLeftIcon />
          返回首页
        </Link>

        <div className="text-center">
          <BoltBadge />
          <h1 className="mt-6 text-[32px] font-bold tracking-[-0.04em] text-[#18181b] sm:text-[30px]">
            欢迎来到AI内容工作台
          </h1>
          <p className="mt-3 text-[17px] text-[#52525a]">让我们开始你的创作之旅</p>
          {intent === "trial" ? (
            <div className="mt-4 inline-flex items-center rounded-full bg-[rgba(74,49,104,0.06)] px-4 py-2 text-[13px] font-medium text-[#6a447f]">
              登录后会继续刚才那轮体验内容
            </div>
          ) : null}
        </div>

        <section className="rounded-[20px] border border-[rgba(0,0,0,0.08)] bg-white px-6 py-[25px] shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.08)] sm:px-[25px]">
          <div className="space-y-5">
            <ModeSwitch
              mode={mode}
              onChange={(nextMode) => {
                setMode(nextMode);
                setFieldErrors({});
                if (nextMode === "login") {
                  setConfirmPassword("");
                }
              }}
            />

            <Field error={fieldErrors.phone} label="手机号">
              <AuthInput
                error={fieldErrors.phone}
                icon={<PhoneIcon />}
                inputMode="numeric"
                maxLength={11}
                onChange={(event) => {
                  setPhone(event.target.value.replace(/\D/g, ""));
                  patchFieldError("phone", "");
                }}
                placeholder="请输入手机号"
                value={phone}
              />
            </Field>

            <Field error={fieldErrors.password} label="密码">
              <AuthInput
                error={fieldErrors.password}
                icon={<LockIcon />}
                onChange={(event) => {
                  setPassword(event.target.value);
                  patchFieldError("password", "");
                }}
                placeholder={mode === "register" ? "设置登录密码" : "请输入密码"}
                type="password"
                value={password}
              />
            </Field>

            {mode === "register" ? (
              <Field error={fieldErrors.confirmPassword} label="确认密码">
                <AuthInput
                  error={fieldErrors.confirmPassword}
                  icon={<LockIcon />}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                    patchFieldError("confirmPassword", "");
                  }}
                  placeholder="请再次输入密码"
                  type="password"
                  value={confirmPassword}
                />
              </Field>
            ) : null}

            <Field error={fieldErrors.captcha} label="图形验证码">
              <div className="relative">
                <AuthInput
                  className="pr-[126px]"
                  error={fieldErrors.captcha}
                  icon={<CaptchaIcon />}
                  inputMode="text"
                  maxLength={8}
                  onChange={(event) => {
                    setCaptchaCode(event.target.value.toUpperCase());
                    patchFieldError("captcha", "");
                  }}
                  placeholder="请输入图形验证码"
                  value={captchaCode}
                />
                <button
                  className="absolute right-2 top-1/2 flex h-9 w-[102px] -translate-y-1/2 items-center justify-center overflow-hidden rounded-[14px] border border-[#f0d4df] bg-[#fff5fa] shadow-[0_1px_2px_rgba(0,0,0,0.08)] hover:border-[#d4668f] hover:bg-[#ffeaf3] disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isRefreshingCaptcha}
                  onClick={() => void refreshPasswordCaptcha()}
                  type="button"
                >
                  {captcha?.imageData ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt="图形验证码"
                      className="h-full w-full object-contain"
                      src={captcha.imageData}
                    />
                  ) : (
                    <span className="text-xs font-medium text-[#d4668f]">
                      {isRefreshingCaptcha ? "刷新中" : "加载中"}
                    </span>
                  )}
                </button>
              </div>
            </Field>

            {fieldErrors.form ? (
              <div aria-live="polite" className="text-center text-[13px] leading-5 text-[#ef4444]">
                {fieldErrors.form}
              </div>
            ) : null}

            <div className="space-y-3 pt-1">
              <button
                className="flex h-[60px] w-full items-center justify-center rounded-[16px] bg-[#4a3168] text-[18px] font-medium text-white shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.1)] hover:bg-[#5a3b7b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a3168] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={working || isRefreshingCaptcha}
                onClick={() => void handlePasswordAuth()}
                type="button"
              >
                {working ? (mode === "register" ? "正在创建账号..." : "正在登录...") : mode === "register" ? "注册并继续" : "登录并继续"}
              </button>

              {quickLoginAvailable ? (
                <div className="text-center">
                  <button
                    className="text-sm font-medium text-[#7a5a9f] underline-offset-4 hover:text-[#4a3168] hover:underline"
                    disabled={working}
                    onClick={() => void handleQuickLogin()}
                    type="button"
                  >
                    或者试试一键登录
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-5 text-center text-[12px] leading-4 text-[#737378]">
            登录即表示同意
            <span className="text-[#4a3168]">《用户协议》</span>
            和
            <span className="text-[#4a3168]">《隐私政策》</span>
          </div>
        </section>

        <section className="flex items-center gap-4 rounded-[20px] bg-[linear-gradient(166deg,#4a3168_0%,#2d1b4e_100%)] px-6 py-6 text-white shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.08)]">
          <div className="flex size-14 items-center justify-center rounded-[20px] bg-[rgba(255,255,255,0.1)] text-white">
            <GiftIcon />
          </div>
          <div>
            <div className="text-[20px] font-semibold">新用户专享福利</div>
            <div className="mt-1 text-[14px] text-white/80">1元体验7天全部功能 · 随时可退款</div>
          </div>
        </section>

        <div className="text-center">
          <Link
            className="inline-flex items-center gap-2 text-[14px] font-medium text-[#52525a] hover:text-[#18181b]"
            href="/trial"
          >
            <HelpIcon />
            遇到问题？查看帮助
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#fafafa] text-sm text-[#737378]">
          正在准备登录入口...
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
