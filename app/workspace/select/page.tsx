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
      <Card className="surface-card-strong rounded-[34px] p-6 sm:p-8">
        <div className="space-y-4">
          <SoftBadge tone="brand">选择工作空间</SoftBadge>
          <SectionHeading
            eyebrow="先回到这次要做的那个空间"
            title="选一个你现在要进入的工作空间"
            description="如果你同时在多个空间里工作，先回到这次要继续的那个。"
          />
        </div>
      </Card>

      {loading ? (
        <Card className="rounded-[30px]">
          <p className="text-soft text-sm">正在加载空间列表…</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <Card
              key={item.id}
              className="rounded-[30px] bg-[linear-gradient(180deg,_rgba(255,255,255,0.9)_0%,_rgba(244,241,250,0.78)_100%)]"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-strong text-base font-semibold">
                    {item.name}
                  </div>
                  <div className="text-soft mt-1 text-sm">
                    {describeWorkspace(item)}
                  </div>
                </div>
                <Button className="min-w-[112px]" onClick={() => router.push("/workspace")} type="button">
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
