"use client";

export function WorkspaceHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.8)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1283px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#F5F3F7_0%,#FDF4F8_100%)] text-base font-semibold text-[#4A3168]">
            M
          </div>
          <div className="text-lg font-semibold text-[#27272A]">Memory</div>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-[#F9CFE3] bg-[#FDF4F8] px-3 py-1.5 text-sm font-medium text-[#993D63]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#D4668F]" />
          体验版
        </div>
      </div>
    </header>
  );
}

