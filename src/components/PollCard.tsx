import { useState } from 'react';
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

interface PollCardProps {
  question: string;
  options: PollOption[];
  index: number;
}

// Mock comments for demo
const mockComments: Comment[] = [
  { id: '1', author: 'Alex M.', text: 'This really made me think about my daily habits.', time: '2h ago' },
  { id: '2', author: 'Jordan K.', text: 'Interesting perspective!', time: '5h ago' },
];

const PollCard = ({ question, options, index }: PollCardProps) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const hasVoted = selectedOption !== null;

  const handleVote = (optionIndex: number) => {
    if (!hasVoted) {
      setSelectedOption(optionIndex);
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: 'You',
        text: newComment.trim(),
        time: 'Just now',
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden transition-all duration-500 ease-out',
        'border border-border/50 rounded-2xl bg-background p-5',
      )}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Question */}
      <p className="text-base font-medium leading-relaxed text-foreground mb-4">
        {question}
      </p>

      {/* Options */}
      <div className={cn(
        'space-y-2',
        options.length > 2 && 'max-h-32 overflow-y-auto pr-1'
      )}>
        {options.map((option, optionIndex) => (
          <button
            key={optionIndex}
            onClick={() => handleVote(optionIndex)}
            disabled={hasVoted}
            className={cn(
              'relative w-full text-left rounded-xl overflow-hidden transition-all duration-500 ease-out',
              'border',
              hasVoted
                ? 'cursor-default'
                : 'cursor-pointer hover:border-primary/50 active:scale-[0.98]',
              selectedOption === optionIndex
                ? 'border-primary bg-primary/10'
                : 'border-border/50 bg-foreground/5'
            )}
          >
            {/* Progress bar background */}
            <div
              className={cn(
                'absolute inset-0 transition-all duration-700 ease-out',
                hasVoted ? 'opacity-100' : 'opacity-0',
                selectedOption === optionIndex
                  ? 'bg-primary/20'
                  : 'bg-foreground/10'
              )}
              style={{
                width: hasVoted ? `${option.percentage}%` : '0%',
              }}
            />

            {/* Content */}
            <div className="relative px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {selectedOption === optionIndex && (
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center animate-scale-in">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
                <span
                  className={cn(
                    'text-sm font-medium transition-colors duration-300',
                    selectedOption === optionIndex
                      ? 'text-primary'
                      : 'text-foreground'
                  )}
                >
                  {option.text}
                </span>
              </div>

              {/* Percentage */}
              <span
                className={cn(
                  'text-sm font-semibold transition-all duration-500',
                  hasVoted ? 'opacity-100' : 'opacity-0',
                  selectedOption === optionIndex
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                {option.percentage}%
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Vote count hint and comments toggle */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground">
          {hasVoted ? 'Thanks for voting!' : 'Tap to vote'}
        </span>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>{comments.length} comments</span>
          {showComments ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Comments Section */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-out',
          showComments ? 'max-h-80 opacity-100 mt-4' : 'max-h-0 opacity-0'
        )}
      >
        {/* Add Comment Input */}
        <div className="flex items-center gap-2 mb-3">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a comment..."
            maxLength={200}
            className="flex-1 h-9 px-3 rounded-lg bg-accent border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
          />
          <button
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            className={cn(
              'w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300',
              newComment.trim()
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95'
                : 'bg-accent text-muted-foreground cursor-not-allowed'
            )}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Comments List */}
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {comments.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-3">
              No comments yet. Be the first!
            </p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="p-2.5 rounded-lg bg-accent/50 border border-border/30"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-foreground">
                    {comment.author}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {comment.time}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {comment.text}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PollCard;
