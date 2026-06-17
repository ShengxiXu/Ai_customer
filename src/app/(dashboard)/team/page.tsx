"use client";

import { useState } from "react";
import {
  UserPlus, Settings, Shuffle, Users, Clock, CheckCircle2,
  Mail, Phone, MoreVertical,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlatformIcon } from "@/components/ui/platform-icon";
import { mockAgents, mockAccounts } from "@/lib/mock-data";
import { PlatformLabels, type AgentStatus } from "@/types";
import { cn, formatTime } from "@/lib/utils";

const statusConfig: Record<AgentStatus, { label: string; color: string; dot: string }> = {
  online: { label: "在线", color: "text-emerald-600 bg-emerald-50", dot: "bg-emerald-500" },
  busy: { label: "忙碌", color: "text-red-600 bg-red-50", dot: "bg-red-500" },
  away: { label: "离开", color: "text-amber-600 bg-amber-50", dot: "bg-amber-500" },
  offline: { label: "离线", color: "text-muted-foreground bg-muted", dot: "bg-slate-400" },
};

const roleConfig: Record<string, { label: string; variant: any }> = {
  admin: { label: "管理员", variant: "default" },
  supervisor: { label: "主管", variant: "secondary" },
  agent: { label: "客服", variant: "outline" },
};

export default function TeamPage() {
  const [activeTab, setActiveTab] = useState<"agents" | "routing">("agents");
  const onlineCount = mockAgents.filter((a) => a.status === "online" || a.status === "busy").length;
  const totalActive = mockAgents.reduce((sum, a) => sum + a.activeConversations, 0);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">客服团队</h1>
          <p className="mt-1 text-sm text-muted-foreground">管理客服人员和对话分配规则</p>
        </div>
        <Button size="sm"><UserPlus className="h-4 w-4" />添加客服</Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div><div className="text-sm text-muted-foreground">团队人数</div><div className="mt-1 text-2xl font-bold">{mockAgents.length}</div></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><Users className="h-5 w-5" /></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div><div className="text-sm text-muted-foreground">在线客服</div><div className="mt-1 text-2xl font-bold text-emerald-600">{onlineCount}</div></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"><CheckCircle2 className="h-5 w-5" /></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div><div className="text-sm text-muted-foreground">活跃会话</div><div className="mt-1 text-2xl font-bold text-purple-600">{totalActive}</div></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600"><Clock className="h-5 w-5" /></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div><div className="text-sm text-muted-foreground">分配规则</div><div className="mt-1 text-2xl font-bold">轮询分配</div></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600"><Shuffle className="h-5 w-5" /></div>
          </div>
        </CardContent></Card>
      </div>

      <div className="flex gap-1 border-b border-border">
        {([{"key":"agents","label":"客服列表"},{"key":"routing","label":"分配规则"}] as const).map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={cn("relative px-4 py-2.5 text-sm font-medium transition-colors",
              activeTab === tab.key ? "text-primary" : "text-muted-foreground hover:text-foreground")}>
            {tab.label}
            {activeTab === tab.key && <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary" />}
          </button>
        ))}
      </div>

      {activeTab === "agents" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockAgents.map((agent) => {
            const sc = statusConfig[agent.status];
            const workload = Math.round((agent.activeConversations / agent.maxConcurrent) * 100);
            return (
              <Card key={agent.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar name={agent.name} size="lg" />
                        <span className={cn("absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card", sc.dot)} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{agent.name}</span>
                          <Badge variant={roleConfig[agent.role].variant} className="text-[9px] py-0">{roleConfig[agent.role].label}</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">{agent.department}</div>
                        <span className={cn("mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium", sc.color)}>
                          <span className={cn("h-1.5 w-1.5 rounded-full", sc.dot)} />{sc.label}
                          {agent.onlineSince && ` · ${formatTime(agent.onlineSince)}`}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                  </div>
                  <div className="mt-3 space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-3 w-3" />{agent.email}</div>
                    {agent.phone && <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-3 w-3" />{agent.phone}</div>}
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">会话负载</span>
                      <span className="font-medium">{agent.activeConversations}/{agent.maxConcurrent}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className={cn("h-full rounded-full transition-all", workload > 80 ? "bg-red-500" : workload > 50 ? "bg-amber-500" : "bg-emerald-500")} style={{ width: `${workload}%` }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {activeTab === "routing" && (
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">分配策略</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { key: "round_robin", title: "轮询分配", desc: "按顺序轮流分配给在线客服，保证负载均衡", active: true },
                { key: "least_load", title: "最少负载优先", desc: "优先分配给当前活跃会话最少的客服", active: false },
                { key: "designated", title: "指定分配", desc: "按账号/平台指定专属客服接待", active: false },
                { key: "skill_based", title: "技能组分配", desc: "根据客户标签和客服技能匹配分配", active: false },
              ].map((rule) => (
                <div key={rule.key} className={cn("flex items-center justify-between rounded-lg border p-3 transition-colors cursor-pointer",
                  rule.active ? "border-primary bg-primary/5" : "border-border hover:bg-accent/30")}>
                  <div>
                    <div className="flex items-center gap-2"><span className="text-sm font-medium">{rule.title}</span>{rule.active && <Badge variant="default" className="text-[9px] py-0">当前</Badge>}</div>
                    <p className="text-xs text-muted-foreground mt-0.5">{rule.desc}</p>
                  </div>
                  <input type="radio" checked={rule.active} readOnly className="h-4 w-4 accent-primary" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">账号-客服绑定</CardTitle>
              <Button variant="outline" size="sm"><Settings className="h-4 w-4" />编辑绑定</Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {mockAccounts.map((acc) => {
                const agent = mockAgents.find((a) => a.id === acc.assignedAgentId);
                return (
                  <div key={acc.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div className="flex items-center gap-3">
                      <PlatformIcon platform={acc.platform} size={20} />
                      <div><div className="text-sm font-medium">{acc.name}</div><div className="text-xs text-muted-foreground">{PlatformLabels[acc.platform]} · {acc.followers.toLocaleString()} 粉丝</div></div>
                    </div>
                    <div className="flex items-center gap-2">
                      {agent ? (<><Avatar name={agent.name} size="sm" /><span className="text-sm font-medium">{agent.name}</span></>) : (<Badge variant="warning" className="text-[10px]">未分配</Badge>)}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">离线转接规则</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[{"t":"客服离线时自动转接","d":"当负责客服离线时，自动将新消息转给其他在线客服","c":true},{"t":"离线消息待处理","d":"客服离线时消息标记为待处理，待其上线后处理","c":false},{"t":"超时自动转AI","d":"客服5分钟未回复时，自动切换为AI托管","c":true}].map((r) => (
                <label key={r.t} className="flex items-center justify-between">
                  <div><div className="text-sm font-medium">{r.t}</div><div className="text-xs text-muted-foreground">{r.d}</div></div>
                  <input type="checkbox" defaultChecked={r.c} className="h-4 w-4 accent-primary" />
                </label>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
