export type ApiOptions = {
  method?: string;
  body?: unknown;
  token?: string;
  adminPass?: string;
  isForm?: boolean;
};

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export async function apiRequest<T>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {};
  if (!options.isForm) headers["Content-Type"] = "application/json";
  if (options.token) headers["x-user-token"] = options.token;
  if (options.adminPass) headers["x-admin-pass"] = options.adminPass;

  const response = await fetch(`${apiBase}${path}`, {
    method: options.method ?? (options.body ? "POST" : "GET"),
    headers,
    body: options.body
      ? options.isForm
        ? (options.body as FormData)
        : JSON.stringify(options.body)
      : undefined,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || response.statusText);
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await response.json()) as T;
  }
  return (await response.text()) as T;
}
