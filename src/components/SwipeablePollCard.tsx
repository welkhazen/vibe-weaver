import { useState, useRef, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Check, MessageCircle, ChevronDown, ChevronLeft, ChevronRight, Send, ArrowUp, CornerDownRight } from 'lucide-react';
import LockedProfileModal from './LockedProfileModal';

interface PollOption {
  text: string;
  percentage: number;
}

interface Comment {
  id: string;
  author: string;
  text: string;
  time: string;
  upvotes: number;
  replies: Comment[];
}

interface SwipeablePollCardProps {
  question: string;
  options: PollOption[];
  onVote: (optionIndex?: number) => void;
  onNext: () => void;
  onPrev: () => void;
  canGoBack: boolean;
  isLocked: boolean;
}

const RANDOM_USERNAMES = [
  'cosmic_drift', 'neon_sage', 'pixel_fox', 'lunar_echo', 'zen_spark',
  'wave_rider', 'shadow_mint', 'blaze_nova', 'frost_bloom', 'dusk_whisper',
  'ember_sky', 'iron_lotus', 'velvet_haze', 'storm_byte', 'jade_pulse'
];

const getRandomUsername = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  return RANDOM_USERNAMES[Math.abs(hash) % RANDOM_USERNAMES.length];
};

const mockComments: Comment[] = [
{ id: '1', author: getRandomUsername('1'), text: 'This really made me think about my daily habits.', time: '2h ago', upvotes: 5, replies: [] },
{ id: '2', author: getRandomUsername('2'), text: 'Interesting perspective!', time: '5h ago', upvotes: 2, replies: [] }];


const SWIPE_THRESHOLD = 100;

