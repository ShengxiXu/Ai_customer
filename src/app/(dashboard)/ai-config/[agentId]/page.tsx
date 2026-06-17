"use client";

import Link from "next/link";
import { Suspense, useState, use } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Bot, ArrowLeft, Megaphone, Wrench, BookOpen, Smartphone,
  VolumeX, Settings2, Trash2, Copy, Pencil, Save, Plus,
  Home, MessageSquare, Users, MessageCircle, BarChart3, Settings as SettingsIcon,
  ChevronRight, X, HelpCircle, MessageCircleMore, UserCheck, Sparkles,
  Lightbulb, Filter, MoreVertical, Edit2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { mockAIAgents } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { PlatformLabels, PlatformColors, AgentTemplateLabels, AISkillTypeLabels } from "@/types";
import type { AIAgent, AIAgentSkill, AISkillType } from "@/types";

const mainNavItems = [
  { href: "/dashboard", label: "首页", icon: Home },
  { href: "/conversations", label: "对话", icon: MessageSquare },
  { href: "/customers", label: "顾客", icon: Users },
  { href: "/comments", label: "评论", icon: MessageCircle },
  { href: "/knowledge", label: "知识空间", icon: BookOpen },
  { href: "/ai-config", label: "AI 员工", icon: Bot, active: true },
  { href: "/analytics", label: "数据报表", icon: BarChart3 },
  { href: "/settings", label: "设置", icon: SettingsIcon },
];

const secondaryNav = [
  { key: "reception", label: "接待管理", icon: Megaphone },
  { key: "skills", label: "技能矩阵", icon: Wrench },
  { key: "learning", label: "学习资料", icon: BookOpen },
];

const tertiaryNav = [
  { key: "scope", label: "接待范围", icon: Smartphone, parent: "reception" },
  { key: "style", label: "沟通风格", icon: MessageCircleMore, parent: "reception" },
  { key: "pause", label: "暂停接待", icon: VolumeX, parent: "reception" },
  { key: "reply", label: "回复配置", icon: Settings2, parent: "reception" },
];

type TabKey = "scope" | "style" | "pause" | "reply" | "skills" | "learning";

const availableSkills: { type: AISkillType; name: string; desc: string }[] = [
  { type: "lead", name: "获客", desc: "收集顾客信息" },
  { type: "profile", name: "记客户档案", desc: "记录顾客信息" },
  { type: "filter", name: "筛选", desc: "根据预设目标，手动调用，筛选出符合条件的顾客" },
  { type: "exclude", name: "排除", desc: "排除不符合条件的顾客" },
  { type: "smart_play", name: "智能出牌", desc: "顾客消息触发特定场景时，回放对应图片、笔记等素材" },
];

export default function AgentDetailPage({ params }: { params: Promise<{ agentId: string }> }) {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-sm text-muted-foreground">加载中…</div>}>
      <AgentDetailContent params={params} />
    </Suspense>
  );
}

