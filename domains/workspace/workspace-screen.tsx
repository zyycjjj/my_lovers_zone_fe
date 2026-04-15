"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest, ApiClientError } from "@/shared/lib/api";
import { clearAuthSession, useAuthSession } from "@/shared/lib/session-store";
import { Button, ButtonLink, Card, ChoicePill, FieldGroup, NoticePanel, cn } from "@/shared/ui/ui";

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
  icon: string;
  label: string;
  short: string;
  description: string;
  promptLabel: string;
  promptPlaceholder: string;
  emptyTitle: string;
  emptyDescription: string;
}> = [
  {
    key: "title",
    icon: "文",
    label: "标题生成",
    short: "20 条可直接挑选的标题",
    description: "先用一个关键词，把今天要发的标题方向定下来。",
    promptLabel: "描述你要生成的标题方向",
    promptPlaceholder: "例如：春季连衣裙上新，想要更适合小红书的种草标题",
    emptyTitle: "准备好了，开始生成标题吧！",
    emptyDescription: "在上方输入框描述你的商品和标题方向，AI 会先给你一组可直接参考的标题。",
  },
  {
    key: "script",
    icon: "稿",
    label: "脚本生成",
    short: "短视频和直播口播都能先出一版",
    description: "先把可讲的内容搭起来，再决定要不要继续细修。",
    promptLabel: "描述你要生成的脚本内容",
    promptPlaceholder: "例如：家用小风扇，面向租房上班族，想做一版直播口播脚本",
    emptyTitle: "准备好了，开始创作吧！",
    emptyDescription: "在上方输入框描述你的需求，AI 将为你生成一版结构清晰的内容脚本。",
  },
  {
    key: "refine",
    icon: "改",
    label: "话术提炼",
    short: "把已有话术变得更清楚、更稳妥",
    description: "适合你已经有一版话术，想更顺、更合规地表达。",
    promptLabel: "贴入你要提炼的话术",
    promptPlaceholder: "例如：这是我直播间准备讲的一段话术，想更有说服力也更稳妥",
    emptyTitle: "准备好了，开始整理吧！",
    emptyDescription: "把已有话术贴进来，我会帮你提炼卖点、识别风险并给出更顺的表达。",
  },
  {
    key: "commission",
    icon: "算",
    label: "佣金测算",
    short: "先算明白，再决定推不推",
    description: "把价格、佣金和扣点算清楚，避免盲目上链接。",
    promptLabel: "补充测算背景",
    promptPlaceholder: "例如：这款商品想看高客单和低客单两种情况下的佣金空间",
    emptyTitle: "准备好了，开始测算吧！",
    emptyDescription: "填写价格、佣金和扣点信息后，AI 会帮你快速算清这单值不值得推。",
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

function SidebarCard({
  title,
  eyebrow,
  children,
  className,
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("space-y-4 rounded-[20px] border border-[rgba(0,0,0,0.08)] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)]", className)}>
      <div className="space-y-1">
        {eyebrow ? <div className="text-xs font-medium text-[#737378]">{eyebrow}</div> : null}
        <div className="text-base font-semibold text-[#27272A]">{title}</div>
      </div>
      {children}
    </Card>
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

  const activeResultExists = useMemo(() => {
    if (activeTool === "title") return titleResult.length > 0;
    if (activeTool === "script") return Boolean(scriptResult.trim());
    if (activeTool === "refine") return Boolean(refineResult);
    return Boolean(commissionResult);
  }, [activeTool, titleResult, scriptResult, refineResult, commissionResult]);

  const activeTips = useMemo(() => {
    if (activeTool === "title") {
      return [
        "把商品、卖点和平台场景一起写上，标题会更贴近发布场景。",
        "如果你想要情绪感或转化感，可以直接写进需求里。",
        "先出一组，再挑两条继续细化，效率更高。",
      ];
    }
    if (activeTool === "script") {
      return [
        "先写清商品、人群和场景，脚本会更具体。",
        "直播口播建议补充价格和转化目标。",
        "先跑一版，再拿结果去微调节奏和开场。",
      ];
    }
    if (activeTool === "refine") {
      return [
        "原始话术越完整，提炼后的建议越准确。",
        "把你最担心的表达问题直接写进来，会更有针对性。",
        "结果里会同时给到卖点、风险和替代表达。",
      ];
    }
    return [
      "价格和佣金比例是必填，平台扣点建议一起补上。",
      "如果想比较不同售价，可以看测算结果里的对比区。",
      "先算佣金空间，再决定主推哪一档链接更稳。",
    ];
  }, [activeTool]);

  const examplePrompts = useMemo(() => {
    if (activeTool === "title") {
      return [
        "春季连衣裙上新，想要更适合小红书的种草标题",
        "厨房收纳架，突出省空间和实用感",
        "夏季凉感被，想做一组高点击直播预热标题",
        "香薰蜡烛，偏治愈氛围感的文案标题",
      ];
    }
    if (activeTool === "script") {
      return [
        "家用小风扇，适合租房党和办公室场景",
        "美白精华，想做一版直播口播脚本",
        "厨房收纳盒，突出使用前后对比",
        "防晒衣，适合通勤女生的短视频脚本",
      ];
    }
    if (activeTool === "refine") {
      return [
        "这款面膜补水特别快，基本敷完就感觉皮肤状态很好，适合熬夜后急救。",
        "这双鞋真的巨显瘦，而且穿一天都不累，直播间很多姐妹都在回购。",
        "这个锅不挑灶台，热得快，清洗也方便，厨房新手也能轻松上手。",
      ];
    }
    return [
      "爆款零食 39.9 元，佣金 25%，平台扣点 5%",
      "家居小电器 199 元，佣金 18%，平台扣点 8%",
      "护肤套装 299 元，佣金 30%，平台扣点 10%",
    ];
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

  function handleExampleClick(example: string) {
    setToolError("");
    setCopiedText("");

    if (activeTool === "title") {
      setTitleKeyword(example);
      return;
    }

    if (activeTool === "script") {
      setScriptKeyword(example);
      return;
    }

    if (activeTool === "refine") {
      setRefineText(example);
      return;
    }

    const priceMatch = example.match(/(\d+(?:\.\d+)?)\s*元/);
    const commissionMatch = example.match(/佣金\s*(\d+(?:\.\d+)?)%/);
    const platformMatch = example.match(/扣点\s*(\d+(?:\.\d+)?)%/);

    setCommissionPrice(priceMatch?.[1] ?? "");
    setCommissionRate(
      commissionMatch?.[1] ? String(Number(commissionMatch[1]) / 100) : "",
    );
    setPlatformRate(
      platformMatch?.[1] ? String(Number(platformMatch[1]) / 100) : "",
    );
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
      <div className="min-h-screen bg-[#FAFAFA] px-4 py-8 sm:px-6 lg:px-8">
        <Card className="mx-auto max-w-[1200px] rounded-[24px] p-8">
          <p className="text-sm text-[#737378]">正在进入你的工作台…</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
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

      <main className="mx-auto max-w-[1283px] px-4 py-6 sm:px-6 lg:px-8">
        <section className="mb-8 space-y-2">
          <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-[#18181B] sm:text-[30px]">
            开始创作你的内容
          </h1>
          <p className="text-base leading-relaxed text-[#737378]">
            输入你的需求，AI 将为你生成专业内容
          </p>
        </section>

        {pageError ? (
          <NoticePanel className="mb-6" tone="rose">
            {pageError}
          </NoticePanel>
        ) : null}

        <section className="grid gap-6 lg:grid-cols-[minmax(0,824px)_minmax(0,395px)]">
          <div className="space-y-6">
            <Card className="rounded-[20px] border border-[rgba(0,0,0,0.08)] bg-[linear-gradient(135deg,rgba(255,255,255,1)_0%,rgba(245,243,247,0.3)_100%)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] sm:p-[25px]">
              <div className="space-y-5">
                <div className="flex flex-wrap gap-2">
                  {tools.map((tool) => {
                    const active = tool.key === activeTool;
                    return (
                      <ChoicePill
                        key={tool.key}
                        active={active}
                        className={cn(
                          "rounded-full border px-4 py-2 text-sm",
                          active
                            ? "border-[#4A3168] bg-[#F5F3F7] text-[#4A3168]"
                            : "border-[#ECECF0] bg-white text-[#52525B]",
                        )}
                        onClick={() => {
                          setActiveTool(tool.key);
                          setToolError("");
                          setCopiedText("");
                        }}
                      >
                        <span className="inline-flex items-center gap-2">
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[rgba(74,49,104,0.08)] text-[11px] font-semibold text-[#4A3168]">
                            {tool.icon}
                          </span>
                          {tool.label}
                        </span>
                      </ChoicePill>
                    );
                  })}
                </div>

                <div className="space-y-2">
                  <div className="text-[20px] font-semibold text-[#27272A]">
                    {activeToolMeta.promptLabel}
                  </div>
                  <p className="text-sm leading-7 text-[#737378]">
                    {activeToolMeta.description}
                  </p>
                </div>

                <FieldGroup label="内容描述">
                  <textarea
                    className="min-h-[122px] w-full resize-none rounded-[16px] border border-[#ECECF0] bg-white px-4 py-3 text-base leading-6 text-[#27272A] outline-none transition-colors placeholder:text-[#A3A3AB] focus:border-[#4A3168]"
                    onChange={(event) => {
                      const value = event.target.value;
                      if (activeTool === "title") setTitleKeyword(value);
                      if (activeTool === "script") setScriptKeyword(value);
                      if (activeTool === "refine") setRefineText(value);
                    }}
                    placeholder={activeToolMeta.promptPlaceholder}
                    value={
                      activeTool === "title"
                        ? titleKeyword
                        : activeTool === "script"
                          ? scriptKeyword
                          : activeTool === "refine"
                            ? refineText
                            : ""
                    }
                  />
                </FieldGroup>

                {activeTool === "title" ? (
                  <FieldGroup label="风格方向" hint="选填">
                    <input
                      className={inputClassName()}
                      onChange={(event) => setTitleStyle(event.target.value)}
                      placeholder="比如：口语感、情绪感、强转化"
                      value={titleStyle}
                    />
                  </FieldGroup>
                ) : null}

                {activeTool === "script" ? (
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
                    <FieldGroup className="sm:col-span-2" label="使用场景" hint="选填">
                      <input
                        className={inputClassName()}
                        onChange={(event) => setScriptScene(event.target.value)}
                        placeholder="比如：办公室、宿舍、通勤"
                        value={scriptScene}
                      />
                    </FieldGroup>
                    <FieldGroup className="sm:col-span-2" label="输出风格">
                      <div className="flex flex-wrap gap-3">
                        <ChoicePill active={scriptStyle === "short"} onClick={() => setScriptStyle("short")}>
                          短视频种草
                        </ChoicePill>
                        <ChoicePill active={scriptStyle === "live"} onClick={() => setScriptStyle("live")}>
                          直播口播
                        </ChoicePill>
                      </div>
                    </FieldGroup>
                  </div>
                ) : null}

                {activeTool === "commission" ? (
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
                    <FieldGroup className="sm:col-span-2" label="平台扣点" hint="选填">
                      <input
                        className={inputClassName()}
                        inputMode="decimal"
                        onChange={(event) => setPlatformRate(event.target.value)}
                        placeholder="比如：0.1"
                        value={platformRate}
                      />
                    </FieldGroup>
                  </div>
                ) : null}

                {toolError ? <NoticePanel>{toolError}</NoticePanel> : null}

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="text-sm text-[#737378]">{activeToolMeta.short}</div>
                  <Button
                    className="rounded-[16px] bg-[#4A3168] px-6 py-3 text-white hover:bg-[#3D2856]"
                    disabled={loadingTool === activeTool}
                    onClick={handleSubmitTool}
                    type="button"
                  >
                    {loadingTool === activeTool ? "正在生成..." : `开始${activeToolMeta.label}`}
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="rounded-[20px] border border-[rgba(0,0,0,0.08)] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] sm:p-[25px]">
              {activeResultExists ? (
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-[20px] font-semibold text-[#27272A]">这轮结果</div>
                      <div className="mt-1 text-sm text-[#737378]">
                        先看这一轮结果，再决定下一步怎么继续。
                      </div>
                    </div>
                    {copiedText ? (
                      <span className="rounded-full bg-[#F5F3F7] px-3 py-1 text-xs font-medium text-[#4A3168]">
                        {copiedText}
                      </span>
                    ) : null}
                  </div>

                  {activeTool === "title" && titleResult.length ? (
                    <div className="space-y-4">
                      <div className="grid gap-3">
                        {titleResult.map((title, index) => (
                          <div
                            key={`${title}-${index}`}
                            className="rounded-[16px] border border-[rgba(0,0,0,0.08)] bg-white px-4 py-4 text-sm leading-7 text-[#27272A]"
                          >
                            <span className="mr-2 font-semibold text-[#4A3168]">{index + 1}.</span>
                            {title}
                          </div>
                        ))}
                      </div>
                      <Button
                        onClick={() =>
                          handleCopy(
                            titleResult.map((item, index) => `${index + 1}. ${item}`).join("\n"),
                          )
                        }
                        type="button"
                        variant="secondary"
                      >
                        复制这一组标题
                      </Button>
                    </div>
                  ) : null}

                  {activeTool === "script" && scriptResult ? (
                    <div className="space-y-4">
                      <pre className="whitespace-pre-wrap rounded-[16px] border border-[rgba(0,0,0,0.08)] bg-[#FAFAFA] px-4 py-4 text-sm leading-7 text-[#27272A]">
                        {scriptResult}
                      </pre>
                      <Button onClick={() => handleCopy(scriptResult)} type="button" variant="secondary">
                        复制这版脚本
                      </Button>
                    </div>
                  ) : null}

                  {activeTool === "refine" && refineResult ? (
                    <div className="space-y-4">
                      <NoticePanel className="rounded-[16px] px-4 py-4">
                        <div className="text-xs uppercase tracking-[0.2em]">一句话总结</div>
                        <div className="mt-2 text-base font-semibold leading-8">
                          {refineResult.summaryLine || "这轮还没有总结结果"}
                        </div>
                      </NoticePanel>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-3">
                          <div className="text-sm font-semibold text-[#27272A]">卖点提炼</div>
                          {refineResult.sellingPoints.map((item, index) => (
                            <div
                              key={`${item}-${index}`}
                              className="rounded-[16px] border border-[rgba(0,0,0,0.08)] px-4 py-3 text-sm leading-7 text-[#27272A]"
                            >
                              {item}
                            </div>
                          ))}
                        </div>
                        <div className="space-y-3">
                          <div className="text-sm font-semibold text-[#27272A]">合规建议</div>
                          {refineResult.suggestions.map((item, index) => (
                            <div
                              key={`${item}-${index}`}
                              className="rounded-[16px] border border-[rgba(0,0,0,0.08)] px-4 py-3 text-sm leading-7 text-[#27272A]"
                            >
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="text-sm font-semibold text-[#27272A]">风险提示</div>
                        {refineResult.risks.map((risk, index) => (
                          <div
                            key={`${risk.type}-${index}`}
                            className="rounded-[16px] border border-[rgba(212,102,143,0.2)] bg-[#FFF7FA] px-4 py-3 text-sm leading-7 text-[#27272A]"
                          >
                            <div className="font-medium text-[#993D63]">{risk.type}</div>
                            <div className="mt-1 text-[#737378]">{risk.matches.join("、")}</div>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-3">
                        <div className="text-sm font-semibold text-[#27272A]">更稳妥的表达</div>
                        {refineResult.safeRewrites.map((item, index) => (
                          <div
                            key={`${item}-${index}`}
                            className="rounded-[16px] border border-[rgba(0,0,0,0.08)] px-4 py-3 text-sm leading-7 text-[#27272A]"
                          >
                            {item}
                          </div>
                        ))}
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
                  ) : null}

                  {activeTool === "commission" && commissionResult ? (
                    <div className="space-y-4">
                      <NoticePanel className="rounded-[16px] px-4 py-4" tone="gold">
                        <div className="text-xs uppercase tracking-[0.2em]">预计佣金</div>
                        <div className="mt-2 text-[32px] font-semibold leading-none">
                          {commissionResult.commission} 元
                        </div>
                        <div className="mt-3 text-sm leading-7">{commissionResult.sellingPoint}</div>
                      </NoticePanel>
                      <div className="space-y-3">
                        {commissionResult.comparisons.map((item) => (
                          <div
                            key={`${item.price}-${item.commission}`}
                            className="flex items-center justify-between rounded-[16px] border border-[rgba(0,0,0,0.08)] px-4 py-4 text-sm"
                          >
                            <span className="text-[#737378]">售价 {item.price} 元</span>
                            <span className="font-semibold text-[#27272A]">
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
                  ) : null}
                </div>
              ) : (
                <div className="space-y-6 py-4 text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(135deg,#F5F3F7_0%,#FDF4F8_100%)] text-[32px]">
                    ✦
                  </div>
                  <div className="space-y-2">
                    <div className="text-[20px] font-semibold text-[#27272A]">
                      {activeToolMeta.emptyTitle}
                    </div>
                    <p className="mx-auto max-w-[480px] text-sm leading-7 text-[#737378]">
                      {activeToolMeta.emptyDescription}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="text-xs text-[#737378]">💡 试试这些示例：</div>
                    <div className="flex flex-wrap justify-center gap-2">
                      {examplePrompts.map((example) => (
                        <button
                          key={example}
                          className="rounded-[12px] bg-[#F5F3F7] px-3 py-2 text-sm text-[#4A3168]"
                          onClick={() => handleExampleClick(example)}
                          type="button"
                        >
                          {example}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>

          <aside className="space-y-6">
            <SidebarCard eyebrow="工作台概览" title="创作状态">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[34px] font-semibold tracking-[-0.04em] text-[#27272A]">
                    {tools.length}
                  </div>
                  <div className="text-sm text-[#737378]">已接入创作能力</div>
                </div>
                <div className="text-right text-sm text-[#737378]">
                  <div>空间数量</div>
                  <div className="mt-1 text-[20px] font-semibold text-[#993D63]">
                    {workspaces.length}
                  </div>
                </div>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#F5F3F7]">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#D4668F_0%,#4A3168_100%)]"
                  style={{ width: `${(tools.length / 4) * 100}%` }}
                />
              </div>
              <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                <div className="rounded-[16px] bg-[#FAFAFA] px-3 py-3">
                  <div className="text-xs text-[#A3A3AB]">当前空间</div>
                  <div className="mt-1 text-sm font-semibold text-[#27272A]">
                    {me?.currentWorkspace?.name || "个人空间"}
                  </div>
                </div>
                <div className="rounded-[16px] bg-[#FAFAFA] px-3 py-3">
                  <div className="text-xs text-[#A3A3AB]">空间身份</div>
                  <div className="mt-1 text-sm font-semibold text-[#27272A]">
                    {getWorkspaceRoleLabel(me?.currentWorkspace?.role)}
                  </div>
                </div>
                <div className="rounded-[16px] bg-[#FAFAFA] px-3 py-3">
                  <div className="text-xs text-[#A3A3AB]">空间类型</div>
                  <div className="mt-1 text-sm font-semibold text-[#27272A]">
                    {getWorkspaceTypeLabel(me?.currentWorkspace?.type)}
                  </div>
                </div>
              </div>
            </SidebarCard>

            <SidebarCard
              className="bg-[linear-gradient(180deg,rgba(255,249,252,1)_0%,rgba(253,244,248,1)_100%)]"
              eyebrow="推荐入口"
              title={`现在适合先做「${activeToolMeta.label}」`}
            >
              <div className="space-y-3">
                <div className="rounded-[16px] border border-[#F9CFE3] bg-white/80 px-4 py-3 text-sm text-[#993D63]">
                  {activeToolMeta.short}
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="rounded-[16px] border border-[rgba(0,0,0,0.08)] bg-white px-4 py-3">
                    <div className="text-sm font-semibold text-[#27272A]">账号资料</div>
                    <div className="mt-1 text-sm text-[#737378]">
                      {displayName}
                      {me?.onboardingCompleted ? " · 已完成建档" : " · 待完善"}
                    </div>
                  </div>
                  <div className="rounded-[16px] border border-[rgba(0,0,0,0.08)] bg-white px-4 py-3">
                    <div className="text-sm font-semibold text-[#27272A]">登录手机号</div>
                    <div className="mt-1 text-sm text-[#737378]">
                      {me?.account.phone || "当前账号已登录"}
                    </div>
                  </div>
                </div>
              </div>
            </SidebarCard>

            <section className="rounded-[20px] bg-[#4A3168] p-5 text-white shadow-[0_12px_32px_rgba(74,49,104,0.2)]">
              <div className="space-y-4">
                <div className="text-base font-semibold">💡 专业提示</div>
                <div className="space-y-3">
                  {activeTips.map((tip) => (
                    <div
                      key={tip}
                      className="rounded-[14px] border border-white/10 bg-white/8 px-4 py-3 text-sm leading-7 text-white/88"
                    >
                      {tip}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <SidebarCard eyebrow="空间管理" title="保持你的资料和空间状态更新">
              <div className="space-y-4">
                <div className="rounded-[999px] bg-[linear-gradient(135deg,#F5F3F7_0%,#FDF4F8_100%)] p-3 text-center text-[#4A3168]">
                  当前可用：标题生成、脚本生成、话术提炼、佣金测算
                </div>
                <div className="space-y-3">
                  <ButtonLink className="w-full" href="/onboarding">
                    修改资料
                  </ButtonLink>
                  {workspaces.length > 1 ? (
                    <ButtonLink className="w-full" href="/workspace/select" variant="secondary">
                      切换空间
                    </ButtonLink>
                  ) : null}
                  <Button className="w-full" onClick={handleLogout} type="button" variant="ghost">
                    退出登录
                  </Button>
                </div>
              </div>
            </SidebarCard>
          </aside>
        </section>
      </main>
    </div>
  );
}
