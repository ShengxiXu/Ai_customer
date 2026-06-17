"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import {
  Bot, Home, MessageSquare, Users, MessageCircle, BookOpen,
  BarChart3, Settings as SettingsIcon, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AgentTemplateLabels } from "@/types";
import type { AgentTemplate } from "@/types";

const mainNavItems = [
  { href: "/dashboard", label: "首页", icon: Home },
  { href: "/conversations", label: "对话", icon: MessageSquare },
  { href: "/customers", label: "顾客", icon: Users },
  { href: "/comments", label: "评论", icon: MessageCircle },
  { href: "/knowledge", label: "知识空间", icon: BookOpen },
  { href: "/ai-config", label: "AI 员工", icon: Bot, active: true },
  { href: "/analytics", label: "数据报表", icon: BarChart3 },
  { href: "/settings", label: "设置", icon: SettingsIcon },
];

export default function NewAgentPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-sm text-muted-foreground">加载中…</div>}>
      <NewAgentContent />
    </Suspense>
  );
}

function NewAgentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const template = (searchParams.get("template") as AgentTemplate) || "blank";

  // 模拟创建：直接跳转到新员工详情
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/ai-config/agent_xiaozhi?tab=scope");
    }, 100);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex h-screen bg-background">
      <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-muted/30">
        <div className="flex h-14 items-center gap-2 px-4 border-b border-border">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-pink-600">
            <span className="text-xs font-bold text-white">来</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-base font-bold text-foreground">来鼓</span>
            <span className="rounded bg-gradient-to-r from-orange-400 to-pink-500 px-1.5 py-0.5 text-[9px] font-medium text-white">Pro</span>
          </div>
        </div>
        <nav className="flex-1 space-y-0.5 p-3">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  item.active
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-xs font-medium text-white">
              超
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-foreground">超级管理员</div>
              <div className="text-[10px] text-muted-foreground">19821719867</div>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
        </div>
      </aside>

      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-sm text-muted-foreground">
            正在创建「{AgentTemplateLabels[template]}」AI 员工…
          </p>
        </div>
      </main>
    </div>
  );
}
