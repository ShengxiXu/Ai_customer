# 智客AI - 智能客服系统

AI优先的智能客服产品，仿照来鼓AI客服设计开发，支持多平台消息聚合、AI自动回复、智能留资转化。

## 核心功能

| 模块 | 功能说明 |
|------|---------|
| **工作台** | 数据概览、会话趋势、渠道分布、待处理会话、客服排行 |
| **会话管理** | 多平台多账号消息聚合、AI托管自动回复、人工接管、实时意图分析 |
| **客户管理** | 客户CRM、标签管理、留资状态追踪、意向分级 |
| **评论管理** | 多账号评论聚合、AI高意向识别、AI建议回复 |
| **知识库** | 分类管理、文档向量化、命中率统计 |
| **AI配置** | 模型设置、System Prompt、话术模板、反广告检测、自我进化、转人工兜底 |
| **客服团队** | 客服管理、负载监控、分配策略（轮询/负载/指定/技能）、账号绑定 |
| **数据统计** | AI vs 人工对比、获客转化漏斗、客户意向分布、渠道效果、客服绩效 |
| **系统设置** | 账号接入、通知设置、安全设置、计费管理 |

## 技术栈

- **框架**: Next.js 14 (App Router) + TypeScript
- **样式**: Tailwind CSS + CSS Variables (支持暗色模式)
- **图表**: Recharts
- **图标**: Lucide React
- **AI**: OpenAI兼容接口 (DeepSeek / GPT / 通义千问)

## 快速开始

```bash
# 安装依赖
npm install

# 配置AI API（可选，不配置将使用模拟回复）
cp .env.local.example .env.local

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

## AI客服配置

在 `.env.local` 中配置大模型API：

```env
AI_API_KEY=your-api-key
AI_API_BASE_URL=https://api.deepseek.com/v1
AI_MODEL=deepseek-chat
```

支持任何OpenAI兼容的API接口。不配置API Key时，系统使用内置模拟回复演示所有功能。
