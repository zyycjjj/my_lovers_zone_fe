"use client";

import Image from "next/image";
import { UiButton } from "@/shared/ui/ui-button";
import type { Photo } from "./signal-model";

export function SignalPhotosPanel({
  photos,
  onRefresh,
}: {
  photos: Photo[];
  onRefresh: () => void;
}) {
  return (
    <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">最近照片</h2>
        <UiButton onClick={onRefresh} variant="ghost" className="px-2 py-1 text-xs">
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
  );
}

