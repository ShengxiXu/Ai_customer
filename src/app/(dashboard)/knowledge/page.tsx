"use client";

import { useState } from "react";
import {
  BookOpen, HelpCircle, MessageSquare, FileText, Tag, GraduationCap,
  Plus, Search, Upload, MoreVertical, TrendingUp, Zap, File,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockKnowledgeCategories, mockKnowledgeDocuments } from "@/lib/mock-data";
import { cn, formatTime, formatNumber } from "@/lib/utils";

const iconMap: Record<string, any> = {
  BookOpen, HelpCircle, MessageSquare, FileText, Tag, GraduationCap,
};

const statusConfig: Record<string, { label: string; variant: any }> = {
  active: { label: "已生效", variant: "success" },
  training: { label: "训练中", variant: "warning" },
  draft: { label: "草稿", variant: "secondary" },
};

export default function KnowledgePage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredDocs = activeCategory === "all"
    ? mockKnowledgeDocuments
    : mockKnowledgeDocuments.filter((d) => d.categoryId === activeCategory);

  const totalDocs = mockKnowledgeCategories.reduce((sum, c) => sum + c.documentCount, 0);
  const totalHits = mockKnowledgeDocuments.reduce((sum, d) => sum + d.hitCount, 0);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">知识库</h1>
          <p className="mt-1 text-sm text-muted-foreground">AI客服的大脑，持续学习越用越聪明</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Upload className="h-4 w-4" />批量导入</Button>
          <Button size="sm"><Plus className="h-4 w-4" />新建文档</Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="p-4">
          <div className="text-sm text-muted-foreground">文档总数</div>
          <div className="mt-1 text-2xl font-bold">{totalDocs}</div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="text-sm text-muted-foreground">知识命中次数</div>
          <div className="mt-1 text-2xl font-bold text-blue-600">{formatNumber(totalHits)}</div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="text-sm text-muted-foreground">向量分块数</div>
          <div className="mt-1 text-2xl font-bold text-purple-600">1,247</div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="text-sm text-muted-foreground">命中率</div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-emerald-600">92.3%</span>
            <span className="flex items-center text-xs text-emerald-600"><TrendingUp className="h-3 w-3" />+3.2%</span>
          </div>
        </CardContent></Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* 分类列表 */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader><CardTitle className="text-sm">知识分类</CardTitle></CardHeader>
            <CardContent className="space-y-1">
              <button
                onClick={() => setActiveCategory("all")}
                className={cn("flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                  activeCategory === "all" ? "bg-primary text-primary-foreground" : "hover:bg-accent")}
              >
                <span className="flex items-center gap-2"><File className="h-4 w-4" />全部文档</span>
                <span className="text-xs opacity-70">{totalDocs}</span>
              </button>
              {mockKnowledgeCategories.map((cat) => {
                const Icon = iconMap[cat.icon] || File;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={cn("flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                      activeCategory === cat.id ? "bg-primary text-primary-foreground" : "hover:bg-accent")}
                  >
                    <span className="flex items-center gap-2"><Icon className="h-4 w-4" />{cat.name}</span>
                    <span className="text-xs opacity-70">{cat.documentCount}</span>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* 文档列表 */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm">
                {activeCategory === "all" ? "全部文档" : mockKnowledgeCategories.find((c) => c.id === activeCategory)?.name}
                <span className="ml-2 text-xs text-muted-foreground">({filteredDocs.length})</span>
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input type="text" placeholder="搜索文档..." className="h-8 w-48 rounded-lg border border-input bg-background pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {filteredDocs.map((doc) => {
                const cat = mockKnowledgeCategories.find((c) => c.id === doc.categoryId);
                return (
                  <div key={doc.id} className="flex items-center gap-4 rounded-lg border border-border p-3 hover:bg-accent/30 transition-colors">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/30">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium truncate">{doc.title}</h4>
                        <Badge variant={statusConfig[doc.status].variant} className="text-[9px] py-0">{statusConfig[doc.status].label}</Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground truncate">{doc.content}</p>
                      <div className="mt-1 flex items-center gap-3 text-[10px] text-muted-foreground">
                        <span>{cat?.name}</span>
                        <span>·</span>
                        <span>{doc.chunkCount} 分块</span>
                        <span>·</span>
                        <span className="flex items-center gap-0.5"><Zap className="h-2.5 w-2.5" />命中 {doc.hitCount} 次</span>
                        <span>·</span>
                        <span>{doc.source}</span>
                        <span>·</span>
                        <span>更新于 {formatTime(doc.updatedAt)}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0"><MoreVertical className="h-4 w-4" /></Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
