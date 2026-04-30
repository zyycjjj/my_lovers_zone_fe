"use client";

import { useCallback, useMemo, useState } from "react";
import { apiRequest, ApiClientError } from "@/shared/lib/api";
import {
  buildActiveTips,
  buildExamplePrompts,
  parseCommissionExample,
  tools,
  type CommissionResult,
  type RefineResult,
  type ToolKind,
} from "./workspace-model";
import { goals, type Goal } from "./workspace-goal-picker";
import { submitWorkspaceTool } from "./workspace-tool-requests";
import { useTracking } from "./use-tracking";

function buildRefineText(result: RefineResult) {
  return [
    `一句话总结：${result.summaryLine || "暂无"}`,
    "",
    "卖点提炼：",
    ...result.sellingPoints.map((item, index) => `${index + 1}. ${item}`),
    "",
    "合规建议：",
    ...result.suggestions.map((item, index) => `${index + 1}. ${item}`),
    "",
    "更稳妥的表达：",
    ...result.safeRewrites.map((item, index) => `${index + 1}. ${item}`),
  ].join("\n");
}

function buildCommissionText(result: CommissionResult) {
  return [
    `预计佣金：${result.commission} 元`,
    result.sellingPoint,
    ...result.comparisons.map((item) => `售价 ${item.price} 元，佣金 ${item.commission} 元`),
  ].join("\n");
}

