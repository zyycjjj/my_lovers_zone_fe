"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiClientError, apiRequest } from "@/shared/lib/api";
import { clearAuthSession, useAuthSession } from "@/shared/lib/session-store";
import {
  buildActiveTips,
  buildExamplePrompts,
  parseCommissionExample,
  tools,
  type AuthMe,
  type CommissionResult,
  type RefineResult,
  type RoutingResult,
  type ScriptResult,
  type TitleResult,
  type ToolKind,
  type WorkspaceList,
  type WorkspaceSummary,
} from "./workspace-model";

export function useWorkspace() {
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

  const activeTips = useMemo(() => buildActiveTips(activeTool), [activeTool]);
  const examplePrompts = useMemo(() => buildExamplePrompts(activeTool), [activeTool]);

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

    const parsed = parseCommissionExample(example);
    setCommissionPrice(parsed.price);
    setCommissionRate(parsed.commissionRate);
    setPlatformRate(parsed.platformRate);
  }

  function selectTool(next: ToolKind) {
    setActiveTool(next);
    setToolError("");
    setCopiedText("");
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

  return {
    activeResultExists,
    activeTips,
    activeTool,
    activeToolMeta,
    commissionPrice,
    commissionRate,
    commissionResult,
    copiedText,
    displayName,
    examplePrompts,
    handleCopy,
    handleExampleClick,
    handleLogout,
    handleSubmitTool,
    loading,
    loadingTool,
    me,
    pageError,
    platformRate,
    refineResult,
    refineText,
    scriptAudience,
    scriptKeyword,
    scriptPrice,
    scriptResult,
    scriptScene,
    scriptStyle,
    selectTool,
    setActiveTool,
    setCommissionPrice,
    setCommissionRate,
    setPlatformRate,
    setRefineText,
    setScriptAudience,
    setScriptKeyword,
    setScriptPrice,
    setScriptResult,
    setScriptScene,
    setScriptStyle,
    setTitleKeyword,
    setTitleResult,
    setTitleStyle,
    titleKeyword,
    titleResult,
    titleStyle,
    toolError,
    workspaces,
  };
}
