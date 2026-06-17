"use client";

import Link from "next/link";
import {
  Bot, Plus, ArrowRight,
  Home, MessageSquare, Users, MessageCircle, BookOpen,
  BarChart3, Settings, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
  { href: "/settings", label: "设置", icon: Settings },
];

const templates: { key: AgentTemplate; title: string; desc: string; svg: React.ReactNode }[] = [
  {
    key: "active_lead",
    title: "主动获客",
    desc: "在对话中，主动询问并获取顾客的联系方式",
    svg: (
      <svg viewBox="0 0 120 120" className="h-20 w-20">
        <circle cx="60" cy="40" r="14" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M40 80 Q40 65 60 65 Q80 65 80 80" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="20" y="85" width="80" height="3" fill="currentColor" opacity="0.3" />
        <text x="92" y="35" fontSize="10" fill="currentColor">?</text>
      </svg>
    ),
  },
  {
    key: "card_lead",
    title: "名片获客",
    desc: "主动发送自己的名片信息，吸引顾客添加好友",
    svg: (
      <svg viewBox="0 0 120 120" className="h-20 w-20">
        <rect x="30" y="35" width="60" height="40" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="48" cy="50" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M40 65 L56 55 L72 65" fill="none" stroke="currentColor" strokeWidth="2" />
        <line x1="78" y1="50" x2="85" y2="50" stroke="currentColor" strokeWidth="2" />
        <line x1="78" y1="58" x2="85" y2="58" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    key: "deep_mining",
    title: "深度挖掘",
    desc: "获取联系方式后试图继续深挖信息",
    svg: (
      <svg viewBox="0 0 120 120" className="h-20 w-20">
        <rect x="25" y="40" width="30" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="65" y="40" width="30" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
        <line x1="55" y1="50" x2="65" y2="50" stroke="currentColor" strokeWidth="2" />
        <circle cx="60" cy="85" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
        <line x1="60" y1="65" x2="60" y2="77" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    key: "precise_lead",
    title: "精准获客",
    desc: "先通过对话筛选目标顾客，再获取指定条件顾客的联系方式",
    svg: (
      <svg viewBox="0 0 120 120" className="h-20 w-20">
        <circle cx="50" cy="50" r="18" fill="none" stroke="currentColor" strokeWidth="2" />
        <line x1="62" y1="62" x2="75" y2="75" stroke="currentColor" strokeWidth="2" />
        <circle cx="50" cy="50" r="8" fill="currentColor" opacity="0.2" />
        <path d="M85 40 L90 45 L100 35" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function TemplatesPage() {
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

      <main className="flex-1 overflow-y-auto">
        <div className="flex h-14 items-center gap-2 border-b border-border px-6 text-sm">
          <Bot className="h-4 w-4 text-muted-foreground" />
          <Link href="/ai-config" className="text-muted-foreground hover:text-foreground">AI 员工</Link>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-foreground">选择模板</span>
        </div>

        <div className="mx-auto max-w-5xl p-6">
          <h1 className="text-xl font-semibold text-foreground">选择模板</h1>

          <div className="mt-10 flex flex-col items-center text-center">
            <h2 className="text-2xl font-semibold text-foreground">智能获客，从模板开始</h2>
            <p className="mt-2 text-sm text-muted-foreground">选择小古人设，轻松实现 线索全量沉淀增长</p>

            <div className="mt-10 grid w-full grid-cols-2 gap-6 md:grid-cols-4">
              {templates.map((t) => (
                <Link
                  key={t.key}
                  href={`/ai-config/new?template=${t.key}`}
                  className="group flex flex-col items-center rounded-xl border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-md"
                >
                  <div className="text-muted-foreground group-hover:text-primary transition-colors">{t.svg}</div>
                  <div className="mt-4 text-sm font-medium text-foreground">{t.title}</div>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
                </Link>
              ))}
            </div>

            <Link
              href="/ai-config/new?template=blank"
              className="mt-10 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <span>生成小古人设，开始配置</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-background">
                <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
