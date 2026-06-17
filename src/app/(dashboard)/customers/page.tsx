"use client";

import { useState } from "react";
import { Search, Download, UserPlus, Phone, MessageCircle, Mail, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlatformIcon } from "@/components/ui/platform-icon";
import { mockCustomers, mockTags } from "@/lib/mock-data";
import { PlatformLabels, type Customer, type LeadStatus } from "@/types";
import { cn, formatTime, formatNumber } from "@/lib/utils";

const leadStatusFilters: { key: LeadStatus | "all"; label: string }[] = [
  { key: "all", label: "全部客户" },
  { key: "not_leaded", label: "未留资" },
  { key: "leaded", label: "已留资" },
  { key: "converted", label: "已转化" },
];

const intentConfig: Record<string, { label: string; color: string }> = {
  high: { label: "高意向", color: "text-red-600 bg-red-50" },
  medium: { label: "中意向", color: "text-amber-600 bg-amber-50" },
  low: { label: "低意向", color: "text-slate-600 bg-slate-50" },
  unknown: { label: "待识别", color: "text-muted-foreground bg-muted" },
};

const leadStatusConfig: Record<string, { label: string; variant: any }> = {
  not_leaded: { label: "未留资", variant: "secondary" },
  leaded: { label: "已留资", variant: "success" },
  converted: { label: "已转化", variant: "default" },
};

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [leadFilter, setLeadFilter] = useState<LeadStatus | "all">("all");

  const filteredCustomers = mockCustomers.filter((c) => {
    if (leadFilter !== "all" && c.leadStatus !== leadFilter) return false;
    if (search && !c.name.includes(search) && !c.phone?.includes(search) && !c.wechat?.includes(search)) return false;
    return true;
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">客户管理</h1>
          <p className="mt-1 text-sm text-muted-foreground">管理所有渠道客户，追踪留资转化状态</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Download className="h-4 w-4" />导出</Button>
          <Button size="sm"><UserPlus className="h-4 w-4" />主动私信</Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="p-4">
          <div className="text-sm text-muted-foreground">总客户数</div>
          <div className="mt-1 text-2xl font-bold">{formatNumber(8654)}</div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="text-sm text-muted-foreground">已留资</div>
          <div className="mt-1 text-2xl font-bold text-emerald-600">{formatNumber(1172)}</div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="text-sm text-muted-foreground">已转化</div>
          <div className="mt-1 text-2xl font-bold text-blue-600">{formatNumber(402)}</div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="text-sm text-muted-foreground">留资率</div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-purple-600">34.2%</span>
            <span className="flex items-center text-xs text-emerald-600"><TrendingUp className="h-3 w-3" />+8.1%</span>
          </div>
        </CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜索客户名称、手机号、微信..."
                className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="flex gap-1">
              {leadStatusFilters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setLeadFilter(f.key)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                    leadFilter === f.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="px-4 py-3 font-medium">客户信息</th>
                <th className="px-4 py-3 font-medium">来源平台</th>
                <th className="px-4 py-3 font-medium">联系方式</th>
                <th className="px-4 py-3 font-medium">标签</th>
                <th className="px-4 py-3 font-medium">意向</th>
                <th className="px-4 py-3 font-medium">留资状态</th>
                <th className="px-4 py-3 font-medium">最近联系</th>
                <th className="px-4 py-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar name={customer.name} size="sm" />
                        <div className="absolute -bottom-0.5 -right-0.5"><PlatformIcon platform={customer.platform} size={14} /></div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">{customer.name}</div>
                        <div className="text-xs text-muted-foreground">{customer.source}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><Badge variant="outline" className="text-[10px]">{PlatformLabels[customer.platform]}</Badge></td>
                  <td className="px-4 py-3">
                    <div className="space-y-0.5 text-xs">
                      {customer.phone && <div className="flex items-center gap-1"><Phone className="h-3 w-3 text-muted-foreground" />{customer.phone}</div>}
                      {customer.wechat && <div className="flex items-center gap-1"><MessageCircle className="h-3 w-3 text-muted-foreground" />{customer.wechat}</div>}
                      {customer.email && <div className="flex items-center gap-1"><Mail className="h-3 w-3 text-muted-foreground" />{customer.email}</div>}
                      {!customer.phone && !customer.wechat && !customer.email && <span className="text-muted-foreground/50">未留资</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {customer.tags.slice(0, 2).map((tagId) => {
                        const tag = mockTags.find((t) => t.id === tagId);
                        if (!tag) return null;
                        return <span key={tagId} className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ backgroundColor: `${tag.color}15`, color: tag.color }}>{tag.name}</span>;
                      })}
                      {customer.tags.length > 2 && <span className="text-[10px] text-muted-foreground">+{customer.tags.length - 2}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", intentConfig[customer.intentLevel].color)}>
                      {intentConfig[customer.intentLevel].label}
                    </span>
                  </td>
                  <td className="px-4 py-3"><Badge variant={leadStatusConfig[customer.leadStatus].variant} className="text-[10px]">{leadStatusConfig[customer.leadStatus].label}</Badge></td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{formatTime(customer.lastContactAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-7 text-xs">详情</Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs">私信</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
