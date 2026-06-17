"use client";

import { useState } from "react";
import {
  Bot, Zap, Shield, Target, Plus, Edit2, Save,
  Sparkles, AlertTriangle, RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea, Input } from "@/components/ui/input";
import { defaultAIConfig, mockScriptTemplates } from "@/lib/mock-data";
import { cn, formatNumber } from "@/lib/utils";
import type { AIConfig } from "@/types";

export default function AIConfigPage() {
  const [config, setConfig] = useState<AIConfig>(defaultAIConfig);
  const [editingPrompt, setEditingPrompt] = useState(false);
  const [activeTab, setActiveTab] = useState<"model" | "scripts" | "advanced">("model");

  const updateConfig = <K extends keyof AIConfig>(key: K, value: AIConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">AI配置</h1>
        <p className="mt-1 text-sm text-muted-foreground">配置AI客服的模型参数、话术策略和智能能力</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div><div className="text-sm text-muted-foreground">AI接管率</div><div className="mt-1 text-2xl font-bold text-purple-600">87.3%</div></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600"><Bot className="h-5 w-5" /></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div><div className="text-sm text-muted-foreground">留资转化率</div><div className="mt-1 text-2xl font-bold text-emerald-600">34.2%</div></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"><Target className="h-5 w-5" /></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div><div className="text-sm text-muted-foreground">反广告拦截</div><div className="mt-1 text-2xl font-bold text-blue-600">{config.antiAdEnabled ? "已启用" : "关闭"}</div></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><Shield className="h-5 w-5" /></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div><div className="text-sm text-muted-foreground">自我进化</div><div className="mt-1 text-2xl font-bold text-amber-600">{config.selfEvolutionEnabled ? "已启用" : "关闭"}</div></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600"><Sparkles className="h-5 w-5" /></div>
          </div>
        </CardContent></Card>
      </div>

      <div className="flex gap-1 border-b border-border">
        {([
          { key: "model", label: "模型与提示词" },
          { key: "scripts", label: "话术模板" },
          { key: "advanced", label: "高级能力" },
        ] as const).map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={cn("relative px-4 py-2.5 text-sm font-medium transition-colors",
              activeTab === tab.key ? "text-primary" : "text-muted-foreground hover:text-foreground")}>
            {tab.label}
            {activeTab === tab.key && <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary" />}
          </button>
        ))}
      </div>

      {activeTab === "model" && (
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">模型设置</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">AI模型</label>
                  <Input value={config.model} onChange={(e) => updateConfig("model", e.target.value)} className="mt-1.5" />
                  <p className="mt-1 text-xs text-muted-foreground">支持DeepSeek、GPT-4、通义千问等OpenAI兼容模型</p>
                </div>
                <div>
                  <label className="text-sm font-medium">自动回复延迟（秒）</label>
                  <Input type="number" value={config.autoReplyDelay} onChange={(e) => updateConfig("autoReplyDelay", Number(e.target.value))} className="mt-1.5" />
                  <p className="mt-1 text-xs text-muted-foreground">模拟人工打字延迟，更自然</p>
                </div>
                <div>
                  <label className="text-sm font-medium">温度（Temperature）: {config.temperature}</label>
                  <input type="range" min="0" max="1" step="0.1" value={config.temperature} onChange={(e) => updateConfig("temperature", Number(e.target.value))} className="mt-2 w-full" />
                  <p className="mt-1 text-xs text-muted-foreground">值越高回复越发散，越低越稳定</p>
                </div>
                <div>
                  <label className="text-sm font-medium">最大Token数</label>
                  <Input type="number" value={config.maxTokens} onChange={(e) => updateConfig("maxTokens", Number(e.target.value))} className="mt-1.5" />
                  <p className="mt-1 text-xs text-muted-foreground">单次回复的最大长度</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base">系统提示词（System Prompt）</CardTitle>
                <CardDescription className="text-xs">定义AI客服的角色、行为规范和话术风格</CardDescription>
              </div>
              {editingPrompt ? (
                <Button size="sm" onClick={() => setEditingPrompt(false)}><Save className="h-4 w-4" />保存</Button>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setEditingPrompt(true)}><Edit2 className="h-4 w-4" />编辑</Button>
              )}
            </CardHeader>
            <CardContent>
              <Textarea value={config.systemPrompt} onChange={(e) => updateConfig("systemPrompt", e.target.value)} readOnly={!editingPrompt} rows={12} className={cn(!editingPrompt && "bg-muted/30 cursor-default")} />
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "scripts" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">话术模板</h3>
              <p className="text-xs text-muted-foreground">AI会根据场景自动匹配合适的话术，提升留资转化率</p>
            </div>
            <Button size="sm"><Plus className="h-4 w-4" />新建话术</Button>
          </div>
          {mockScriptTemplates.map((script) => (
            <Card key={script.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold">{script.name}</h4>
                      <Badge variant="outline" className="text-[10px]">{script.scenario}</Badge>
                      <Switch checked={script.enabled} onCheckedChange={() => {}} />
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">触发条件：{script.trigger}</p>
                    <div className="rounded-lg bg-muted/50 p-3 text-sm">{script.content}</div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-lg font-bold text-blue-600">{formatNumber(script.hitCount)}</div>
                    <div className="text-[10px] text-muted-foreground">命中次数</div>
                    <div className="mt-2 text-lg font-bold text-emerald-600">{Math.round(script.conversionRate * 100)}%</div>
                    <div className="text-[10px] text-muted-foreground">转化率</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "advanced" && (
        <div className="space-y-4">
          {[
            { key: "autoReplyEnabled", icon: Bot, title: "AI自动回复", desc: "客户发消息后AI自动接管回复，无需人工介入", color: "text-purple-600 bg-purple-50" },
            { key: "antiAdEnabled", icon: Shield, title: "反广告话术检测", desc: "自动识别并过滤硬广式话术，让对话更自然", color: "text-blue-600 bg-blue-50" },
            { key: "intentRecognitionEnabled", icon: Target, title: "意图识别", desc: "实时分析客户消息意图，自动标记高意向客户", color: "text-red-600 bg-red-50" },
            { key: "selfEvolutionEnabled", icon: Sparkles, title: "自我进化", desc: "AI从成功对话中持续学习，使用越久效果越好", color: "text-amber-600 bg-amber-50" },
            { key: "fallbackToHuman", icon: AlertTriangle, title: "转人工兜底", desc: "当AI置信度低于阈值时自动转接人工客服", color: "text-orange-600 bg-orange-50" },
          ].map((item) => {
            const Icon = item.icon;
            const isEnabled = config[item.key as keyof AIConfig] as boolean;
            return (
              <Card key={item.key}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", item.color)}><Icon className="h-5 w-5" /></div>
                    <div><div className="text-sm font-semibold">{item.title}</div><div className="text-xs text-muted-foreground">{item.desc}</div></div>
                  </div>
                  <Switch checked={isEnabled} onCheckedChange={(v) => updateConfig(item.key as keyof AIConfig, v as any)} />
                </CardContent>
              </Card>
            );
          })}
          {config.fallbackToHuman && (
            <Card>
              <CardContent className="p-4">
                <label className="text-sm font-medium">转人工置信度阈值: {Math.round(config.fallbackThreshold * 100)}%</label>
                <input type="range" min="0.3" max="0.9" step="0.05" value={config.fallbackThreshold} onChange={(e) => updateConfig("fallbackThreshold", Number(e.target.value))} className="mt-2 w-full" />
                <p className="mt-1 text-xs text-muted-foreground">当AI意图识别置信度低于此值时，自动转接人工客服</p>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600"><RefreshCw className="h-5 w-5" /></div>
                <div><div className="text-sm font-semibold">知识库重新向量化</div><div className="text-xs text-muted-foreground">更新知识库后需要重新构建向量索引</div></div>
              </div>
              <Button variant="outline" size="sm"><RefreshCw className="h-4 w-4" />立即重建索引</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
