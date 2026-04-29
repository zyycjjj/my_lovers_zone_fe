"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/shared/lib/api";

export type Recommendation = {
  suggestTool: "title" | "script" | "refine" | "commission" | null;
  hint: string;
  reason: string;
  todayMood: string | null;
  todayGoal: string | null;
  latestAsset: {
    id: number;
    toolKey: string;
    title?: string | null;
    status: string;
  } | null;
  toolPreference: Record<string, number>;
};

export function useRecommendation() {
  const [data, setData] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    apiRequest<Recommendation>("/api/recommendations/me")
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}
