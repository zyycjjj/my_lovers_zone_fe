"use client";

export default function MeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <header className="sticky top-0 z-20 border-b border-[rgba(0,0,0,0.08)] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <a className="flex items-center gap-3" href="/">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F3F7] text-base font-semibold text-[#4A3168]">
              M
            </span>
            <span className="text-lg font-semibold text-[#27272A]">Memory</span>
          </a>
          <a
            href="/login"
            className="rounded-[14px] bg-[#4A3168] px-4 py-2 text-sm font-medium text-white"
          >
            重新登录
          </a>
        </div>
      </header>
      <main className="mx-auto max-w-[1180px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FEF2F2] text-xl">
            ⚠
          </div>
          <h2 className="text-lg font-semibold text-[#27272A]">我的页出了点问题</h2>
          <p className="mt-2 max-w-[420px] text-center text-sm leading-7 text-[#737378]">
            加载时遇到了一个错误，可能需要重新登录后再试。
          </p>
          {error?.message ? (
            <p className="mt-2 max-w-[360px] text-center text-xs text-[#A3A3AD] break-all">
              {error.message}
            </p>
          ) : null}
          <div className="mt-5 flex gap-3">
            <button
              onClick={() => reset()}
              className="rounded-[14px] bg-[#4A3168] px-5 py-2.5 text-sm font-medium text-white"
            >
              重试
            </button>
            <a
              href="/login"
              className="rounded-[14px] border border-[rgba(74,49,104,0.18)] bg-white px-5 py-2.5 text-sm font-medium text-[#4A3168]"
            >
              重新登录
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