const SwipeablePollCard = ({ question, options, onVote, onNext, onPrev, canGoBack, isLocked }: SwipeablePollCardProps) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);
  const [showAllComments, setShowAllComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [upvotedIds, setUpvotedIds] = useState<Set<string>>(new Set());
  const [profileModalUser, setProfileModalUser] = useState<string | null>(null);

  const startX = useRef(0);
  const hasVoted = selectedOption !== null;

  const handleDragStart = useCallback((clientX: number) => {
    if (hasVoted || isLocked) return;
    startX.current = clientX;
    setIsDragging(true);
  }, [hasVoted, isLocked]);

  const handleDragMove = useCallback((clientX: number) => {
    if (!isDragging) return;
    setDragX(clientX - startX.current);
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    if (Math.abs(dragX) > SWIPE_THRESHOLD) {
      const direction = dragX > 0 ? 'right' : 'left';
      setExitDirection(direction);
      setIsExiting(true);

      setTimeout(() => {
        const optionIndex = direction === 'right' ? 0 : 1;
        setSelectedOption(optionIndex);
        onVote(optionIndex);
        setIsExiting(false);
        setExitDirection(null);
        setDragX(0);
      }, 300);
    } else {
      setDragX(0);
    }
  }, [isDragging, dragX, onVote]);

  const handleTapVote = (optionIndex: number) => {
    if (hasVoted || isLocked) return;
    const direction = optionIndex === 0 ? 'right' : 'left';
    setExitDirection(direction);
    setIsExiting(true);

    setTimeout(() => {
      setSelectedOption(optionIndex);
      onVote(optionIndex);
      setIsExiting(false);
      setExitDirection(null);
    }, 300);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments((prev) => [{ id: Date.now().toString(), author: getRandomUsername(Date.now().toString()), text: newComment.trim(), time: 'Just now', upvotes: 0, replies: [] }, ...prev]);
      setNewComment('');
    }
  };

  const handleReply = (parentId: string) => {
    if (!replyText.trim()) return;
    setComments((prev) =>
    prev.map((c) =>
    c.id === parentId ?
    { ...c, replies: [...c.replies, { id: Date.now().toString(), author: getRandomUsername(Date.now().toString() + 'r'), text: replyText.trim(), time: 'Just now', upvotes: 0, replies: [] }] } :
    c
    )
    );
    setReplyText('');
    setReplyingTo(null);
  };

  const handleUpvote = (commentId: string, isReply?: boolean, parentId?: string) => {
    const key = `${parentId || ''}-${commentId}`;
    const alreadyUpvoted = upvotedIds.has(key);
    setUpvotedIds((prev) => {
      const next = new Set(prev);
      if (alreadyUpvoted) next.delete(key);else next.add(key);
      return next;
    });
    if (isReply && parentId) {
      setComments((prev) =>
      prev.map((c) =>
      c.id === parentId ?
      { ...c, replies: c.replies.map((r) => r.id === commentId ? { ...r, upvotes: r.upvotes + (alreadyUpvoted ? -1 : 1) } : r) } :
      c
      )
      );
    } else {
      setComments((prev) =>
      prev.map((c) => c.id === commentId ? { ...c, upvotes: c.upvotes + (alreadyUpvoted ? -1 : 1) } : c)
      );
    }
  };

  // Sort comments by upvotes (most upvoted first)
  const sortedComments = useMemo(() =>
    [...comments].sort((a, b) => b.upvotes - a.upvotes),
    [comments]
  );

  const visibleComments = useMemo(() =>
    showAllComments ? sortedComments : sortedComments.slice(0, 3),
    [showAllComments, sortedComments]
  );

  const hasMoreComments = sortedComments.length > 3;

  const rotation = isDragging ? dragX * 0.08 : 0;
  const opacity = isDragging ? Math.max(0.5, 1 - Math.abs(dragX) / 400) : 1;
  const yesIndicatorOpacity = isDragging && dragX > 30 ? Math.min(dragX / SWIPE_THRESHOLD, 1) : 0;
  const noIndicatorOpacity = isDragging && dragX < -30 ? Math.min(Math.abs(dragX) / SWIPE_THRESHOLD, 1) : 0;

  const exitTransform = isExiting ?
  exitDirection === 'right' ?
  'translateX(120%) rotate(15deg)' :
  'translateX(-120%) rotate(-15deg)' :
  '';

  return (
    <div className="relative w-full flex-1 flex flex-col items-center justify-center py-4">
      {/* Left arrow - outside card */}
      <button
        onClick={onPrev}
        disabled={!canGoBack}
        className={cn(
          'absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-[0.9] z-10',
          canGoBack ? 'bg-foreground/10 text-foreground hover:bg-foreground/20' : 'bg-foreground/5 text-muted-foreground/30 cursor-not-allowed'
        )}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Right arrow - outside card */}
      <button
        onClick={onNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 active:scale-[0.9] transition-all z-10"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Card */}
      <div
        className={cn(
          'relative rounded-3xl border border-border/50 bg-background shadow-lg overflow-hidden select-none',
          'w-[280px] h-[400px]',
          'transition-transform duration-300 ease-out',
          isDragging && '!transition-none',
          isExiting && 'transition-all duration-300 ease-in opacity-0'
        )}
        style={{
          transform: isExiting ?
          exitTransform :
          `translateX(${dragX}px) rotate(${rotation}deg)`,
          opacity: isExiting ? 0 : opacity
        }}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => {if (isDragging) handleDragMove(e.clientX);}}
        onMouseUp={handleDragEnd}
        onMouseLeave={() => {if (isDragging) handleDragEnd();}}>

        {/* Swipe direction indicators */}
        <div
          className="absolute top-6 right-6 px-4 py-2 rounded-xl border-2 border-green-500 z-10 pointer-events-none"
          style={{ opacity: yesIndicatorOpacity, transform: `rotate(-15deg)` }}>

          <span className="text-green-500 font-bold text-xl">YES</span>
        </div>
        <div
          className="absolute top-6 left-6 px-4 py-2 rounded-xl border-2 border-red-500 z-10 pointer-events-none"
          style={{ opacity: noIndicatorOpacity, transform: `rotate(15deg)` }}>

          <span className="text-red-500 font-bold text-xl">NO</span>
        </div>

        {/* Card Content */}
        <div className="flex flex-col h-full p-5 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {!hasVoted ?
          <div className="flex-col flex-1 flex items-center justify-center">
              <p className="text-xl font-bold text-foreground text-center leading-relaxed">
                {question}
              </p>
              <p className="text-xs text-muted-foreground mt-4 mb-4">Swipe right for Yes, left for No</p>
              {!isLocked &&
            <div className="flex gap-4 w-full">
                  <button
                onClick={() => handleTapVote(0)}
                className="flex-1 py-3.5 rounded-xl font-semibold text-sm text-white active:scale-[0.95] transition-all bg-gold-light"
                style={{ background: 'hsl(var(--gold-h), var(--gold-s), var(--gold-l))' }}>

                    Yes
                  </button>
                  <button
                onClick={() => handleTapVote(1)}
                className="flex-1 py-3.5 rounded-xl bg-foreground text-background font-semibold text-sm active:scale-[0.95] transition-all">

                    No
                  </button>
                </div>
            }
            </div> :

          <div className="w-full space-y-3 animate-fade-in">
              <p className="text-lg font-semibold text-foreground text-center mb-4">{question}</p>

              {options.map((option, i) =>
            <div key={i} className="relative w-full rounded-xl overflow-hidden border border-border/50">
                  <div
                className={cn(
                  'absolute inset-0',
                  selectedOption === i ? 'bg-primary/20' : 'bg-foreground/10'
                )}
                style={{ width: `${option.percentage}%` }} />

                  <div className="relative px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {selectedOption === i &&
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </div>
                  }
                      <span className={cn('text-sm font-semibold', selectedOption === i ? 'text-primary' : 'text-foreground')}>
                        {option.text}
                      </span>
                    </div>
                    <span className={cn('text-sm font-semibold', selectedOption === i ? 'text-primary' : 'text-muted-foreground')}>
                      {option.percentage}%
                    </span>
                  </div>
                </div>
            )}

              {/* Comments - always visible */}
              <div className="space-y-2 mt-2">
                {/* Comment input */}
                <div className="flex items-center gap-1.5">
                  <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => {if (e.key === 'Enter') {e.preventDefault();handleAddComment();}}}
                  placeholder="Add a comment..."
                  maxLength={200}
                  className="flex-1 h-7 px-2.5 rounded-lg bg-accent border border-border text-[10px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50" />

                  <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className={cn(
                    'w-7 h-7 rounded-lg flex items-center justify-center',
                    newComment.trim() ? 'bg-primary text-primary-foreground' : 'bg-accent text-muted-foreground'
                  )}>

                    <Send className="w-3 h-3" />
                  </button>
                </div>

                {/* Comments list - always shown, sorted by upvotes */}
                <div className="space-y-1.5">
                  {visibleComments.map((c) =>
                <div key={c.id} className="space-y-1">
                      <div className="p-1.5 rounded-lg my-[4px] bg-primary-foreground border-primary mx-0 px-[20px] opacity-100 border">
                        <p className="text-[9px] text-foreground mb-0.5">{c.text}</p>
                        <div className="flex items-center justify-between mb-0.5">
                          <button onClick={() => setProfileModalUser(c.author)} className="text-[8px] text-primary font-normal hover:underline cursor-pointer transition-colors">@{c.author}</button>
                          <span className="text-[8px] text-muted-foreground">{c.time}</span>
                        </div>
                        <p className="text-[9px] text-muted-foreground mb-1 hidden">{c.text}</p>
                        <div className="flex items-center gap-3">
                          <button
                        onClick={() => handleUpvote(c.id)}
                        className={cn(
                          'flex items-center gap-0.5 text-[9px] transition-colors',
                          upvotedIds.has(`-${c.id}`) ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                        )}>

                            <ArrowUp className="w-2.5 h-2.5" />
                            <span>{c.upvotes}</span>
                          </button>
                          <button
                        onClick={() => setReplyingTo(replyingTo === c.id ? null : c.id)}
                        className="flex items-center gap-0.5 text-[9px] text-muted-foreground hover:text-foreground transition-colors">

                            <CornerDownRight className="w-2.5 h-2.5" />
                            <span>Reply</span>
                          </button>
                        </div>
                      </div>

                      {/* Reply input */}
                      {replyingTo === c.id &&
                  <div className="flex items-center gap-1.5 ml-4">
                          <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => {if (e.key === 'Enter') {e.preventDefault();handleReply(c.id);}}}
                      placeholder="Reply..."
                      maxLength={200}
                      className="flex-1 h-6 px-2 rounded-md bg-accent border border-border text-[9px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                      autoFocus />

                          <button
                      onClick={() => handleReply(c.id)}
                      disabled={!replyText.trim()}
                      className={cn(
                        'w-6 h-6 rounded-md flex items-center justify-center',
                        replyText.trim() ? 'bg-primary text-primary-foreground' : 'bg-accent text-muted-foreground'
                      )}>

                            <Send className="w-2.5 h-2.5" />
                          </button>
                        </div>
                  }

                      {/* Replies */}
                      {c.replies.map((r) =>
                  <div key={r.id} className="ml-4 p-1.5 rounded-lg bg-accent/30 border border-primary/20">
                          <p className="text-[8px] text-foreground mb-0.5">{r.text}</p>
                          <div className="flex items-center justify-between mb-0.5">
                            <button onClick={() => setProfileModalUser(r.author)} className="text-[8px] text-primary font-normal hover:underline cursor-pointer transition-colors">@{r.author}</button>
                            <span className="text-[7px] text-muted-foreground">{r.time}</span>
                          </div>
                          <button
                      onClick={() => handleUpvote(r.id, true, c.id)}
                      className={cn(
                        'flex items-center gap-0.5 text-[8px] transition-colors',
                        upvotedIds.has(`${c.id}-${r.id}`) ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                      )}>

                            <ArrowUp className="w-2 h-2" />
                            <span>{r.upvotes}</span>
                          </button>
                        </div>
                  )}
                    </div>
                )}
                </div>

                {/* View more button */}
                {hasMoreComments && !showAllComments &&
              <button
                onClick={() => setShowAllComments(true)}
                className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors mx-auto">

                    <MessageCircle className="w-3 h-3" />
                    <span>View {sortedComments.length - 3} more comments</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>
              }
              </div>

            </div>
          }
        </div>
      </div>

      {/* Locked Profile Modal */}
      <LockedProfileModal
        open={!!profileModalUser}
        onClose={() => setProfileModalUser(null)}
        username={profileModalUser || ''}
      />
    </div>);

};

export default SwipeablePollCard;