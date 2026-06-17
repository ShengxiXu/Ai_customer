// ===== 平台渠道 =====
export type Platform = "xiaohongshu" | "douyin" | "kuaishou" | "weixin" | "web";

export const PlatformLabels: Record<Platform, string> = {
  xiaohongshu: "小红书",
  douyin: "抖音",
  kuaishou: "快手",
  weixin: "微信",
  web: "网页",
};

export const PlatformColors: Record<Platform, string> = {
  xiaohongshu: "#FF2442",
  douyin: "#161823",
  kuaishou: "#FF4906",
  weixin: "#07C160",
  web: "#3B82F6",
};

// ===== 账号 =====
export interface Account {
  id: string;
  name: string;
  avatar: string;
  platform: Platform;
  platformUid: string;
  followers: number;
  status: "online" | "offline";
  assignedAgentId?: string;
}

// ===== 客户 =====
export type CustomerStatus = "new" | "following" | "converted" | "lost";
export type LeadStatus = "not_leaded" | "leaded" | "converted";

export interface CustomerTag {
  id: string;
  name: string;
  color: string;
}

export interface Customer {
  id: string;
  name: string;
  avatar: string;
  platform: Platform;
  platformUid: string;
  phone?: string;
  wechat?: string;
  email?: string;
  status: CustomerStatus;
  leadStatus: LeadStatus;
  tags: string[];
  note?: string;
  source: string;
  firstContactAt: string;
  lastContactAt: string;
  totalMessages: number;
  intentLevel: "high" | "medium" | "low" | "unknown";
}

// ===== 会话 =====
export type ConversationStatus = "active" | "waiting" | "closed";
export type MessageSender = "customer" | "agent" | "ai" | "system";
export type MessageType = "text" | "image" | "card" | "link" | "voice";

export interface Message {
  id: string;
  conversationId: string;
  sender: MessageSender;
  type: MessageType;
  content: string;
  createdAt: string;
  isAI?: boolean;
  aiConfidence?: number;
}

export interface Conversation {
  id: string;
  customerId: string;
  customer: Customer;
  accountId: string;
  account: Account;
  platform: Platform;
  status: ConversationStatus;
  assignedAgentId?: string;
  assignedAgent?: Agent;
  unreadCount: number;
  lastMessage?: string;
  lastMessageAt: string;
  aiEnabled: boolean;
  messages: Message[];
  createdAt: string;
}

// ===== 客服 =====
export type AgentRole = "admin" | "supervisor" | "agent";
export type AgentStatus = "online" | "busy" | "away" | "offline";

export interface Agent {
  id: string;
  name: string;
  avatar: string;
  role: AgentRole;
  status: AgentStatus;
  maxConcurrent: number;
  activeConversations: number;
  email: string;
  phone?: string;
  department: string;
  onlineSince?: string;
}

// ===== 评论 =====
export type CommentStatus = "pending" | "replied" | "ignored";

export interface Comment {
  id: string;
  accountId: string;
  account: Account;
  postId: string;
  postTitle: string;
  postCover: string;
  customerName: string;
  customerAvatar: string;
  content: string;
  status: CommentStatus;
  reply?: string;
  hasHighIntent: boolean;
  createdAt: string;
}

// ===== 知识库 =====
export interface KnowledgeCategory {
  id: string;
  name: string;
  description: string;
  documentCount: number;
  icon: string;
}

export interface KnowledgeDocument {
  id: string;
  categoryId: string;
  title: string;
  content: string;
  source: string;
  status: "active" | "training" | "draft";
  updatedAt: string;
  chunkCount: number;
  hitCount: number;
}

// ===== AI配置 =====
export type AITone = "professional" | "friendly" | "casual" | "enthusiastic";

export interface AIConfig {
  model: string;
  apiKey: string;
  apiBaseUrl: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  welcomeMessage: string;
  tone: AITone;
  antiAdEnabled: boolean;
  autoReplyEnabled: boolean;
  autoReplyDelay: number;
  intentRecognitionEnabled: boolean;
  selfEvolutionEnabled: boolean;
  fallbackToHuman: boolean;
  fallbackThreshold: number;
  maxConversationTurns: number;
  knowledgeCategoryIds: string[];
  proactivelyMessage: boolean;
  extractContactEnabled: boolean;
  emotionAnalysisEnabled: boolean;
}

