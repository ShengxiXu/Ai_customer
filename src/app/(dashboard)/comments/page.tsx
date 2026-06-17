"use client";

import { useState } from "react";
import { Reply, Flag, CheckCircle2, Clock, Zap, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlatformIcon } from "@/components/ui/platform-icon";
import { Textarea } from "@/components/ui/input";
import { mockComments } from "@/lib/mock-data";
import { PlatformLabels, type CommentStatus } from "@/types";
import { cn, formatTime } from "@/lib/utils";

const statusConfig: Record<CommentStatus, { label: string; variant: any; icon: any }> = {
  pending: { label: "待回复", variant: "warning", icon: Clock },
  replied: { label: "已回复", variant: "success", icon: CheckCircle2 },
  ignored: { label: "已忽略", variant: "secondary", icon: AlertCircle },
};

export default function CommentsPage() {
  const [comments, setComments] = useState(mockComments);
  const [filter, setFilter] = useState<CommentStatus | "all">("all");
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const filtered = comments.filter((c) => filter === "all" || c.status === filter);

  const handleReply = (id: string) => {
    setComments((prev) => prev.map((c) => c.id === id ? { ...c, status: "replied", reply: replyText } : c));
    setReplyingId(null);
    setReplyText("");
  };

  const handleIgnore = (id: string) => {
    setComments((prev) => prev.map((c) => c.id === id ? { ...c, status: "ignored" } : c));
  };

  const aiSuggestReply = (content: string) => {
    if (content.includes("价格") || content.includes("收费") || content.includes("多少钱")) {
      return "您好~ 详细价格我私信发您吧，不同课程价格不一样哦，请问您对哪个课程感兴趣呢？😊";
    }
    if (content.includes("私信") || content.includes("资料")) {
      return "好的呀~ 我马上私信您发资料，请留意一下消息哦~";
    }
    if (content.includes("开课") || content.includes("报名")) {
      return "您好~ 最新一期下周一就开课啦！我私信发您详细课表和报名链接哈~";
    }
    return "感谢您的关注~ 我私信给您详细介绍吧，请问您具体想了解哪方面呢？😊";
  };

  const pendingCount = comments.filter((c) => c.status === "pending").length;
  const highIntentCount = comments.filter((c) => c.hasHighIntent && c.status === "pending").length;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">评论管理</h1>
        <p className="mt-1 text-sm text-muted-foreground">聚合管理多账号评论，AI识别高意向评论并智能回复</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div><div className="text-sm text-muted-foreground">待处理评论</div><div className="mt-1 text-2xl font-bold">{pendingCount}</div></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600"><Clock className="h-5 w-5" /></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div><div className="text-sm text-muted-foreground">高意向评论</div><div className="mt-1 text-2xl font-bold text-red-600">{highIntentCount}</div></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600"><Flag className="h-5 w-5" /></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div><div className="text-sm text-muted-foreground">AI智能识别</div><div className="mt-1 text-2xl font-bold text-purple-600">已启用</div></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600"><Zap className="h-5 w-5" /></div>
          </div>
        </CardContent></Card>
      </div>

      <div className="flex gap-1">
        {(["all", "pending", "replied", "ignored"] as const).map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={cn("rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              filter === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent")}>
            {s === "all" ? "全部" : statusConfig[s].label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((comment) => {
          const StatusIcon = statusConfig[comment.status].icon;
          return (
            <Card key={comment.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="w-32 shrink-0">
                    <div className="aspect-video rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-muted-foreground text-xs">封面图</div>
                    <div className="mt-2 flex items-center gap-1.5">
                      <PlatformIcon platform={comment.account.platform} size={14} />
                      <span className="text-[10px] text-muted-foreground truncate">{comment.account.name}</span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="mb-2 flex items-center gap-2">
                      <h3 className="text-sm font-medium truncate flex-1">{comment.postTitle}</h3>
                      {comment.hasHighIntent && <Badge variant="destructive" className="text-[10px]"><Flag className="h-2.5 w-2.5 mr-0.5" />高意向</Badge>}
                      <Badge variant={statusConfig[comment.status].variant} className="text-[10px]"><StatusIcon className="h-2.5 w-2.5 mr-0.5" />{statusConfig[comment.status].label}</Badge>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Avatar name={comment.customerName} size="sm" />
                      <div className="flex-1">
                        <div className="text-xs font-medium">{comment.customerName}</div>
                        <p className="mt-0.5 text-sm">{comment.content}</p>
                        <span className="text-[10px] text-muted-foreground">{formatTime(comment.createdAt)}</span>
                      </div>
                    </div>

                    {comment.reply && (
                      <div className="mt-3 rounded-lg bg-muted/50 p-3">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><Reply className="h-3 w-3" />回复</div>
                        <p className="text-sm">{comment.reply}</p>
                      </div>
                    )}

                    {replyingId === comment.id ? (
                      <div className="mt-3 space-y-2">
                        <Textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="输入回复内容..." rows={2} />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleReply(comment.id)}>发送回复</Button>
                          <Button variant="outline" size="sm" onClick={() => { setReplyingId(null); setReplyText(""); }}>取消</Button>
                        </div>
                      </div>
                    ) : comment.status === "pending" && (
                      <div className="mt-3 flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => { setReplyingId(comment.id); setReplyText(aiSuggestReply(comment.content)); }}>
                          <Zap className="h-3.5 w-3.5 text-purple-600" />AI建议回复
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => { setReplyingId(comment.id); setReplyText(""); }}>
                          <Reply className="h-3.5 w-3.5" />回复
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleIgnore(comment.id)}>忽略</Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
