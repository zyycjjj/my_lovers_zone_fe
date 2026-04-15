"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiRequest } from "@/shared/lib/api";
import { getNumberAuthEnvironment, getSpToken } from "@/shared/lib/number-auth";
import { useAuthSession, useAuthSessionActions } from "@/shared/lib/session-store";
import {
  getErrorMessage,
  resolveRoute,
  type FieldErrors,
  type FieldName,
  type FormMode,
  type NumberAuthTokenDto,
  type NumberLoginResponse,
  type PasswordCaptchaDto,
} from "./login-model";

export function useLogin() {
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
    let active = true;

    setIsRefreshingCaptcha(true);
    apiRequest<PasswordCaptchaDto>("/api/auth/password-captcha", {
      retryOnUnauthorized: false,
    })
      .then((response) => {
        if (!active) return;
        setCaptcha(response);
        setCaptchaCode("");
      })
      .catch((error) => {
        if (!active) return;
        const message = getErrorMessage(error, "图形验证码刷新失败");
        setFieldErrors((current) => ({ ...current, captcha: message }));
      })
      .finally(() => {
        if (active) setIsRefreshingCaptcha(false);
      });

    return () => {
      active = false;
    };
  }, []);

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

  const passwordStrengthError = useMemo(() => {
    if (password.length < 8) return "密码至少需要 8 位";
    const kinds = [
      /[a-zA-Z]/.test(password),
      /\d/.test(password),
      /[^a-zA-Z0-9]/.test(password),
    ].filter(Boolean).length;
    if (kinds < 2) return "请混合字母、数字或符号";
    return "";
  }, [password]);

  function validateForm() {
    const nextErrors: FieldErrors = {};

    if (!/^1\d{10}$/.test(phone.trim())) {
      nextErrors.phone = "请输入手机号";
    }

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
      const message = getErrorMessage(
        error,
        mode === "register" ? "注册失败，请稍后再试" : "登录失败，请稍后再试",
      );
      setFieldErrors(mapApiError(message));
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
