"use client";

import { useState, useTransition } from "react";
import { ChronikComment } from "@/types/chronik";
import { addComment, deleteComment } from "@/actions/chronik";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, MessageSquare, ChevronDown, ChevronUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { de, enUS } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

interface ChronikCommentSectionProps {
  chronikId: string;
  comments: ChronikComment[];
  currentUserId?: string;
  locale: string;
}

export function ChronikCommentSection({
  chronikId,
  comments,
  currentUserId,
  locale,
}: ChronikCommentSectionProps) {
  const t = useTranslations("Chronik");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [content, setContent] = useState("");

  const dateLocale = locale === "de" ? de : enUS;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.length < 3) return;

    startTransition(async () => {
      try {
        await addComment(chronikId, content);
        setContent("");
        setFeedback({ message: t("comment_added") || "Comment added", type: "success" });
        setTimeout(() => setFeedback(null), 3000);
      } catch (error) {
        setFeedback({ message: "Failed to add comment", type: "error" });
        setTimeout(() => setFeedback(null), 3000);
      }
    });
  };

  const handleDelete = async (commentId: string) => {
    startTransition(async () => {
      try {
        await deleteComment(commentId);
        setFeedback({ message: t("comment_deleted") || "Comment deleted", type: "success" });
        setTimeout(() => setFeedback(null), 3000);
      } catch (error) {
        setFeedback({ message: "Failed to delete comment", type: "error" });
        setTimeout(() => setFeedback(null), 3000);
      }
    });
  };

  return (
    <div className="mt-6 space-y-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-brand-sky hover:text-brand-sky/80 hover:bg-brand-sky/10"
      >
        <MessageSquare className="w-4 h-4" />
        <span>{t("comments")}</span>
        <Badge variant="secondary" className="bg-brand-sky/20 text-brand-sky border-none">
          {comments.length}
        </Badge>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </Button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden space-y-4"
          >
            <div className="space-y-4 pl-4 border-l-2 border-brand-sky/20">
              {comments.length === 0 ? (
                <p className="text-sm text-white/40 italic">{t("no_comments")}</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="group relative bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-brand-sky">{comment.user_name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-white/40">
                          {formatDistanceToNow(new Date(comment.created_at), {
                            addSuffix: true,
                            locale: dateLocale,
                          })}
                        </span>
                        {currentUserId === comment.user_id && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-red-400 hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleDelete(comment.id)}
                            disabled={isPending}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-white/80 leading-relaxed">{comment.content}</p>
                  </div>
                ))
              )}

              <form onSubmit={handleSubmit} className="space-y-3 mt-4">
                <Textarea
                  placeholder={t("placeholder")}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-brand-sky/50 min-h-[80px] resize-none"
                  disabled={isPending}
                />
                
                {feedback && (
                  <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium ${
                          feedback.type === "success" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}
                  >
                      {feedback.type === "success" ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      {feedback.message}
                  </motion.div>
                )}

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isPending || content.length < 3}
                    className="bg-brand-sky hover:bg-brand-sky/80 text-brand-navy font-bold"
                  >
                    {isPending ? t("loading") : t("add_comment")}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
