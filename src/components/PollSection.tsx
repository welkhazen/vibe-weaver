import { useState, useEffect } from 'react';
import { Instagram, ChevronUp, ChevronDown, Lock, Unlock, Brain, Heart, Eye, Ghost, Link2, Map } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import SwipeablePollCard from './SwipeablePollCard';

interface PollItem {
  question: string;
  options: { text: string; percentage: number }[];
}

const DAILY_CAP = 11;

const getTodayKey = () => {
  const now = new Date();
  return `poll-answers-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

const pollData: PollItem[] = [
  { question: "Do you believe your thoughts shape your reality?", options: [{ text: "Yes", percentage: 78 }, { text: "No", percentage: 22 }] },
  { question: "Do you practice self-reflection regularly?", options: [{ text: "Yes", percentage: 64 }, { text: "No", percentage: 36 }] },
  { question: "Is vulnerability a strength?", options: [{ text: "Yes", percentage: 81 }, { text: "No", percentage: 19 }] },
  { question: "Do you set intentions for your day?", options: [{ text: "Yes", percentage: 52 }, { text: "No", percentage: 48 }] },
  { question: "Can you control your emotions?", options: [{ text: "Yes", percentage: 43 }, { text: "No", percentage: 57 }] },
  { question: "Do you believe in growth mindset?", options: [{ text: "Yes", percentage: 89 }, { text: "No", percentage: 11 }] },
];

interface UnlockableTest {
  name: string;
  threshold: number;
  icon: React.ReactNode;
}

const unlockableTests: UnlockableTest[] = [
  { name: 'Myers-Briggs Personality Type', threshold: 25, icon: <Brain className="w-3.5 h-3.5" /> },
  { name: 'Big Five Personality Profile', threshold: 50, icon: <Heart className="w-3.5 h-3.5" /> },
  { name: 'Emotional Intelligence Assessment', threshold: 75, icon: <Eye className="w-3.5 h-3.5" /> },
  { name: 'Shadow Self Analysis', threshold: 100, icon: <Ghost className="w-3.5 h-3.5" /> },
  { name: 'Attachment Style Profile', threshold: 150, icon: <Link2 className="w-3.5 h-3.5" /> },
  { name: 'Cognitive Bias Mapping', threshold: 200, icon: <Map className="w-3.5 h-3.5" /> },
];

const PollSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [statsExpanded, setStatsExpanded] = useState(false);

  const [dailyCount, setDailyCount] = useState(() => {
    const saved = localStorage.getItem(getTodayKey());
    return saved ? parseInt(saved, 10) : 0;
  });

  const [totalCount, setTotalCount] = useState(() => {
    const saved = localStorage.getItem('poll-answers-total');
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem(getTodayKey(), String(dailyCount));
  }, [dailyCount]);

  useEffect(() => {
    localStorage.setItem('poll-answers-total', String(totalCount));
  }, [totalCount]);

  const handleVote = () => {
    setDailyCount((prev) => prev + 1);
    setTotalCount((prev) => prev + 1);
  };

  const handleNext = () => {
    if (currentIndex < pollData.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const isAtCap = dailyCount >= DAILY_CAP;
  const isComplete = currentIndex >= pollData.length;
  const currentPoll = pollData[currentIndex];

  return (
    <div className="flex flex-col h-full w-full">
      {/* Top bar - minimal */}
      <div className="flex items-center justify-between px-1 mb-3">
        <span className="text-xs text-muted-foreground">{currentIndex + 1}/{pollData.length}</span>
        <a
          href="https://instagram.com/thecumulativemind"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-foreground/5 hover:bg-foreground/10 transition-all active:scale-95"
        >
          <Instagram className="w-3.5 h-3.5 text-foreground" />
          <span className="text-[10px] font-medium text-foreground">@thecumulativemind</span>
        </a>
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-1.5 mb-4">
        {pollData.map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              i === currentIndex ? 'w-6 bg-gold' : i < currentIndex ? 'w-1.5 bg-primary/50' : 'w-1.5 bg-foreground/20'
            )}
          />
        ))}
      </div>

      {/* Card area - fills available space */}
      <div className="flex-1 flex items-center justify-center min-h-0">
        {isAtCap ? (
          <div className="text-center space-y-3 animate-fade-in">
            <Lock className="w-10 h-10 text-muted-foreground mx-auto" />
            <p className="text-lg font-semibold text-foreground">Daily limit reached</p>
            <p className="text-sm text-muted-foreground">Come back tomorrow for more questions!</p>
          </div>
        ) : currentPoll ? (
          <SwipeablePollCard
            key={currentIndex}
            question={currentPoll.question}
            options={currentPoll.options}
            onVote={handleVote}
            onNext={handleNext}
            isLocked={isAtCap}
          />
        ) : (
          <div className="text-center space-y-3 animate-fade-in">
            <p className="text-lg font-semibold text-foreground">All done! 🎉</p>
            <p className="text-sm text-muted-foreground">Questions updated regularly</p>
          </div>
        )}
      </div>

      {/* Collapsible bottom stats panel */}
      <div className="mt-3 border-t border-border/50">
        <button
          onClick={() => setStatsExpanded(!statsExpanded)}
          className="w-full flex items-center justify-between px-3 py-2.5"
        >
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-foreground">{dailyCount}/{DAILY_CAP} today</span>
            <Progress value={(dailyCount / DAILY_CAP) * 100} className="h-1.5 w-20" />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>{totalCount} total</span>
            {statsExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </div>
        </button>

        <div className={cn(
          'overflow-hidden transition-all duration-300 ease-out',
          statsExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}>
          <div className="px-3 pb-3 space-y-2">
            <span className="text-[11px] font-medium text-muted-foreground">Unlock Personality Tests</span>
            {unlockableTests.map((test) => {
              const isUnlocked = totalCount >= test.threshold;
              const progress = Math.min((totalCount / test.threshold) * 100, 100);
              const remaining = Math.max(test.threshold - totalCount, 0);

              return (
                <div key={test.name} className="space-y-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={isUnlocked ? 'text-gold' : 'text-muted-foreground'}>{test.icon}</span>
                      <span className="text-[10px] text-foreground truncate">{test.name}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {isUnlocked ? (
                        <Unlock className="w-3 h-3 text-gold" />
                      ) : (
                        <>
                          <Lock className="w-3 h-3 text-muted-foreground" />
                          <span className="text-[9px] text-muted-foreground">{remaining} more</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Progress value={progress} className="h-1" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollSection;
