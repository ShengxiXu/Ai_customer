"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import { Bot, ChevronRight } from "lucide-react";
import { AgentTemplateLabels } from "@/types";
import type { AgentTemplate } from "@/types";

export default function NewAgentPage() {
  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center text-sm text-muted-foreground">加载中…</div>}>
      <NewAgentContent />
    </Suspense>
  );
}

function NewAgentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const template = (searchParams.get("template") as AgentTemplate) || "blank";

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/ai-config/agent_xiaozhi?tab=scope");
    }, 100);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="mt-4 text-sm text-muted-foreground">
          正在创建「{AgentTemplateLabels[template]}」AI 员工…
        </p>
      </div>
    </div>
  );
}
