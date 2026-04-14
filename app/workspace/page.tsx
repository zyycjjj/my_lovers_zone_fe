"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest, ApiClientError } from "../lib/api";
import { clearAuthSession, useAuthSession } from "../lib/session-store";
import { PromptInputCard, ResultDisplayCard, StatusSummaryCard } from "../components/business";
import {
  Button,
  ButtonLink,
  Card,
  ChoicePill,
  EmptyStatePanel,
  FieldGroup,
  MetricPanel,
  NoticePanel,
  SectionHeading,
  SoftBadge,
  cn,
} from "../components/ui";

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

function inputClassName(multiline = false) {
  return cn(
    "input-base",
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
        <p className="text-soft text-sm">正在进入你的工作台…</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="surface-card-strong rounded-[34px] bg-[linear-gradient(180deg,_rgba(255,255,255,0.95)_0%,_rgba(241,234,255,0.84)_100%)]">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <SoftBadge tone="brand">内容工作台</SoftBadge>
              {me?.onboardingCompleted ? <SoftBadge tone="sage">资料已准备好</SoftBadge> : null}
            </div>

            <SectionHeading
              eyebrow="今天先做一轮"
              title={`欢迎回来，${displayName}`}
              description="现在直接从一个入口开始就行。今天先把最重要的一轮做出来，后面再慢慢往下接。"
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricPanel
                hint={`${getWorkspaceRoleLabel(me?.currentWorkspace?.role)} / ${getWorkspaceTypeLabel(me?.currentWorkspace?.type)}`}
                label="当前空间"
                value={me?.currentWorkspace?.name || "个人空间"}
              />
              <MetricPanel
                hint="资料越清楚，后面给你的结果就越贴近。"
                label="今天建议"
                value={todayLine}
              />
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

        <StatusSummaryCard
          description="不需要重开一整套流程，先把今天这一轮继续做下去。"
          footer={
            <div className="space-y-4">
              <NoticePanel>
                不用一口气把所有事做完。先选一个入口，先做出一版，再继续往下走。
              </NoticePanel>
              <div>
                <Button onClick={handleLogout} type="button" variant="secondary">
                  退出登录
                </Button>
              </div>
            </div>
          }
          rows={[
            <div
              key="phone"
              className="rounded-[22px] border border-[rgba(91,70,142,0.1)] bg-white/82 px-4 py-4 text-sm text-soft"
            >
              登录手机号：{me?.account.phone || "已登录"}
            </div>,
            <div
              key="count"
              className="rounded-[22px] border border-[rgba(91,70,142,0.1)] bg-white/82 px-4 py-4 text-sm text-soft"
            >
              空间数量：{workspaces.length}
            </div>,
            <div
              key="ability"
              className="rounded-[22px] border border-[rgba(91,70,142,0.1)] bg-white/82 px-4 py-4 text-sm text-soft"
            >
              现在可用：标题生成、脚本生成、话术整理、佣金测算
            </div>,
          ]}
          title="这次回来先从这里接上"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.98fr_1.02fr]">
        <PromptInputCard
          badge={activeToolMeta.label}
          description={activeToolMeta.description}
          footer={
            <>
              <Button disabled={loadingTool === activeTool} onClick={handleSubmitTool} type="button">
                {loadingTool === activeTool ? "正在生成…" : `开始${activeToolMeta.label}`}
              </Button>
              <div className="bg-slate-soft text-soft inline-flex items-center rounded-full px-4 py-2 text-sm">
                {activeToolMeta.short}
              </div>
            </>
          }
          title="选择一个入口，先把今天这轮做出来"
        >
          <div className="flex flex-wrap items-center gap-3">
            {tools.map((tool) => {
              const active = tool.key === activeTool;
              return (
                <ChoicePill
                  key={tool.key}
                  active={active}
                  onClick={() => {
                    setActiveTool(tool.key);
                    setToolError("");
                    setCopiedText("");
                  }}
                >
                  {tool.label}
                </ChoicePill>
              );
            })}
          </div>

          <div className="space-y-5">
              {activeTool === "title" ? (
                <>
                  <FieldGroup label="商品关键词">
                    <input
                      className={inputClassName()}
                      onChange={(event) => setTitleKeyword(event.target.value)}
                      placeholder="比如：香薰蜡烛、夏季凉感被、厨房收纳架"
                      value={titleKeyword}
                    />
                  </FieldGroup>

                  <FieldGroup label="风格方向" hint="选填">
                    <input
                      className={inputClassName()}
                      onChange={(event) => setTitleStyle(event.target.value)}
                      placeholder="比如：口语感、治愈、强转化"
                      value={titleStyle}
                    />
                  </FieldGroup>
                </>
              ) : null}

              {activeTool === "script" ? (
                <>
                  <FieldGroup label="商品关键词">
                    <input
                      className={inputClassName()}
                      onChange={(event) => setScriptKeyword(event.target.value)}
                      placeholder="比如：家用小风扇"
                      value={scriptKeyword}
                    />
                  </FieldGroup>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FieldGroup label="价格" hint="选填">
                      <input
                        className={inputClassName()}
                        inputMode="decimal"
                        onChange={(event) => setScriptPrice(event.target.value)}
                        placeholder="比如：99"
                        value={scriptPrice}
                      />
                    </FieldGroup>
                    <FieldGroup label="目标人群" hint="选填">
                      <input
                        className={inputClassName()}
                        onChange={(event) => setScriptAudience(event.target.value)}
                        placeholder="比如：租房党、上班族"
                        value={scriptAudience}
                      />
                    </FieldGroup>
                  </div>

                  <FieldGroup label="使用场景" hint="选填">
                    <input
                      className={inputClassName()}
                      onChange={(event) => setScriptScene(event.target.value)}
                      placeholder="比如：办公室、宿舍、通勤"
                      value={scriptScene}
                    />
                  </FieldGroup>

                  <FieldGroup label="输出风格">
                    <div className="flex flex-wrap gap-3">
                      <ChoicePill active={scriptStyle === "short"} onClick={() => setScriptStyle("short")}>
                        短视频种草
                      </ChoicePill>
                      <ChoicePill active={scriptStyle === "live"} onClick={() => setScriptStyle("live")}>
                        直播口播
                      </ChoicePill>
                    </div>
                  </FieldGroup>
                </>
              ) : null}

              {activeTool === "refine" ? (
                <FieldGroup label="原始话术">
                  <textarea
                    className={inputClassName(true)}
                    onChange={(event) => setRefineText(event.target.value)}
                    placeholder="把你已经写好的话术贴进来，Memory 会帮你理顺表达、提炼卖点，并提醒风险。"
                    value={refineText}
                  />
                </FieldGroup>
              ) : null}

              {activeTool === "commission" ? (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FieldGroup label="商品价格">
                      <input
                        className={inputClassName()}
                        inputMode="decimal"
                        onChange={(event) => setCommissionPrice(event.target.value)}
                        placeholder="比如：199"
                        value={commissionPrice}
                      />
                    </FieldGroup>
                    <FieldGroup label="佣金比例">
                      <input
                        className={inputClassName()}
                        inputMode="decimal"
                        onChange={(event) => setCommissionRate(event.target.value)}
                        placeholder="比如：0.2"
                        value={commissionRate}
                      />
                    </FieldGroup>
                  </div>

                  <FieldGroup label="平台扣点" hint="选填">
                    <input
                      className={inputClassName()}
                      inputMode="decimal"
                      onChange={(event) => setPlatformRate(event.target.value)}
                      placeholder="比如：0.1"
                      value={platformRate}
                    />
                  </FieldGroup>
                </>
              ) : null}
          </div>

          {toolError ? <NoticePanel>{toolError}</NoticePanel> : null}
        </PromptInputCard>

        <ResultDisplayCard
          badge={copiedText ? <SoftBadge tone="sage">{copiedText}</SoftBadge> : null}
          description="先看这一轮结果，再决定下一步怎么继续。"
          title="这轮结果"
        >
            {activeTool === "title" ? (
              titleResult.length ? (
                <div className="space-y-4">
                  <div className="grid gap-3">
                    {titleResult.map((title, index) => (
                      <div
                        key={`${title}-${index}`}
                        className="rounded-[22px] border border-[rgba(91,70,142,0.1)] bg-white/84 px-4 py-4 text-sm leading-7 text-strong"
                      >
                        <span className="text-brand mr-2">{index + 1}.</span>
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
                <EmptyStatePanel>
                  先输一个商品关键词。标题出来之后，你可以直接挑一条先用。
                </EmptyStatePanel>
              )
            ) : null}

            {activeTool === "script" ? (
              scriptResult ? (
                <div className="space-y-4">
                  <pre className="whitespace-pre-wrap rounded-[24px] border border-[rgba(91,70,142,0.1)] bg-white/84 px-5 py-5 text-sm leading-7 text-strong">
                    {scriptResult}
                  </pre>
                  <Button onClick={() => handleCopy(scriptResult)} type="button" variant="secondary">
                    复制这版脚本
                  </Button>
                </div>
              ) : (
                <EmptyStatePanel>
                  先给我一个商品关键词。我会先把开场、脚本和分镜建议整理出来。
                </EmptyStatePanel>
              )
            ) : null}

            {activeTool === "refine" ? (
              refineResult ? (
                <div className="space-y-4">
                  <NoticePanel className="rounded-[24px] px-5 py-5">
                    <div className="text-brand text-xs uppercase tracking-[0.2em]">一句话总结</div>
                    <div className="text-brand-ink mt-3 text-base font-semibold leading-8">
                      {refineResult.summaryLine || "这轮还没有总结结果"}
                    </div>
                  </NoticePanel>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <div className="text-strong text-sm font-semibold">卖点提炼</div>
                      {refineResult.sellingPoints.length ? (
                        refineResult.sellingPoints.map((item, index) => (
                          <div
                            key={`${item}-${index}`}
                            className="rounded-[20px] border border-[rgba(91,70,142,0.1)] bg-white/82 px-4 py-3 text-sm leading-7 text-strong"
                          >
                            {item}
                          </div>
                        ))
                      ) : (
                        <EmptyStatePanel className="rounded-[20px] px-4 py-3">
                          暂时没有提炼出新的卖点。
                        </EmptyStatePanel>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="text-strong text-sm font-semibold">合规建议</div>
                      {refineResult.suggestions.length ? (
                        refineResult.suggestions.map((item, index) => (
                          <div
                            key={`${item}-${index}`}
                            className="rounded-[20px] border border-[rgba(91,70,142,0.1)] bg-white/82 px-4 py-3 text-sm leading-7 text-strong"
                          >
                            {item}
                          </div>
                        ))
                      ) : (
                        <EmptyStatePanel className="rounded-[20px] px-4 py-3">
                          暂时没有新的提醒。
                        </EmptyStatePanel>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-strong text-sm font-semibold">风险提示</div>
                    {refineResult.risks.length ? (
                      refineResult.risks.map((risk, index) => (
                        <div
                          key={`${risk.type}-${index}`}
                          className="rounded-[20px] border border-[rgba(203,96,146,0.16)] bg-white/82 px-4 py-3 text-sm leading-7 text-strong"
                        >
                          <div className="text-brand-ink font-medium">{risk.type}</div>
                          <div className="text-soft mt-1">
                            {risk.matches.join("、")}
                          </div>
                        </div>
                      ))
                    ) : (
                      <EmptyStatePanel className="rounded-[20px] px-4 py-3">
                        这轮没有明显风险词。
                      </EmptyStatePanel>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="text-strong text-sm font-semibold">更稳妥的表达</div>
                    {refineResult.safeRewrites.length ? (
                      refineResult.safeRewrites.map((item, index) => (
                        <div
                          key={`${item}-${index}`}
                          className="rounded-[20px] border border-[rgba(91,70,142,0.1)] bg-white/82 px-4 py-3 text-sm leading-7 text-strong"
                        >
                          {item}
                        </div>
                      ))
                    ) : (
                      <EmptyStatePanel className="rounded-[20px] px-4 py-3">
                        这轮还没有替代表达。
                      </EmptyStatePanel>
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
                <EmptyStatePanel>
                  把已有话术贴进来，我会帮你提炼重点、提醒风险，并给一版更稳妥的表达。
                </EmptyStatePanel>
              )
            ) : null}

            {activeTool === "commission" ? (
              commissionResult ? (
                <div className="space-y-4">
                  <NoticePanel className="rounded-[24px] px-5 py-5" tone="gold">
                    <div className="text-brand text-xs uppercase tracking-[0.2em]">预计佣金</div>
                    <div className="mt-3 text-[32px] font-semibold leading-none text-[#8e5f00]">
                      {commissionResult.commission} 元
                    </div>
                    <div className="mt-3 text-sm leading-7 text-[#7a5e1c]">
                      {commissionResult.sellingPoint}
                    </div>
                  </NoticePanel>

                  <div className="space-y-3">
                    {commissionResult.comparisons.map((item) => (
                      <div
                        key={`${item.price}-${item.commission}`}
                        className="flex items-center justify-between rounded-[22px] border border-[rgba(91,70,142,0.1)] bg-white/82 px-4 py-4 text-sm"
                      >
                        <span className="text-soft">售价 {item.price} 元</span>
                        <span className="text-strong font-semibold">
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
                <EmptyStatePanel>
                  把价格和佣金填上，先算清楚这一单值不值得推。
                </EmptyStatePanel>
              )
            ) : null}
        </ResultDisplayCard>
      </section>

      {pageError ? (
        <NoticePanel tone="rose">{pageError}</NoticePanel>
      ) : null}
    </div>
  );
}
