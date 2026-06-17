"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessagesSquare,
  Users,
  MessageCircle,
  BookOpen,
  Bot,
  UserCog,
  BarChart3,
  Settings,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "工作台", icon: LayoutDashboard },
  { href: "/conversations", label: "会话管理", icon: MessagesSquare, badge: "会话聚合" },
  { href: "/customers", label: "客户管理", icon: Users },
  { href: "/comments", label: "评论管理", icon: MessageCircle },
  { href: "/knowledge", label: "知识库", icon: BookOpen },
  { href: "/ai-config", label: "AI配置", icon: Bot },
  { href: "/team", label: "客服团队", icon: UserCog },
  { href: "/analytics", label: "数据统计", icon: BarChart3 },
  { href: "/settings", label: "系统设置", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-60 flex-col bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 px-5 border-b border-sidebar-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="text-base font-bold text-white">智客AI</div>
          <div className="text-[10px] text-sidebar-foreground/60">智能客服系统</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-white"
                  : "text-sidebar-foreground/70 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] text-white/80">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-pink-500 text-sm font-medium text-white">
            张
          </div>
          <div className="flex-1 min-w-0">
            <div className="truncate text-sm font-medium text-white">张小明</div>
            <div className="truncate text-xs text-sidebar-foreground/60">管理员</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
