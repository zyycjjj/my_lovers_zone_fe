"use client";

import { type FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiClientError, apiRequest } from "@/shared/lib/api";
import { getAuthSessionSnapshot } from "@/shared/lib/session-store";
import { Button, ButtonLink, Card, NoticePanel } from "@/shared/ui/ui";
import { SiteHeader } from "@/shared/ui/site-header";

type CommunityPost = {
  id: number;
  type: "checkin" | "work_review" | "viral_case";
  title: string;
  content: string;
  platform: string | null;
  sourceUrl: string | null;
  createdAt: string;
  account?: { displayName: string | null } | null;
  asset?: { id: number; toolKey: string; title: string | null } | null;
  _count?: { comments: number; reactions: number };
};

type ContentAsset = {
  id: number;
  toolKey: string;
  title: string | null;
};

const tabs = [
  { key: "", label: "全部" },
  { key: "checkin", label: "开工广场" },
  { key: "work_review", label: "作品互评" },
  { key: "viral_case", label: "爆款案例" },
] as const;

const typeLabels: Record<string, string> = {
  checkin: "开工",
  work_review: "互评",
  viral_case: "案例",
};

const emptyForm = {
  type: "checkin",
  title: "",
  content: "",
  platform: "",
  sourceUrl: "",
  assetId: "",
};

