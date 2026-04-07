"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "../../lib/api";
import { useAuthSession } from "../../lib/session-store";
import { Button, Card, SectionHeading, SoftBadge } from "../../components/ui";

type WorkspaceSummary = {
  id: number;
  name: string;
  type: string;
  role: string;
  status: string;
};

type WorkspaceList = {
  items: WorkspaceSummary[];
};

function describeWorkspace(item: WorkspaceSummary) {
  const typeLabel = item.type === "team" ? "团队空间" : "个人空间";
  const roleLabel =
    item.role === "admin" ? "管理员" : item.role === "editor" ? "编辑成员" : "主理人";
  const statusLabel = item.status === "active" ? "正常使用" : item.status;

  return `${typeLabel} · ${roleLabel} · ${statusLabel}`;
}

export default function WorkspaceSelectPage() {
  const router = useRouter();
  const session = useAuthSession();
  const [items, setItems] = useState<WorkspaceSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.sessionToken) {
      router.replace("/login");
      return;
    }

    let active = true;

    apiRequest<WorkspaceList>("/api/workspaces")
      .then((response) => {
        if (!active) return;
        const nextItems = response.items || [];
        setItems(nextItems);
        setLoading(false);

        if (nextItems.length <= 1) {
          router.replace("/workspace");
        }
      })
      .catch(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [router, session?.sessionToken]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Card className="rounded-[32px]">
        <div className="space-y-4">
          <SoftBadge tone="brand">选择工作空间</SoftBadge>
          <SectionHeading
            eyebrow="选一个"
            title="选一个你现在要进入的空间"
            description="如果你同时在多个空间里工作，先回到这次要继续的那个。"
          />
        </div>
      </Card>

      {loading ? (
        <Card className="rounded-[28px]">
          <p className="text-sm text-[--text-soft]">正在加载空间列表…</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <Card key={item.id} className="rounded-[28px]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-base font-semibold text-[--text-strong]">
                    {item.name}
                  </div>
                  <div className="mt-1 text-sm text-[--text-soft]">
                    {describeWorkspace(item)}
                  </div>
                </div>
                <Button onClick={() => router.push("/workspace")} type="button">
                  进入
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
