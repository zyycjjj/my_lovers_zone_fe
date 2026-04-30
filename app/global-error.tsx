"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="zh-CN">
      <body style={{ margin: 0, background: "#FAFAFA", fontFamily: "system-ui, sans-serif" }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 16px",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: 420 }}>
            <div
              style={{
                margin: "0 auto 16px",
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "#FEF2F2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
              }}
            >
              ⚠
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: "#27272A", margin: "0 0 8px" }}>
              页面出了点问题
            </h2>
            <p style={{ fontSize: 14, color: "#737378", lineHeight: 1.75, margin: "0 0 8px" }}>
              加载时遇到了一个错误，请尝试刷新页面。
            </p>
            {error?.message ? (
              <p style={{ fontSize: 12, color: "#A3A3AD", wordBreak: "break-all", margin: "0 0 16px" }}>
                {error.message}
              </p>
            ) : null}
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                onClick={() => reset()}
                style={{
                  padding: "10px 20px",
                  borderRadius: 14,
                  background: "#4A3168",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                重试
              </button>
              <a
                href="/"
                style={{
                  padding: "10px 20px",
                  borderRadius: 14,
                  background: "#fff",
                  color: "#4A3168",
                  border: "1px solid rgba(74,49,104,0.18)",
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                回首页
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
