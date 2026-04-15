"use client";

import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "@/shared/lib/api";
import { useClientToken } from "@/shared/lib/use-client-token";
import { moods, statuses, type Photo, type Signal } from "./signal-model";

export function useSignal() {
  const { token, setToken } = useClientToken();
  const [mood, setMood] = useState(moods[0].value);
  const [status, setStatus] = useState(statuses[0].value);
  const [message, setMessage] = useState("");
  const [today, setToday] = useState<Signal | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadToday = useCallback(async () => {
    if (!token) return;
    try {
      const data = await apiRequest<Signal | null>("/api/signal/today", {
        token,
      });
      if (data) {
        setToday(data);
        setMood(data.mood);
        setStatus(data.status);
        setMessage(data.message ?? "");
      } else {
        setToday(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载失败");
    }
  }, [token]);

  const loadPhotos = useCallback(async () => {
    if (!token) return;
    try {
      const data = await apiRequest<Photo[]>("/api/photo/latest", { token });
      setPhotos(data ?? []);
    } catch {
      setPhotos([]);
    }
  }, [token]);

  useEffect(() => {
    loadToday();
    loadPhotos();
  }, [loadPhotos, loadToday]);

  const submit = async () => {
    if (!token) {
      setError("请先填写 token");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest<Signal>("/api/signal", {
        token,
        body: { mood, status, message: message || undefined },
      });
      setToday(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "提交失败");
    } finally {
      setLoading(false);
    }
  };

  const uploadPhoto = async (file: File) => {
    if (!token) {
      setError("请先填写 token");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      if (today?.id) form.append("signalId", String(today.id));
      await apiRequest("/api/photo", { token, body: form, isForm: true });
      await loadPhotos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "上传失败");
    } finally {
      setUploading(false);
    }
  };

  return {
    error,
    loading,
    loadPhotos,
    loadToday,
    message,
    mood,
    photos,
    setMessage,
    setMood,
    setStatus,
    setToken,
    status,
    submit,
    today,
    token,
    uploading,
    uploadPhoto,
  };
}

