"use client";

import { useCallback, useMemo, useState } from "react";
import { ApiClientError } from "@/shared/lib/api";
import {
  buildActiveTips,
  buildExamplePrompts,
  parseCommissionExample,
  tools,
  type CommissionResult,
  type RefineResult,
  type ToolKind,
} from "./workspace-model";
import { submitWorkspaceTool } from "./workspace-tool-requests";

export function useWorkspaceTools() {
  const [activeTool, setActiveTool] = useState<ToolKind>("title");
  const [toolError, setToolError] = useState("");
  const [loadingTool, setLoadingTool] = useState<ToolKind | null>(null);
  const [copiedText, setCopiedText] = useState("");
  const [resumedDraftPrompt, setResumedDraftPrompt] = useState("");

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
      if (result.kind === "title") setTitleResult(result.titleResult);
      if (result.kind === "script") setScriptResult(result.scriptResult);
      if (result.kind === "refine") setRefineResult(result.refineResult);
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
    examplePrompts,
    handleCopy,
    handleExampleClick,
    handleSubmitTool,
    loadingTool,
    platformRate,
    refineResult,
    refineText,
    resumedDraftPrompt,
    resumeTrialDraft,
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
