"use client";

import { useCallback, useSyncExternalStore } from "react";

export type AuthSessionSnapshot = {
  sessionToken: string;
  refreshToken?: string;
  expiredAt?: string;
};

const STORAGE_KEY = "memory.stage1.session";
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function parse(value: string | null): AuthSessionSnapshot | null {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as Partial<AuthSessionSnapshot>;
    if (!parsed.sessionToken) return null;
    return {
      sessionToken: parsed.sessionToken,
      refreshToken: parsed.refreshToken || "",
      expiredAt: parsed.expiredAt || "",
    };
  } catch {
    return null;
  }
}

let cachedSnapshot: AuthSessionSnapshot | null = null;
let cachedValue: string | null = null;

export function getAuthSessionSnapshot() {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(STORAGE_KEY);
  if (value === cachedValue) return cachedSnapshot;
  cachedValue = value;
  cachedSnapshot = parse(value);
  return cachedSnapshot;
}

function getServerSnapshot() {
  return null;
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener();
  };

  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function saveAuthSession(session: AuthSessionSnapshot) {
  if (typeof window === "undefined") return;
  const value = JSON.stringify(session);
  window.localStorage.setItem(STORAGE_KEY, value);
  cachedValue = value;
  cachedSnapshot = session;
  emit();
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  cachedValue = null;
  cachedSnapshot = null;
  emit();
}

export function useAuthSession() {
  return useSyncExternalStore(subscribe, getAuthSessionSnapshot, getServerSnapshot);
}

export function useAuthSessionActions() {
  const setSession = useCallback((session: AuthSessionSnapshot) => {
    saveAuthSession(session);
  }, []);

  const clearSession = useCallback(() => {
    clearAuthSession();
  }, []);

  return { setSession, clearSession };
}
