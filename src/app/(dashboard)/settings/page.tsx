"use client";

import {
  Settings, Link2, Bell, Shield, CreditCard,
  Plus, Check, ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { PlatformIcon } from "@/components/ui/platform-icon";
import { mockAccounts } from "@/lib/mock-data";
import { PlatformLabels } from "@/types";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">系统设置</h1>
        <p className="mt-1 text-sm text-muted-foreground">管理账号接入、通知、安全和计费</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2"><Link2 className="h-5 w-5" />账号接入</CardTitle>
              <CardDescription className="text-xs mt-1">管理各社交平台的账号接入</CardDescription>
            </div>
            <Button size="sm"><Plus className="h-4 w-4" />接入新账号</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {mockAccounts.map((acc) => (
            <div key={acc.id} className="flex items-center justify-between rounded-lg border border-border p-3">
              <div className="flex items-center gap-3">
                <PlatformIcon platform={acc.platform} size={24} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{acc.name}</span>
                    <Badge variant={acc.status === "online" ? "success" : "secondary"} className="text-[10px]">{acc.status === "online" ? "已连接" : "未连接"}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">{PlatformLabels[acc.platform]} · {acc.platformUid} · {acc.followers.toLocaleString()} 粉丝</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-xs"><Settings className="h-3.5 w-3.5" />配置</Button>
                <Button variant="ghost" size="sm" className="text-xs text-red-500">断开</Button>
              </div>
            </div>
          ))}
          <div className="grid grid-cols-4 gap-3 pt-2">
            {(Object.keys(PlatformLabels) as Array<keyof typeof PlatformLabels>).map((platform) => {
              const connected = mockAccounts.some((a) => a.platform === platform);
              return (
                <div key={platform} className={cn("flex flex-col items-center gap-2 rounded-lg border border-dashed p-4 transition-colors cursor-pointer hover:bg-accent/30",
                  connected ? "border-emerald-300 bg-emerald-50/30 dark:bg-emerald-950/10" : "border-border")}>
                  <PlatformIcon platform={platform} size={32} />
                  <span className="text-xs font-medium">{PlatformLabels[platform]}</span>
                  {connected ? <Badge variant="success" className="text-[9px]"><Check className="h-2.5 w-2.5 mr-0.5" />已接入</Badge> : <span className="text-[10px] text-muted-foreground">点击接入</span>}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Bell className="h-5 w-5" />通知设置</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {[
            { title: "新消息通知", desc: "收到新私信时推送通知", on: true },
            { title: "新评论通知", desc: "收到新评论时推送通知", on: true },
            { title: "高意向客户提醒", desc: "AI识别到高意向客户时特别提醒", on: true },
            { title: "AI转人工通知", desc: "AI将对话转给人工时通知", on: true },
            { title: "留资成功通知", desc: "客户成功留资时通知", on: false },
            { title: "每日数据报告", desc: "每天定时发送数据汇总报告", on: true },
          ].map((item) => (
            <div key={item.title} className="flex items-center justify-between">
              <div><div className="text-sm font-medium">{item.title}</div><div className="text-xs text-muted-foreground">{item.desc}</div></div>
              <Switch checked={item.on} onCheckedChange={() => {}} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Shield className="h-5 w-5" />安全设置</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm font-medium">修改密码</label><Input type="password" placeholder="输入新密码" className="mt-1.5" /></div>
            <div><label className="text-sm font-medium">确认密码</label><Input type="password" placeholder="再次输入新密码" className="mt-1.5" /></div>
          </div>
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between"><div><div className="text-sm font-medium">两步验证</div><div className="text-xs text-muted-foreground">登录时需要额外验证码</div></div><Switch checked={true} onCheckedChange={() => {}} /></div>
            <div className="flex items-center justify-between"><div><div className="text-sm font-medium">IP白名单</div><div className="text-xs text-muted-foreground">仅允许指定IP访问后台</div></div><Switch checked={false} onCheckedChange={() => {}} /></div>
          </div>
          <Button size="sm">保存安全设置</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><CreditCard className="h-5 w-5" />计费管理</CardTitle></CardHeader>
        <CardContent>
          <div className="rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">当前套餐</div>
                <div className="mt-1 text-xl font-bold text-amber-700 dark:text-amber-400">专业版 Pro</div>
                <div className="text-xs text-muted-foreground mt-0.5">有效期至 2026-12-31</div>
              </div>
              <Button variant="outline" size="sm"><ExternalLink className="h-3.5 w-3.5" />升级套餐</Button>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="rounded-lg border border-border p-3"><div className="text-xs text-muted-foreground">AI点数余额</div><div className="mt-1 text-xl font-bold text-amber-600">45,680</div></div>
            <div className="rounded-lg border border-border p-3"><div className="text-xs text-muted-foreground">本月已消耗</div><div className="mt-1 text-xl font-bold">54,320</div></div>
            <div className="rounded-lg border border-border p-3"><div className="text-xs text-muted-foreground">接入账号数</div><div className="mt-1 text-xl font-bold">5 / 20</div></div>
          </div>
          <Button className="mt-4" size="sm"><CreditCard className="h-4 w-4" />充值AI点数</Button>
        </CardContent>
      </Card>
    </div>
  );
}
