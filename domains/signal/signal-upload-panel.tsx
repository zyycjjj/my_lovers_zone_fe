"use client";

export function SignalUploadPanel({
  uploading,
  onUpload,
}: {
  uploading: boolean;
  onUpload: (file: File) => void;
}) {
  return (
    <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800">上传照片</h2>
      <p className="mt-2 text-sm text-slate-500">支持 jpg/png/webp，最多 5MB</p>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onUpload(file);
        }}
        className="mt-4 w-full text-sm text-slate-500"
        disabled={uploading}
      />
      {uploading ? <div className="mt-2 text-sm text-slate-500">上传中...</div> : null}
    </div>
  );
}

