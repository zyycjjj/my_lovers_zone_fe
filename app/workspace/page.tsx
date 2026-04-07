"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest, ApiClientError } from "../lib/api";
import { clearAuthSession, useAuthSession } from "../lib/session-store";
import { Button, ButtonLink, Card, SectionHeading, SoftBadge, cn } from "../components/ui";

type WorkspaceSummary = {
  id: number;
  name: string;
  type: string;
  role: string;
  status: string;
};

type AuthMe = {
  account: {
    id: number;
    phone?: string;
    displayName?: string;
    status: string;
  };
  currentWorkspace: WorkspaceSummary | null;
  onboardingCompleted: boolean;
};

type RoutingResult = {
  routeType: "onboarding" | "workspace_home" | "workspace_select";
  workspaceId?: number;
  reason: string;
};

type WorkspaceList = {
  items: WorkspaceSummary[];
};

type ToolKind = "title" | "script" | "refine" | "commission";

type TitleResult = {
  titles: string[];
};

type ScriptResult = {
  text: string;
};

type RefineRisk = {
  type: string;
  matches: string[];
};

type RefineResult = {
  summaryLine: string;
  sellingPoints: string[];
  risks: RefineRisk[];
  suggestions: string[];
  safeRewrites: string[];
};

type CommissionResult = {
  commission: number;
  comparisons: Array<{ price: number; commission: number }>;
  sellingPoint: string;
};

const tools: Array<{
  key: ToolKind;
  label: string;
  short: string;
  description: string;
}> = [
  {
    key: "title",
    label: "标题生成",
    short: "20 条可直接挑选的标题",
    description: "先用一个关键词，把今天要发的标题方向定下来。",
  },
  {
    key: "script",
    label: "脚本生成",
    short: "短视频和直播口播都能先出一版",
    description: "先把可讲的内容搭起来，再决定要不要继续细修。",
  },
  {
    key: "refine",
    label: "话术提炼",
    short: "把已有话术变得更清楚、更稳妥",
    description: "适合你已经有一版话术，想更顺、更合规地表达。",
  },
  {
    key: "commission",
    label: "佣金测算",
    short: "先算明白，再决定推不推",
    description: "把价格、佣金和扣点算清楚，避免盲目上链接。",
  },
];

function getWorkspaceTypeLabel(type?: string) {
  return type === "team" ? "团队空间" : "个人空间";
}

function getWorkspaceRoleLabel(role?: string) {
  if (role === "admin") return "管理员";
  if (role === "editor") return "编辑成员";
  return "主理人";
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-[--text-strong]">{label}</span>
        {hint ? <span className="text-xs text-[--text-muted]">{hint}</span> : null}
      </div>
      {children}
    </label>
  );
}

function inputClassName(multiline = false) {
  return cn(
    "w-full rounded-[22px] border border-[--border-soft] bg-white/88 px-4 py-3 text-sm text-[--text-strong] outline-none placeholder:text-[--text-muted] focus:border-[rgba(191,92,49,0.28)]",
    multiline ? "min-h-[144px] resize-none" : "",
  );
}

