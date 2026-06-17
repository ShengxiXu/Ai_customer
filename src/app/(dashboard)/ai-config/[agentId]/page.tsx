"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Megaphone, Wrench, BookOpen, Smartphone,
  VolumeX, Settings2, Trash2, Copy, Pencil, Plus, X,
  ChevronRight, MessageCircleMore, Sparkles, MoreVertical, Bot,
  Lightbulb, Filter as FilterIcon, Check, Building2, Package, Users, Briefcase,
  AlertCircle, ChevronDown, Target, Send, Save, RefreshCw,
  UserPlus, Headphones, MessageSquareDashed, ClipboardList, UserMinus, Filter as Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { mockAIAgents } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { AgentTemplateLabels } from "@/types";
import type { AIAgent, SkillNode, AISkillType, AIAgentSkill } from "@/types";

export default function AgentDetailPage({ params }: { params: { agentId: string } }) {
  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center text-sm text-muted-foreground">加载中…</div>}>
      <AgentDetailContent agentId={params.agentId} />
    </Suspense>
  );
}

type TabKey = "scope" | "style" | "pause" | "reply" | "skills" | "skills_added" | "company" | "product" | "audience" | "knowledge";

const secondaryNav = [
  { key: "reception", label: "接待管理", icon: Megaphone, childType: "reception" as const },
  { key: "skills", label: "技能矩阵", icon: Wrench, childType: "skills" as const },
  { key: "learning", label: "学习资料", icon: BookOpen, childType: "learning" as const },
];

const skillIcons: Record<AISkillType, typeof Lightbulb> = {
  lead: UserPlus,
  self_learn: Headphones,
  auto_reply: MessageSquareDashed,
  profile: ClipboardList,
  filter: Filter,
  exclude: UserMinus,
};

