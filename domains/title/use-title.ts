"use client";

import { useState } from "react";
import { apiRequest } from "@/shared/lib/api";
import { useClientToken } from "@/shared/lib/use-client-token";
import type { TitleResult } from "./title-model";

export function useTitleTool() {
  const { token, setToken } = useClientToken();
  const [keyword, setKeyword] = useState("");
  const [style, setStyle] = useState("");
  const [titles, setTitles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!token) {
      setError("请先填写 token");
      return;
    }
    if (!keyword.trim()) {
      setError("请输入商品关键词");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest<TitleResult>("/api/tool/title", {
        token,
        body: { keyword, style: style || undefined },
      });
      setTitles(data.titles ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败");
    } finally {
      setLoading(false);
    }
  };

  return {
    error,
    keyword,
    loading,
    setKeyword,
    setStyle,
    setToken,
    style,
    submit,
    titles,
    token,
  };
}

