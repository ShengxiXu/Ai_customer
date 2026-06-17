"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Bot, Plus, Search, ListFilter, Grid3x3, Home, MessageSquare,
  Users, MessageCircle, BookOpen, UserCog, BarChart3, Settings,
  Sparkles, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { mockAIAgents } from "@/lib/mock-data";
import { cn, formatDate } from "@/lib/utils";
import { PlatformLabels, PlatformColors } from "@/types";
import type { AIAgent, AIAgentStatus, AgentTemplate } from "@/types";
import { AgentTemplateLabels } from "@/types";

const mainNavItems = [
  { href: "/dashboard", label: "首页", icon: Home },
  { href: "/conversations", label: "对话", icon: MessageSquare },
  { href: "/customers", label: "顾客", icon: Users },
  { href: "/comments", label: "评论", icon: MessageCircle },
  { href: "/knowledge", label: "知识空间", icon: BookOpen },
  { href: "/ai-config", label: "AI 员工", icon: Bot, badge: "Agent", active: true },
  { href: "/analytics", label: "数据报表", icon: BarChart3 },
  { href: "/settings", label: "设置", icon: Settings },
];

export default function AIAgentListPage() {
  const [agents, setAgents] = useState<AIAgent[]>(mockAIAgents);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  const toggleAgent = (id: string) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: (a.status === "enabled" ? "disabled" : "enabled") as AIAgentStatus } : a))
    );
  };

  const filteredAgents = agents.filter((a) => a.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex h-screen bg-background">
      {/* 主侧边栏 */}
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
                {item.badge && (
                  <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">{item.badge}</span>
                )}
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

      {/* 主内容区 */}
      <main className="flex-1 overflow-y-auto">
        {/* 顶部面包屑 */}
        <div className="flex h-14 items-center gap-2 border-b border-border px-6 text-sm">
          <Bot className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">AI 员工</span>
        </div>

        <div className="space-y-4 p-6">
          {/* 标题栏 */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground">AI 员工</h1>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/ai-config/templates">
                <Button className="gap-1.5">
                  <Plus className="h-4 w-4" /> 新建
                </Button>
              </Link>
            </div>
          </div>

          {/* 工具栏 */}
          <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索小智智能体名称..."
                className="h-8 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <button className="flex h-8 w-8 items-center justify-center rounded-md border border-input hover:bg-muted">
              <ListFilter className="h-4 w-4 text-muted-foreground" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md border",
                viewMode === "list" ? "border-primary bg-primary/10 text-primary" : "border-input text-muted-foreground hover:bg-muted"
              )}
            >
              <ListFilter className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md border",
                viewMode === "grid" ? "border-primary bg-primary/10 text-primary" : "border-input text-muted-foreground hover:bg-muted"
              )}
            >
              <Grid3x3 className="h-4 w-4" />
            </button>
          </div>

          {/* AI员工卡片网格 */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
              {filteredAgents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} onToggle={() => toggleAgent(agent.id)} />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredAgents.map((agent) => (
                <AgentListRow key={agent.id} agent={agent} onToggle={() => toggleAgent(agent.id)} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function AgentCard({ agent, onToggle }: { agent: AIAgent; onToggle: () => void }) {
  return (
    <div className="group rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md">
      <div className="mb-3 flex items-start justify-between">
        <Link href={`/ai-config/${agent.id}`} className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-sm font-semibold text-white">
            {agent.avatar}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-foreground">{agent.name}</div>
            <div className="text-[10px] text-muted-foreground">{AgentTemplateLabels[agent.template]}</div>
          </div>
        </Link>
        <Switch checked={agent.status === "enabled"} onCheckedChange={onToggle} />
      </div>

      <Link href={`/ai-config/${agent.id}`} className="block">
        {agent.boundChannels.length > 0 && (
          <div className="mb-2.5 flex flex-wrap gap-1.5">
            {agent.boundChannels.slice(0, 3).map((ch, i) => (
              <Badge
                key={i}
                variant="outline"
                className="gap-1 border-border bg-background px-1.5 py-0 text-[10px]"
                style={{ color: PlatformColors[ch.platform] }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: PlatformColors[ch.platform] }} />
                {ch.accountName}
              </Badge>
            ))}
            {agent.boundChannels.length > 3 && (
              <Badge variant="outline" className="px-1.5 py-0 text-[10px]">+{agent.boundChannels.length - 3}</Badge>
            )}
          </div>
        )}

        {!agent.scope.expertise && (
          <div className="mb-2 flex items-center gap-1 text-[11px] text-muted-foreground">
            <span className="h-1 w-1 rounded-full bg-muted-foreground" />
            不指定专长
          </div>
        )}

        <div className="text-[10px] text-muted-foreground">更新于 {formatDate(agent.updatedAt)}</div>
      </Link>
    </div>
  );
}

function AgentListRow({ agent, onToggle }: { agent: AIAgent; onToggle: () => void }) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-sm font-semibold text-white">
        {agent.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-foreground">{agent.name}</div>
        <div className="text-xs text-muted-foreground">{AgentTemplateLabels[agent.template]}</div>
      </div>
      <Switch checked={agent.status === "enabled"} onCheckedChange={onToggle} />
    </div>
  );
}
