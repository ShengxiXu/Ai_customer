"use client";

import { useState } from "react";
import {
  Bot, Zap, Shield, Target, Plus, Edit2, Save, Send,
  Sparkles, AlertTriangle, RefreshCw, Key, MessageSquare,
  BookOpen, Settings2, TestTube2, Trash2, ChevronRight,
  TrendingUp, Clock, Brain, Eye, EyeOff, Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea, Input } from "@/components/ui/input";
import { defaultAIConfig, mockScriptTemplates, mockKnowledgeCategories } from "@/lib/mock-data";
import { cn, formatNumber } from "@/lib/utils";
import type { AIConfig, AITone, ScriptCategory, ScriptTemplate } from "@/types";
import { ScriptCategoryLabels } from "@/types";

type NavKey = "model" | "persona" | "scripts" | "abilities" | "knowledge" | "test";

export default function AIConfigPage() {
  const [config, setConfig] = useState<AIConfig>(defaultAIConfig);
  const [activeNav, setActiveNav] = useState<NavKey>("model");
  const [editingPrompt, setEditingPrompt] = useState(false);
  const [editingWelcome, setEditingWelcome] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [scripts, setScripts] = useState<ScriptTemplate[]>(mockScriptTemplates);
  const [scriptFilter, setScriptFilter] = useState<ScriptCategory | "all">("all");
  const [testInput, setTestInput] = useState("");
  const [testMessages, setTestMessages] = useState<{ role: "user" | "ai"; content: string }[]>([]);
  const [testLoading, setTestLoading] = useState(false);

  const updateConfig = <K extends keyof AIConfig>(key: K, value: AIConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const toggleScript = (id: string) => {
    setScripts((prev) => prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
  };

  const filteredScripts = scriptFilter === "all" ? scripts : scripts.filter((s) => s.category === scriptFilter);

  const handleTestSend = () => {
    if (!testInput.trim()) return;
    const userMsg = testInput.trim();
    setTestInput("");
    setTestMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setTestLoading(true);
    setTimeout(() => {
      const replies = [
        "您好呀~ 感谢您的咨询！我们的课程涵盖多个方向，方便留个微信吗？我发详细资料给您看看~ 😊",
        "这个问题问得好！我们的课程性价比很高，现在报名还有优惠哦。您主要想了解哪个方向的课程呢？",
        "理解您的需求~ 我们有专业的老师团队，可以根据您的情况定制学习方案。方便留个手机号吗？我帮您预约免费试听课~",
      ];
      setTestMessages((prev) => [...prev, { role: "ai", content: replies[Math.floor(Math.random() * replies.length)] }]);
      setTestLoading(false);
    }, 1200);
  };

  const navItems: { key: NavKey; label: string; icon: typeof Bot; desc: string }[] = [
    { key: "model", label: "AI模型", icon: Bot, desc: "模型与API配置" },
    { key: "persona", label: "AI人设", icon: Sparkles, desc: "角色与话术风格" },
    { key: "scripts", label: "话术模板", icon: MessageSquare, desc: "场景化话术管理" },
    { key: "abilities", label: "智能能力", icon: Zap, desc: "AI高级能力开关" },
    { key: "knowledge", label: "知识库关联", icon: BookOpen, desc: "AI参考知识范围" },
    { key: "test", label: "AI测试", icon: TestTube2, desc: "在线对话调试" },
  ];

  const toneOptions: { value: AITone; label: string; desc: string }[] = [
    { value: "professional", label: "专业严谨", desc: "措辞规范，适合B端客户" },
    { value: "friendly", label: "亲切友好", desc: "像朋友一样交流，拉近距离" },
    { value: "casual", label: "轻松随意", desc: "口语化表达，适合年轻群体" },
    { value: "enthusiastic", label: "热情积极", desc: "充满感染力，促单效果好" },
  ];

  const modelOptions = [
    { value: "deepseek-chat", label: "DeepSeek Chat", desc: "性价比高，中文能力强" },
    { value: "deepseek-reasoner", label: "DeepSeek Reasoner", desc: "推理能力强，适合复杂问题" },
    { value: "gpt-4o", label: "GPT-4o", desc: "OpenAI旗舰模型，综合能力强" },
    { value: "gpt-4o-mini", label: "GPT-4o mini", desc: "轻量快速，成本低" },
    { value: "qwen-max", label: "通义千问 Max", desc: "阿里云大模型，国内访问快" },
    { value: "claude-3-5-sonnet", label: "Claude 3.5 Sonnet", desc: "Anthropic模型，长文理解强" },
  ];

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* 左侧导航 */}
      <aside className="w-60 shrink-0 border-r border-border bg-muted/30 p-3">
        <div className="mb-4 px-2">
          <h2 className="text-sm font-semibold text-foreground">AI配置中心</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">配置AI客服大脑</p>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveNav(item.key)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                  isActive ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">{item.label}</div>
                  <div className={cn("text-[11px] truncate", isActive ? "text-primary-foreground/70" : "text-muted-foreground")}>
                    {item.desc}
                  </div>
                </div>
                {isActive && <ChevronRight className="h-4 w-4 shrink-0" />}
              </button>
            );
          })}
        </nav>

        {/* 底部统计 */}
        <div className="mt-6 space-y-2 px-2">
          <div className="rounded-lg bg-purple-50 p-3 dark:bg-purple-950/30">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-purple-600" />
              <span className="text-xs font-medium text-purple-700 dark:text-purple-400">AI运行状态</span>
            </div>
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">今日接管</span>
                <span className="font-semibold">248 / 284</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">留资转化</span>
                <span className="font-semibold text-emerald-600">34.2%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">平均响应</span>
                <span className="font-semibold">2.8s</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* 右侧内容区 */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl space-y-6 p-6">
          {/* 页面标题 */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">
                {navItems.find((n) => n.key === activeNav)?.label}
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {navItems.find((n) => n.key === activeNav)?.desc}
              </p>
            </div>
            {activeNav === "model" && (
              <Badge variant="outline" className="gap-1.5">
                <span className={cn("h-2 w-2 rounded-full", config.autoReplyEnabled ? "bg-emerald-500" : "bg-gray-400")} />
                {config.autoReplyEnabled ? "AI已启用" : "AI已关闭"}
              </Badge>
            )}
          </div>

          {/* ===== AI模型配置 ===== */}
          {activeNav === "model" && (
            <div className="space-y-5">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Bot className="h-4 w-4 text-purple-600" /> 模型选择
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {modelOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => updateConfig("model", opt.value)}
                        className={cn(
                          "flex flex-col rounded-lg border p-3 text-left transition-all",
                          config.model === opt.value
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold">{opt.label}</span>
                          {config.model === opt.value && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <span className="mt-1 text-xs text-muted-foreground">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Key className="h-4 w-4 text-amber-600" /> API凭证
                  </CardTitle>
                  <CardDescription className="text-xs">配置大模型API的访问密钥和接口地址</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">API Key</label>
                    <div className="mt-1.5 flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          type={showApiKey ? "text" : "password"}
                          value={config.apiKey}
                          onChange={(e) => updateConfig("apiKey", e.target.value)}
                          className="pr-10"
                        />
                        <button
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <Button variant="outline" size="sm">测试连接</Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">API Base URL</label>
                    <Input
                      value={config.apiBaseUrl}
                      onChange={(e) => updateConfig("apiBaseUrl", e.target.value)}
                      className="mt-1.5"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">OpenAI兼容接口地址，留空则使用模型默认地址</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Settings2 className="h-4 w-4 text-blue-600" /> 参数调优
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">温度 (Temperature)</label>
                        <Badge variant="secondary" className="text-xs">{config.temperature}</Badge>
                      </div>
                      <input
                        type="range" min="0" max="1" step="0.1"
                        value={config.temperature}
                        onChange={(e) => updateConfig("temperature", Number(e.target.value))}
                        className="mt-2 w-full"
                      />
                      <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                        <span>精确稳定</span>
                        <span>富有创意</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">最大Token数</label>
                      </div>
                      <Input
                        type="number" value={config.maxTokens}
                        onChange={(e) => updateConfig("maxTokens", Number(e.target.value))}
                        className="mt-1.5"
                      />
                      <p className="mt-1 text-xs text-muted-foreground">单次回复的最大长度</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">自动回复延迟（秒）</label>
                      </div>
                      <Input
                        type="number" value={config.autoReplyDelay}
                        onChange={(e) => updateConfig("autoReplyDelay", Number(e.target.value))}
                        className="mt-1.5"
                      />
                      <p className="mt-1 text-xs text-muted-foreground">模拟人工打字延迟，更自然</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">最大对话轮数</label>
                      </div>
                      <Input
                        type="number" value={config.maxConversationTurns}
                        onChange={(e) => updateConfig("maxConversationTurns", Number(e.target.value))}
                        className="mt-1.5"
                      />
                      <p className="mt-1 text-xs text-muted-foreground">超过后自动转人工</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ===== AI人设配置 ===== */}
          {activeNav === "persona" && (
            <div className="space-y-5">
              <Card>
                <CardHeader className="flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Sparkles className="h-4 w-4 text-amber-600" /> 系统提示词 (System Prompt)
                    </CardTitle>
                    <CardDescription className="text-xs">定义AI客服的角色定位、行为规范和话术风格</CardDescription>
                  </div>
                  {editingPrompt ? (
                    <Button size="sm" onClick={() => setEditingPrompt(false)}>
                      <Save className="h-4 w-4" /> 保存
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => setEditingPrompt(true)}>
                      <Edit2 className="h-4 w-4" /> 编辑
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={config.systemPrompt}
                    onChange={(e) => updateConfig("systemPrompt", e.target.value)}
                    readOnly={!editingPrompt}
                    rows={12}
                    className={cn(!editingPrompt && "bg-muted/30 cursor-default font-mono text-sm")}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle className="text-base">欢迎语</CardTitle>
                    <CardDescription className="text-xs">客户首次发消息时AI自动发送的问候语</CardDescription>
                  </div>
                  {editingWelcome ? (
                    <Button size="sm" onClick={() => setEditingWelcome(false)}>
                      <Save className="h-4 w-4" /> 保存
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => setEditingWelcome(true)}>
                      <Edit2 className="h-4 w-4" /> 编辑
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={config.welcomeMessage}
                    onChange={(e) => updateConfig("welcomeMessage", e.target.value)}
                    readOnly={!editingWelcome}
                    rows={3}
                    className={cn(!editingWelcome && "bg-muted/30 cursor-default")}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">语气风格</CardTitle>
                  <CardDescription className="text-xs">选择AI客服的沟通风格，影响整体话术调性</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {toneOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => updateConfig("tone", opt.value)}
                        className={cn(
                          "flex flex-col rounded-lg border p-3 text-left transition-all",
                          config.tone === opt.value
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold">{opt.label}</span>
                          {config.tone === opt.value && <Check className="h-4 w-4 text-primary" />}
                        </div>
                        <span className="mt-1 text-xs text-muted-foreground">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ===== 话术模板管理 ===== */}
          {activeNav === "scripts" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm text-muted-foreground">
                    共 {scripts.length} 条话术，启用 {scripts.filter((s) => s.enabled).length} 条
                  </span>
                </div>
                <Button size="sm"><Plus className="h-4 w-4" /> 新建话术</Button>
              </div>

              {/* 分类筛选 */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setScriptFilter("all")}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                    scriptFilter === "all" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/70"
                  )}
                >
                  全部 ({scripts.length})
                </button>
                {(Object.keys(ScriptCategoryLabels) as ScriptCategory[]).map((cat) => {
                  const count = scripts.filter((s) => s.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setScriptFilter(cat)}
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                        scriptFilter === cat ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/70"
                      )}
                    >
                      {ScriptCategoryLabels[cat]} ({count})
                    </button>
                  );
                })}
              </div>

              {/* 话术列表 */}
              {filteredScripts.map((script) => (
                <Card key={script.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-semibold">{script.name}</h4>
                          <Badge variant="outline" className="text-[10px]">
                            {ScriptCategoryLabels[script.category]}
                          </Badge>
                          <Badge variant="secondary" className="text-[10px]">优先级 P{script.priority}</Badge>
                          <Switch checked={script.enabled} onCheckedChange={() => toggleScript(script.id)} />
                        </div>
                        <div className="mb-2 flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Target className="h-3 w-3" /> {script.scenario}
                          </span>
                          <span className="flex items-center gap-1">
                            <Zap className="h-3 w-3" /> {script.trigger}
                          </span>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-3 text-sm leading-relaxed">{script.content}</div>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="text-lg font-bold text-blue-600">{formatNumber(script.hitCount)}</div>
                        <div className="text-[10px] text-muted-foreground">命中次数</div>
                        <div className="mt-2 text-lg font-bold text-emerald-600">
                          {Math.round(script.conversionRate * 100)}%
                        </div>
                        <div className="text-[10px] text-muted-foreground">转化率</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* ===== 智能能力配置 ===== */}
          {activeNav === "abilities" && (
            <div className="space-y-4">
              {[
                { key: "autoReplyEnabled", icon: Bot, title: "AI自动回复", desc: "客户发消息后AI自动接管回复，无需人工介入", color: "text-purple-600 bg-purple-50 dark:bg-purple-950/30", badge: "核心" },
                { key: "antiAdEnabled", icon: Shield, title: "反广告话术检测", desc: "自动识别并过滤硬广式话术，让对话更自然", color: "text-blue-600 bg-blue-50 dark:bg-blue-950/30" },
                { key: "intentRecognitionEnabled", icon: Target, title: "意图识别", desc: "实时分析客户消息意图，自动标记高意向客户", color: "text-red-600 bg-red-50 dark:bg-red-950/30" },
                { key: "selfEvolutionEnabled", icon: Sparkles, title: "自我进化", desc: "AI从成功对话中持续学习，使用越久效果越好", color: "text-amber-600 bg-amber-50 dark:bg-amber-950/30", badge: "推荐" },
                { key: "extractContactEnabled", icon: MessageSquare, title: "联系方式提取", desc: "自动从对话中识别手机号、微信、邮箱等留资信息", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30" },
                { key: "emotionAnalysisEnabled", icon: Brain, title: "情感分析", desc: "分析客户情绪变化，负面情绪自动预警转人工", color: "text-pink-600 bg-pink-50 dark:bg-pink-950/30" },
                { key: "proactivelyMessage", icon: Send, title: "主动私信", desc: "对高意向但未留资的客户自动发起跟进私信", color: "text-cyan-600 bg-cyan-50 dark:bg-cyan-950/30" },
                { key: "fallbackToHuman", icon: AlertTriangle, title: "转人工兜底", desc: "当AI置信度低于阈值或达到最大轮数时自动转接人工", color: "text-orange-600 bg-orange-50 dark:bg-orange-950/30" },
              ].map((item) => {
                const Icon = item.icon;
                const isEnabled = config[item.key as keyof AIConfig] as boolean;
                return (
                  <Card key={item.key}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", item.color)}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">{item.title}</span>
                            {item.badge && (
                              <Badge variant="secondary" className="text-[10px]">{item.badge}</Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">{item.desc}</div>
                        </div>
                      </div>
                      <Switch
                        checked={isEnabled}
                        onCheckedChange={(v) => updateConfig(item.key as keyof AIConfig, v as never)}
                      />
                    </CardContent>
                  </Card>
                );
              })}

              {/* 转人工阈值 */}
              {config.fallbackToHuman && (
                <Card>
                  <CardContent className="space-y-3 p-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">转人工置信度阈值</label>
                        <Badge variant="secondary">{Math.round(config.fallbackThreshold * 100)}%</Badge>
                      </div>
                      <input
                        type="range" min="0.3" max="0.9" step="0.05"
                        value={config.fallbackThreshold}
                        onChange={(e) => updateConfig("fallbackThreshold", Number(e.target.value))}
                        className="mt-2 w-full"
                      />
                      <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                        <span>30% (更激进)</span>
                        <span>90% (更保守)</span>
                      </div>
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        当AI意图识别置信度低于此值时，自动转接人工客服
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 知识库重建 */}
              <Card>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600 dark:bg-cyan-950/30">
                      <RefreshCw className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">知识库重新向量化</div>
                      <div className="text-xs text-muted-foreground">更新知识库后需要重新构建向量索引</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm"><RefreshCw className="h-4 w-4" /> 重建索引</Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ===== 知识库关联 ===== */}
          {activeNav === "knowledge" && (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/30">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">选择AI参考的知识库分类</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        AI回复时会优先从选中的知识库分类中检索相关信息。未选中的分类不会被AI引用。
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-3">
                {mockKnowledgeCategories.map((cat) => {
                  const isSelected = config.knowledgeCategoryIds.includes(cat.id);
                  return (
                    <Card
                      key={cat.id}
                      className={cn(
                        "cursor-pointer transition-all",
                        isSelected ? "border-primary ring-1 ring-primary" : "hover:border-primary/50"
                      )}
                    >
                      <CardContent
                        className="p-4"
                        onClick={() => {
                          const newIds = isSelected
                            ? config.knowledgeCategoryIds.filter((id) => id !== cat.id)
                            : [...config.knowledgeCategoryIds, cat.id];
                          updateConfig("knowledgeCategoryIds", newIds);
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{cat.icon}</span>
                            <div>
                              <div className="text-sm font-semibold">{cat.name}</div>
                              <div className="text-xs text-muted-foreground">{cat.documentCount} 篇文档</div>
                            </div>
                          </div>
                          <div className={cn(
                            "flex h-5 w-5 items-center justify-center rounded border",
                            isSelected ? "border-primary bg-primary text-primary-foreground" : "border-border"
                          )}>
                            {isSelected && <Check className="h-3 w-3" />}
                          </div>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">{cat.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">检索参数</span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm">Top-K 检索数量</label>
                        <Badge variant="secondary">5</Badge>
                      </div>
                      <input type="range" min="1" max="10" step="1" defaultValue="5" className="mt-2 w-full" />
                      <p className="mt-1 text-xs text-muted-foreground">每次检索返回的最相关文档分块数量</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm">相似度阈值</label>
                        <Badge variant="secondary">0.75</Badge>
                      </div>
                      <input type="range" min="0.5" max="1" step="0.05" defaultValue="0.75" className="mt-2 w-full" />
                      <p className="mt-1 text-xs text-muted-foreground">低于此相似度的检索结果不会被引用</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ===== AI对话测试 ===== */}
          {activeNav === "test" && (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/30">
                      <TestTube2 className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">在线对话测试</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        模拟客户对话，实时测试AI回复效果。测试使用当前配置的模型和提示词。
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-0">
                  {/* 对话区域 */}
                  <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                    {testMessages.length === 0 && (
                      <div className="flex h-full flex-col items-center justify-center text-center">
                        <Bot className="h-12 w-12 text-muted-foreground/40" />
                        <p className="mt-3 text-sm text-muted-foreground">开始测试对话，体验AI回复效果</p>
                        <div className="mt-3 flex flex-wrap justify-center gap-2">
                          {["你们的课程多少钱？", "有试听课吗？", "和其他机构比有什么优势？"].map((q) => (
                            <button
                              key={q}
                              onClick={() => { setTestInput(q); }}
                              className="rounded-full bg-muted px-3 py-1.5 text-xs hover:bg-muted/70"
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {testMessages.map((msg, i) => (
                      <div key={i} className={cn("flex gap-2", msg.role === "user" ? "justify-end" : "justify-start")}>
                        {msg.role === "ai" && (
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-950/50">
                            <Bot className="h-4 w-4" />
                          </div>
                        )}
                        <div className={cn(
                          "max-w-[70%] rounded-2xl px-4 py-2.5 text-sm",
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}>
                          {msg.content}
                        </div>
                        {msg.role === "user" && (
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950/50">
                            <span className="text-xs font-medium">我</span>
                          </div>
                        )}
                      </div>
                    ))}
                    {testLoading && (
                      <div className="flex gap-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-950/50">
                          <Bot className="h-4 w-4" />
                        </div>
                        <div className="flex items-center gap-1 rounded-2xl bg-muted px-4 py-3">
                          <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.3s]" />
                          <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.15s]" />
                          <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 输入区域 */}
                  <div className="border-t border-border p-3">
                    <div className="flex gap-2">
                      <Input
                        value={testInput}
                        onChange={(e) => setTestInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleTestSend(); } }}
                        placeholder="输入客户消息进行测试..."
                        className="flex-1"
                      />
                      <Button onClick={handleTestSend} disabled={!testInput.trim() || testLoading}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                    {testMessages.length > 0 && (
                      <div className="mt-2 flex items-center justify-between">
                        <button
                          onClick={() => setTestMessages([])}
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                        >
                          <Trash2 className="h-3 w-3" /> 清空对话
                        </button>
                        <span className="text-xs text-muted-foreground">模型: {config.model}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