export default function WorkspacePage() {
  const router = useRouter();
  const session = useAuthSession();

  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [me, setMe] = useState<AuthMe | null>(null);
  const [workspaces, setWorkspaces] = useState<WorkspaceSummary[]>([]);

  const [activeTool, setActiveTool] = useState<ToolKind>("title");
  const [toolError, setToolError] = useState("");
  const [loadingTool, setLoadingTool] = useState<ToolKind | null>(null);
  const [copiedText, setCopiedText] = useState("");

  const [titleKeyword, setTitleKeyword] = useState("");
  const [titleStyle, setTitleStyle] = useState("");
  const [titleResult, setTitleResult] = useState<string[]>([]);

  const [scriptKeyword, setScriptKeyword] = useState("");
  const [scriptPrice, setScriptPrice] = useState("");
  const [scriptAudience, setScriptAudience] = useState("");
  const [scriptScene, setScriptScene] = useState("");
  const [scriptStyle, setScriptStyle] = useState<"short" | "live">("short");
  const [scriptResult, setScriptResult] = useState("");

  const [refineText, setRefineText] = useState("");
  const [refineResult, setRefineResult] = useState<RefineResult | null>(null);

  const [commissionPrice, setCommissionPrice] = useState("");
  const [commissionRate, setCommissionRate] = useState("");
  const [platformRate, setPlatformRate] = useState("");
  const [commissionResult, setCommissionResult] = useState<CommissionResult | null>(null);

  useEffect(() => {
    if (!session?.sessionToken) {
      router.replace("/login");
      return;
    }

    let active = true;

    Promise.all([
      apiRequest<AuthMe>("/api/auth/me"),
      apiRequest<RoutingResult>("/api/auth/routing"),
      apiRequest<WorkspaceList>("/api/workspaces"),
    ])
      .then(([nextMe, nextRouting, list]) => {
        if (!active) return;
        setMe(nextMe);
        setWorkspaces(list.items || []);

        if (nextRouting.routeType === "onboarding") {
          router.replace("/onboarding");
          return;
        }
        if (nextRouting.routeType === "workspace_select") {
          router.replace("/workspace/select");
          return;
        }

        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setPageError(
          err instanceof ApiClientError
            ? err.message
            : err instanceof Error
              ? err.message
              : "页面加载失败，请稍后再试",
        );
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [router, session?.sessionToken]);

  const displayName = useMemo(() => {
    if (!me) return "";
    return me.account.displayName || me.account.phone || `用户 ${me.account.id}`;
  }, [me]);

  const activeToolMeta = useMemo(
    () => tools.find((item) => item.key === activeTool) ?? tools[0],
    [activeTool],
  );

  const todayLine = useMemo(() => {
    if (activeTool === "title") return "先定一个标题方向，再往下做会更轻松。";
    if (activeTool === "script") return "先把一版能讲的脚本写出来，后面再慢慢磨。";
    if (activeTool === "refine") return "把你已有的话术整理顺一点，会更容易开口。";
    return "先算清楚这单值不值得推，心里会更稳。";
  }, [activeTool]);

  async function handleLogout() {
    try {
      await apiRequest("/api/auth/logout", {
        method: "POST",
        body: { allDevices: false },
      });
    } catch {}
    clearAuthSession();
    router.replace("/login");
  }

  async function handleCopy(text: string) {
    if (!text.trim()) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText("已复制到剪贴板");
      window.setTimeout(() => setCopiedText(""), 1800);
    } catch {
      setCopiedText("复制失败，请手动复制");
      window.setTimeout(() => setCopiedText(""), 1800);
    }
  }

  async function handleSubmitTool() {
    setToolError("");
    setCopiedText("");
    setLoadingTool(activeTool);

    try {
      if (activeTool === "title") {
        if (!titleKeyword.trim()) {
          throw new Error("先填一个商品关键词，再开始生成标题。");
        }

        const data = await apiRequest<TitleResult>("/api/tool/title", {
          method: "POST",
          body: {
            keyword: titleKeyword.trim(),
            style: titleStyle.trim() || undefined,
          },
        });

        setTitleResult(data.titles ?? []);
      }

      if (activeTool === "script") {
        if (!scriptKeyword.trim()) {
          throw new Error("先填一个商品关键词，再开始生成脚本。");
        }

        const data = await apiRequest<ScriptResult>("/api/tool/script", {
          method: "POST",
          body: {
            keyword: scriptKeyword.trim(),
            price: scriptPrice ? Number(scriptPrice) : undefined,
            audience: scriptAudience.trim() || undefined,
            scene: scriptScene.trim() || undefined,
            style: scriptStyle,
          },
        });

        setScriptResult(data.text || "");
      }

      if (activeTool === "refine") {
        if (!refineText.trim()) {
          throw new Error("先贴一段你要整理的话术。");
        }

        const data = await apiRequest<RefineResult>("/api/tool/refine", {
          method: "POST",
          body: { text: refineText.trim() },
        });

        setRefineResult(data);
      }

      if (activeTool === "commission") {
        if (!commissionPrice || !commissionRate) {
          throw new Error("先把商品价格和佣金比例填上。");
        }

        const data = await apiRequest<CommissionResult>("/api/tool/commission", {
          method: "POST",
          body: {
            price: Number(commissionPrice),
            commissionRate: Number(commissionRate),
            platformRate: platformRate ? Number(platformRate) : undefined,
          },
        });

        setCommissionResult(data);
      }
    } catch (err) {
      setToolError(
        err instanceof ApiClientError
          ? err.message
          : err instanceof Error
            ? err.message
            : "这次没跑通，请稍后再试",
      );
    } finally {
      setLoadingTool(null);
    }
  }

  if (loading) {
    return (
      <Card className="mx-auto max-w-3xl rounded-[32px] p-8">
        <p className="text-sm text-[--text-soft]">正在进入你的工作台…</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-[32px] bg-[linear-gradient(180deg,_rgba(255,255,255,0.94)_0%,_rgba(255,243,235,0.86)_100%)]">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <SoftBadge tone="brand">内容工作台</SoftBadge>
              {me?.onboardingCompleted ? <SoftBadge tone="sage">资料已准备好</SoftBadge> : null}
            </div>

            <SectionHeading
              eyebrow="今天先做一轮"
              title={`欢迎回来，${displayName}`}
              description="现在可以直接开始做内容了。先从一个入口开始，把今天最重要的这一轮先接住。"
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[24px] border border-[--border-soft] bg-white/88 px-5 py-5">
                <div className="text-xs uppercase tracking-[0.2em] text-[--text-muted]">
                  当前空间
                </div>
                <div className="mt-2 text-lg font-semibold text-[--text-strong]">
                  {me?.currentWorkspace?.name || "个人空间"}
                </div>
                <div className="mt-2 text-sm text-[--text-soft]">
                  {getWorkspaceRoleLabel(me?.currentWorkspace?.role)} /{" "}
                  {getWorkspaceTypeLabel(me?.currentWorkspace?.type)}
                </div>
              </div>

              <div className="rounded-[24px] border border-[--border-soft] bg-white/88 px-5 py-5">
                <div className="text-xs uppercase tracking-[0.2em] text-[--text-muted]">
                  今天建议
                </div>
                <div className="mt-2 text-base font-semibold text-[--text-strong]">
                  {todayLine}
                </div>
                <div className="mt-2 text-sm text-[--text-soft]">
                  资料越清楚，后面给你的结果就越贴近。
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/onboarding" variant="secondary">
                修改资料
              </ButtonLink>
              {workspaces.length > 1 ? (
                <ButtonLink href="/workspace/select" variant="ghost">
                  切换空间
                </ButtonLink>
              ) : null}
            </div>
          </div>
        </Card>

        <Card className="rounded-[32px]">
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-[--text-strong]">你的当前状态</div>
                <div className="mt-1 text-sm leading-7 text-[--text-soft]">
                  这里先把能直接开始用的能力接起来，回来就能继续做。
                </div>
              </div>
              <Button onClick={handleLogout} type="button" variant="secondary">
                退出登录
              </Button>
            </div>

            <div className="grid gap-3">
              <div className="rounded-[22px] border border-[--border-soft] bg-white/82 px-4 py-4 text-sm text-[--text-soft]">
                登录手机号：{me?.account.phone || "已登录"}
              </div>
              <div className="rounded-[22px] border border-[--border-soft] bg-white/82 px-4 py-4 text-sm text-[--text-soft]">
                空间数量：{workspaces.length}
              </div>
              <div className="rounded-[22px] border border-[--border-soft] bg-white/82 px-4 py-4 text-sm text-[--text-soft]">
                当前可用：标题生成、脚本生成、话术提炼、佣金测算
              </div>
            </div>

            <div className="rounded-[24px] border border-[rgba(191,92,49,0.14)] bg-[--brand-soft] px-4 py-4 text-sm leading-7 text-[--brand-ink]">
              不用一口气把所有事做完。先选一个入口，先做出一版，再继续往下走。
            </div>
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.98fr_1.02fr]">
        <Card className="rounded-[32px]">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              {tools.map((tool) => {
                const active = tool.key === activeTool;
                return (
                  <button
                    key={tool.key}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm font-medium",
                      active
                        ? "border-[rgba(191,92,49,0.18)] bg-[--brand-soft] text-[--brand-ink]"
                        : "border-[--border-soft] bg-white/70 text-[--text-soft]",
                    )}
                    onClick={() => {
                      setActiveTool(tool.key);
                      setToolError("");
                      setCopiedText("");
                    }}
                    type="button"
                  >
                    {tool.label}
                  </button>
                );
              })}
            </div>

            <div className="rounded-[26px] border border-[--border-soft] bg-[linear-gradient(180deg,_rgba(255,255,255,0.92)_0%,_rgba(244,246,248,0.72)_100%)] p-5">
              <div className="text-base font-semibold text-[--text-strong]">
                {activeToolMeta.label}
              </div>
              <div className="mt-2 text-sm leading-7 text-[--text-soft]">
                {activeToolMeta.description}
              </div>
            </div>

            <div className="space-y-5">
              {activeTool === "title" ? (
                <>
                  <Field label="商品关键词">
                    <input
                      className={inputClassName()}
                      onChange={(event) => setTitleKeyword(event.target.value)}
                      placeholder="比如：香薰蜡烛、夏季凉感被、厨房收纳架"
                      value={titleKeyword}
                    />
                  </Field>

                  <Field label="风格方向" hint="选填">
                    <input
                      className={inputClassName()}
                      onChange={(event) => setTitleStyle(event.target.value)}
                      placeholder="比如：口语感、治愈、强转化"
                      value={titleStyle}
                    />
                  </Field>
                </>
              ) : null}

              {activeTool === "script" ? (
                <>
                  <Field label="商品关键词">
                    <input
                      className={inputClassName()}
                      onChange={(event) => setScriptKeyword(event.target.value)}
                      placeholder="比如：家用小风扇"
                      value={scriptKeyword}
                    />
                  </Field>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="价格" hint="选填">
                      <input
                        className={inputClassName()}
                        inputMode="decimal"
                        onChange={(event) => setScriptPrice(event.target.value)}
                        placeholder="比如：99"
                        value={scriptPrice}
                      />
                    </Field>
                    <Field label="目标人群" hint="选填">
                      <input
                        className={inputClassName()}
                        onChange={(event) => setScriptAudience(event.target.value)}
                        placeholder="比如：租房党、上班族"
                        value={scriptAudience}
                      />
                    </Field>
                  </div>

                  <Field label="使用场景" hint="选填">
                    <input
                      className={inputClassName()}
                      onChange={(event) => setScriptScene(event.target.value)}
                      placeholder="比如：办公室、宿舍、通勤"
                      value={scriptScene}
                    />
                  </Field>

                  <Field label="输出风格">
                    <div className="flex flex-wrap gap-3">
                      <button
                        className={cn(
                          "rounded-full border px-4 py-2 text-sm font-medium",
                          scriptStyle === "short"
                            ? "border-[rgba(191,92,49,0.18)] bg-[--brand-soft] text-[--brand-ink]"
                            : "border-[--border-soft] bg-white/70 text-[--text-soft]",
                        )}
                        onClick={() => setScriptStyle("short")}
                        type="button"
                      >
                        短视频种草
                      </button>
                      <button
                        className={cn(
                          "rounded-full border px-4 py-2 text-sm font-medium",
                          scriptStyle === "live"
                            ? "border-[rgba(191,92,49,0.18)] bg-[--brand-soft] text-[--brand-ink]"
                            : "border-[--border-soft] bg-white/70 text-[--text-soft]",
                        )}
                        onClick={() => setScriptStyle("live")}
                        type="button"
                      >
                        直播口播
                      </button>
                    </div>
                  </Field>
                </>
              ) : null}

              {activeTool === "refine" ? (
                <Field label="原始话术">
                  <textarea
                    className={inputClassName(true)}
                    onChange={(event) => setRefineText(event.target.value)}
                    placeholder="把你已经写好的话术贴进来，Memory 会帮你理顺表达、提炼卖点，并提醒风险。"
                    value={refineText}
                  />
                </Field>
              ) : null}

              {activeTool === "commission" ? (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="商品价格">
                      <input
                        className={inputClassName()}
                        inputMode="decimal"
                        onChange={(event) => setCommissionPrice(event.target.value)}
                        placeholder="比如：199"
                        value={commissionPrice}
                      />
                    </Field>
                    <Field label="佣金比例">
                      <input
                        className={inputClassName()}
                        inputMode="decimal"
                        onChange={(event) => setCommissionRate(event.target.value)}
                        placeholder="比如：0.2"
                        value={commissionRate}
                      />
                    </Field>
                  </div>

                  <Field label="平台扣点" hint="选填">
                    <input
                      className={inputClassName()}
                      inputMode="decimal"
                      onChange={(event) => setPlatformRate(event.target.value)}
                      placeholder="比如：0.1"
                      value={platformRate}
                    />
                  </Field>
                </>
              ) : null}
            </div>

            {toolError ? (
              <div className="rounded-[22px] border border-[rgba(191,92,49,0.18)] bg-[--brand-soft] px-4 py-4 text-sm leading-7 text-[--brand-ink]">
                {toolError}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <Button disabled={loadingTool === activeTool} onClick={handleSubmitTool} type="button">
                {loadingTool === activeTool ? "正在生成…" : `开始${activeToolMeta.label}`}
              </Button>
              <div className="inline-flex items-center rounded-full bg-[--slate-soft] px-4 py-2 text-sm text-[--text-soft]">
                {activeToolMeta.short}
              </div>
            </div>
          </div>
        </Card>

        <Card className="rounded-[32px]">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-base font-semibold text-[--text-strong]">结果区</div>
                <div className="mt-1 text-sm text-[--text-soft]">
                  先看这一轮结果，再决定下一步怎么继续。
                </div>
              </div>
              {copiedText ? <SoftBadge tone="sage">{copiedText}</SoftBadge> : null}
            </div>

            {activeTool === "title" ? (
              titleResult.length ? (
                <div className="space-y-4">
                  <div className="grid gap-3">
                    {titleResult.map((title, index) => (
                      <div
                        key={`${title}-${index}`}
                        className="rounded-[22px] border border-[--border-soft] bg-white/84 px-4 py-4 text-sm leading-7 text-[--text-strong]"
                      >
                        <span className="mr-2 text-[--brand]">{index + 1}.</span>
                        {title}
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={() => handleCopy(titleResult.map((item, index) => `${index + 1}. ${item}`).join("\n"))}
                    type="button"
                    variant="secondary"
                  >
                    复制这一组标题
                  </Button>
                </div>
              ) : (
                <div className="rounded-[24px] border border-dashed border-[--border-soft] bg-white/76 px-5 py-10 text-sm leading-7 text-[--text-soft]">
                  先输一个商品关键词。标题出来之后，你可以直接挑一条先用。
                </div>
              )
            ) : null}

            {activeTool === "script" ? (
              scriptResult ? (
                <div className="space-y-4">
                  <pre className="whitespace-pre-wrap rounded-[24px] border border-[--border-soft] bg-white/84 px-5 py-5 text-sm leading-7 text-[--text-strong]">
                    {scriptResult}
                  </pre>
                  <Button onClick={() => handleCopy(scriptResult)} type="button" variant="secondary">
                    复制这版脚本
                  </Button>
                </div>
              ) : (
                <div className="rounded-[24px] border border-dashed border-[--border-soft] bg-white/76 px-5 py-10 text-sm leading-7 text-[--text-soft]">
                  先给我一个商品关键词。我会先把开场、脚本和分镜建议整理出来。
                </div>
              )
            ) : null}

            {activeTool === "refine" ? (
              refineResult ? (
                <div className="space-y-4">
                  <div className="rounded-[24px] border border-[--border-soft] bg-[--brand-soft] px-5 py-5">
                    <div className="text-xs uppercase tracking-[0.2em] text-[--brand]">一句话总结</div>
                    <div className="mt-3 text-base font-semibold leading-8 text-[--brand-ink]">
                      {refineResult.summaryLine || "这轮还没有总结结果"}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <div className="text-sm font-semibold text-[--text-strong]">卖点提炼</div>
                      {refineResult.sellingPoints.length ? (
                        refineResult.sellingPoints.map((item, index) => (
                          <div
                            key={`${item}-${index}`}
                            className="rounded-[20px] border border-[--border-soft] bg-white/82 px-4 py-3 text-sm leading-7 text-[--text-strong]"
                          >
                            {item}
                          </div>
                        ))
                      ) : (
                        <div className="rounded-[20px] border border-dashed border-[--border-soft] bg-white/76 px-4 py-3 text-sm text-[--text-soft]">
                          暂时没有提炼出新的卖点。
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="text-sm font-semibold text-[--text-strong]">合规建议</div>
                      {refineResult.suggestions.length ? (
                        refineResult.suggestions.map((item, index) => (
                          <div
                            key={`${item}-${index}`}
                            className="rounded-[20px] border border-[--border-soft] bg-white/82 px-4 py-3 text-sm leading-7 text-[--text-strong]"
                          >
                            {item}
                          </div>
                        ))
                      ) : (
                        <div className="rounded-[20px] border border-dashed border-[--border-soft] bg-white/76 px-4 py-3 text-sm text-[--text-soft]">
                          暂时没有新的提醒。
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm font-semibold text-[--text-strong]">风险提示</div>
                    {refineResult.risks.length ? (
                      refineResult.risks.map((risk, index) => (
                        <div
                          key={`${risk.type}-${index}`}
                          className="rounded-[20px] border border-[rgba(191,92,49,0.18)] bg-white/82 px-4 py-3 text-sm leading-7 text-[--text-strong]"
                        >
                          <div className="font-medium text-[--brand-ink]">{risk.type}</div>
                          <div className="mt-1 text-[--text-soft]">
                            {risk.matches.join("、")}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[20px] border border-dashed border-[--border-soft] bg-white/76 px-4 py-3 text-sm text-[--text-soft]">
                        这轮没有明显风险词。
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm font-semibold text-[--text-strong]">更稳妥的表达</div>
                    {refineResult.safeRewrites.length ? (
                      refineResult.safeRewrites.map((item, index) => (
                        <div
                          key={`${item}-${index}`}
                          className="rounded-[20px] border border-[--border-soft] bg-white/82 px-4 py-3 text-sm leading-7 text-[--text-strong]"
                        >
                          {item}
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[20px] border border-dashed border-[--border-soft] bg-white/76 px-4 py-3 text-sm text-[--text-soft]">
                        这轮还没有替代表达。
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() =>
                      handleCopy(
                        [
                          `一句话总结：${refineResult.summaryLine}`,
                          "",
                          "卖点提炼：",
                          ...refineResult.sellingPoints.map((item) => `- ${item}`),
                          "",
                          "合规建议：",
                          ...refineResult.suggestions.map((item) => `- ${item}`),
                          "",
                          "更稳妥的表达：",
                          ...refineResult.safeRewrites.map((item) => `- ${item}`),
                        ].join("\n"),
                      )
                    }
                    type="button"
                    variant="secondary"
                  >
                    复制这轮整理结果
                  </Button>
                </div>
              ) : (
                <div className="rounded-[24px] border border-dashed border-[--border-soft] bg-white/76 px-5 py-10 text-sm leading-7 text-[--text-soft]">
                  把已有话术贴进来，我会帮你提炼重点、提醒风险，并给一版更稳妥的表达。
                </div>
              )
            ) : null}

            {activeTool === "commission" ? (
              commissionResult ? (
                <div className="space-y-4">
                  <div className="rounded-[24px] border border-[rgba(191,92,49,0.18)] bg-[--brand-soft] px-5 py-5">
                    <div className="text-xs uppercase tracking-[0.2em] text-[--brand]">预计佣金</div>
                    <div className="mt-3 text-[32px] font-semibold leading-none text-[--brand-ink]">
                      {commissionResult.commission} 元
                    </div>
                    <div className="mt-3 text-sm leading-7 text-[--brand-ink]">
                      {commissionResult.sellingPoint}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {commissionResult.comparisons.map((item) => (
                      <div
                        key={`${item.price}-${item.commission}`}
                        className="flex items-center justify-between rounded-[22px] border border-[--border-soft] bg-white/82 px-4 py-4 text-sm"
                      >
                        <span className="text-[--text-soft]">售价 {item.price} 元</span>
                        <span className="font-semibold text-[--text-strong]">
                          佣金 {item.commission} 元
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() =>
                      handleCopy(
                        [
                          `预计佣金：${commissionResult.commission} 元`,
                          commissionResult.sellingPoint,
                          ...commissionResult.comparisons.map(
                            (item) => `售价 ${item.price} 元，佣金 ${item.commission} 元`,
                          ),
                        ].join("\n"),
                      )
                    }
                    type="button"
                    variant="secondary"
                  >
                    复制测算结果
                  </Button>
                </div>
              ) : (
                <div className="rounded-[24px] border border-dashed border-[--border-soft] bg-white/76 px-5 py-10 text-sm leading-7 text-[--text-soft]">
                  把价格和佣金填上，先算清楚这一单值不值得推。
                </div>
              )
            ) : null}
          </div>
        </Card>
      </section>

      {pageError ? (
        <Card className="rounded-[28px] border-[rgba(191,92,49,0.18)] bg-[--brand-soft]">
          <p className="text-sm leading-7 text-[--brand-ink]">{pageError}</p>
        </Card>
      ) : null}
    </div>
  );
}
