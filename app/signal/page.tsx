"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { UiButton } from "../components/ui-button";
import { apiRequest } from "../lib/api";
import { useClientToken } from "../lib/use-client-token";

type Signal = {
  id: number;
  mood: string;
  status: string;
  message?: string;
  createdAt: string;
};

type Photo = {
  id: number;
  url: string;
  createdAt: string;
};

const moods = [
  { label: "甜甜的", value: "sweet" },
  { label: "元气满满", value: "energetic" },
  { label: "有点累", value: "tired" },
  { label: "需要抱抱", value: "hug" },
];

const statuses = [
  { label: "很忙但想你", value: "busy" },
  { label: "心情不错", value: "happy" },
  { label: "有点焦虑", value: "anxious" },
  { label: "想安静", value: "quiet" },
];

export default function SignalPage() {
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

  return (
    <div className="grid gap-6">
      <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-800">今日轻信号</h1>
        <p className="mt-2 text-sm text-slate-500">
          轻轻告诉我你的状态，我会懂
        </p>
        <div className="mt-5 grid gap-4">
          <div>
            <label className="text-sm text-slate-600">访问 Token</label>
            <input
              value={token}
              onChange={(event) => setToken(event.target.value)}
              className="mt-2 w-full rounded-xl border border-rose-100 bg-rose-50 px-4 py-2 text-sm text-slate-700 focus:border-rose-300 focus:outline-none"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm text-slate-600">心情</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {moods.map((item) => (
                  <UiButton
                    key={item.value}
                    onClick={() => setMood(item.value)}
                    variant={mood === item.value ? "primary" : "secondary"}
                    className="px-4 py-2 text-sm"
                  >
                    {item.label}
                  </UiButton>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-600">状态</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {statuses.map((item) => (
                  <UiButton
                    key={item.value}
                    onClick={() => setStatus(item.value)}
                    variant={status === item.value ? "primary" : "secondary"}
                    className="px-4 py-2 text-sm"
                  >
                    {item.label}
                  </UiButton>
                ))}
              </div>
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-600">想说的话（可选）</label>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="mt-2 min-h-[120px] w-full rounded-xl border border-rose-100 bg-white px-4 py-3 text-sm text-slate-700 focus:border-rose-300 focus:outline-none"
              placeholder="例如：今天有点忙，但想你"
            />
          </div>
          {error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs text-rose-600">
              {error}
            </div>
          ) : null}
          <UiButton
            onClick={submit}
            disabled={loading}
            variant="primary"
            className="px-6 py-2 text-sm"
          >
            {loading ? "提交中..." : "提交轻信号"}
          </UiButton>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">今日信号</h2>
          {today ? (
            <div className="mt-4 space-y-2 text-sm text-slate-700">
              <div className="rounded-xl border border-rose-100 bg-rose-50/60 px-4 py-3">
                <div>心情：{today.mood}</div>
                <div>状态：{today.status}</div>
                <div>留言：{today.message || "无"}</div>
              </div>
            </div>
          ) : (
            <div className="mt-4 text-sm text-slate-500">
              今日还没有提交
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">上传照片</h2>
          <p className="mt-2 text-sm text-slate-500">
            支持 jpg/png/webp，最多 5MB
          </p>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) uploadPhoto(file);
            }}
            className="mt-4 w-full text-sm text-slate-500"
            disabled={uploading}
          />
          {uploading ? (
            <div className="mt-2 text-sm text-slate-500">上传中...</div>
          ) : null}
        </div>
      </div>

      <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">最近照片</h2>
          <UiButton
            onClick={loadPhotos}
            variant="ghost"
            className="px-2 py-1 text-xs"
          >
            刷新
          </UiButton>
        </div>
        {photos.length ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="overflow-hidden rounded-2xl border border-rose-100 bg-rose-50/60"
              >
                <Image
                  src={photo.url}
                  alt="love"
                  width={400}
                  height={300}
                  className="h-48 w-full object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 text-sm text-slate-500">暂无照片</div>
        )}
      </div>
    </div>
  );
}
