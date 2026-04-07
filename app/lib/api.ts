"use client";

import {
  clearAuthSession,
  getAuthSessionSnapshot,
  saveAuthSession,
  type AuthSessionSnapshot,
} from "./session-store";

export type ApiOptions = {
  method?: string;
  body?: unknown;
  token?: string;
  sessionToken?: string;
  adminPass?: string;
  isForm?: boolean;
  retryOnUnauthorized?: boolean;
};

type ApiEnvelope<T> = {
  code?: string;
  message?: string;
  requestId?: string;
  timestamp?: string;
  data?: T;
  details?: unknown;
};

export class ApiClientError extends Error {
  code: string;
  status: number;
  details?: unknown;

  constructor(
    message: string,
    options: { code?: string; status?: number; details?: unknown } = {},
  ) {
    super(message);
    this.name = "ApiClientError";
    this.code = options.code ?? "UNKNOWN_ERROR";
    this.status = options.status ?? 500;
    this.details = options.details;
  }
}

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

function isApiEnvelope<T>(value: unknown): value is ApiEnvelope<T> {
  return Boolean(
    value &&
      typeof value === "object" &&
      "code" in value &&
      "message" in value &&
      "timestamp" in value,
  );
}

async function parseResponse<T>(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    const text = await response.text();
    if (!response.ok) {
      throw new ApiClientError(text || response.statusText, {
        code: "HTTP_ERROR",
        status: response.status,
      });
    }
    return text as T;
  }

  const payload = (await response.json()) as ApiEnvelope<T> | T;
  if (isApiEnvelope<T>(payload)) {
    if (!response.ok || payload.code !== "SUCCESS") {
      throw new ApiClientError(payload.message || response.statusText, {
        code: payload.code || "HTTP_ERROR",
        status: response.status,
        details: payload.details,
      });
    }
    return payload.data as T;
  }

  if (!response.ok) {
    throw new ApiClientError(response.statusText, {
      code: "HTTP_ERROR",
      status: response.status,
    });
  }

  return payload;
}

async function doFetch<T>(
  path: string,
  options: ApiOptions = {},
  overrideSession?: AuthSessionSnapshot | null,
) {
  const session = overrideSession ?? getAuthSessionSnapshot();
  const headers: Record<string, string> = {};

  if (!options.isForm) {
    headers["Content-Type"] = "application/json";
  }
  if (options.token) {
    headers["x-user-token"] = options.token;
  }
  if (options.adminPass) {
    headers["x-admin-pass"] = options.adminPass;
  }

  const resolvedSessionToken =
    options.sessionToken ?? session?.sessionToken ?? "";
  if (resolvedSessionToken) {
    headers["x-session-token"] = resolvedSessionToken;
  }

  const response = await fetch(`${apiBase}${path}`, {
    method: options.method ?? (options.body ? "POST" : "GET"),
    headers,
    body: options.body
      ? options.isForm
        ? (options.body as FormData)
        : JSON.stringify(options.body)
      : undefined,
  });

  return parseResponse<T>(response);
}

export async function refreshStageOneSession() {
  const session = getAuthSessionSnapshot();

  if (!session?.refreshToken) {
    throw new ApiClientError("当前没有可刷新的会话", {
      code: "UNAUTHORIZED",
      status: 401,
    });
  }

  const next = await doFetch<{
    sessionToken: string;
    refreshToken?: string;
    expiredAt: string;
  }>(
    "/api/auth/session/refresh",
    {
      method: "POST",
      body: {
        refreshToken: session.refreshToken,
        rotateRefreshToken: true,
      },
      sessionToken: session.sessionToken,
      retryOnUnauthorized: false,
    },
    session,
  );

  const merged = {
    ...session,
    sessionToken: next.sessionToken,
    refreshToken: next.refreshToken || session.refreshToken,
    expiredAt: next.expiredAt,
  };

  saveAuthSession(merged);
  return merged;
}

export async function apiRequest<T>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  try {
    return await doFetch<T>(path, options);
  } catch (error) {
    if (
      error instanceof ApiClientError &&
      error.code === "UNAUTHORIZED" &&
      options.retryOnUnauthorized !== false &&
      !options.token &&
      getAuthSessionSnapshot()?.refreshToken
    ) {
      try {
        const session = await refreshStageOneSession();
        return await doFetch<T>(path, { ...options, retryOnUnauthorized: false }, session);
      } catch {
        clearAuthSession();
      }
    }

    throw error;
  }
}
