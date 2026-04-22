"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/shared/lib/api";
import { plans as fallbackPlans, type Plan } from "./home-model";

type PublicPlan = Omit<Plan, "price"> & {
  priceText?: string;
  price?: string;
};

function normalizePlan(plan: PublicPlan): Plan {
  return {
    ...plan,
    price: plan.priceText || plan.price || "",
    features: Array.isArray(plan.features) ? plan.features : [],
  };
}

export function usePublicPlans() {
  const [items, setItems] = useState<Plan[]>(fallbackPlans);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const data = await apiRequest<PublicPlan[]>("/api/payments/plans/public", {
          retryOnUnauthorized: false,
          timeoutMs: 12000,
        });
        if (!active || !Array.isArray(data) || !data.length) return;
        setItems(data.map(normalizePlan));
      } catch {
        if (active) setItems(fallbackPlans);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return items;
}
