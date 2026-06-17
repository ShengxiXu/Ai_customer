"use client";

import Link from "next/link";
import { useState } from "react";
import { Bot, Plus, Search, ListFilter, Grid3x3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { mockAIAgents } from "@/lib/mock-data";
import { cn, formatDate } from "@/lib/utils";
import { PlatformColors } from "@/types";
import type { AIAgent, AIAgentStatus } from "@/types";

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
    <div className="space-y-4 p-6">
      {/* 标题栏 */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">AI 员工</h1>
        <Link href="/ai-config/templates">
          <Button className="gap-1.5">
            <Plus className="h-4 w-4" /> 新建
          </Button>
        </Link>
      </div>

      {/* 工具栏 */}
      <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索小洽智能体名称..."
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
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
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
  );
}

function AgentCard({ agent, onToggle }: { agent: AIAgent; onToggle: () => void }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md">
      <div className="mb-3 flex items-start justify-between">
        <Link href={`/ai-config/${agent.id}`} className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-base">
            🤖
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-foreground">{agent.name}</div>
            <div className="text-[10px] text-muted-foreground">全天接待</div>
          </div>
        </Link>
        <Switch checked={agent.status === "enabled"} onCheckedChange={onToggle} />
      </div>

      <Link href={`/ai-config/${agent.id}`} className="block">
        {agent.boundChannels.length > 0 && (
          <div className="mb-2.5 flex flex-wrap gap-1.5">
            {agent.boundChannels.slice(0, 4).map((ch, i) => (
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
            {agent.boundChannels.length > 4 && (
              <Badge variant="outline" className="px-1.5 py-0 text-[10px]">+{agent.boundChannels.length - 4}</Badge>
            )}
          </div>
        )}

        {agent.boundChannels.length === 0 && (
          <div className="mb-2 text-[11px] text-muted-foreground">一个渠道都没有添加</div>
        )}

        <div className="mb-2 flex items-center gap-1 text-[11px] text-muted-foreground">
          <span className="h-1 w-1 rounded-full bg-muted-foreground" />
          不指定专长
        </div>

        <div className="text-[10px] text-muted-foreground">更新于 {formatDate(agent.updatedAt)}</div>
      </Link>
    </div>
  );
}

function AgentListRow({ agent, onToggle }: { agent: AIAgent; onToggle: () => void }) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-base">
        🤖
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-foreground">{agent.name}</div>
        <div className="text-xs text-muted-foreground">全天接待</div>
      </div>
      <Switch checked={agent.status === "enabled"} onCheckedChange={onToggle} />
    </div>
  );
}
