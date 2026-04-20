"use client";

import type { FieldErrors, FormMode, PasswordCaptchaDto } from "./login-model";

export function getPasswordStrengthError(password: string) {
  if (password.length < 8) return "密码至少需要 8 位";
  const kinds = [
    /[a-zA-Z]/.test(password),
    /\d/.test(password),
    /[^a-zA-Z0-9]/.test(password),
  ].filter(Boolean).length;
  if (kinds < 2) return "请混合字母、数字或符号";
  return "";
}

export function validateLoginForm({
  mode,
  phone,
  password,
  confirmPassword,
  captcha,
  captchaCode,
}: {
  mode: FormMode;
  phone: string;
  password: string;
  confirmPassword: string;
  captcha: PasswordCaptchaDto | null;
  captchaCode: string;
}) {
  const nextErrors: FieldErrors = {};

  if (!/^1\d{10}$/.test(phone.trim())) {
    nextErrors.phone = "请输入手机号";
  }

  const passwordStrengthError = getPasswordStrengthError(password);
  if (passwordStrengthError) {
    nextErrors.password = passwordStrengthError;
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

export function mapLoginApiError(message: string, mode: FormMode): FieldErrors {
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