export function useWorkspaceTools(onEntitlementChange?: () => void | Promise<unknown>) {
  const [activeTool, setActiveTool] = useState<ToolKind>("title");
  const [activeGoalKey, setActiveGoalKey] = useState<string | null>(null);
  const [toolError, setToolError] = useState("");
  const [loadingTool, setLoadingTool] = useState<ToolKind | null>(null);
  const [copiedText, setCopiedText] = useState("");
  const [resultActionMessage, setResultActionMessage] = useState("");
  const [savingAsset, setSavingAsset] = useState(false);
  const [resumedDraftPrompt, setResumedDraftPrompt] = useState("");

  // 埋点
  const { trackToolUsed, trackContentSaved, trackContentCompleted, trackContentCopied, trackGoalSelected } = useTracking();

  const [titleKeyword, setTitleKeyword] = useState("");
  const [titleStyle, setTitleStyle] = useState("");
  const [titleResult, setTitleResult] = useState<string[]>([]);
  const [titleAssetId, setTitleAssetId] = useState<number | undefined>();

  const [scriptKeyword, setScriptKeyword] = useState("");
  const [scriptPrice, setScriptPrice] = useState("");
  const [scriptAudience, setScriptAudience] = useState("");
  const [scriptScene, setScriptScene] = useState("");
  const [scriptStyle, setScriptStyle] = useState<"short" | "live">("short");
  const [scriptResult, setScriptResult] = useState("");
  const [scriptAssetId, setScriptAssetId] = useState<number | undefined>();

  const [refineText, setRefineText] = useState("");
  const [refineResult, setRefineResult] = useState<RefineResult | null>(null);

  const [commissionPrice, setCommissionPrice] = useState("");
  const [commissionRate, setCommissionRate] = useState("");
  const [platformRate, setPlatformRate] = useState("");
  const [commissionResult, setCommissionResult] = useState<CommissionResult | null>(null);

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

  const activeResultText = useMemo(() => {
    if (activeTool === "title") {
      return titleResult.map((item, index) => `${index + 1}. ${item}`).join("\n");
    }
    if (activeTool === "script") return scriptResult.trim();
    if (activeTool === "refine" && refineResult) return buildRefineText(refineResult);
    if (activeTool === "commission" && commissionResult) return buildCommissionText(commissionResult);
    return "";
  }, [activeTool, titleResult, scriptResult, refineResult, commissionResult]);

  const activeResultTitle = useMemo(() => {
    if (activeTool === "title") return titleKeyword.trim() || "标题生成结果";
    if (activeTool === "script") return scriptKeyword.trim() || resumedDraftPrompt.trim() || "脚本生成结果";
    if (activeTool === "refine") return "话术提炼结果";
    return "佣金测算结果";
  }, [activeTool, titleKeyword, scriptKeyword, resumedDraftPrompt]);

  const activeSourcePrompt = useMemo(() => {
    if (activeTool === "title") return titleKeyword.trim();
    if (activeTool === "script") return scriptKeyword.trim() || resumedDraftPrompt.trim();
    if (activeTool === "refine") return refineText.trim();
    if (activeTool === "commission") {
      return [commissionPrice && `售价 ${commissionPrice}`, commissionRate && `佣金 ${commissionRate}`, platformRate && `扣点 ${platformRate}`]
        .filter(Boolean)
        .join("，");
    }
    return "";
  }, [
    activeTool,
    titleKeyword,
    scriptKeyword,
    resumedDraftPrompt,
    refineText,
    commissionPrice,
    commissionRate,
    platformRate,
  ]);

  const activeTips = useMemo(() => buildActiveTips(activeTool), [activeTool]);
  const examplePrompts = useMemo(() => buildExamplePrompts(activeTool), [activeTool]);

  const nextActions = useMemo(() => {
    if (!activeResultExists) return [];
    const actions: { label: string; onClick: () => void; variant: "primary" | "secondary" | "ghost" }[] = [];

    if (activeTool === "title") {
      actions.push(
        { label: "生成脚本", onClick: () => { selectTool("script"); setScriptKeyword(titleKeyword.trim() || resumedDraftPrompt.trim()); }, variant: "primary" },
        { label: "保存这组", onClick: () => void saveCurrentResult(false), variant: "secondary" },
      );
    } else if (activeTool === "script") {
      actions.push(
        { label: "提炼话术", onClick: () => void refineCurrentScript(), variant: "primary" },
        { label: "生成标题", onClick: () => void generateTitlesFromScript(), variant: "secondary" },
        { label: "复制并完成", onClick: () => void copyAndCompleteCurrentResult(), variant: "ghost" },
      );
    } else if (activeTool === "refine") {
      actions.push(
        { label: "生成标题", onClick: () => void generateTitlesFromScript(), variant: "primary" },
        { label: "保存结果", onClick: () => void saveCurrentResult(false), variant: "secondary" },
      );
    } else if (activeTool === "commission") {
      actions.push(
        { label: "生成脚本", onClick: () => { selectTool("script"); setScriptKeyword(commissionPrice.trim()); }, variant: "primary" },
        { label: "保存测算", onClick: () => void saveCurrentResult(false), variant: "secondary" },
      );
    }
    return actions;
  }, [activeTool, activeResultExists, titleKeyword, resumedDraftPrompt, commissionPrice]);

  async function handleCopy(text: string) {
    if (!text.trim()) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText("已复制到剪贴板");
      trackContentCopied(activeTool); // 埋点：内容复制
      window.setTimeout(() => setCopiedText(""), 1800);
    } catch {
      setCopiedText("复制失败，请手动复制");
      window.setTimeout(() => setCopiedText(""), 1800);
    }
  }

  async function saveCurrentResult(markCompleted = false) {
    const content = activeResultText.trim();
    if (!content) {
      setResultActionMessage("先生成内容，再保存或标记完成。");
      window.setTimeout(() => setResultActionMessage(""), 2200);
      return;
    }

    setSavingAsset(true);
    setResultActionMessage("");

    try {
      await apiRequest("/api/content-assets", {
        body: {
          toolKey: activeTool,
          title: activeResultTitle,
          content,
          sourcePrompt: activeSourcePrompt,
          markCompleted,
        },
      });
      
      // 埋点：内容保存/完成
      if (markCompleted) {
        trackContentCompleted(activeTool);
      } else {
        trackContentSaved(activeTool);
      }
      
      setResultActionMessage(markCompleted ? "已记录完成，明天可以接着这条继续。" : "已保存到内容记录。");
      window.setTimeout(() => setResultActionMessage(""), 2400);
    } catch (err) {
      setResultActionMessage(
        err instanceof ApiClientError
          ? err.message
          : err instanceof Error
            ? err.message
            : "保存失败，请稍后再试。",
      );
    } finally {
      setSavingAsset(false);
    }
  }

  async function copyAndCompleteCurrentResult() {
    const content = activeResultText.trim();
    if (!content) {
      setResultActionMessage("先生成内容，再标记完成。");
      window.setTimeout(() => setResultActionMessage(""), 2200);
      return;
    }

    await handleCopy(content);
    await saveCurrentResult(true);
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
    setTitleAssetId(undefined);
    setScriptAssetId(undefined);
  }

  function handleGoalSelect(goal: Goal) {
    setActiveGoalKey(goal.key);
    setActiveTool(goal.defaultTool);
    setToolError("");
    setCopiedText("");
    trackGoalSelected(goal.key); // 埋点：目标选择
    if (goal.key === "publish") {
      if (!scriptKeyword.trim()) {
        setScriptKeyword("今天要发的内容主题是：");
      }
    } else if (goal.key === "new_product") {
      if (!titleKeyword.trim()) {
        setTitleKeyword("新上架的商品名称或关键词：");
      }
    } else if (goal.key === "convert") {
      if (!refineText.trim()) {
        setRefineText("粘贴需要优化的话术或脚本内容：");
      }
    }
  }

  function handleGoalClear() {
    setActiveGoalKey(null);
  }

  async function refineCurrentScript() {
    const normalizedScript = scriptResult.trim();
    if (!normalizedScript) {
      setToolError("先生成一版脚本，再继续提炼话术。");
      return;
    }

    setActiveTool("refine");
    setRefineText(normalizedScript);
    setToolError("");
    setCopiedText("");
    setLoadingTool("refine");

    try {
      const result = await submitWorkspaceTool("refine", {
        commissionPrice,
        commissionRate,
        platformRate,
        refineText: normalizedScript,
        scriptAudience,
        scriptKeyword,
        scriptPrice,
        scriptScene,
        scriptStyle,
        titleKeyword,
        titleStyle,
      });

      if (result.kind === "refine") {
        setRefineResult(result.refineResult);
        setScriptAssetId(undefined);
      }
    } catch (err) {
      setToolError(
        err instanceof ApiClientError
          ? err.message
          : err instanceof Error
            ? err.message
            : "这轮提炼暂时没有跑通，请稍后再试。",
      );
    } finally {
      setLoadingTool(null);
      void onEntitlementChange?.();
    }
  }

  async function generateTitlesFromScript() {
    const normalizedScript = scriptResult.trim();
    const normalizedKeyword = scriptKeyword.trim();
    const derivedKeyword = normalizedKeyword || resumedDraftPrompt.trim() || normalizedScript.replace(/\s+/g, " ").slice(0, 36);

    if (!derivedKeyword) {
      setToolError("先生成一版内容，再帮你出标题。");
      return;
    }

    setActiveTool("title");
    setTitleKeyword(derivedKeyword);
    setToolError("");
    setCopiedText("");
    setLoadingTool("title");

    try {
      const result = await submitWorkspaceTool("title", {
        commissionPrice,
        commissionRate,
        platformRate,
        refineText,
        scriptAudience,
        scriptKeyword,
        scriptPrice,
        scriptScene,
        scriptStyle,
        titleKeyword: derivedKeyword,
        titleStyle: titleStyle.trim() || "种草感",
      });

      if (result.kind === "title") {
        setTitleResult(result.titleResult);
        setTitleAssetId(result.assetId);
      }
    } catch (err) {
      setToolError(
        err instanceof ApiClientError
          ? err.message
          : err instanceof Error
            ? err.message
            : "这轮标题暂时没有跑通，请稍后再试。",
      );
    } finally {
      setLoadingTool(null);
      void onEntitlementChange?.();
    }
  }

  const resumeTrialDraft = useCallback(
    async (prompt: string) => {
      const normalizedPrompt = prompt.trim();
      if (!normalizedPrompt) return;

      setActiveTool("script");
      setScriptKeyword(normalizedPrompt);
      setResumedDraftPrompt(normalizedPrompt);
      setToolError("");
      setCopiedText("");
      setTitleResult([]);
      setScriptResult("");
      setRefineResult(null);
      setCommissionResult(null);
      setLoadingTool("script");

      try {
        const result = await submitWorkspaceTool("script", {
          commissionPrice,
          commissionRate,
          platformRate,
          refineText,
          scriptAudience,
          scriptKeyword: normalizedPrompt,
          scriptPrice,
          scriptScene,
          scriptStyle,
          titleKeyword,
          titleStyle,
        });

        if (result.kind === "script") {
          setScriptResult(result.scriptResult);
          setScriptAssetId(result.assetId);
        }
      } catch (err) {
        setToolError(
          err instanceof ApiClientError
            ? err.message
            : err instanceof Error
              ? err.message
              : "体验页那轮内容已经带过来了，你可以补两句再继续生成。",
        );
      } finally {
        setLoadingTool(null);
        void onEntitlementChange?.();
      }
    },
    [
      commissionPrice,
      commissionRate,
      platformRate,
      refineText,
      scriptAudience,
      scriptPrice,
      scriptScene,
      scriptStyle,
      titleKeyword,
      titleStyle,
      onEntitlementChange,
    ],
  );

  async function handleSubmitTool() {
    setToolError("");
    setCopiedText("");
    setLoadingTool(activeTool);

    try {
      const result = await submitWorkspaceTool(activeTool, {
        commissionPrice,
        commissionRate,
        platformRate,
        refineText,
        scriptAudience,
        scriptKeyword,
        scriptPrice,
        scriptScene,
        scriptStyle,
        titleKeyword,
        titleStyle,
      });
      
      // 埋点：工具使用
      trackToolUsed(activeTool);
      
      if (result.kind === "title") { setTitleResult(result.titleResult); setTitleAssetId(result.assetId); }
      if (result.kind === "script") { setScriptResult(result.scriptResult); setScriptAssetId(result.assetId); }
      if (result.kind === "refine") { setRefineResult(result.refineResult); }
      if (result.kind === "commission") setCommissionResult(result.commissionResult);
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
      void onEntitlementChange?.();
    }
  }

  const currentAssetId = useMemo(() => {
    if (activeTool === "title") return titleAssetId;
    if (activeTool === "script") return scriptAssetId;
    return undefined;
  }, [activeTool, titleAssetId, scriptAssetId]);

  return {
    activeGoalKey,
    activeResultExists,
    activeResultText,
    activeTips,
    activeTool,
    activeToolMeta,
    commissionPrice,
    commissionRate,
    commissionResult,
    copyAndCompleteCurrentResult,
    copiedText,
    currentAssetId,
    examplePrompts,
    handleCopy,
    handleExampleClick,
    handleGoalClear,
    handleGoalSelect,
    handleSubmitTool,
    loadingTool,
    nextActions,
    platformRate,
    refineCurrentScript,
    refineResult,
    refineText,
    resultActionMessage,
    resumedDraftPrompt,
    resumeTrialDraft,
    saveCurrentResult,
    savingAsset,
    generateTitlesFromScript,
    scriptAudience,
    scriptKeyword,
    scriptPrice,
    scriptResult,
    scriptScene,
    scriptStyle,
    selectTool,
    setCommissionPrice,
    setCommissionRate,
    setPlatformRate,
    setRefineText,
    setScriptAudience,
    setScriptKeyword,
    setScriptPrice,
    setScriptScene,
    setScriptStyle,
    setTitleKeyword,
    setTitleStyle,
    titleKeyword,
    titleResult,
    titleStyle,
    toolError,
  };
}