function AgentDetailContent({ agentId }: { agentId: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = (searchParams.get("tab") as TabKey) || "scope";
  const initialSkill = searchParams.get("skill") as AISkillType | undefined;
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const [selectedSkillType, setSelectedSkillType] = useState<AISkillType | undefined>(initialSkill || undefined);
  const [activeSecondary, setActiveSecondary] = useState<string>(
    initialTab.startsWith("skills") ? "skills" :
    initialTab === "company" || initialTab === "product" || initialTab === "audience" || initialTab === "knowledge" ? "learning" :
    "reception"
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

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setSelectedSkillType(undefined);
    router.replace(`/ai-config/${agentId}?tab=${tab}`);
  };

  const handleSelectSkill = (type: AISkillType | undefined) => {
    setSelectedSkillType(type);
    if (type) {
      router.replace(`/ai-config/${agentId}?tab=skills&skill=${type}`);
    } else {
      router.replace(`/ai-config/${agentId}?tab=skills`);
    }
  };

  const handleSecondaryChange = (key: string) => {
    setActiveSecondary(key);
    const defaultTabs: Record<string, TabKey> = {
      reception: "scope",
      skills: "skills",
      learning: "company",
    };
    const targetTab = defaultTabs[key] || "scope";
    setActiveTab(targetTab);
    setSelectedSkillType(undefined);
    router.replace(`/ai-config/${agentId}?tab=${targetTab}`);
  };

  // 接待子模块
  const receptionChildren = [
    { key: "scope" as TabKey, label: "接待范围", icon: Smartphone },
    { key: "style" as TabKey, label: "沟通风格", icon: MessageCircleMore },
    { key: "pause" as TabKey, label: "暂停接待", icon: VolumeX },
    { key: "reply" as TabKey, label: "回复配置", icon: Settings2 },
  ];

  // 学习资料子模块
  const learningChildren = [
    { key: "company" as TabKey, label: "公司介绍", icon: Building2 },
    { key: "product" as TabKey, label: "产品介绍", icon: Package },
    { key: "audience" as TabKey, label: "服务对象", icon: Users },
    { key: "knowledge" as TabKey, label: "业务知识", icon: Briefcase },
  ];

  const currentReception = receptionChildren.find((c) => c.key === activeTab);
  const currentLearning = learningChildren.find((c) => c.key === activeTab);
  const selectedSkillName = selectedSkillType ? localAgent.skills.find((s) => s.type === selectedSkillType)?.name : undefined;
  const currentChildLabel = selectedSkillName
    || currentReception?.label
    || currentLearning?.label
    || (activeTab === "skills" ? "技能管理" : activeTab === "skills_added" ? "已添加技能" : "接待范围");

  return (
    <div className="flex h-full bg-background">
      {/* 二级侧边栏 */}
      <aside className="flex w-44 shrink-0 flex-col border-r border-border bg-card">
        <nav className="flex-1 space-y-1 p-3">
          {secondaryNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeSecondary === item.key;
            return (
              <button
                key={item.key}
                onClick={() => handleSecondaryChange(item.key)}
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
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* 详情头部 */}
        <div className="flex h-14 items-center justify-between gap-2 border-b border-border px-6">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/ai-config" className="text-muted-foreground hover:text-foreground flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" />
            </Link>
            <span className="text-foreground font-medium">{localAgent.name}</span>
            <span className="text-muted-foreground">|</span>
            <span className="text-muted-foreground">{localAgent.description}</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex h-8 w-8 items-center justify-center rounded-md border border-input hover:bg-muted" title="删除">
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-md border border-input hover:bg-muted" title="复制">
              <Copy className="h-4 w-4 text-muted-foreground" />
            </button>
            <Switch checked={localAgent.status === "enabled"} onCheckedChange={(v) => updateAgent("status", v ? "enabled" : "disabled")} />
          </div>
        </div>

        {/* 描述条 */}
        <div className="flex items-center gap-2 border-b border-border bg-muted/20 px-6 py-2 text-xs text-muted-foreground">
          <ClockIcon className="h-3 w-3" />
          <span>接待时间</span>
          <span className="text-foreground">{localAgent.scope.serviceMode === "all_day" ? "全天接待" : "自定义"}</span>
          <span className="text-border">|</span>
          <BookOpen className="h-3 w-3" />
          <span>业务知识</span>
          {localAgent.knowledgeBaseName ? (
            <button className="text-primary hover:underline">{localAgent.knowledgeBaseName}</button>
          ) : (
            <span className="text-muted-foreground">未设置</span>
          )}
        </div>

        <div className="flex flex-1 overflow-hidden">
          {activeSecondary === "reception" && (
            <aside className="flex w-40 shrink-0 flex-col border-r border-border bg-muted/20">
              <nav className="flex-1 space-y-1 p-3">
                {receptionChildren.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => handleTabChange(item.key)}
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

          {activeSecondary === "skills" && (
            <aside className="flex w-48 shrink-0 flex-col border-r border-border bg-card">
              <nav className="flex-1 space-y-3 p-3">
                {localAgent.skills.map((skill) => {
                  const Icon = skillIcons[skill.type] ?? Lightbulb;
                  const isActive = selectedSkillType === skill.type;
                  return (
                    <button
                      key={skill.type}
                      onClick={() => handleSelectSkill(skill.type)}
                      className={cn(
                        "group flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-muted/60"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0",
                          isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                        )}
                      />
                      <span className={cn("flex-1 truncate text-left", isActive && "font-medium")}>
                        {skill.name}
                      </span>
                      {skill.hasWarning && (
                        <AlertCircle className="h-3.5 w-3.5 shrink-0 text-red-500" fill="currentColor" stroke="white" />
                      )}
                      <span
                        role="switch"
                        aria-checked={skill.enabled}
                        onClick={(e) => {
                          e.stopPropagation();
                          setLocalAgent((prev) => ({
                            ...prev,
                            skills: prev.skills.map((s) => (s.type === skill.type ? { ...s, enabled: !s.enabled } : s)),
                          }));
                        }}
                        className={cn(
                          "relative inline-flex h-[18px] w-8 shrink-0 cursor-pointer items-center rounded-full transition-colors",
                          skill.enabled ? "bg-primary" : "bg-muted-foreground/30"
                        )}
                      >
                        <span
                          className={cn(
                            "inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform",
                            skill.enabled ? "translate-x-[15px]" : "translate-x-0.5"
                          )}
                        />
                      </span>
                    </button>
                  );
                })}
                {localAgent.skills.length === 0 && (
                  <div className="px-3 py-2 text-xs text-muted-foreground">暂未添加技能</div>
                )}
              </nav>
            </aside>
          )}

          {activeSecondary === "learning" && (
            <aside className="flex w-40 shrink-0 flex-col border-r border-border bg-muted/20">
              <nav className="flex-1 space-y-1 p-3">
                {learningChildren.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => handleTabChange(item.key)}
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
              <h2 className="text-base font-semibold text-foreground">{currentChildLabel}</h2>
              <Button size="sm" onClick={() => {}}>保存</Button>
            </div>

            <div className={cn(
              "mx-auto space-y-6 p-6",
              (activeTab === "skills" || activeTab === "skills_added") ? "max-w-4xl" : "max-w-3xl"
            )}>
              {activeTab === "scope" && <ScopeTab agent={localAgent} updateScope={updateScope} />}
              {activeTab === "style" && <StyleTab agent={localAgent} updateStyle={updateStyle} />}
              {activeTab === "pause" && <PauseTab agent={localAgent} updatePause={updatePause} />}
              {activeTab === "reply" && <ReplyTab agent={localAgent} updateReply={updateReply} />}
              {(activeTab === "skills" || activeTab === "skills_added") && (
                <SkillsTab agent={localAgent} selectedSkillType={selectedSkillType} onSelectSkill={handleSelectSkill} />
              )}
              {activeTab === "company" && <LearningFieldTab agent={localAgent} field="companyIntro" label="公司介绍" updateLearning={updateLearning} />}
              {activeTab === "product" && <LearningFieldTab agent={localAgent} field="productIntro" label="产品介绍" updateLearning={updateLearning} />}
              {activeTab === "audience" && <LearningFieldTab agent={localAgent} field="serviceAudience" label="服务对象" updateLearning={updateLearning} />}
              {activeTab === "knowledge" && <LearningFieldTab agent={localAgent} field="businessKnowledge" label="业务知识" updateLearning={updateLearning} />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function Field({ label, children, hint, counter, maxLength }: { label: string; children: React.ReactNode; hint?: string; counter?: number; maxLength?: number }) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-1 text-sm font-medium text-foreground">
        {label}
      </div>
      {children}
      {(hint || counter !== undefined) && (
        <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
          {hint && <span>{hint}</span>}
          {counter !== undefined && maxLength !== undefined && (
            <span className="ml-auto">{counter}/{maxLength}</span>
          )}
        </div>
      )}
    </div>
  );
}

// ==================== 子模块组件 ====================

function ScopeTab({ agent, updateScope }: { agent: AIAgent; updateScope: <K extends keyof AIAgent["scope"]>(key: K, value: AIAgent["scope"][K]) => void }) {
  const showChannels = agent.boundChannels.slice(0, 1);
  const hiddenCount = Math.max(0, agent.boundChannels.length - 1);
  const [showChannelDropdown, setShowChannelDropdown] = useState(false);

  return (
    <div className="space-y-5">
      <Field label="接待渠道">
        <div className="relative">
          <button
            onClick={() => setShowChannelDropdown(!showChannelDropdown)}
            className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-sm hover:border-primary/50"
          >
            <div className="flex items-center gap-1.5 overflow-hidden">
              {showChannels.length > 0 ? (
                <>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-medium text-white" style={{ backgroundColor: "#07C160" }}>
                    {showChannels[0].accountName[0]}
                  </span>
                  <span className="truncate">{showChannels[0].accountName}</span>
                  {hiddenCount > 0 && (
                    <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-[10px]">+{hiddenCount}</Badge>
                  )}
                </>
              ) : (
                <span className="text-muted-foreground">请选择接待渠道</span>
              )}
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
          {showChannelDropdown && (
            <div className="absolute z-10 mt-1 w-full rounded-md border border-input bg-card shadow-lg">
              {agent.boundChannels.map((ch, i) => (
                <div key={i} className="flex items-center justify-between px-3 py-2 hover:bg-muted">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-medium text-white" style={{ backgroundColor: "#07C160" }}>
                      {ch.accountName[0]}
                    </span>
                    <span className="text-sm">{ch.accountName}</span>
                  </div>
                  <button className="text-muted-foreground hover:text-foreground">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Field>

      <Field label="服务时间">
        <div className="flex w-full rounded-md border border-input p-0.5">
          <button
            onClick={() => updateScope("serviceMode", "all_day")}
            className={cn(
              "flex-1 rounded px-3 py-1.5 text-sm transition-colors",
              agent.scope.serviceMode === "all_day"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            全天接待
          </button>
          <button
            onClick={() => updateScope("serviceMode", "custom")}
            className={cn(
              "flex-1 rounded px-3 py-1.5 text-sm transition-colors",
              agent.scope.serviceMode === "custom"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            自定义接待
          </button>
        </div>
      </Field>

      <Field label="角色与专长" hint="如果某个企业的小洽AI都不指定专长，会按照其他条件范围匹配">
        <textarea
          value={agent.scope.expertise}
          onChange={(e) => updateScope("expertise", e.target.value)}
          placeholder="不指定专长"
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
      </Field>

      <div>
        <div className="mb-2 text-sm font-medium text-foreground">意图引导专家</div>
        <p className="text-xs text-muted-foreground">我专门负责引导不同问题群，通过巧妙的话设计，帮助他们浏览并明确自己真实需求，是您顾客背后的聊天高手</p>
      </div>

      <div>
        <div className="mb-2 text-sm font-medium text-foreground">自定义专长</div>
        <p className="text-xs text-muted-foreground">自定义小洽AI专长，为顾客匹配最合适的小洽</p>
      </div>

      <div>
        <div className="mb-2 text-sm font-medium text-foreground">筛选顾客</div>
        <button className="flex items-center gap-1.5 text-sm text-primary hover:underline">
          <Plus className="h-3.5 w-3.5" /> 添加筛选
        </button>
      </div>
    </div>
  );
}

function StyleTab({ agent, updateStyle }: { agent: AIAgent; updateStyle: <K extends keyof AIAgent["style"]>(key: K, value: AIAgent["style"][K]) => void }) {
  return (
    <div className="space-y-5">
      <Field label="开场白">
        <textarea
          value={agent.style.greeting}
          onChange={(e) => updateStyle("greeting", e.target.value)}
          placeholder="请输入开场白内容"
          rows={4}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
      </Field>

      <Field label="默认接待风格" counter={agent.style.defaultTone.length} maxLength={3000} hint={agent.style.defaultTone.length > 0 ? "优先使用技能专属接待风格，未配置时使用默认风格" : "优先使用技能专属接待风格，未配置时使用默认风格"}>
        <textarea
          value={agent.style.defaultTone}
          onChange={(e) => updateStyle("defaultTone", e.target.value)}
          placeholder="请输入接待风格描述"
          rows={6}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
      </Field>

      <Field label="话术约束" counter={agent.style.toneConstraint.length} maxLength={1000}>
        <textarea
          value={agent.style.toneConstraint}
          onChange={(e) => updateStyle("toneConstraint", e.target.value)}
          placeholder="请输入话术约束内容"
          rows={4}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
      </Field>

      <div>
        <div className="mb-2 text-sm font-medium text-foreground">回答内容检查</div>
        <p className="mb-3 text-xs text-muted-foreground">AI 员工回复之前检查包含相关语义的内容，替换为指定表述</p>
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
            <p className="mt-1 text-xs text-muted-foreground">当检测到顾客情绪不好时，小洽 AI 将自动暂停</p>
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
          <div className="mt-3 flex flex-wrap items-center gap-2 rounded border border-input bg-background p-2 min-h-[36px]">
            {agent.pauseRule.pauseKeywords.map((kw, i) => (
              <span key={i} className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs text-foreground">
                {kw}
                <button
                  onClick={() => {
                    const next = agent.pauseRule.pauseKeywords.filter((_, idx) => idx !== i);
                    updatePause("pauseKeywords", next);
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            <input
              placeholder="请输入内容并按回车"
              className="flex-1 min-w-[120px] bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.currentTarget.value.trim()) {
                  e.preventDefault();
                  const v = e.currentTarget.value.trim();
                  if (!agent.pauseRule.pauseKeywords.includes(v)) {
                    updatePause("pauseKeywords", [...agent.pauseRule.pauseKeywords, v]);
                  }
                  e.currentTarget.value = "";
                }
              }}
            />
          </div>
        )}
      </div>

      <div className="rounded-md border border-input p-3">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-foreground">接收到平台发来的系统消息，暂停接待</div>
            <p className="mt-1 text-xs text-muted-foreground">当客服在平台回复消息又希望打断AI节点时可以使用此功能。</p>
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
        <p className="mt-3 text-xs text-muted-foreground">对话开始的第一条消息如果是平台发送的系统消息，仍然正常接待</p>
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
          <option value="short">简短</option>
          <option value="medium">适中</option>
          <option value="long">详细</option>
          <option value="unlimited">不限</option>
        </select>
      </Field>

      <Field label="消息聚合间隔" hint="范围：0-10秒">
        <input
          type="number"
          value={agent.replyConfig.aggregateWindow}
          onChange={(e) => updateReply("aggregateWindow", Number(e.target.value))}
          className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none"
        />
      </Field>

      <Field label="延迟回复间隔" hint="范围：0-60秒">
        <input
          type="number"
          value={agent.replyConfig.delayedReplyInterval}
          onChange={(e) => updateReply("delayedReplyInterval", Number(e.target.value))}
          className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none"
        />
      </Field>
    </div>
  );
}

function SkillsTab({ agent, selectedSkillType, onSelectSkill }: { agent: AIAgent; selectedSkillType?: AISkillType; onSelectSkill: (type: AISkillType | undefined) => void }) {
  const selectedSkill = selectedSkillType ? agent.skills.find((s) => s.type === selectedSkillType) : undefined;

  return (
    <div className="space-y-5">
      {/* 顶部双 Tab */}
      <div className="flex items-center justify-between border-b border-border">
        <div className="flex">
          <button
            onClick={() => onSelectSkill(undefined)}
            className={cn(
              "border-b-2 px-4 py-2 text-sm font-medium",
              !selectedSkill ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            技能规则
          </button>
          <button
            onClick={() => onSelectSkill(agent.skills[0]?.type)}
            className={cn(
              "border-b-2 px-4 py-2 text-sm font-medium",
              selectedSkill ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            添加技能
          </button>
        </div>
        <Button size="sm" variant="outline" className="gap-1">
          <Plus className="h-3.5 w-3.5" /> 规则
        </Button>
      </div>

      {/* 当未选中技能时,显示技能规则/流程图 */}
      {!selectedSkill && (
        <>
          {/* 技能说明 */}
          <div className="rounded-md border border-input bg-card p-3">
            <button className="flex w-full items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-medium text-foreground">
                <AlertCircle className="h-4 w-4 text-blue-500" />
                技能规则小贴士
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
            <div className="mt-2 space-y-1 text-xs text-muted-foreground">
              <p><span className="font-medium text-foreground">自动切换：</span>顾客进入对话后，小洽AI 会按照预设好的规则切换技能</p>
              <p><span className="font-medium text-foreground">被动技能：</span>沉默追问、智能应答、记录 等技能被动触发，不需要配置</p>
            </div>
          </div>

          {/* 流程图 */}
          <div className="relative space-y-4">
            {agent.skillNodes.length === 0 ? (
              <div className="rounded-md border border-dashed border-input p-8 text-center text-sm text-muted-foreground">
                暂未配置技能规则，点击右上角"规则"按钮添加
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                {agent.skillNodes.map((node, i) => (
                  <div key={node.id} className="w-full max-w-2xl">
                    <SkillNodeCard node={node} />
                    {i < agent.skillNodes.length - 1 && (
                      <div className="my-2 flex justify-center">
                        <div className="flex flex-col items-center">
                          <div className="h-4 w-px bg-border"></div>
                          <div className="text-xs text-muted-foreground">↓</div>
                          <div className="h-4 w-px bg-border"></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* 选中技能时显示技能配置页面 */}
      {selectedSkill && <SkillConfigPage agent={agent} skill={selectedSkill} />}
    </div>
  );
}

// ==================== 技能配置页面 ====================

function SkillConfigPage({ agent, skill }: { agent: AIAgent; skill: AIAgentSkill }) {
  // 根据技能类型渲染对应的配置表单
  switch (skill.type) {
    case "lead":
      return <LeadSkillConfig skill={skill} />;
    case "self_learn":
      return <ServiceSkillConfig skill={skill} />;
    case "auto_reply":
      return <SilentAskSkillConfig skill={skill} />;
    case "profile":
      return <CollectSkillConfig skill={skill} />;
    case "filter":
      return <FilterSkillConfig skill={skill} />;
    case "exclude":
      return <ExcludeSkillConfig skill={skill} />;
    default:
      return <DefaultSkillConfig skill={skill} />;
  }
}

function SkillHeader({ icon, name, description, enabled, onToggle }: { icon: React.ReactNode; name: string; description: string; enabled: boolean; onToggle: () => void }) {
  return (
    <div className="rounded-md border border-input bg-card p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
            {icon}
          </div>
          <div>
            <div className="text-base font-medium text-foreground">{name}</div>
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{enabled ? "已启用" : "已停用"}</span>
          <Switch checked={enabled} onCheckedChange={onToggle} />
        </div>
      </div>
    </div>
  );
}

// 获客技能 - 引导客户留资
function LeadSkillConfig({ skill }: { skill: AIAgentSkill }) {
  return (
    <div className="space-y-4">
      <SkillHeader
        icon={<Target className="h-5 w-5" />}
        name="获客"
        description="在对话中，主动询问并获取顾客的联系方式（微信、手机号等）"
        enabled={skill.enabled}
        onToggle={() => {}}
      />

      <div className="rounded-md border border-input p-4 space-y-4">
        <Field label="触发时机">
          <div className="space-y-2">
            {["客户主动表达购买意向", "客户询问价格或课程", "客户多次咨询后", "客服主动发起"].map((opt, i) => (
              <label key={i} className="flex items-center gap-2 text-sm">
                <input type="radio" name="lead_trigger" defaultChecked={i === 1} className="h-4 w-4" />
                {opt}
              </label>
            ))}
          </div>
        </Field>

        <Field label="留资引导话术" hint="使用 [姓名] 等变量提升亲切感">
          <textarea
            rows={4}
            defaultValue="看您对我们的课程很感兴趣呢！方便留个微信吗？我把详细的课表、试听视频和优惠信息发给您看看~"
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </Field>

        <Field label="联系方式类型">
          <div className="flex flex-wrap gap-3">
            {["微信号", "手机号", "QQ", "邮箱"].map((t, i) => (
              <label key={t} className="flex items-center gap-1.5 text-sm">
                <input type="checkbox" defaultChecked={i < 2} className="h-4 w-4" />
                {t}
              </label>
            ))}
          </div>
        </Field>

        <Field label="留资后自动跟进">
          <Switch defaultChecked />
          <p className="mt-1 text-xs text-muted-foreground">客户留下联系方式后，自动分配给指定客服跟进</p>
        </Field>
      </div>

      <div className="rounded-md border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20 p-3 text-xs text-amber-700 dark:text-amber-400">
        <div className="flex items-center gap-1.5 font-medium">
          <AlertCircle className="h-3.5 w-3.5" /> 提示
        </div>
        <p className="mt-1">建议在客户表达明确意向后再触发，避免过早引导引起客户反感</p>
      </div>
    </div>
  );
}

// 服务技能 - 自动应答
function ServiceSkillConfig({ skill }: { skill: AIAgentSkill }) {
  return (
    <div className="space-y-4">
      <SkillHeader
        icon={<Sparkles className="h-5 w-5" />}
        name="服务"
        description="在有疑问的时候回复联系方式、提供专业服务"
        enabled={skill.enabled}
        onToggle={() => {}}
      />

      <div className="rounded-md border border-input p-4 space-y-4">
        <Field label="服务模式">
          <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
            <option>智能应答</option>
            <option>人工接管</option>
            <option>混合模式</option>
          </select>
        </Field>

        <Field label="知识库关联" hint="勾选允许 AI 参考的知识库分类">
          <div className="space-y-2">
            {["产品介绍", "常见问题", "售后服务", "促销活动"].map((cat, i) => (
              <label key={cat} className="flex items-center gap-2 text-sm">
                <input type="checkbox" defaultChecked={i < 3} className="h-4 w-4" />
                {cat}
              </label>
            ))}
          </div>
        </Field>

        <Field label="回复风格">
          <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
            <option>亲切友好</option>
            <option>专业严谨</option>
            <option>热情积极</option>
            <option>轻松随意</option>
          </select>
        </Field>
      </div>
    </div>
  );
}

// 沉默追问技能
function SilentAskSkillConfig({ skill }: { skill: AIAgentSkill }) {
  return (
    <div className="space-y-4">
      <SkillHeader
        icon={<Send className="h-5 w-5" />}
        name="沉默追问"
        description="客户长时间不回复时主动追问，激活对话"
        enabled={skill.enabled}
        onToggle={() => {}}
      />

      <div className="rounded-md border border-input p-4 space-y-4">
        <Field label="沉默时长" hint="客户超过此时间未回复时触发">
          <div className="flex items-center gap-2">
            <input
              type="number"
              defaultValue={30}
              className="h-9 w-24 rounded-md border border-input bg-background px-3 text-sm"
            />
            <span className="text-sm text-muted-foreground">分钟</span>
          </div>
        </Field>

        <Field label="追问话术">
          <textarea
            rows={3}
            defaultValue="嗨~ 还在吗？您之前咨询的问题需要继续了解吗？"
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </Field>

        <Field label="最多追问次数">
          <input
            type="number"
            defaultValue={2}
            className="h-9 w-24 rounded-md border border-input bg-background px-3 text-sm"
          />
        </Field>
      </div>
    </div>
  );
}

// 收集技能
function CollectSkillConfig({ skill }: { skill: AIAgentSkill }) {
  return (
    <div className="space-y-4">
      <SkillHeader
        icon={<Briefcase className="h-5 w-5" />}
        name="收集"
        description="收集顾客信息（姓名、需求、预算等）"
        enabled={skill.enabled}
        onToggle={() => {}}
      />

      <div className="rounded-md border border-input p-4 space-y-4">
        <Field label="收集字段">
          <div className="space-y-2">
            {["姓名", "性别", "年龄", "联系方式", "所在地区", "需求类型", "预算范围"].map((f, i) => (
              <label key={f} className="flex items-center gap-2 text-sm">
                <input type="checkbox" defaultChecked={i < 2} className="h-4 w-4" />
                {f}
              </label>
            ))}
          </div>
        </Field>

        <Field label="收集方式" hint="自然融入对话">
          <div className="flex flex-col gap-2">
            {["对话中自然询问", "客户主动提供", "表单收集"].map((m, i) => (
              <label key={m} className="flex items-center gap-2 text-sm">
                <input type="checkbox" defaultChecked={i === 0} className="h-4 w-4" />
                {m}
              </label>
            ))}
          </div>
        </Field>
      </div>
    </div>
  );
}

// 筛选技能
function FilterSkillConfig({ skill }: { skill: AIAgentSkill }) {
  return (
    <div className="space-y-4">
      <SkillHeader
        icon={<FilterIcon className="h-5 w-5" />}
        name="筛选"
        description="根据筛选条件，过滤顾客"
        enabled={skill.enabled}
        onToggle={() => {}}
      />

      <div className="rounded-md border border-input p-4 space-y-4">
        <Field label="筛选条件">
          <div className="space-y-2">
            {[
              "地域（指定城市）",
              "年龄范围",
              "消费能力",
              "需求紧迫度",
              "是否新客户",
            ].map((c, i) => (
              <label key={c} className="flex items-center gap-2 text-sm">
                <input type="checkbox" defaultChecked={i < 2} className="h-4 w-4" />
                {c}
              </label>
            ))}
          </div>
        </Field>

        <Field label="不符合时">
          <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
            <option>AI 停止接待</option>
            <option>转人工客服</option>
            <option>继续对话</option>
          </select>
        </Field>
      </div>
    </div>
  );
}

// 排除技能
function ExcludeSkillConfig({ skill }: { skill: AIAgentSkill }) {
  return (
    <div className="space-y-4">
      <SkillHeader
        icon={<X className="h-5 w-5" />}
        name="排除"
        description="排除不符合条件的顾客"
        enabled={skill.enabled}
        onToggle={() => {}}
      />

      <div className="rounded-md border border-input p-4 space-y-4">
        <Field label="排除条件">
          <div className="space-y-2">
            {["黑名单用户", "已合作客户", "竞品人员", "非目标地域", "未成年人"].map((c, i) => (
              <label key={c} className="flex items-center gap-2 text-sm">
                <input type="checkbox" defaultChecked={i === 0} className="h-4 w-4" />
                {c}
              </label>
            ))}
          </div>
        </Field>

        <Field label="排除时操作">
          <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
            <option>直接结束对话</option>
            <option>礼貌话术后结束</option>
            <option>转人工处理</option>
          </select>
        </Field>
      </div>
    </div>
  );
}

function DefaultSkillConfig({ skill }: { skill: AIAgentSkill }) {
  return (
    <div className="space-y-4">
      <SkillHeader
        icon={<Lightbulb className="h-5 w-5" />}
        name={skill.name}
        description={skill.description}
        enabled={skill.enabled}
        onToggle={() => {}}
      />
      <div className="rounded-md border border-input p-6 text-center text-sm text-muted-foreground">
        该技能的详细配置即将上线
      </div>
    </div>
  );
}

function SkillNodeCard({ node }: { node: SkillNode }) {
  if (node.type === "filter") {
    return (
      <div className="rounded-md border border-input bg-card p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
              <FilterIcon className="h-3.5 w-3.5" />
            </div>
            <span className="text-sm font-medium">{node.label}</span>
            {node.condition && (
              <>
                <span className="text-sm text-muted-foreground">{node.condition}</span>
                <Badge variant="outline" className="gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                  AI 停止接待
                </Badge>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={node.enabled} />
            <button className="text-muted-foreground hover:text-foreground">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }
  if (node.type === "trigger") {
    return (
      <div className="flex justify-center">
        <div className="rounded-full border border-dashed border-input bg-muted/30 px-4 py-1.5 text-xs text-muted-foreground">
          {node.label}
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-md border border-input bg-card p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Lightbulb className="h-3.5 w-3.5" />
          </div>
          <span className="text-sm font-medium">{node.label}</span>
          {node.subLabel && (
            <Badge variant="outline" className="gap-1">
              {node.subLabel}
              <Switch checked={node.enabled} />
            </Badge>
          )}
        </div>
        <button className="text-muted-foreground hover:text-foreground">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function LearningFieldTab({ agent, field, label, updateLearning }: { agent: AIAgent; field: keyof AIAgent["learning"]; label: string; updateLearning: <K extends keyof AIAgent["learning"]>(key: K, value: AIAgent["learning"][K]) => void }) {
  return (
    <div className="space-y-3">
      <Field label={label}>
        <textarea
          value={agent.learning[field]}
          onChange={(e) => updateLearning(field, e.target.value)}
          placeholder={`请输入${label}`}
          rows={20}
          className="flex w-full rounded-md border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
      </Field>
    </div>
  );
}
