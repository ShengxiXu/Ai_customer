"use client";

import {
  MessagesSquare,
  Users,
  Zap,
  Clock,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Bot,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PlatformIcon } from "@/components/ui/platform-icon";
import { mockDashboardStats, mockConversations } from "@/lib/mock-data";
import { PlatformLabels, PlatformColors } from "@/types";
import { formatTime } from "@/lib/utils";
import Link from "next/link";

const statCards = [
  {
    label: "今日活跃会话",
    value: "28",
    icon: MessagesSquare,
    color: "text-blue-600 bg-blue-50 dark:bg-blue-950/30",
    change: "+12%",
    trend: "up",
  },
  {
    label: "AI接管率",
    value: "87.3%",
    icon: Bot,
    color: "text-purple-600 bg-purple-50 dark:bg-purple-950/30",
    change: "+5.2%",
    trend: "up",
  },
  {
    label: "留资转化率",
    value: "34.2%",
    icon: Target,
    color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30",
    change: "+8.1%",
    trend: "up",
  },
  {
    label: "平均响应时间",
    value: "2.8秒",
    icon: Clock,
    color: "text-orange-600 bg-orange-50 dark:bg-orange-950/30",
    change: "-0.5秒",
    trend: "down",
  },
  {
    label: "累计客户数",
    value: "8,654",
    icon: Users,
    color: "text-cyan-600 bg-cyan-50 dark:bg-cyan-950/30",
    change: "+326",
    trend: "up",
  },
  {
    label: "AI点数余额",
    value: "45,680",
    icon: Zap,
    color: "text-amber-600 bg-amber-50 dark:bg-amber-950/30",
    change: "-2,340",
    trend: "down",
  },
];

export default function DashboardPage() {
  const stats = mockDashboardStats;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">工作台</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            欢迎回来，张小明！今日已有 28 个活跃会话等待处理
          </p>
        </div>
        <Link
          href="/conversations"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <MessagesSquare className="h-4 w-4" />
          进入会话
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label} className="animate-slide-up">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`flex items-center gap-0.5 text-xs font-medium ${
                      card.trend === "up" ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    {card.trend === "up" ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {card.change}
                  </span>
                </div>
                <div className="mt-3 text-2xl font-bold">{card.value}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{card.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">会话趋势</CardTitle>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                总会话数
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-purple-500" />
                AI处理数
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={stats.conversationTrend}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorAI" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Area type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} fill="url(#colorTotal)" name="总会话数" />
                <Area type="monotone" dataKey="aiCount" stroke="#8B5CF6" strokeWidth={2} fill="url(#colorAI)" name="AI处理数" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">渠道分布</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={stats.platformDistribution}
                  dataKey="count"
                  nameKey="platform"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                >
                  {stats.platformDistribution.map((entry) => (
                    <Cell key={entry.platform} fill={PlatformColors[entry.platform]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number, _name: string, item: any) => [
                    `${value} 会话`,
                    PlatformLabels[item.payload.platform as keyof typeof PlatformLabels],
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {stats.platformDistribution.map((item) => (
                <div key={item.platform} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <PlatformIcon platform={item.platform} size={16} />
                    <span className="text-muted-foreground">{PlatformLabels[item.platform]}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{item.count}</span>
                    <Badge variant="success" className="text-[10px]">
                      {Math.round(item.leadRate * 100)}% 留资
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">待处理会话</CardTitle>
            <Link href="/conversations" className="text-xs text-primary hover:underline">
              查看全部 →
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {mockConversations
              .filter((c) => c.status !== "closed")
              .slice(0, 5)
              .map((conv) => (
                <Link
                  key={conv.id}
                  href="/conversations"
                  className="flex items-center gap-3 rounded-lg p-2.5 hover:bg-accent transition-colors"
                >
                  <div className="relative">
                    <Avatar name={conv.customer.name} size="sm" />
                    <div className="absolute -bottom-0.5 -right-0.5">
                      <PlatformIcon platform={conv.platform} size={14} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">{conv.customer.name}</span>
                      {conv.aiEnabled && (
                        <Badge variant="secondary" className="text-[9px] py-0">
                          <Bot className="h-2.5 w-2.5 mr-0.5" />
                          AI
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-muted-foreground">{formatTime(conv.lastMessageAt)}</span>
                    {conv.unreadCount > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-medium text-white">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">客服排行</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.topAgents.map((item, index) => (
              <div key={item.agent.id} className="flex items-center gap-3">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    index === 0
                      ? "bg-amber-100 text-amber-700"
                      : index === 1
                      ? "bg-slate-100 text-slate-700"
                      : index === 2
                      ? "bg-orange-100 text-orange-700"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index + 1}
                </span>
                <Avatar name={item.agent.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{item.agent.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.conversations} 会话 · {item.leads} 留资
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-emerald-600">
                    {Math.round(item.satisfaction * 100)}%
                  </div>
                  <div className="text-[10px] text-muted-foreground">满意度</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">24小时会话分布</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.hourlyDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} interval={2} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} name="会话数" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
