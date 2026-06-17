"use client";

import { useState } from "react";
import { Search, Bell, Sun, Moon, ChevronDown, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function TopBar({ title }: { title?: string }) {
  const [isDark, setIsDark] = useState(false);

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-4">
        {title && <h1 className="text-lg font-semibold">{title}</h1>}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索客户、会话、知识库..."
            className="h-9 w-72 rounded-lg border border-input bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* AI点数余额 */}
        <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-1.5 dark:bg-amber-950/30">
          <Zap className="h-4 w-4 text-amber-500" />
          <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
            45,680
          </span>
          <span className="text-xs text-amber-600 dark:text-amber-500">AI点数</span>
        </div>

        {/* 暗色模式切换 */}
        <button
          onClick={() => {
            setIsDark(!isDark);
            document.documentElement.classList.toggle("dark");
          }}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* 通知 */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* 用户信息 */}
        <div className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-accent transition-colors cursor-pointer">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-pink-500 text-xs font-medium text-white">
            张
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
}
