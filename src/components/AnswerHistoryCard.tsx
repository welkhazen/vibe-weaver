import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Check, MessageCircle, ChevronDown, ChevronUp, Send, ThumbsUp, CornerDownRight } from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  text: string;
  time: string;
  upvotes: number;
  replies: Comment[];
}

interface AnswerHistoryCardProps {
  question: string;
  answer: string;
  options: { text: string; percentage: number }[];
}

const defaultComments: Comment[] = [
  { id: '1', author: 'Alex M.', text: 'This really made me think about my daily habits.', time: '2h ago', upvotes: 5, replies: [] },
  { id: '2', author: 'Jordan K.', text: 'Interesting perspective!', time: '5h ago', upvotes: 2, replies: [] },
];

const AnswerHistoryCard = ({ question, answer, options }: AnswerHistoryCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>(defaultComments);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [upvotedIds, setUpvotedIds] = useState<Set<string>>(new Set());

  const selectedIndex = answer === 'Yes' ? 0 : 1;

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments(prev => [
      { id: Date.now().toString(), author: 'You', text: newComment.trim(), time: 'Just now', upvotes: 0, replies: [] },
      ...prev,
    ]);
    setNewComment('');
  };

  const handleReply = (parentId: string) => {
    if (!replyText.trim()) return;
    setComments(prev =>
      prev.map(c =>
        c.id === parentId
          ? { ...c, replies: [...c.replies, { id: Date.now().toString(), author: 'You', text: replyText.trim(), time: 'Just now', upvotes: 0, replies: [] }] }
          : c
      )
    );
    setReplyText('');
    setReplyingTo(null);
  };

  const handleUpvote = (commentId: string, isReply?: boolean, parentId?: string) => {
    const key = `${parentId || ''}-${commentId}`;
    const alreadyUpvoted = upvotedIds.has(key);

    setUpvotedIds(prev => {
      const next = new Set(prev);
      if (alreadyUpvoted) next.delete(key); else next.add(key);
      return next;
    });

    if (isReply && parentId) {
      setComments(prev =>
        prev.map(c =>
          c.id === parentId
            ? { ...c, replies: c.replies.map(r => r.id === commentId ? { ...r, upvotes: r.upvotes + (alreadyUpvoted ? -1 : 1) } : r) }
            : c
        )
      );
    } else {
      setComments(prev =>
        prev.map(c => c.id === commentId ? { ...c, upvotes: c.upvotes + (alreadyUpvoted ? -1 : 1) } : c)
      );
    }
  };

  const totalComments = comments.reduce((sum, c) => sum + 1 + c.replies.length, 0);

  return (
    <div className="rounded-xl border border-border/50 bg-background overflow-hidden">
      {/* Question */}
      <div className="px-4 pt-3 pb-2">
        <p className="text-sm font-semibold text-foreground">{question}</p>
      </div>

      {/* Results */}
      <div className="px-4 space-y-1.5 pb-2">
        {options.map((option, i) => (
          <div key={i} className="relative w-full rounded-lg overflow-hidden border border-border/30">
            <div
              className={cn('absolute inset-0', selectedIndex === i ? 'bg-primary/15' : 'bg-foreground/5')}
              style={{ width: `${option.percentage}%` }}
            />
            <div className="relative px-3 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {selectedIndex === i && (
                  <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-primary-foreground" />
                  </div>
                )}
                <span className={cn('text-xs font-medium', selectedIndex === i ? 'text-primary' : 'text-foreground')}>
                  {option.text}
                </span>
              </div>
              <span className={cn('text-xs font-medium', selectedIndex === i ? 'text-primary' : 'text-muted-foreground')}>
                {option.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Comments toggle */}
      <div className="px-4 pb-2">
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
        >
          <MessageCircle className="w-3 h-3" />
          <span>{totalComments} comments</span>
          {showComments ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Comments section */}
      <div className={cn(
        'overflow-hidden transition-all duration-300',
        showComments ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
      )}>
        <div className="px-4 pb-3 space-y-2">
          {/* New comment input */}
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddComment(); } }}
              placeholder="Add a comment..."
              maxLength={200}
              className="flex-1 h-7 px-2.5 rounded-lg bg-accent border border-border text-[10px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className={cn(
                'w-7 h-7 rounded-lg flex items-center justify-center',
                newComment.trim() ? 'bg-primary text-primary-foreground' : 'bg-accent text-muted-foreground'
              )}
            >
              <Send className="w-3 h-3" />
            </button>
          </div>

          {/* Comment list */}
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {comments.map((c) => (
              <div key={c.id} className="space-y-1">
                <div className="p-2 rounded-lg bg-accent/50 border border-border/30">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] font-medium text-foreground">{c.author}</span>
                    <span className="text-[9px] text-muted-foreground">{c.time}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mb-1">{c.text}</p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleUpvote(c.id)}
                      className={cn(
                        'flex items-center gap-0.5 text-[9px] transition-colors',
                        upvotedIds.has(`-${c.id}`) ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <ThumbsUp className="w-2.5 h-2.5" />
                      <span>{c.upvotes}</span>
                    </button>
                    <button
                      onClick={() => setReplyingTo(replyingTo === c.id ? null : c.id)}
                      className="flex items-center gap-0.5 text-[9px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <CornerDownRight className="w-2.5 h-2.5" />
                      <span>Reply</span>
                    </button>
                  </div>
                </div>

                {/* Reply input */}
                {replyingTo === c.id && (
                  <div className="flex items-center gap-1.5 ml-4">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleReply(c.id); } }}
                      placeholder="Reply..."
                      maxLength={200}
                      className="flex-1 h-6 px-2 rounded-md bg-accent border border-border text-[9px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                      autoFocus
                    />
                    <button
                      onClick={() => handleReply(c.id)}
                      disabled={!replyText.trim()}
                      className={cn(
                        'w-6 h-6 rounded-md flex items-center justify-center',
                        replyText.trim() ? 'bg-primary text-primary-foreground' : 'bg-accent text-muted-foreground'
                      )}
                    >
                      <Send className="w-2.5 h-2.5" />
                    </button>
                  </div>
                )}

                {/* Replies */}
                {c.replies.map((r) => (
                  <div key={r.id} className="ml-4 p-1.5 rounded-lg bg-accent/30 border border-border/20">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[9px] font-medium text-foreground">{r.author}</span>
                      <span className="text-[8px] text-muted-foreground">{r.time}</span>
                    </div>
                    <p className="text-[9px] text-muted-foreground mb-0.5">{r.text}</p>
                    <button
                      onClick={() => handleUpvote(r.id, true, c.id)}
                      className={cn(
                        'flex items-center gap-0.5 text-[8px] transition-colors',
                        upvotedIds.has(`${c.id}-${r.id}`) ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <ThumbsUp className="w-2 h-2" />
                      <span>{r.upvotes}</span>
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerHistoryCard;
