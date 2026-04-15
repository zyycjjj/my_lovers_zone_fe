"use client";

import { SignalForm } from "./signal-form";
import { SignalPhotosPanel } from "./signal-photos-panel";
import { SignalTodayPanel } from "./signal-today-panel";
import { SignalUploadPanel } from "./signal-upload-panel";
import { useSignal } from "./use-signal";

export default function SignalScreen() {
  const signal = useSignal();

  return (
    <div className="grid gap-6">
      <SignalForm
        error={signal.error}
        loading={signal.loading}
        message={signal.message}
        mood={signal.mood}
        onMessageChange={signal.setMessage}
        onMoodChange={signal.setMood}
        onStatusChange={signal.setStatus}
        onSubmit={() => void signal.submit()}
        onTokenChange={signal.setToken}
        status={signal.status}
        token={signal.token}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <SignalTodayPanel today={signal.today} />
        <SignalUploadPanel uploading={signal.uploading} onUpload={(file) => void signal.uploadPhoto(file)} />
      </div>

      <SignalPhotosPanel photos={signal.photos} onRefresh={() => void signal.loadPhotos()} />
    </div>
  );
}
