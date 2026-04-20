"use client";

import { useEffect, useState } from "react";
import { getNumberAuthEnvironment } from "@/shared/lib/number-auth";

export function useQuickLoginAvailability() {
  const [quickLoginAvailable, setQuickLoginAvailable] = useState(false);

  useEffect(() => {
    let active = true;

    getNumberAuthEnvironment()
      .then((env) => {
        if (!active) return;
        setQuickLoginAvailable(Boolean(env && !env.isPc && !env.isWifi));
      })
      .catch(() => {
        if (active) setQuickLoginAvailable(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return quickLoginAvailable;
}

