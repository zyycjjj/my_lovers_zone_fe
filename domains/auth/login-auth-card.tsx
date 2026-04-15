"use client";

import Image from "next/image";
import { CaptchaIcon, LockIcon, PhoneIcon } from "./login-icons";
import { AuthInput, AuthPrimaryButton, Field, ModeSwitch } from "./login-ui";
import type { FormMode } from "./login-model";

type Props = {
  captcha?: { captchaId: string; imageData: string } | null;
  captchaCode: string;
  confirmPassword: string;
  fieldErrors: Record<string, string | undefined>;
  isRefreshingCaptcha: boolean;
  mode: FormMode;
  password: string;
  phone: string;
  quickLoginAvailable: boolean;
  working: boolean;
  onCaptchaCodeChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onModeChange: (mode: FormMode) => void;
  onPasswordChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onQuickLogin: () => void;
  onRefreshCaptcha: () => void;
  onSubmit: () => void;
};

export function LoginAuthCard({
  captcha,
  captchaCode,
  confirmPassword,
  fieldErrors,
  isRefreshingCaptcha,
  mode,
  password,
  phone,
  quickLoginAvailable,
  working,
  onCaptchaCodeChange,
  onConfirmPasswordChange,
  onModeChange,
  onPasswordChange,
  onPhoneChange,
  onQuickLogin,
  onRefreshCaptcha,
  onSubmit,
}: Props) {
  return (
    <section className="rounded-[20px] border border-[rgba(0,0,0,0.08)] bg-white px-6 py-[25px] shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.08)] sm:px-[25px]">
      <div className="space-y-5">
        <ModeSwitch mode={mode} onChange={onModeChange} />

        <Field error={fieldErrors.phone} label="手机号">
          <AuthInput
            error={fieldErrors.phone}
            icon={<PhoneIcon />}
            inputMode="numeric"
            maxLength={11}
            onChange={(event) => onPhoneChange(event.target.value.replace(/\D/g, ""))}
            placeholder="请输入手机号"
            value={phone}
          />
        </Field>

        <Field error={fieldErrors.password} label="密码">
          <AuthInput
            error={fieldErrors.password}
            icon={<LockIcon />}
            onChange={(event) => onPasswordChange(event.target.value)}
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
              onChange={(event) => onConfirmPasswordChange(event.target.value)}
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
              onChange={(event) => onCaptchaCodeChange(event.target.value.toUpperCase())}
              placeholder="请输入图形验证码"
              value={captchaCode}
            />
            <button
              className="absolute right-2 top-1/2 flex h-9 w-[102px] -translate-y-1/2 items-center justify-center overflow-hidden rounded-[14px] border border-[#f0d4df] bg-[#fff5fa] shadow-[0_1px_2px_rgba(0,0,0,0.08)] hover:border-[#d4668f] hover:bg-[#ffeaf3] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isRefreshingCaptcha}
              onClick={onRefreshCaptcha}
              type="button"
            >
              {captcha?.imageData ? (
                <Image
                  alt="图形验证码"
                  className="h-full w-full object-contain"
                  height={36}
                  src={captcha.imageData}
                  unoptimized
                  width={102}
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
          <AuthPrimaryButton
            disabled={working || isRefreshingCaptcha}
            onClick={onSubmit}
          >
            {working
              ? mode === "register"
                ? "正在创建账号..."
                : "正在登录..."
              : mode === "register"
                ? "注册并继续"
                : "登录并继续"}
          </AuthPrimaryButton>

          {quickLoginAvailable ? (
            <div className="text-center">
              <button
                className="text-sm font-medium text-[#7a5a9f] underline-offset-4 hover:text-[#4a3168] hover:underline"
                disabled={working}
                onClick={onQuickLogin}
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
  );
}
