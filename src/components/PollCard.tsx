import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface PollOption {
  text: string;
  percentage: number;
}

interface PollCardProps {
  question: string;
  options: PollOption[];
  index: number;
}

const PollCard = ({ question, options, index }: PollCardProps) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const hasVoted = selectedOption !== null;

  const handleVote = (optionIndex: number) => {
    if (!hasVoted) {
      setSelectedOption(optionIndex);
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
      <div className="space-y-2">
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

      {/* Vote count hint */}
      <div className="mt-3 text-center">
        <span className="text-[10px] text-muted-foreground">
          {hasVoted ? 'Thanks for voting!' : 'Tap to vote'}
        </span>
      </div>
    </div>
  );
};

export default PollCard;
