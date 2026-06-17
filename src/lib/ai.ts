import type { AIConfig, Message, Customer } from "@/types";

/**
 * AI客服服务 - 基于大模型API的智能对话
 * 支持OpenAI兼容接口（DeepSeek、通义千问、GPT等）
 */

interface AIResponse {
  content: string;
  confidence: number;
  shouldFallback: boolean;
  extractedLead?: { type: "phone" | "wechat" | "email"; value: string };
}

const mockReplies = [
  "您好呀~ 感谢您的咨询！请问您想了解哪方面的课程呢？我可以为您详细介绍 😊",
  "好的，这个问题我来帮您解答~ 根据您的需求，我推荐您了解一下我们的专项提升课程，效果非常不错哦！",
  "理解您的顾虑~ 我们的课程性价比很高，现在报名还能享受暑期优惠呢。方便留个微信吗？我把详细资料发给您看看~",
  "当然可以的！我们提供免费试听课，您可以直接体验课程质量。请问您方便留个手机号吗？我帮您预约一下~",
  "这个问题比较专业，我帮您转接给资深顾问老师，请稍等一下哦~",
];

// 从消息中提取联系方式
export function extractLeadInfo(text: string): AIResponse["extractedLead"] {
  const phoneMatch = text.match(/1[3-9]\d{9}/);
  if (phoneMatch) return { type: "phone", value: phoneMatch[0] };

  const wechatMatch = text.match(/(?:微信|vx|wx)[:：\s]*([a-zA-Z0-9_-]{6,20})/i);
  if (wechatMatch) return { type: "wechat", value: wechatMatch[1] };

  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) return { type: "email", value: emailMatch[0] };

  return undefined;
}

// 意图识别
export function recognizeIntent(text: string): {
  intent: string;
  confidence: number;
  isHighIntent: boolean;
} {
  const highIntentKeywords = ["报名", "价格", "多少钱", "怎么收费", "优惠", "折扣", "购买", "报名费", "试听", "留微信", "联系方式"];
  const mediumIntentKeywords = ["课程", "上课", "学习", "培训", "辅导", "怎么学"];
  const lowIntentKeywords = ["你好", "在吗", "咨询", "了解"];

  for (const keyword of highIntentKeywords) {
    if (text.includes(keyword)) {
      return { intent: `高意向：${keyword}`, confidence: 0.92, isHighIntent: true };
    }
  }
  for (const keyword of mediumIntentKeywords) {
    if (text.includes(keyword)) {
      return { intent: `中意向：${keyword}`, confidence: 0.78, isHighIntent: false };
    }
  }
  for (const keyword of lowIntentKeywords) {
    if (text.includes(keyword)) {
      return { intent: `低意向：${keyword}`, confidence: 0.65, isHighIntent: false };
    }
  }
  return { intent: "未知意图", confidence: 0.5, isHighIntent: false };
}

// 反广告话术检测
export function isAdSpam(text: string): boolean {
  const adPatterns = [
    /加我微信.*免费/,
    /扫码.*领取/,
    /限时.*秒杀/,
    /原价.*现价/,
    /点击.*链接.*/i,
  ];
  return adPatterns.some((pattern) => pattern.test(text));
}

// 生成AI回复
export async function generateAIReply(
  messages: Message[],
  _customer: Customer,
  config: AIConfig
): Promise<AIResponse> {
  const lastMessage = messages[messages.length - 1];
  const userText = lastMessage?.content || "";

  const intentResult = recognizeIntent(userText);
  const extractedLead = extractLeadInfo(userText);

  const shouldFallback =
    intentResult.confidence < config.fallbackThreshold ||
    userText.includes("人工") ||
    userText.includes("真人") ||
    userText.includes("客服");

  // 如果有API Key，调用大模型
  if (process.env.AI_API_KEY) {
    try {
      const response = await fetch(
        `${process.env.AI_API_BASE_URL || "https://api.deepseek.com/v1"}/chat/completions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.AI_API_KEY}`,
          },
          body: JSON.stringify({
            model: config.model,
            temperature: config.temperature,
            max_tokens: config.maxTokens,
            messages: [
              { role: "system", content: config.systemPrompt },
              ...messages.map((m) => ({
                role: m.sender === "customer" ? "user" : "assistant",
                content: m.content,
              })),
            ],
          }),
        }
      );
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || mockReplies[0];
      const finalContent =
        config.antiAdEnabled && isAdSpam(content)
          ? "您好~ 这个问题我直接为您解答吧，请问具体想了解什么呢？"
          : content;
      return {
        content: finalContent,
        confidence: intentResult.confidence,
        shouldFallback,
        extractedLead,
      };
    } catch {
      // fallback to mock
    }
  }

  // 无API Key时使用模拟回复
  let reply: string;
  if (shouldFallback) {
    reply = mockReplies[4];
  } else if (extractedLead) {
    reply = "收到啦！我这边马上安排顾问老师联系您，一般1小时内就会加您好友哦，请留意一下~ 期待为您服务！";
  } else if (intentResult.isHighIntent) {
    reply = mockReplies[2];
  } else if (intentResult.confidence > 0.7) {
    reply = mockReplies[1];
  } else {
    reply = mockReplies[Math.floor(Math.random() * 2)];
  }

  return {
    content: reply,
    confidence: intentResult.confidence,
    shouldFallback,
    extractedLead,
  };
}
