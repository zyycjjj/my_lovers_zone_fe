import { ApiClientError } from "@/shared/lib/api";

export type NumberAuthTokenDto = {
  accessToken: string;
  jwtToken: string;
  accessTokenExpiredAt: string;
  jwtTokenExpiredAt: string;
};

export type PasswordCaptchaDto = {
  captchaId: string;
  imageData: string;
  expiredAt: string;
};

export type RoutingResult = {
  routeType: "onboarding" | "workspace_home" | "workspace_select";
  workspaceId?: number;
  reason: string;
};

export type NumberLoginResponse = {
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

export type FormMode = "login" | "register";
export type FieldName = "phone" | "password" | "confirmPassword" | "captcha";
export type FieldErrors = Partial<Record<FieldName | "form", string>>;

export const modeOptions: Array<{ value: FormMode; label: string }> = [
  { value: "login", label: "密码登录" },
  { value: "register", label: "手机号注册" },
];

export function resolveRoute(routing: RoutingResult) {
  if (routing.routeType === "onboarding") return "/onboarding";
  if (routing.routeType === "workspace_select") return "/workspace/select";
  return "/workspace";
}

export function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiClientError) return error.message;
  if (error instanceof Error) return error.message;
  return fallback;
}
