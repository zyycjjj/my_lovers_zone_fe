"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

type Profiles = {
  test: string;
  girlfriend: string;
  me: string;
};

const TOKEN_KEY = "love.currentToken";
const PROFILE_KEY = "love.profiles";

const defaultProfiles: Profiles = {
  test: "",
  girlfriend: "",
  me: "",
};

const tokenListeners = new Set<() => void>();
const profileListeners = new Set<() => void>();

const getQueryToken = () => {
  if (typeof window === "undefined") return "";
  const params = new URLSearchParams(window.location.search);
  return (params.get("t") ?? "").trim();
};

const getTokenSnapshot = () => {
  if (typeof window === "undefined") return "";
  const queryToken = getQueryToken();
  if (queryToken) return queryToken;
  return localStorage.getItem(TOKEN_KEY) ?? "";
};

const getTokenServerSnapshot = () => "";

const subscribeToken = (listener: () => void) => {
  tokenListeners.add(listener);
  const handleStorage = (event: StorageEvent) => {
    if (event.key === TOKEN_KEY) listener();
  };
  window.addEventListener("storage", handleStorage);
  return () => {
    tokenListeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
};

const emitToken = () => {
  tokenListeners.forEach((listener) => listener());
};

let cachedProfilesRaw: string | null = null;
let cachedProfilesValue: Profiles = defaultProfiles;

const buildProfiles = (stored: string | null) => {
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
};

const getProfilesSnapshot = () => {
  if (typeof window === "undefined") return defaultProfiles;
  const stored = localStorage.getItem(PROFILE_KEY);
  if (stored === cachedProfilesRaw) return cachedProfilesValue;
  cachedProfilesRaw = stored;
  cachedProfilesValue = buildProfiles(stored);
  return cachedProfilesValue;
};

const getProfilesServerSnapshot = () => defaultProfiles;

const subscribeProfiles = (listener: () => void) => {
  profileListeners.add(listener);
  const handleStorage = (event: StorageEvent) => {
    if (event.key === PROFILE_KEY) listener();
  };
  window.addEventListener("storage", handleStorage);
  return () => {
    profileListeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
};

const emitProfiles = () => {
  profileListeners.forEach((listener) => listener());
};

export function useClientToken() {
  const token = useSyncExternalStore(
    subscribeToken,
    getTokenSnapshot,
    getTokenServerSnapshot,
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const queryToken = getQueryToken();
    if (!queryToken) return;
    const stored = localStorage.getItem(TOKEN_KEY) ?? "";
    if (stored !== queryToken) {
      localStorage.setItem(TOKEN_KEY, queryToken);
      emitToken();
    }
  }, [token]);

  const setToken = useCallback((next: string) => {
    const value = next.trim();
    if (typeof window !== "undefined") {
      if (value) {
        localStorage.setItem(TOKEN_KEY, value);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    }
    emitToken();
  }, []);

  return { token, setToken };
}

export function useProfiles() {
  const profiles = useSyncExternalStore(
    subscribeProfiles,
    getProfilesSnapshot,
    getProfilesServerSnapshot,
  );

  const updateProfiles = useCallback((next: Profiles) => {
    const raw = JSON.stringify(next);
    cachedProfilesRaw = raw;
    cachedProfilesValue = next;
    if (typeof window !== "undefined") {
      localStorage.setItem(PROFILE_KEY, raw);
    }
    emitProfiles();
  }, []);

  return { profiles, setProfiles: updateProfiles };
}
