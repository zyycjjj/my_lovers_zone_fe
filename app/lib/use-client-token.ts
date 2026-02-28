"use client";

import { useEffect, useState } from "react";

type Profiles = {
  test: string;
  girlfriend: string;
  me: string;
};

const TOKEN_KEY = "love.currentToken";
const PROFILE_KEY = "love.profiles";

const defaultProfiles: Profiles = {
  test: "test",
  girlfriend: "girlfriend",
  me: "me",
};

export function useClientToken() {
  const [token, setTokenState] = useState(() => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams(window.location.search);
    const queryToken = (params.get("t") ?? "").trim();
    if (queryToken) return queryToken;
    return localStorage.getItem(TOKEN_KEY) ?? "";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (token) localStorage.setItem(TOKEN_KEY, token);
  }, [token]);

  const setToken = (next: string) => {
    const value = next.trim();
    setTokenState(value);
  };

  return { token, setToken };
}

export function useProfiles() {
  const [profiles, setProfilesState] = useState<Profiles>(() => {
    if (typeof window === "undefined") return defaultProfiles;
    const stored = localStorage.getItem(PROFILE_KEY);
    if (!stored) return defaultProfiles;
    try {
      const parsed = JSON.parse(stored) as Partial<Profiles>;
      return {
        test: parsed.test ?? defaultProfiles.test,
        girlfriend: parsed.girlfriend ?? defaultProfiles.girlfriend,
        me: parsed.me ?? defaultProfiles.me,
      };
    } catch {
      return defaultProfiles;
    }
  });

  const updateProfiles = (next: Profiles) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
    }
    setProfilesState(next);
  };

  return { profiles, setProfiles: updateProfiles };
}
