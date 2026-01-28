import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface QACardProps {
  question: string;
  answer: string;
  index: number;
}

const QACard = ({ question, answer, index }: QACardProps) => {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <div
      onClick={() => setIsRevealed(!isRevealed)}
      className={cn(
        'relative overflow-hidden cursor-pointer transition-all duration-500 ease-out',
        'border border-border/50 rounded-2xl',
        isRevealed ? 'bg-foreground' : 'bg-background',
      )}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Question */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <p
            className={cn(
              'text-base font-medium leading-relaxed transition-colors duration-300',
              isRevealed ? 'text-background' : 'text-foreground'
            )}
          >
            {question}
          </p>
          <div
            className={cn(
              'flex-shrink-0 p-1 rounded-full transition-colors duration-300',
              isRevealed ? 'bg-background/20' : 'bg-foreground/10'
            )}
          >
            {isRevealed ? (
              <ChevronUp className={cn('w-4 h-4', isRevealed ? 'text-background' : 'text-foreground')} />
            ) : (
              <ChevronDown className={cn('w-4 h-4', isRevealed ? 'text-background' : 'text-foreground')} />
            )}
          </div>
        </div>
      </div>

      {/* Answer - Expandable */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-500 ease-out',
          isRevealed ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="px-5 pb-5 pt-0">
          <div className="border-t border-background/20 pt-4">
            <p className="text-sm text-background/80 leading-relaxed">
              {answer}
            </p>
          </div>
        </div>
      </div>

      {/* Tap hint */}
      {!isRevealed && (
        <div className="absolute bottom-2 right-3">
          <span className="text-[10px] text-muted-foreground">tap to reveal</span>
        </div>
      )}
    </div>
  );
};

export default QACard;
