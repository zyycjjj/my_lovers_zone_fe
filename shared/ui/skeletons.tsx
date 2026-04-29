export function WorkspaceSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="mx-auto max-w-[1283px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-3 animate-pulse">
          <div className="h-[30px] w-[200px] rounded-lg bg-[#ECECF0]" />
          <div className="h-[20px] w-[360px] rounded bg-[#ECECF0]" />
        </div>

        <section className="mb-6 grid gap-5 md:grid-cols-4 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-[20px] border border-[rgba(0,0,0,0.06)] bg-white p-5">
              <div className="h-[14px] w-[80px] rounded bg-[#ECECF0]" />
              <div className="mt-3 h-[36px] w-[60px] rounded bg-[#ECECF0]" />
              <div className="mt-4 h-2 rounded-full bg-[#ECECF0]" />
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_395px]">
          <div className="space-y-6 animate-pulse">
            <div className="rounded-[20px] bg-white p-6 shadow-sm">
              <div className="h-[18px] w-[120px] rounded bg-[#ECECF0]" />
              <div className="mt-4 h-[44px] w-full rounded-xl bg-[#F5F3F7]" />
              <div className="mt-4 h-[120px] w-full rounded-xl bg-[#F5F3F7]" />
              <div className="mt-4 ml-auto h-[42px] w-[100px] rounded-xl bg-[#ECECF0]" />
            </div>
            <div className="rounded-[20px] bg-white p-6 shadow-sm">
              <div className="h-[18px] w-[160px] rounded bg-[#ECECF0]" />
              <div className="mt-4 space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-[14px] w-full rounded bg-[#F5F3F7]" />
                ))}
              </div>
            </div>
          </div>
          <aside className="space-y-6 animate-pulse">
            <div className="rounded-[20px] bg-gradient-to-br from-[#F5F3F7]/80 to-[rgba(253,244,248,0.5)] p-6">
              <div className="h-[18px] w-[100px] rounded bg-[#ECECF0]" />
              <div className="mt-3 flex justify-between">
                <div className="h-[30px] w-[40px] rounded bg-[#ECECF0]" />
                <div className="h-[30px] w-[40px] rounded bg-[#ECECF0]" />
              </div>
              <div className="mt-4 h-2 rounded-full bg-[#ECECF0]" />
            </div>
            <div className="rounded-[20px] bg-[#4A3168] p-6">
              <div className="h-[18px] w-[100px] rounded bg-white/20" />
              <div className="mt-3 space-y-2">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="h-[14px] w-full rounded bg-white/15" />
                ))}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}

export function MeSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <header className="border-b border-[rgba(0,0,0,0.08)] bg-white/90">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 animate-pulse">
            <div className="h-10 w-10 rounded-full bg-[#ECECF0]" />
            <div className="h-[18px] w-[60px] rounded bg-[#ECECF0]" />
          </div>
          <div className="flex gap-2 animate-pulse">
            <div className="h-10 w-[70px] rounded-[14px] bg-[#ECECF0]" />
            <div className="h-10 w-[50px] rounded-[14px] bg-[#ECECF0]" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8 animate-pulse">
        <div className="mb-6 space-y-2">
          <div className="h-[34px] w-[180px] rounded bg-[#ECECF0]" />
          <div className="h-[20px] w-[400px] rounded bg-[#ECECF0]" />
        </div>

        <div className="grid gap-5 md:grid-cols-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-[20px] border border-[rgba(0,0,0,0.06)] bg-white p-5">
              <div className="h-[14px] w-[80px] rounded bg-[#ECECF0]" />
              <div className="mt-3 h-[28px] w-[60px] rounded bg-[#ECECF0]" />
              <div className="mt-3 h-[14px] w-[120px] rounded bg-[#ECECF0]" />
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-[20px] bg-white p-0 shadow-sm">
            <div className="border-b border-[rgba(0,0,0,0.06)] px-5 py-4">
              <div className="h-[18px] w-[100px] rounded bg-[#ECECF0]" />
            </div>
            <div className="p-5 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex gap-2">
                    <div className="h-[24px] w-[48px] rounded-full bg-[#F5F3F7]" />
                    <div className="h-[24px] w-[90px] rounded bg-[#ECECF0]" />
                  </div>
                  <div className="h-[18px] w-[200px] rounded bg-[#ECECF0]" />
                  <div className="h-[52px] w-full rounded bg-[#F5F3F7]" />
                </div>
              ))}
            </div>
          </div>
          <aside className="space-y-6">
            <div className="rounded-[20px] bg-[#F8F4FB] p-5">
              <div className="h-[18px] w-[100px] rounded bg-[#ECECF0]" />
              <div className="mt-3 h-[56px] w-full rounded bg-[#ECECF0]" />
            </div>
            <div className="rounded-[20px] bg-white p-5">
              <div className="h-[18px] w-[100px] rounded bg-[#ECECF0]" />
              <div className="mt-4 space-y-2">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="h-[48px] rounded-[16px] bg-[#FAFAFA]" />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
