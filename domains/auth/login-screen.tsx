"use client";

import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeftIcon } from "./login-icons";
import { LoginAuthCard } from "./login-auth-card";
import { LoginBenefitCard } from "./login-benefit-card";
import { LoginHeader } from "./login-header";
import { LoginHelpLink } from "./login-help-link";
import { useLogin } from "./use-login";

function LoginPageContent() {
  const login = useLogin();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fafafa] px-4 py-6 sm:px-6 sm:py-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-[-72px] top-16 size-72 rounded-full bg-[#d1c7dd] opacity-40 blur-3xl" />
        <div className="absolute left-[-48px] top-[36%] size-96 rounded-full bg-[#f9cfe3] opacity-40 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-[448px] flex-col justify-center gap-5 sm:min-h-[calc(100vh-2rem)]">
        <Link
          className="inline-flex items-center gap-2 self-start text-[15px] font-medium text-[#52525a] hover:text-[#18181b] sm:hidden"
          href="/"
        >
          <ArrowLeftIcon />
          返回首页
        </Link>

        <LoginHeader intent={login.intent} />

        <LoginAuthCard
          captcha={login.captcha}
          captchaCode={login.captchaCode}
          confirmPassword={login.confirmPassword}
          fieldErrors={login.fieldErrors}
          isRefreshingCaptcha={login.isRefreshingCaptcha}
          mode={login.mode}
          onCaptchaCodeChange={(value) => login.changeCaptchaCode(value)}
          onConfirmPasswordChange={(value) => login.changeConfirmPassword(value)}
          onModeChange={(mode) => login.changeMode(mode)}
          onPasswordChange={(value) => login.changePassword(value)}
          onPhoneChange={(value) => login.changePhone(value)}
          onQuickLogin={() => void login.handleQuickLogin()}
          onRefreshCaptcha={() => void login.refreshPasswordCaptcha()}
          onSubmit={() => void login.handlePasswordAuth()}
          password={login.password}
          phone={login.phone}
          quickLoginAvailable={login.quickLoginAvailable}
          working={login.working}
        />

        <LoginBenefitCard />
        <LoginHelpLink />
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