export type ScriptCategory = "greeting" | "lead" | "objection" | "closing" | "fallback" | "followup";

export const ScriptCategoryLabels: Record<ScriptCategory, string> = {
  greeting: "开场问候",
  lead: "留资引导",
  objection: "异议处理",
  closing: "结束语",
  fallback: "转人工",
  followup: "跟进回访",
};

export interface ScriptTemplate {
  id: string;
  name: string;
  scenario: string;
  trigger: string;
  content: string;
  enabled: boolean;
  hitCount: number;
  conversionRate: number;
  category: ScriptCategory;
  priority: number;
}

// ===== AI员工(Agent) =====
export type AgentTemplate = "active_lead" | "card_lead" | "deep_mining" | "precise_lead" | "blank";

export const AgentTemplateLabels: Record<AgentTemplate, string> = {
  active_lead: "主动获客",
  card_lead: "名片获客",
  deep_mining: "深度挖掘",
  precise_lead: "精准获客",
  blank: "空白创建",
};

export type AIAgentStatus = "enabled" | "disabled";

export interface AIAgentChannel {
  platform: Platform;
  accountName: string;
  accountId: string;
}

export interface AIAgentScope {
  channels: AIAgentChannel[];
  serviceMode: "all_day" | "custom";
  serviceTimeStart?: string;
  serviceTimeEnd?: string;
  expertise: string;
}

export interface AIAgentStyle {
  greeting: string;
  defaultTone: string;
  toneConstraint: string;
  checkWechat: boolean;
  wechatReplacement: string;
  checkPhone: boolean;
  phoneReplacement: string;
}

export interface AIAgentPauseRule {
  satisfactionEnabled: boolean;
  keywordEnabled: boolean;
  pauseKeywords: string[];
  platformStrategyEnabled: boolean;
  xiaohongshuDelay: number;
  douyinDelay: number;
}

export interface AIAgentReplyConfig {
  maxLength: "short" | "medium" | "long" | "unlimited";
  aggregateWindow: number;
  delayedReplyInterval: number;
}

export type AISkillType = "lead" | "profile" | "filter" | "exclude" | "smart_play" | "auto_reply" | "self_learn";

export const AISkillTypeLabels: Record<AISkillType, string> = {
  lead: "获客",
  profile: "记客户档案",
  filter: "筛选",
  exclude: "排除",
  smart_play: "智能出牌",
  auto_reply: "自动回复",
  self_learn: "自我学习",
};

export interface AIAgentSkill {
  type: AISkillType;
  name: string;
  description: string;
  enabled: boolean;
  hasWarning?: boolean;
}

export interface AIAgentLearning {
  companyIntro: string;
  productIntro: string;
  serviceAudience: string;
  businessKnowledge: string;
}

export interface AIAgent {
  id: string;
  name: string;
  template: AgentTemplate;
  avatar: string;
  status: AIAgentStatus;
  boundChannels: AIAgentChannel[];
  description: string;
  knowledgeBaseName: string;
  createdAt: string;
  updatedAt: string;
  scope: AIAgentScope;
  style: AIAgentStyle;
  pauseRule: AIAgentPauseRule;
  replyConfig: AIAgentReplyConfig;
  skills: AIAgentSkill[];
  skillNodes: SkillNode[];
  learning: AIAgentLearning;
}

export type SkillNodeType = "filter" | "trigger" | "skill";

export interface SkillNode {
  id: string;
  type: SkillNodeType;
  label: string;
  subLabel?: string;
  condition?: string;
  action?: string;
  enabled: boolean;
}

// ===== 数据统计 =====
export interface DashboardStats {
  totalConversations: number;
  activeConversations: number;
  aiHandledRate: number;
  leadConversionRate: number;
  avgResponseTime: number;
  totalLeads: number;
  totalCustomers: number;
  aiPointBalance: number;
  conversationTrend: { date: string; count: number; aiCount: number }[];
  platformDistribution: { platform: Platform; count: number; leadRate: number }[];
  hourlyDistribution: { hour: string; count: number }[];
  topAgents: { agent: Agent; conversations: number; leads: number; satisfaction: number }[];
}
