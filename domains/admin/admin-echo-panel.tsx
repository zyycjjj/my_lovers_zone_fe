"use client";

import { UiButton } from "@/shared/ui/ui-button";

type Props = {
  echoToken: string;
  echoText: string;
  onEchoTokenChange: (value: string) => void;
  onEchoTextChange: (value: string) => void;
  onSend: () => void;
};

export function AdminEchoPanel({
  echoText,
  echoToken,
  onEchoTextChange,
  onEchoTokenChange,
  onSend,
}: Props) {
  return (
    <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800">发送回声</h2>
      <div className="mt-4 grid gap-3">
        <input
          value={echoToken}
          onChange={(event) => onEchoTokenChange(event.target.value)}
          className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-2 text-sm text-slate-700 focus:border-rose-300 focus:outline-none"
          placeholder="要发送的用户 token"
        />
        <input
          value={echoText}
          onChange={(event) => onEchoTextChange(event.target.value)}
          className="rounded-xl border border-rose-100 bg-white px-4 py-2 text-sm text-slate-700 focus:border-rose-300 focus:outline-none"
          placeholder="一句温柔的话"
        />
        <UiButton onClick={onSend} variant="primary">
          发送回声
        </UiButton>
      </div>
    </div>
  );
}

