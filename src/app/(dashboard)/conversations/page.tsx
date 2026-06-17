"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  Bot,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  UserPlus,
  Tag,
  FileText,
  Zap,
  AlertCircle,
  CheckCircle2,
  User,
  Users as UsersIcon,
  Hand,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlatformIcon } from "@/components/ui/platform-icon";
import { Switch } from "@/components/ui/switch";
import { mockConversations, mockTags, defaultAIConfig } from "@/lib/mock-data";
import { generateAIReply, recognizeIntent, extractLeadInfo } from "@/lib/ai";
import { PlatformLabels } from "@/types";
import type { Conversation, Message } from "@/types";
import { cn, formatTime } from "@/lib/utils";
import { nanoid } from "nanoid";

const statusFilters = [
  { key: "all", label: "全部", icon: UsersIcon },
  { key: "active", label: "进行中", icon: Bot },
  { key: "waiting", label: "待处理", icon: AlertCircle },
  { key: "ai", label: "AI托管", icon: Zap },
];

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [activeId, setActiveId] = useState<string>(mockConversations[0].id);
  const [inputText, setInputText] = useState("");
  const [isAITyping, setIsAITyping] = useState(false);
  const [filter, setFilter] = useState("all");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeId);

  const filteredConversations = conversations.filter((c) => {
    if (filter === "all") return true;
    if (filter === "active") return c.status === "active";
    if (filter === "waiting") return c.status === "waiting";
    if (filter === "ai") return c.aiEnabled;
    return true;
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConv?.messages.length, isAITyping]);

  const handleSend = () => {
    if (!inputText.trim() || !activeConv) return;
    const newMessage: Message = {
      id: nanoid(),
      conversationId: activeConv.id,
      sender: "agent",
      type: "text",
      content: inputText,
      createdAt: new Date().toISOString(),
    };
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, messages: [...c.messages, newMessage], lastMessage: inputText, lastMessageAt: newMessage.createdAt }
          : c
      )
    );
    setInputText("");
  };

  const simulateAIReply = async (convId: string) => {
    const conv = conversations.find((c) => c.id === convId);
    if (!conv || !conv.aiEnabled) return;
    setIsAITyping(true);
    const result = await generateAIReply(conv.messages, conv.customer, defaultAIConfig);
    setTimeout(() => {
      const aiMessage: Message = {
        id: nanoid(),
        conversationId: convId,
        sender: "ai",
        type: "text",
        content: result.content,
        createdAt: new Date().toISOString(),
        isAI: true,
        aiConfidence: result.confidence,
      };
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId
            ? { ...c, messages: [...c.messages, aiMessage], lastMessage: result.content, lastMessageAt: aiMessage.createdAt }
            : c
        )
      );
      setIsAITyping(false);
    }, 1500);
  };

  const simulateCustomerMessage = () => {
    if (!activeConv) return;
    const demoMessages = [
      "你们有什么课程呀？",
      "价格大概多少？",
      "可以试听吗？",
      "我微信是 test123，发我资料吧",
    ];
    const msg = demoMessages[Math.floor(Math.random() * demoMessages.length)];
    const customerMsg: Message = {
      id: nanoid(),
      conversationId: activeConv.id,
      sender: "customer",
      type: "text",
      content: msg,
      createdAt: new Date().toISOString(),
    };
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, messages: [...c.messages, customerMsg], lastMessage: msg, lastMessageAt: customerMsg.createdAt }
          : c
      )
    );
    setTimeout(() => simulateAIReply(activeConv.id), 500);
  };

  const toggleAI = (convId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, aiEnabled: !c.aiEnabled } : c))
    );
  };

  if (!activeConv) return null;

  const lastCustomerMsg = [...activeConv.messages].reverse().find((m) => m.sender === "customer");
  const intentResult = lastCustomerMsg ? recognizeIntent(lastCustomerMsg.content) : null;
  const leadInfo = lastCustomerMsg ? extractLeadInfo(lastCustomerMsg.content) : null;

  return (
    <div className="flex h-full">
      {/* 左栏：会话列表 */}
      <div className="flex w-80 flex-col border-r border-border bg-card">
        <div className="border-b border-border p-4">
          <h1 className="text-lg font-semibold mb-3">会话管理</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="搜索会话..."
              className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div className="mt-3 flex gap-1">
            {statusFilters.map((f) => {
              const Icon = f.icon;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors",
                    filter === f.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
                  )}
                >
                  <Icon className="h-3 w-3" />
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveId(conv.id)}
              className={cn(
                "flex w-full items-start gap-3 border-b border-border p-3 text-left transition-colors hover:bg-accent/50",
                activeId === conv.id && "bg-accent"
              )}
            >
              <div className="relative">
                <Avatar name={conv.customer.name} size="md" />
                <div className="absolute -bottom-0.5 -right-0.5">
                  <PlatformIcon platform={conv.platform} size={16} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium truncate">{conv.customer.name}</span>
                  <span className="text-xs text-muted-foreground shrink-0">{formatTime(conv.lastMessageAt)}</span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  {conv.aiEnabled && (
                    <Badge variant="secondary" className="text-[9px] py-0">
                      <Bot className="h-2.5 w-2.5 mr-0.5" />
                      AI托管
                    </Badge>
                  )}
                  {conv.status === "waiting" && (
                    <Badge variant="warning" className="text-[9px] py-0">待处理</Badge>
                  )}
                  {conv.unreadCount > 0 && (
                    <span className="ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-medium text-white">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 中栏：聊天窗口 */}
      <div className="flex flex-1 flex-col">
        <div className="flex h-16 items-center justify-between border-b border-border bg-card px-5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar name={activeConv.customer.name} size="sm" />
              <div className="absolute -bottom-0.5 -right-0.5">
                <PlatformIcon platform={activeConv.platform} size={14} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{activeConv.customer.name}</span>
                <Badge variant="outline" className="text-[9px] py-0">{PlatformLabels[activeConv.platform]}</Badge>
              </div>
              <div className="text-xs text-muted-foreground">来自「{activeConv.account.name}」</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-lg bg-purple-50 dark:bg-purple-950/30 px-3 py-1.5">
              <Bot className="h-4 w-4 text-purple-600" />
              <span className="text-xs font-medium text-purple-700 dark:text-purple-400">AI托管</span>
              <Switch checked={activeConv.aiEnabled} onCheckedChange={() => toggleAI(activeConv.id)} />
            </div>
            <Button variant="ghost" size="icon" className="h-9 w-9"><Phone className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="h-9 w-9"><MoreVertical className="h-4 w-4" /></Button>
          </div>
        </div>

        <div className="chat-scroll flex-1 overflow-y-auto bg-muted/30 p-5">
          <div className="mx-auto max-w-3xl space-y-4">
            {activeConv.messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} customerName={activeConv.customer.name} />
            ))}
            {isAITyping && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Avatar name="AI" size="sm" className="bg-gradient-to-br from-purple-400 to-pink-500" />
                <div className="flex items-center gap-1 rounded-2xl bg-card px-4 py-3 shadow-sm">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="border-t border-border bg-card p-4">
          <div className="mx-auto max-w-3xl">
            <div className="mb-2 flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={simulateCustomerMessage} className="text-xs">
                <User className="h-3 w-3" />
                模拟客户消息
              </Button>
              {activeConv.aiEnabled && (
                <Badge variant="secondary" className="text-[10px]">
                  <Zap className="h-3 w-3 mr-0.5" />
                  AI将在客户消息后自动回复
                </Badge>
              )}
            </div>
            <div className="flex items-end gap-2 rounded-xl border border-input bg-background p-2">
              <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0"><Paperclip className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0"><Smile className="h-4 w-4" /></Button>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
                }}
                placeholder="输入消息，按Enter发送..."
                rows={1}
                className="flex-1 resize-none bg-transparent py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none"
              />
              <Button onClick={handleSend} size="icon" className="h-9 w-9 shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 右栏：客户信息面板 */}
      <div className="w-80 overflow-y-auto border-l border-border bg-card">
        <div className="p-5">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <Avatar name={activeConv.customer.name} size="lg" />
              <div className="absolute -bottom-1 -right-1">
                <PlatformIcon platform={activeConv.platform} size={22} />
              </div>
            </div>
            <h3 className="mt-3 text-base font-semibold">{activeConv.customer.name}</h3>
            <p className="text-xs text-muted-foreground">{PlatformLabels[activeConv.platform]} · {activeConv.customer.platformUid}</p>
            <div className="mt-2 flex gap-1.5">
              <IntentBadge level={activeConv.customer.intentLevel} />
              {activeConv.customer.leadStatus === "leaded" && (
                <Badge variant="success" className="text-[10px]"><CheckCircle2 className="h-3 w-3 mr-0.5" />已留资</Badge>
              )}
              {activeConv.customer.leadStatus === "converted" && (
                <Badge variant="success" className="text-[10px]"><CheckCircle2 className="h-3 w-3 mr-0.5" />已转化</Badge>
              )}
            </div>
          </div>

          {intentResult && (
            <div className="mt-5 rounded-lg bg-purple-50 dark:bg-purple-950/20 p-3">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-purple-700 dark:text-purple-400">
                <Zap className="h-3.5 w-3.5" /> AI实时分析
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between"><span className="text-muted-foreground">意图识别</span><span className="font-medium">{intentResult.intent}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">置信度</span><span className="font-medium">{Math.round(intentResult.confidence * 100)}%</span></div>
                {leadInfo && (
                  <div className="flex justify-between"><span className="text-muted-foreground">提取信息</span><span className="font-medium text-emerald-600">{leadInfo.type}: {leadInfo.value}</span></div>
                )}
              </div>
            </div>
          )}

          <div className="mt-5">
            <h4 className="mb-2 text-xs font-semibold text-muted-foreground uppercase">联系方式</h4>
            <div className="space-y-2 text-sm">
              <InfoRow label="手机号" value={activeConv.customer.phone || "未留资"} hasValue={!!activeConv.customer.phone} />
              <InfoRow label="微信" value={activeConv.customer.wechat || "未留资"} hasValue={!!activeConv.customer.wechat} />
              <InfoRow label="邮箱" value={activeConv.customer.email || "未留资"} hasValue={!!activeConv.customer.email} />
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase">客户标签</h4>
              <button className="text-xs text-primary hover:underline flex items-center gap-1"><Tag className="h-3 w-3" />管理</button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {activeConv.customer.tags.map((tagId) => {
                const tag = mockTags.find((t) => t.id === tagId);
                if (!tag) return null;
                return (
                  <span key={tagId} className="rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: `${tag.color}15`, color: tag.color }}>
                    {tag.name}
                  </span>
                );
              })}
            </div>
          </div>

          {activeConv.customer.note && (
            <div className="mt-5">
              <h4 className="mb-2 text-xs font-semibold text-muted-foreground uppercase">客户笔记</h4>
              <div className="rounded-lg bg-muted/50 p-3 text-sm">{activeConv.customer.note}</div>
            </div>
          )}

          <div className="mt-5">
            <h4 className="mb-2 text-xs font-semibold text-muted-foreground uppercase">来源信息</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">来源渠道</span><span className="font-medium">{activeConv.customer.source}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">接入账号</span><span className="font-medium">{activeConv.account.name}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">首次接触</span><span className="font-medium">{formatTime(activeConv.customer.firstContactAt)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">消息总数</span><span className="font-medium">{activeConv.customer.totalMessages} 条</span></div>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            <Button variant="outline" className="w-full" size="sm"><UserPlus className="h-4 w-4" />转接客服</Button>
            <Button variant="outline" className="w-full" size="sm"><FileText className="h-4 w-4" />查看客户档案</Button>
            <Button variant="outline" className="w-full" size="sm"><Hand className="h-4 w-4" />结束会话</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message, customerName }: { message: Message; customerName: string }) {
  const isCustomer = message.sender === "customer";
  const isAI = message.sender === "ai";
  const isSystem = message.sender === "system";

  if (isSystem) {
    return (
      <div className="flex justify-center">
        <div className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
          <AlertCircle className="h-3 w-3" />{message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-start gap-2.5", isCustomer ? "justify-start" : "justify-end")}>
      {isCustomer && <Avatar name={customerName} size="sm" />}
      <div className={cn("max-w-[70%]", !isCustomer && "items-end flex flex-col")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm shadow-sm",
            isCustomer ? "rounded-tl-sm bg-card text-card-foreground"
              : isAI ? "rounded-tr-sm bg-gradient-to-br from-purple-500 to-pink-500 text-white"
              : "rounded-tr-sm bg-primary text-primary-foreground"
          )}
        >
          {message.content}
        </div>
        <div className={cn("mt-1 flex items-center gap-1.5 text-[10px] text-muted-foreground", !isCustomer && "justify-end")}>
          {isAI && (
            <span className="flex items-center gap-0.5 text-purple-600">
              <Bot className="h-2.5 w-2.5" />AI回复{message.aiConfidence && ` · 置信度${Math.round(message.aiConfidence * 100)}%`}
            </span>
          )}
          <span>{formatTime(message.createdAt)}</span>
        </div>
      </div>
      {!isCustomer && <Avatar name={isAI ? "AI" : "我"} size="sm" className={isAI ? "bg-gradient-to-br from-purple-400 to-pink-500" : ""} />}
    </div>
  );
}

function IntentBadge({ level }: { level: string }) {
  const config: Record<string, { label: string; variant: any }> = {
    high: { label: "高意向", variant: "destructive" },
    medium: { label: "中意向", variant: "warning" },
    low: { label: "低意向", variant: "secondary" },
    unknown: { label: "待识别", variant: "outline" },
  };
  const c = config[level] || config.unknown;
  return <Badge variant={c.variant} className="text-[10px]">{c.label}</Badge>;
}

function InfoRow({ label, value, hasValue }: { label: string; value: string; hasValue: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("font-medium", hasValue ? "text-emerald-600" : "text-muted-foreground/60")}>{value}</span>
    </div>
  );
}
