import { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Check, MessageCircle, ChevronDown, ChevronUp, Send } from 'lucide-react';

interface PollOption {
  text: string;
  percentage: number;
}

interface Comment {
  id: string;
  author: string;
  text: string;
  time: string;
}

interface SwipeablePollCardProps {
  question: string;
  options: PollOption[];
  onVote: (optionIndex: number) => void;
  onNext: () => void;
  isLocked: boolean;
}

const mockComments: Comment[] = [
  { id: '1', author: 'Alex M.', text: 'This really made me think about my daily habits.', time: '2h ago' },
  { id: '2', author: 'Jordan K.', text: 'Interesting perspective!', time: '5h ago' },
];

const SWIPE_THRESHOLD = 100;

const SwipeablePollCard = ({ question, options, onVote, onNext, isLocked }: SwipeablePollCardProps) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>(mockComments);

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
        // right = Yes (index 0), left = No (index 1)
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
      setComments([{ id: Date.now().toString(), author: 'You', text: newComment.trim(), time: 'Just now' }, ...comments]);
      setNewComment('');
    }
  };

  const rotation = isDragging ? dragX * 0.08 : 0;
  const opacity = isDragging ? Math.max(0.5, 1 - Math.abs(dragX) / 400) : 1;
  const yesIndicatorOpacity = isDragging && dragX > 30 ? Math.min(dragX / SWIPE_THRESHOLD, 1) : 0;
  const noIndicatorOpacity = isDragging && dragX < -30 ? Math.min(Math.abs(dragX) / SWIPE_THRESHOLD, 1) : 0;

  const exitTransform = isExiting
    ? exitDirection === 'right'
      ? 'translateX(120%) rotate(15deg)'
      : 'translateX(-120%) rotate(-15deg)'
    : '';

  return (
    <div className="relative w-full flex-1 flex flex-col items-center justify-center">
      {/* Card */}
      <div
        className={cn(
          'relative w-full max-w-sm aspect-[3/4] rounded-3xl border border-border/50 bg-background shadow-lg overflow-hidden select-none',
          'transition-transform duration-300 ease-out',
          isDragging && '!transition-none',
          isExiting && 'transition-all duration-300 ease-in opacity-0',
        )}
        style={{
          transform: isExiting
            ? exitTransform
            : `translateX(${dragX}px) rotate(${rotation}deg)`,
          opacity: isExiting ? 0 : opacity,
        }}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => { if (isDragging) handleDragMove(e.clientX); }}
        onMouseUp={handleDragEnd}
        onMouseLeave={() => { if (isDragging) handleDragEnd(); }}
      >
        {/* Swipe direction indicators */}
        <div
          className="absolute top-6 right-6 px-4 py-2 rounded-xl border-2 border-green-500 z-10 pointer-events-none"
          style={{ opacity: yesIndicatorOpacity, transform: `rotate(-15deg)` }}
        >
          <span className="text-green-500 font-bold text-xl">YES</span>
        </div>
        <div
          className="absolute top-6 left-6 px-4 py-2 rounded-xl border-2 border-red-500 z-10 pointer-events-none"
          style={{ opacity: noIndicatorOpacity, transform: `rotate(15deg)` }}
        >
          <span className="text-red-500 font-bold text-xl">NO</span>
        </div>

        {/* Card Content */}
        <div className="flex flex-col items-center justify-center h-full p-6">
          {!hasVoted ? (
            <>
              <p className="text-xl font-bold text-foreground text-center leading-relaxed">
                {question}
              </p>
              <p className="text-xs text-muted-foreground mt-4">Swipe right for Yes, left for No</p>
            </>
          ) : (
            <div className="w-full space-y-4 animate-fade-in">
              <p className="text-lg font-semibold text-foreground text-center mb-6">{question}</p>

              {options.map((option, i) => (
                <div key={i} className="relative w-full rounded-xl overflow-hidden border border-border/50">
                  <div
                    className={cn(
                      'absolute inset-0',
                      selectedOption === i ? 'bg-primary/20' : 'bg-foreground/10'
                    )}
                    style={{ width: `${option.percentage}%` }}
                  />
                  <div className="relative px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {selectedOption === i && (
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </div>
                      )}
                      <span className={cn('text-sm font-semibold', selectedOption === i ? 'text-primary' : 'text-foreground')}>
                        {option.text}
                      </span>
                    </div>
                    <span className={cn('text-sm font-semibold', selectedOption === i ? 'text-primary' : 'text-muted-foreground')}>
                      {option.percentage}%
                    </span>
                  </div>
                </div>
              ))}

              {/* Comments toggle */}
              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mx-auto mt-2"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{comments.length} comments</span>
                {showComments ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {/* Comments */}
              <div className={cn(
                'overflow-hidden transition-all duration-300',
                showComments ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
              )}>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddComment(); } }}
                    placeholder="Add a comment..."
                    maxLength={200}
                    className="flex-1 h-8 px-3 rounded-lg bg-accent border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center',
                      newComment.trim() ? 'bg-primary text-primary-foreground' : 'bg-accent text-muted-foreground'
                    )}
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {comments.map((c) => (
                    <div key={c.id} className="p-2 rounded-lg bg-accent/50 border border-border/30">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[10px] font-medium text-foreground">{c.author}</span>
                        <span className="text-[9px] text-muted-foreground">{c.time}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">{c.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next button */}
              <button
                onClick={onNext}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 active:scale-[0.97] transition-all mt-2"
              >
                Next Question →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tap buttons below card (alternative to swiping) */}
      {!hasVoted && !isLocked && (
        <div className="flex gap-4 mt-5 w-full max-w-sm">
          <button
            onClick={() => handleTapVote(1)}
            className="flex-1 py-3.5 rounded-xl bg-foreground text-background font-semibold text-sm active:scale-[0.95] transition-all"
          >
            No
          </button>
          <button
            onClick={() => handleTapVote(0)}
            className="flex-1 py-3.5 rounded-xl font-semibold text-sm text-white active:scale-[0.95] transition-all"
            style={{ background: 'hsl(var(--gold-h), var(--gold-s), var(--gold-l))' }}
          >
            Yes
          </button>
        </div>
      )}
    </div>
  );
};

export default SwipeablePollCard;