export default function CommunityScreen() {
  const router = useRouter();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [assets, setAssets] = useState<ContentAsset[]>([]);
  const [activeType, setActiveType] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [commentDrafts, setCommentDrafts] = useState<Record<number, string>>(
    {}
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const session = getAuthSessionSnapshot();
    if (!session?.sessionToken) {
      router.replace("/login");
      return;
    }
    loadData(activeType);
  }, [router, activeType]);

  async function loadData(type = activeType) {
    setError("");
    try {
      const query = type ? `?type=${type}` : "";
      const [postRes, assetRes] = await Promise.all([
        apiRequest<{ items: CommunityPost[] }>(`/api/community/posts${query}`),
        apiRequest<{ items: ContentAsset[] }>(
          "/api/content-assets/me?limit=20"
        ),
      ]);
      setPosts(postRes.items || []);
      setAssets(assetRes.items || []);
    } catch (err) {
      setError(
        err instanceof ApiClientError ? err.message : "社区有点堵，等下再进来。"
      );
    }
  }

  async function createPost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await apiRequest("/api/community/posts", {
        method: "POST",
        body: {
          type: form.type,
          title: form.title,
          content: form.content,
          platform: form.platform || undefined,
          sourceUrl: form.sourceUrl || undefined,
          assetId: form.assetId ? Number(form.assetId) : undefined,
        },
      });
      setForm(emptyForm);
      await loadData(activeType);
    } catch (err) {
      setError(
        err instanceof ApiClientError
          ? err.message
          : "没发出去，先把内容留在这儿。"
      );
    } finally {
      setBusy(false);
    }
  }

  async function toggleReaction(postId: number, kind: "like" | "bookmark") {
    await apiRequest(`/api/community/posts/${postId}/reactions`, {
      method: "POST",
      body: { kind },
    });
    await loadData(activeType);
  }

  async function addComment(postId: number) {
    const content = commentDrafts[postId]?.trim();
    if (!content) return;
    await apiRequest(`/api/community/posts/${postId}/comments`, {
      method: "POST",
      body: { content },
    });
    setCommentDrafts((value) => ({ ...value, [postId]: "" }));
    await loadData(activeType);
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <SiteHeader />
      <main className="mx-auto max-w-[1080px] px-4 py-6 sm:px-6 lg:px-8">
        <section className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-[#18181B]">
              任务小广场
            </h1>
            <p className="mt-2 max-w-[680px] text-sm leading-7 text-[#737378]">
              发一张小卡片，看看别人怎么做。这里不比谁厉害，只帮彼此少卡一会儿。
            </p>
          </div>
          <ButtonLink
            href="/supporters"
            variant="secondary"
            className="rounded-full"
          >
            找支持者
          </ButtonLink>
        </section>

        {error ? (
          <NoticePanel className="mb-4" tone="rose">
            {error}
          </NoticePanel>
        ) : null}

        <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
          <Card className="h-fit rounded-[20px] border border-[rgba(0,0,0,0.08)] bg-white p-5">
            <h2 className="text-lg font-semibold text-[#27272A]">
              发一张任务卡
            </h2>
            <form className="mt-4 space-y-3" onSubmit={createPost}>
              <select
                className="h-11 w-full rounded-xl border border-[#ECECF0] px-3 text-sm outline-none focus:border-[#4A3168]"
                value={form.type}
                onChange={(e) =>
                  setForm((value) => ({ ...value, type: e.target.value }))
                }
              >
                <option value="checkin">今天开工了</option>
                <option value="work_review">求一句反馈</option>
                <option value="viral_case">分享一个案例</option>
              </select>
              <input
                className="h-11 w-full rounded-xl border border-[#ECECF0] px-3 text-sm outline-none focus:border-[#4A3168]"
                placeholder="标题，短一点就好"
                value={form.title}
                onChange={(e) =>
                  setForm((value) => ({ ...value, title: e.target.value }))
                }
              />
              <textarea
                className="min-h-[118px] w-full rounded-xl border border-[#ECECF0] px-3 py-2 text-sm outline-none focus:border-[#4A3168]"
                placeholder="今天做了什么、卡在哪、想让大家帮你看哪一眼？"
                value={form.content}
                onChange={(e) =>
                  setForm((value) => ({ ...value, content: e.target.value }))
                }
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  className="h-11 rounded-xl border border-[#ECECF0] px-3 text-sm outline-none focus:border-[#4A3168]"
                  placeholder="平台，可不填"
                  value={form.platform}
                  onChange={(e) =>
                    setForm((value) => ({ ...value, platform: e.target.value }))
                  }
                />
                <input
                  className="h-11 rounded-xl border border-[#ECECF0] px-3 text-sm outline-none focus:border-[#4A3168]"
                  placeholder="案例链接，可不填"
                  value={form.sourceUrl}
                  onChange={(e) =>
                    setForm((value) => ({
                      ...value,
                      sourceUrl: e.target.value,
                    }))
                  }
                />
              </div>
              <select
                className="h-11 w-full rounded-xl border border-[#ECECF0] px-3 text-sm outline-none focus:border-[#4A3168]"
                value={form.assetId}
                onChange={(e) =>
                  setForm((value) => ({ ...value, assetId: e.target.value }))
                }
              >
                <option value="">不关联内容资产</option>
                {assets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.title || asset.toolKey}
                  </option>
                ))}
              </select>
              <Button
                className="w-full rounded-full bg-[#4A3168] text-white"
                disabled={busy || !form.title.trim() || !form.content.trim()}
                type="submit"
              >
                {busy ? "发着呢..." : "发出去"}
              </Button>
            </form>
          </Card>

          <section>
            <div className="mb-4 flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                    activeType === tab.key
                      ? "border-[#4A3168] bg-[#F5F3F7] text-[#4A3168]"
                      : "border-[#ECECF0] bg-white text-[#52525B] hover:border-[#D4C8E0]"
                  }`}
                  onClick={() => setActiveType(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {posts.length ? (
                posts.map((post) => (
                  <Card
                    key={post.id}
                    className="rounded-[20px] border border-[rgba(0,0,0,0.08)] bg-white p-5"
                  >
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#737378]">
                      <span className="rounded-full bg-[#F5F3F7] px-2 py-1 text-[#4A3168]">
                        {typeLabels[post.type]}
                      </span>
                      {post.platform ? <span>{post.platform}</span> : null}
                      <span>
                        {post.account?.displayName || "一个正在努力的人"}
                      </span>
                    </div>
                    <h2 className="mt-3 text-lg font-semibold text-[#27272A]">
                      {post.title}
                    </h2>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-[#52525B]">
                      {post.content}
                    </p>
                    {post.sourceUrl ? (
                      <a
                        className="mt-3 block truncate text-sm text-[#8961F2]"
                        href={post.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {post.sourceUrl}
                      </a>
                    ) : null}
                    {post.asset ? (
                      <div className="mt-3 rounded-xl bg-[#FAFAFA] px-3 py-2 text-xs text-[#737378]">
                        关联内容：{post.asset.title || post.asset.toolKey}
                      </div>
                    ) : null}
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <button
                        className="rounded-full border border-[#ECECF0] px-3 py-1 text-xs text-[#52525B]"
                        type="button"
                        onClick={() => toggleReaction(post.id, "like")}
                      >
                        好的，收到 · {post._count?.reactions || 0}
                      </button>
                      <button
                        className="rounded-full border border-[#ECECF0] px-3 py-1 text-xs text-[#52525B]"
                        type="button"
                        onClick={() => toggleReaction(post.id, "bookmark")}
                      >
                        先存着
                      </button>
                      <span className="text-xs text-[#A1A1AA]">
                        {post._count?.comments || 0} 句反馈
                      </span>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <input
                        className="h-10 flex-1 rounded-full border border-[#ECECF0] px-3 text-sm outline-none focus:border-[#4A3168]"
                        placeholder="留一句有用的，别太用力"
                        value={commentDrafts[post.id] || ""}
                        onChange={(e) =>
                          setCommentDrafts((value) => ({
                            ...value,
                            [post.id]: e.target.value,
                          }))
                        }
                      />
                      <button
                        className="rounded-full bg-[#4A3168] px-4 text-sm text-white"
                        type="button"
                        onClick={() => addComment(post.id)}
                      >
                        发送
                      </button>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="rounded-[20px] border border-dashed border-[#D4D4D8] bg-white p-8 text-center text-sm leading-7 text-[#737378]">
                  这里还挺安静。发第一张卡片吧，别让广场空着吹风。
                </Card>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
