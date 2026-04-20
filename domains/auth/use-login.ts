"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiRequest } from "@/shared/lib/api";
import { getSpToken } from "@/shared/lib/number-auth";
import { useAuthSession, useAuthSessionActions } from "@/shared/lib/session-store";
import {
  getErrorMessage,
  resolveRoute,
  type FieldName,
  type FormMode,
  type NumberAuthTokenDto,
  type NumberLoginResponse,
} from "./login-model";
import { mapLoginApiError, validateLoginForm } from "./login-validation";
import { useLoginCaptcha } from "./use-login-captcha";
import { useQuickLoginAvailability } from "./use-quick-login-availability";

export function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session = useAuthSession();
  const { setSession } = useAuthSessionActions();

  const [mode, setMode] = useState<FormMode>("login");
  const [isPreparing, setIsPreparing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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

  const quickLoginAvailable = useQuickLoginAvailability();

  const { captcha, isRefreshingCaptcha, refreshPasswordCaptcha } = useLoginCaptcha({
    onError: (message) => setFieldErrors((current) => ({ ...current, captcha: message })),
    onResetCode: () => setCaptchaCode(""),
  });

  function patchFieldError(name: FieldName, value: string) {
    setFieldErrors((current) => ({
      ...current,
      [name]: value,
      form: "",
    }));
  }

  function finishLogin(response: NumberLoginResponse) {
    setSession({
      sessionToken: response.session.sessionToken,
      refreshToken: response.session.refreshToken || "",
      expiredAt: response.session.expiredAt,
    });

    router.replace(resolveRoute(response.routing));
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

  async function handlePasswordAuth() {
    const nextErrors = validateLoginForm({
      captcha,
      captchaCode,
      confirmPassword,
      mode,
      password,
      phone,
    });
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
      const message = getErrorMessage(
        error,
        mode === "register" ? "注册失败，请稍后再试" : "登录失败，请稍后再试",
      );
      setFieldErrors(mapLoginApiError(message, mode));
      await refreshPasswordCaptcha(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    captcha,
    captchaCode,
    confirmPassword,
    changeCaptchaCode: (value: string) => {
      setCaptchaCode(value);
      patchFieldError("captcha", "");
    },
    changeConfirmPassword: (value: string) => {
      setConfirmPassword(value);
      patchFieldError("confirmPassword", "");
    },
    changeMode: (nextMode: FormMode) => {
      setMode(nextMode);
      setFieldErrors({});
      if (nextMode === "login") setConfirmPassword("");
    },
    changePassword: (value: string) => {
      setPassword(value);
      patchFieldError("password", "");
    },
    changePhone: (value: string) => {
      setPhone(value);
      patchFieldError("phone", "");
    },
    fieldErrors,
    intent,
    isRefreshingCaptcha,
    mode,
    password,
    phone,
    quickLoginAvailable,
    refreshPasswordCaptcha,
    working,
    handlePasswordAuth,
    handleQuickLogin,
  };
}
