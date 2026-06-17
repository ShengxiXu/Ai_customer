"use client";

import {
  TrendingUp, TrendingDown, Bot, Target, Clock, MessageSquare,
  Users, Zap, Download,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, RadialBarChart, RadialBar,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlatformIcon } from "@/components/ui/platform-icon";
import { mockDashboardStats } from "@/lib/mock-data";
import { PlatformLabels, PlatformColors } from "@/types";
import { formatNumber, formatDuration } from "@/lib/utils";

export default function AnalyticsPage() {
  const stats = mockDashboardStats;

  const conversionFunnel = [
    { stage: "总曝光", count: 128000, rate: 100 },
    { stage: "评论互动", count: 18500, rate: 14.5 },
    { stage: "私信咨询", count: 3428, rate: 2.7 },
    { stage: "AI成功接待", count: 2991, rate: 2.3 },
    { stage: "成功留资", count: 1172, rate: 0.9 },
    { stage: "最终转化", count: 402, rate: 0.3 },
  ];

  const intentData = [
    { name: "高意向", value: 1280, fill: "#EF4444" },
    { name: "中意向", value: 1456, fill: "#F59E0B" },
    { name: "低意向", value: 542, fill: "#6B7280" },
    { name: "未知", value: 150, fill: "#D1D5DB" },
  ];

  const aiVsHuman = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (13 - i));
    return {
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      ai: Math.floor(180 + Math.random() * 100),
      human: Math.floor(20 + Math.random() * 40),
    };
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">数据统计</h1>
          <p className="mt-1 text-sm text-muted-foreground">全链路数据分析，洞察获客转化效果</p>
        </div>
        <div className="flex gap-2">
          <select className="h-9 rounded-lg border border-input bg-background px-3 text-sm">
            <option>最近14天</option>
            <option>最近30天</option>
            <option>最近90天</option>
          </select>
          <Button variant="outline" size="sm"><Download className="h-4 w-4" />导出报表</Button>
        </div>
      </div>

      {/* 核心指标 */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "总会话数", value: formatNumber(stats.totalConversations), icon: MessageSquare, color: "text-blue-600 bg-blue-50", change: "+18.2%", trend: "up" },
          { label: "AI接管率", value: `${(stats.aiHandledRate * 100).toFixed(1)}%`, icon: Bot, color: "text-purple-600 bg-purple-50", change: "+5.2%", trend: "up" },
          { label: "留资转化率", value: `${(stats.leadConversionRate * 100).toFixed(1)}%`, icon: Target, color: "text-emerald-600 bg-emerald-50", change: "+8.1%", trend: "up" },
          { label: "平均响应时间", value: formatDuration(stats.avgResponseTime), icon: Clock, color: "text-orange-600 bg-orange-50", change: "-0.5秒", trend: "up" },
          { label: "总留资数", value: formatNumber(stats.totalLeads), icon: Users, color: "text-cyan-600 bg-cyan-50", change: "+326", trend: "up" },
          { label: "总客户数", value: formatNumber(stats.totalCustomers), icon: Users, color: "text-indigo-600 bg-indigo-50", change: "+1,204", trend: "up" },
          { label: "AI点数消耗", value: formatNumber(54320), icon: Zap, color: "text-amber-600 bg-amber-50", change: "+8,420", trend: "down" },
          { label: "客户满意度", value: "94.2%", icon: TrendingUp, color: "text-pink-600 bg-pink-50", change: "+2.1%", trend: "up" },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${item.color}`}><Icon className="h-5 w-5" /></div>
                  <span className={`flex items-center gap-0.5 text-xs font-medium ${item.trend === "up" ? "text-emerald-600" : "text-red-500"}`}>
                    {item.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}{item.change}
                  </span>
                </div>
                <div className="mt-3 text-2xl font-bold">{item.value}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{item.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* AI vs 人工 */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">AI vs 人工接待对比</CardTitle>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-purple-500" />AI处理</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-500" />人工处理</span>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={aiVsHuman}>
              <defs>
                <linearGradient id="colorAI" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} /><stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} /></linearGradient>
                <linearGradient id="colorHuman" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} /><stop offset="95%" stopColor="#3B82F6" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
              <Area type="monotone" dataKey="ai" stroke="#8B5CF6" strokeWidth={2} fill="url(#colorAI)" name="AI处理" />
              <Area type="monotone" dataKey="human" stroke="#3B82F6" strokeWidth={2} fill="url(#colorHuman)" name="人工处理" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 转化漏斗 */}
        <Card>
          <CardHeader><CardTitle className="text-base">获客转化漏斗</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {conversionFunnel.map((stage, index) => {
              const prevRate = index > 0 ? conversionFunnel[index - 1].rate : 100;
              const convRate = index > 0 ? ((stage.count / conversionFunnel[index - 1].count) * 100).toFixed(1) : "100";
              return (
                <div key={stage.stage}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium">{stage.stage}</span>
                    <span className="text-muted-foreground">{formatNumber(stage.count)} <span className="text-xs">({convRate}%)</span></span>
                  </div>
                  <div className="h-7 rounded-lg bg-muted overflow-hidden">
                    <div className="h-full rounded-lg flex items-center px-3 text-xs font-medium text-white transition-all"
                      style={{ width: `${(stage.count / conversionFunnel[0].count) * 100}%`, backgroundColor: `hsl(${220 + index * 20}, 70%, ${55 - index * 5}%)` }}>
                      {stage.rate}%
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* 意向分布 */}
        <Card>
          <CardHeader><CardTitle className="text-base">客户意向分布</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={intentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={(entry) => `${entry.name}: ${formatNumber(entry.value)}`}>
                  {intentData.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 渠道效果对比 */}
      <Card>
        <CardHeader><CardTitle className="text-base">各渠道获客效果对比</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats.platformDistribution.map(p => ({ ...p, name: PlatformLabels[p.platform], color: PlatformColors[p.platform] }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
              <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} name="会话数" />
              <Bar dataKey="leadRate" fill="#10B981" radius={[4, 4, 0, 0]} name="留资率" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 客服绩效 */}
      <Card>
        <CardHeader><CardTitle className="text-base">客服绩效排行</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="px-3 py-2 font-medium">排名</th>
                <th className="px-3 py-2 font-medium">客服</th>
                <th className="px-3 py-2 font-medium">总会话</th>
                <th className="px-3 py-2 font-medium">留资数</th>
                <th className="px-3 py-2 font-medium">留资率</th>
                <th className="px-3 py-2 font-medium">满意度</th>
                <th className="px-3 py-2 font-medium">平均响应</th>
              </tr>
            </thead>
            <tbody>
              {stats.topAgents.map((item, index) => (
                <tr key={item.agent.id} className="border-b border-border last:border-0">
                  <td className="px-3 py-3"><span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${index === 0 ? "bg-amber-100 text-amber-700" : index === 1 ? "bg-slate-100 text-slate-700" : index === 2 ? "bg-orange-100 text-orange-700" : "bg-muted text-muted-foreground"}`}>{index + 1}</span></td>
                  <td className="px-3 py-3"><div className="flex items-center gap-2"><Avatar name={item.agent.name} size="sm" /><span className="text-sm font-medium">{item.agent.name}</span></div></td>
                  <td className="px-3 py-3 text-sm">{item.conversations}</td>
                  <td className="px-3 py-3 text-sm font-medium text-emerald-600">{item.leads}</td>
                  <td className="px-3 py-3 text-sm">{((item.leads / item.conversations) * 100).toFixed(1)}%</td>
                  <td className="px-3 py-3"><Badge variant="success" className="text-[10px]">{Math.round(item.satisfaction * 100)}%</Badge></td>
                  <td className="px-3 py-3 text-sm text-muted-foreground">{(2 + Math.random()).toFixed(1)}秒</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