function AgentDetailContent({ params }: { params: Promise<{ agentId: string }> }) {
  const { agentId } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = (searchParams.get("tab") as TabKey) || "scope";
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const [activeSecondary, setActiveSecondary] = useState<string>(
    tertiaryNav.find((n) => n.key === initialTab) ? "reception" : initialTab
  );

  const agent = mockAIAgents.find((a) => a.id === agentId) || mockAIAgents[0];
  const [localAgent, setLocalAgent] = useState<AIAgent>(agent);

  const updateAgent = <K extends keyof AIAgent>(key: K, value: AIAgent[K]) => {
    setLocalAgent((prev) => ({ ...prev, [key]: value }));
  };

  const updateScope = <K extends keyof AIAgent["scope"]>(key: K, value: AIAgent["scope"][K]) => {
    setLocalAgent((prev) => ({ ...prev, scope: { ...prev.scope, [key]: value } }));
  };

  const updateStyle = <K extends keyof AIAgent["style"]>(key: K, value: AIAgent["style"][K]) => {
    setLocalAgent((prev) => ({ ...prev, style: { ...prev.style, [key]: value } }));
  };

  const updatePause = <K extends keyof AIAgent["pauseRule"]>(key: K, value: AIAgent["pauseRule"][K]) => {
    setLocalAgent((prev) => ({ ...prev, pauseRule: { ...prev.pauseRule, [key]: value } }));
  };

  const updateReply = <K extends keyof AIAgent["replyConfig"]>(key: K, value: AIAgent["replyConfig"][K]) => {
    setLocalAgent((prev) => ({ ...prev, replyConfig: { ...prev.replyConfig, [key]: value } }));
  };

  const updateLearning = <K extends keyof AIAgent["learning"]>(key: K, value: AIAgent["learning"][K]) => {
    setLocalAgent((prev) => ({ ...prev, learning: { ...prev.learning, [key]: value } }));
  };

  const handleTabChange = (tab: TabKey, parent?: string) => {
    setActiveTab(tab);
    if (parent) setActiveSecondary(parent);
    router.replace(`/ai-config/${agentId}?tab=${tab}`);
  };

  const toggleSkill = (skillType: AISkillType) => {
    setLocalAgent((prev) => {
      const exists = prev.skills.find((s) => s.type === skillType);
      if (exists) {
        return { ...prev, skills: prev.skills.filter((s) => s.type !== skillType) };
      }
      const template = availableSkills.find((s) => s.type === skillType);
      if (!template) return prev;
      return {
        ...prev,
        skills: [...prev.skills, { type: skillType, name: template.name, description: template.desc, enabled: true }],
      };
    });
  };

  return (
    <div className="flex h-screen bg-background">
      {/* 主侧边栏 */}
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

      {/* 详情头部 + 三级侧边栏 + 内容 */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* 顶部栏 */}
        <div className="flex h-14 items-center justify-between gap-2 border-b border-border px-6">
          <div className="flex items-center gap-2 text-sm">
            <Bot className="h-4 w-4 text-muted-foreground" />
            <Link href="/ai-config" className="text-muted-foreground hover:text-foreground">AI 员工</Link>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-foreground">{localAgent.name} - {AgentTemplateLabels[localAgent.template]}</span>
            <Link href="/ai-config" className="ml-1 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex h-8 w-8 items-center justify-center rounded-md border border-input hover:bg-muted">
              <Copy className="h-4 w-4 text-muted-foreground" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-md border border-input hover:bg-muted">
              <Pencil className="h-4 w-4 text-muted-foreground" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-md border border-input hover:bg-muted">
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </button>
            <Switch checked={localAgent.status === "enabled"} onCheckedChange={(v) => updateAgent("status", v ? "enabled" : "disabled")} />
          </div>
        </div>

        {/* 描述条 */}
        <div className="flex items-center gap-2 border-b border-border bg-muted/20 px-6 py-2 text-xs text-muted-foreground">
          <span>接待时间 全天接待</span>
          <span className="text-border">|</span>
          <span>业务知识</span>
          <span className="text-border">|</span>
          <span>未知豆</span>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* 二级侧边栏 */}
          <aside className="flex w-44 shrink-0 flex-col border-r border-border bg-card">
            <nav className="flex-1 space-y-1 p-3">
              {secondaryNav.map((item) => {
                const Icon = item.icon;
                const isActive = activeSecondary === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => setActiveSecondary(item.key)}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* 三级侧边栏 + 内容区 */}
          <div className="flex flex-1 overflow-hidden">
            {activeSecondary === "reception" && (
              <aside className="flex w-40 shrink-0 flex-col border-r border-border bg-muted/20">
                <nav className="flex-1 space-y-1 p-3">
                  {tertiaryNav.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.key;
                    return (
                      <button
                        key={item.key}
                        onClick={() => handleTabChange(item.key as TabKey, "reception")}
                        className={cn(
                          "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                          isActive
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="flex-1 text-left">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </aside>
            )}

            {/* 主内容区 */}
            <main className="flex-1 overflow-y-auto">
              <div className="flex items-center justify-between border-b border-border px-6 py-3">
                <h2 className="text-base font-semibold text-foreground">
                  {activeTab === "scope" && "接待范围"}
                  {activeTab === "style" && "沟通风格"}
                  {activeTab === "pause" && "暂停接待"}
                  {activeTab === "reply" && "回复配置"}
                  {activeTab === "skills" && "技能矩阵"}
                  {activeTab === "learning" && "学习资料"}
                </h2>
                <Button size="sm" onClick={() => {}}>保存</Button>
              </div>

              <div className="mx-auto max-w-3xl space-y-6 p-6">
                {activeTab === "scope" && <ScopeTab agent={localAgent} updateScope={updateScope} />}
                {activeTab === "style" && <StyleTab agent={localAgent} updateStyle={updateStyle} />}
                {activeTab === "pause" && <PauseTab agent={localAgent} updatePause={updatePause} />}
                {activeTab === "reply" && <ReplyTab agent={localAgent} updateReply={updateReply} />}
                {activeTab === "skills" && <SkillsTab agent={localAgent} toggleSkill={toggleSkill} />}
                {activeTab === "learning" && <LearningTab agent={localAgent} updateLearning={updateLearning} />}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== 子模块组件 ====================

function FieldLabel({ label, tip, required }: { label: string; tip?: string; required?: boolean }) {
  return (
    <div className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
      {label}
      {required && <span className="text-red-500">*</span>}
      {tip && <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />}
    </div>
  );
}

function Field({ label, tip, required, children }: { label: string; tip?: boolean; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-red-500">*</span>}
        {tip && <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />}
      </div>
      {children}
    </div>
  );
}

function ScopeTab({ agent, updateScope }: { agent: AIAgent; updateScope: <K extends keyof AIAgent["scope"]>(key: K, value: AIAgent["scope"][K]) => void }) {
  return (
    <div className="space-y-5">
      <Field label="接待渠道" required>
        <select
          value=""
          onChange={() => {}}
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none"
        >
          <option value="">请选择接待渠道</option>
        </select>
      </Field>

      <Field label="服务时间" required>
        <div className="flex gap-2">
          <button
            onClick={() => updateScope("serviceMode", "all_day")}
            className={cn(
              "flex-1 rounded-md border px-3 py-2 text-sm transition-colors",
              agent.scope.serviceMode === "all_day"
                ? "border-primary bg-primary/5 text-primary"
                : "border-input text-foreground hover:border-primary/50"
            )}
          >
            全天接待
          </button>
          <button
            onClick={() => updateScope("serviceMode", "custom")}
            className={cn(
              "flex-1 rounded-md border px-3 py-2 text-sm transition-colors",
              agent.scope.serviceMode === "custom"
                ? "border-primary bg-primary/5 text-primary"
                : "border-input text-foreground hover:border-primary/50"
            )}
          >
            自定义接待
          </button>
        </div>
      </Field>

      <Field label="角色与专长" tip required>
        <textarea
          value={agent.scope.expertise}
          onChange={(e) => updateScope("expertise", e.target.value)}
          placeholder="不指定专长"
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
        <p className="mt-1.5 text-xs text-muted-foreground">如果某个企业的小智A都不指定专长，会按照其他条件范围匹配</p>
      </Field>

      <Field label="意图引导专家">
        <p className="text-xs text-muted-foreground">我专门负责引导不同问题群，通过巧妙的话设计，帮助他们浏览并明确自己真实需求，是您顾客背后的聊天高手</p>
      </Field>

      <Field label="自定义专长">
        <p className="text-xs text-muted-foreground">自定义小智A专长，为顾客匹配最合适的小智</p>
      </Field>

      <Field label="筛选顾客">
        <button className="flex items-center gap-1.5 text-sm text-primary hover:underline">
          <Plus className="h-3.5 w-3.5" /> 添加筛选
        </button>
      </Field>
    </div>
  );
}

function StyleTab({ agent, updateStyle }: { agent: AIAgent; updateStyle: <K extends keyof AIAgent["style"]>(key: K, value: AIAgent["style"][K]) => void }) {
  return (
    <div className="space-y-5">
      <Field label="开场白" required>
        <textarea
          value={agent.style.greeting}
          onChange={(e) => updateStyle("greeting", e.target.value)}
          placeholder="请输入开场白内容"
          rows={3}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
      </Field>

      <Field label="默认接待风格" tip>
        <textarea
          value={agent.style.defaultTone}
          onChange={(e) => updateStyle("defaultTone", e.target.value)}
          placeholder="请输入接待风格描述"
          rows={4}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
        <div className="mt-1 text-right text-xs text-muted-foreground">0/1000</div>
        <p className="text-xs text-muted-foreground">优先使用特殊专属接待风格，未配置时使用默认风格</p>
      </Field>

      <Field label="话术约束">
        <textarea
          value={agent.style.toneConstraint}
          onChange={(e) => updateStyle("toneConstraint", e.target.value)}
          placeholder="请输入话术约束内容"
          rows={4}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
        <div className="mt-1 text-right text-xs text-muted-foreground">0/1000</div>
      </Field>

      <div>
        <FieldLabel label="回答内容检查" />
        <p className="mb-3 text-xs text-muted-foreground">AI 员工回复之前会检查包含相关语义的内容，替换为指定表达</p>
        <div className="space-y-3 rounded-md border border-input p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">当需要回复 <span className="font-medium">微信</span> 时，替换为</span>
            <Switch checked={agent.style.checkWechat} onCheckedChange={(v) => updateStyle("checkWechat", v)} />
          </div>
          {agent.style.checkWechat && (
            <input
              value={agent.style.wechatReplacement}
              onChange={(e) => updateStyle("wechatReplacement", e.target.value)}
              className="h-8 w-full rounded border border-input bg-background px-2 text-sm focus:border-primary focus:outline-none"
            />
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">当需要回复 <span className="font-medium">电话/手机号</span> 时，替换为</span>
            <Switch checked={agent.style.checkPhone} onCheckedChange={(v) => updateStyle("checkPhone", v)} />
          </div>
          {agent.style.checkPhone && (
            <input
              value={agent.style.phoneReplacement}
              onChange={(e) => updateStyle("phoneReplacement", e.target.value)}
              className="h-8 w-full rounded border border-input bg-background px-2 text-sm focus:border-primary focus:outline-none"
            />
          )}
        </div>
      </div>
    </div>
  );
}

function PauseTab({ agent, updatePause }: { agent: AIAgent; updatePause: <K extends keyof AIAgent["pauseRule"]>(key: K, value: AIAgent["pauseRule"][K]) => void }) {
  return (
    <div className="space-y-5">
      <div className="rounded-md border border-input p-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-foreground">顾客情绪不好时，暂停接待</div>
            <p className="mt-1 text-xs text-muted-foreground">当检测到顾客情绪不好时，小智 AI 将自动暂停</p>
          </div>
          <Switch checked={agent.pauseRule.satisfactionEnabled} onCheckedChange={(v) => updatePause("satisfactionEnabled", v)} />
        </div>
      </div>

      <div className="rounded-md border border-input p-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-foreground">当提到这些词语时，暂停接待</div>
          <Switch checked={agent.pauseRule.keywordEnabled} onCheckedChange={(v) => updatePause("keywordEnabled", v)} />
        </div>
        {agent.pauseRule.keywordEnabled && (
          <input
            value={agent.pauseRule.pauseKeywords.join(",")}
            onChange={(e) => updatePause("pauseKeywords", e.target.value.split(",").filter(Boolean))}
            placeholder="请输入内容开始回车"
            className="mt-3 h-8 w-full rounded border border-input bg-background px-2 text-sm focus:border-primary focus:outline-none"
          />
        )}
      </div>

      <div className="rounded-md border border-input p-3">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-foreground">接收到平台发来的系统消息，暂停接待</div>
            <p className="mt-1 text-xs text-muted-foreground">当客服在平台回复消息又处理对客AI作时可以使用此功能</p>
          </div>
          <Switch checked={agent.pauseRule.platformStrategyEnabled} onCheckedChange={(v) => updatePause("platformStrategyEnabled", v)} />
        </div>

        <div className="space-y-3">
          <div className="rounded-md border border-border bg-muted/20 p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">小红书</span>
              <Switch checked={agent.pauseRule.platformStrategyEnabled} onCheckedChange={(v) => updatePause("platformStrategyEnabled", v)} />
            </div>
            {agent.pauseRule.platformStrategyEnabled && (
              <>
                <select className="mt-2 h-8 w-full rounded border border-input bg-background px-2 text-sm">
                  <option>请选择自动恢复时间</option>
                </select>
                <p className="mt-1.5 text-xs text-muted-foreground">暂停接待后，系统将在所选时间后自动恢复接待。</p>
              </>
            )}
          </div>
          <div className="rounded-md border border-border bg-muted/20 p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">抖音</span>
              <Switch checked={agent.pauseRule.platformStrategyEnabled} onCheckedChange={(v) => updatePause("platformStrategyEnabled", v)} />
            </div>
            {agent.pauseRule.platformStrategyEnabled && (
              <>
                <select className="mt-2 h-8 w-full rounded border border-input bg-background px-2 text-sm">
                  <option>请选择自动恢复时间</option>
                </select>
                <p className="mt-1.5 text-xs text-muted-foreground">暂停接待后，系统将在所选时间后自动恢复接待。</p>
              </>
            )}
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">对话开始的第一条消息如果是平台发发的系统消息，仍然正常接待</p>
      </div>
    </div>
  );
}

function ReplyTab({ agent, updateReply }: { agent: AIAgent; updateReply: <K extends keyof AIAgent["replyConfig"]>(key: K, value: AIAgent["replyConfig"][K]) => void }) {
  return (
    <div className="space-y-5">
      <Field label="回复字数">
        <select
          value={agent.replyConfig.maxLength}
          onChange={(e) => updateReply("maxLength", e.target.value as AIAgent["replyConfig"]["maxLength"])}
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none"
        >
          <option value="short">适中</option>
          <option value="medium">中等</option>
          <option value="long">较长</option>
          <option value="unlimited">不限</option>
        </select>
      </Field>

      <div>
        <FieldLabel label="消息聚合间隔" />
        <input
          type="number"
          value={agent.replyConfig.aggregateWindow}
          onChange={(e) => updateReply("aggregateWindow", Number(e.target.value))}
          className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none"
        />
        <p className="mt-1.5 text-xs text-muted-foreground">范围：0-10秒</p>
      </div>

      <div>
        <FieldLabel label="延迟回复间隔" />
        <input
          type="number"
          value={agent.replyConfig.delayedReplyInterval}
          onChange={(e) => updateReply("delayedReplyInterval", Number(e.target.value))}
          className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none"
        />
        <p className="mt-1.5 text-xs text-muted-foreground">范围：0-60秒</p>
      </div>
    </div>
  );
}

function SkillsTab({ agent, toggleSkill }: { agent: AIAgent; toggleSkill: (type: AISkillType) => void }) {
  return (
    <div className="space-y-6">
      {/* 已添加技能 */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">技能矩阵</h3>
        </div>
        <div className="mb-4 flex border-b border-border">
          <button className="border-b-2 border-primary px-4 py-2 text-sm font-medium text-primary">
            添加技能
          </button>
          <button className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">已添加技能</button>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-foreground">点击以添加技能</h3>
        <div className="grid grid-cols-2 gap-3">
          {availableSkills.map((skill) => {
            const isAdded = agent.skills.some((s) => s.type === skill.type);
            return (
              <div
                key={skill.type}
                className="flex items-start gap-3 rounded-md border border-input bg-card p-3 hover:border-primary/50"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Lightbulb className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-foreground">{skill.name}</span>
                    {skill.type === "lead" && <span className="text-[10px] text-muted-foreground">0/2</span>}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{skill.desc}</p>
                </div>
                <button
                  onClick={() => toggleSkill(skill.type)}
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                    isAdded ? "bg-primary text-primary-foreground" : "border border-input text-muted-foreground hover:border-primary hover:text-primary"
                  )}
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-foreground">已添加技能</h3>
        {agent.skills.length === 0 ? (
          <p className="text-xs text-muted-foreground">暂未添加技能</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {agent.skills.map((skill) => (
              <div key={skill.type} className="rounded-md border border-emerald-200 bg-emerald-50/50 p-3 dark:border-emerald-900 dark:bg-emerald-950/20">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground">{skill.name}</div>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{skill.description}</p>
                  </div>
                  <button className="text-muted-foreground hover:text-foreground">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function LearningTab({ agent, updateLearning }: { agent: AIAgent; updateLearning: <K extends keyof AIAgent["learning"]>(key: K, value: AIAgent["learning"][K]) => void }) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border border-input bg-card p-3 text-xs text-muted-foreground">
        在这里补充 AI 员工需要学习的资料，让 AI 在回复客户时更专业、更准确
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => updateLearning("companyIntro", agent.learning.companyIntro || "请输入公司介绍")}
          className={cn(
            "rounded-md border p-3 text-left text-sm transition-colors",
            agent.learning.companyIntro ? "border-primary bg-primary/5 text-foreground" : "border-input text-muted-foreground hover:border-primary/50"
          )}
        >
          <div className="flex items-center gap-2 font-medium">
            <BookOpen className="h-4 w-4" /> 公司介绍
          </div>
          {agent.learning.companyIntro && (
            <p className="mt-2 text-xs">{agent.learning.companyIntro}</p>
          )}
        </button>

        <button
          onClick={() => updateLearning("productIntro", agent.learning.productIntro || "请输入产品介绍")}
          className={cn(
            "rounded-md border p-3 text-left text-sm transition-colors",
            agent.learning.productIntro ? "border-primary bg-primary/5 text-foreground" : "border-input text-muted-foreground hover:border-primary/50"
          )}
        >
          <div className="flex items-center gap-2 font-medium">
            <Sparkles className="h-4 w-4" /> 产品介绍
          </div>
          {agent.learning.productIntro && (
            <p className="mt-2 text-xs">{agent.learning.productIntro}</p>
          )}
        </button>

        <button
          onClick={() => updateLearning("serviceAudience", agent.learning.serviceAudience || "请输入服务对象")}
          className={cn(
            "rounded-md border p-3 text-left text-sm transition-colors",
            agent.learning.serviceAudience ? "border-primary bg-primary/5 text-foreground" : "border-input text-muted-foreground hover:border-primary/50"
          )}
        >
          <div className="flex items-center gap-2 font-medium">
            <UserCheck className="h-4 w-4" /> 服务对象
          </div>
          {agent.learning.serviceAudience && (
            <p className="mt-2 text-xs">{agent.learning.serviceAudience}</p>
          )}
        </button>

        <button
          onClick={() => updateLearning("businessKnowledge", agent.learning.businessKnowledge || "请输入业务知识")}
          className={cn(
            "rounded-md border p-3 text-left text-sm transition-colors",
            agent.learning.businessKnowledge ? "border-primary bg-primary/5 text-foreground" : "border-input text-muted-foreground hover:border-primary/50"
          )}
        >
          <div className="flex items-center gap-2 font-medium">
            <BookOpen className="h-4 w-4" /> 业务知识
          </div>
          {agent.learning.businessKnowledge && (
            <p className="mt-2 text-xs">{agent.learning.businessKnowledge}</p>
          )}
        </button>
      </div>

      {Object.values(agent.learning).some((v) => v) && (
        <div className="mt-4 rounded-md border border-input bg-muted/20 p-4">
          <FieldLabel label={Object.keys(agent.learning).find((k) => agent.learning[k as keyof AIAgent["learning"]]) as string} />
          <textarea
            value={Object.values(agent.learning).find((v) => v) || ""}
            onChange={(e) => {
              const key = Object.keys(agent.learning).find((k) => agent.learning[k as keyof AIAgent["learning"]]) as keyof AIAgent["learning"];
              if (key) updateLearning(key, e.target.value);
            }}
            rows={10}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}
