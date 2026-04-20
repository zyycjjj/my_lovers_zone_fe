"use client";

import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "@/shared/lib/api";
import { getErrorMessage, type PasswordCaptchaDto } from "./login-model";

export function useLoginCaptcha({
  onError,
  onResetCode,
}: {
  onError: (message: string) => void;
  onResetCode: () => void;
}) {
  const [captcha, setCaptcha] = useState<PasswordCaptchaDto | null>(null);
  const [isRefreshingCaptcha, setIsRefreshingCaptcha] = useState(false);

  const refreshPasswordCaptcha = useCallback(
    async (silent = false) => {
      setIsRefreshingCaptcha(true);
      try {
        const response = await apiRequest<PasswordCaptchaDto>("/api/auth/password-captcha", {
          retryOnUnauthorized: false,
        });
        setCaptcha(response);
        onResetCode();
        return response;
      } catch (error) {
        const message = getErrorMessage(error, "图形验证码刷新失败");
        if (!silent) onError(message);
        throw error;
      } finally {
        setIsRefreshingCaptcha(false);
      }
    },
    [onError, onResetCode],
  );

  useEffect(() => {
    let active = true;
    setIsRefreshingCaptcha(true);

    apiRequest<PasswordCaptchaDto>("/api/auth/password-captcha", {
      retryOnUnauthorized: false,
    })
      .then((response) => {
        if (!active) return;
        setCaptcha(response);
        onResetCode();
      })
      .catch((error) => {
        if (!active) return;
        onError(getErrorMessage(error, "图形验证码刷新失败"));
      })
      .finally(() => {
        if (active) setIsRefreshingCaptcha(false);
      });

    return () => {
      active = false;
    };
  }, [onError, onResetCode]);

  return { captcha, isRefreshingCaptcha, refreshPasswordCaptcha };
}

