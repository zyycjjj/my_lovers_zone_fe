"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiClientError, apiRequest } from "@/shared/lib/api";
import { getAuthSessionSnapshot } from "@/shared/lib/session-store";
import { Button, ButtonLink, Card, NoticePanel } from "@/shared/ui/ui";
import { SiteHeader } from "@/shared/ui/site-header";

type SupportConnection = {
  id: number;
  supporterName: string;
  supporterContact: string | null;
  inviteCode: string;
  note: string | null;
  status: "invited" | "active" | "removed";
  createdAt: string;
  acceptedAt: string | null;
  _count?: { sharedAssets: number };
};

type ContentAsset = {
  id: number;
  toolKey: string;
  title: string | null;
  content: string;
  status: string;
  createdAt: string;
};

type SharedItem = {
  id: number;
  note: string | null;
  createdAt: string;
  asset: ContentAsset;
  connection: {
    supporterName: string;
    ownerAccount?: { displayName: string | null; phone: string | null } | null;
  };
};

const toolLabels: Record<string, string> = {
  title: "标题",
  script: "脚本",
  refine: "话术",
  commission: "测算",
  viral: "爆款复刻",
};

export default function SupportersScreen() {
  const router = useRouter();
  const [owned, setOwned] = useState<SupportConnection[]>([]);
  const [supporting, setSupporting] = useState<SupportConnection[]>([]);
  const [assets, setAssets] = useState<ContentAsset[]>([]);
  const [sharedWithMe, setSharedWithMe] = useState<SharedItem[]>([]);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [note, setNote] = useState("");
  const [shareConnectionId, setShareConnectionId] = useState("");
  const [shareAssetId, setShareAssetId] = useState("");
  const [shareNote, setShareNote] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const session = getAuthSessionSnapshot();
    if (!session?.sessionToken) {
      router.replace("/login");
      return;
    }
    const code = new URLSearchParams(window.location.search).get("invite");
    if (code) setInviteCode(code);
    loadData();
  }, [router]);

  const activeConnections = useMemo(
    () =>
      owned.filter(
        (item) => item.status === "active" || item.status === "invited"
      ),
    [owned]
  );

  async function loadData() {
    setError("");
    try {
      const [supporters, assetRes, sharedRes] = await Promise.all([
        apiRequest<{
          owned: SupportConnection[];
          supporting: SupportConnection[];
        }>("/api/supporters"),
        apiRequest<{ items: ContentAsset[] }>(
          "/api/content-assets/me?limit=20"
        ),
        apiRequest<{ items: SharedItem[] }>("/api/supporters/shared-with-me"),
      ]);
      setOwned(supporters.owned || []);
      setSupporting(supporters.supporting || []);
      setAssets(assetRes.items || []);
      setSharedWithMe(sharedRes.items || []);
      if (!shareConnectionId && supporters.owned?.[0])
        setShareConnectionId(String(supporters.owned[0].id));
      if (!shareAssetId && assetRes.items?.[0])
        setShareAssetId(String(assetRes.items[0].id));
    } catch (err) {
      setError(
        err instanceof ApiClientError
          ? err.message
          : "加载失败了，稍后再试一下。"
      );
    }
  }

  async function createInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await apiRequest("/api/supporters/invitations", {
        method: "POST",
        body: {
          supporterName: name,
          supporterContact: contact || undefined,
          note: note || undefined,
        },
      });
      setName("");
      setContact("");
      setNote("");
      await loadData();
    } catch (err) {
      setError(
        err instanceof ApiClientError ? err.message : "邀请没发出去，先别急。"
      );
    } finally {
      setBusy(false);
    }
  }

  async function shareAsset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!shareConnectionId || !shareAssetId) return;
    setBusy(true);
    setError("");
    try {
      await apiRequest(
        `/api/supporters/connections/${shareConnectionId}/share`,
        {
          method: "POST",
          body: { assetId: Number(shareAssetId), note: shareNote || undefined },
        }
      );
      setShareNote("");
      await loadData();
    } catch (err) {
      setError(
        err instanceof ApiClientError
          ? err.message
          : "分享卡住了，再点一次试试。"
      );
    } finally {
      setBusy(false);
    }
  }

  async function copyInvite(code: string) {
    const url = `${window.location.origin}/supporters?invite=${code}`;
    await navigator.clipboard.writeText(url);
  }

  async function acceptInvite() {
    if (!inviteCode) return;
    setBusy(true);
    setError("");
    try {
      await apiRequest(`/api/supporters/invitations/${inviteCode}/accept`, {
        method: "POST",
      });
      setInviteCode("");
      window.history.replaceState(null, "", "/supporters");
      await loadData();
    } catch (err) {
      setError(
        err instanceof ApiClientError ? err.message : "邀请没接住，再试一次。"
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <SiteHeader />
      <main className="mx-auto max-w-[1060px] px-4 py-6 sm:px-6 lg:px-8">
        <section className="mb-6">
          <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-[#18181B]">
            支持者
          </h1>
          <p className="mt-2 max-w-[680px] text-sm leading-7 text-[#737378]">
            找一个愿意看你往前走的人。不是围观，是在你快懒得动的时候，轻轻敲一下桌子。
          </p>
        </section>

        {error ? (
          <NoticePanel className="mb-4" tone="rose">
            {error}
          </NoticePanel>
        ) : null}

        {inviteCode ? (
          <Card className="mb-4 rounded-[20px] border border-[rgba(137,97,242,0.18)] bg-[#F7F2FF] p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="font-semibold text-[#4A3168]">
                  有人把你拉到旁边了
                </div>
                <div className="mt-1 text-sm text-[#6B5A7A]">
                  接受后，Ta
                  可以把进展分享给你看。你不用表演，只要认真看一眼就很好。
                </div>
              </div>
              <Button
                className="rounded-full bg-[#4A3168] text-white"
                disabled={busy}
                onClick={acceptInvite}
              >
                接住这个邀请
              </Button>
            </div>
          </Card>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <Card className="rounded-[20px] border border-[rgba(0,0,0,0.08)] bg-white p-5">
            <h2 className="text-lg font-semibold text-[#27272A]">
              邀请一个支持者
            </h2>
            <form className="mt-4 space-y-3" onSubmit={createInvite}>
              <input
                className="h-11 w-full rounded-xl border border-[#ECECF0] px-3 text-sm outline-none focus:border-[#4A3168]"
                placeholder="怎么称呼 Ta"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="h-11 w-full rounded-xl border border-[#ECECF0] px-3 text-sm outline-none focus:border-[#4A3168]"
                placeholder="联系方式，可不填"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
              <textarea
                className="min-h-[86px] w-full rounded-xl border border-[#ECECF0] px-3 py-2 text-sm outline-none focus:border-[#4A3168]"
                placeholder="想让 Ta 帮你看什么？比如：每周看一次我有没有发出去。"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <Button
                className="w-full rounded-full bg-[#4A3168] text-white"
                disabled={busy || !name.trim()}
                type="submit"
              >
                生成邀请
              </Button>
            </form>
          </Card>

          <Card className="rounded-[20px] border border-[rgba(0,0,0,0.08)] bg-white p-5">
            <h2 className="text-lg font-semibold text-[#27272A]">
              分享一条进展
            </h2>
            <form className="mt-4 space-y-3" onSubmit={shareAsset}>
              <select
                className="h-11 w-full rounded-xl border border-[#ECECF0] px-3 text-sm outline-none focus:border-[#4A3168]"
                value={shareConnectionId}
                onChange={(e) => setShareConnectionId(e.target.value)}
              >
                <option value="">选一个支持者</option>
                {activeConnections.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.supporterName} ·{" "}
                    {item.status === "active" ? "已接受" : "待接受"}
                  </option>
                ))}
              </select>
              <select
                className="h-11 w-full rounded-xl border border-[#ECECF0] px-3 text-sm outline-none focus:border-[#4A3168]"
                value={shareAssetId}
                onChange={(e) => setShareAssetId(e.target.value)}
              >
                <option value="">选一条内容</option>
                {assets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.title || toolLabels[asset.toolKey] || "未命名内容"}
                  </option>
                ))}
              </select>
              <textarea
                className="min-h-[86px] w-full rounded-xl border border-[#ECECF0] px-3 py-2 text-sm outline-none focus:border-[#4A3168]"
                placeholder="留一句话：今天先发这版，帮我看开头顺不顺。"
                value={shareNote}
                onChange={(e) => setShareNote(e.target.value)}
              />
              <Button
                className="w-full rounded-full bg-[#D4668F] text-white"
                disabled={busy || !shareConnectionId || !shareAssetId}
                type="submit"
              >
                分享给 Ta
              </Button>
            </form>
          </Card>
        </div>

        <section className="mt-6 grid gap-4 lg:grid-cols-2">
          <Card className="rounded-[20px] border border-[rgba(0,0,0,0.08)] bg-white p-5">
            <h2 className="text-lg font-semibold text-[#27272A]">我的支持者</h2>
            <div className="mt-4 space-y-3">
              {owned.length ? (
                owned.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-[#ECECF0] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium text-[#27272A]">
                          {item.supporterName}
                        </div>
                        <div className="mt-1 text-xs text-[#737378]">
                          {item.status === "active"
                            ? "已经在旁边了"
                            : "邀请还在路上"}{" "}
                          · 已分享 {item._count?.sharedAssets || 0} 条
                        </div>
                        {item.note ? (
                          <div className="mt-2 text-sm leading-6 text-[#52525B]">
                            {item.note}
                          </div>
                        ) : null}
                      </div>
                      <button
                        className="shrink-0 rounded-full border border-[#ECECF0] px-3 py-1 text-xs text-[#4A3168]"
                        type="button"
                        onClick={() => copyInvite(item.inviteCode)}
                      >
                        复制邀请
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-[#E4E4E7] p-4 text-sm leading-6 text-[#737378]">
                  还没有邀请谁。先找一个不会催太狠、但会认真看的人。
                </div>
              )}
            </div>
          </Card>

          <Card className="rounded-[20px] border border-[rgba(0,0,0,0.08)] bg-white p-5">
            <h2 className="text-lg font-semibold text-[#27272A]">
              别人分享给我的
            </h2>
            <div className="mt-4 space-y-3">
              {sharedWithMe.length ? (
                sharedWithMe.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-[#ECECF0] p-4"
                  >
                    <div className="text-xs text-[#8961F2]">
                      {item.connection.ownerAccount?.displayName || "有人"}{" "}
                      分享给你
                    </div>
                    <div className="mt-1 font-medium text-[#27272A]">
                      {item.asset.title ||
                        toolLabels[item.asset.toolKey] ||
                        "一条内容"}
                    </div>
                    {item.note ? (
                      <div className="mt-2 text-sm leading-6 text-[#52525B]">
                        {item.note}
                      </div>
                    ) : null}
                    <div className="mt-3 line-clamp-3 text-sm leading-6 text-[#737378]">
                      {item.asset.content}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-[#E4E4E7] p-4 text-sm leading-6 text-[#737378]">
                  暂时还没人把进展递给你。等有人来敲门，这里会亮起来。
                </div>
              )}
            </div>
          </Card>
        </section>

        <div className="mt-6">
          <ButtonLink
            href="/community"
            variant="secondary"
            className="rounded-full"
          >
            去社区看看大家今天在做什么
          </ButtonLink>
        </div>
      </main>
    </div>
  );
}
