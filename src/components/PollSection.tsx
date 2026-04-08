import { useState, useEffect, useCallback } from 'react';
import { Instagram, Lock, Clock, CalendarDays, Flame } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import SwipeablePollCard from './SwipeablePollCard';
import AnswerHistoryCard from './AnswerHistoryCard';
import PersonalityTestGrid from './PersonalityTestGrid';
import PollSubPageOverlay from './PollSubPageOverlay';

interface PollItem {
  question: string;
  options: {text: string; percentage: number;}[];
}

const BASE_DAILY_CAP = 8;
const UNLOCK_COST = 15;
const UNLOCK_BONUS = 5;

const getTodayKey = () => {
  const now = new Date();
  return `poll-answers-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

const getHistoryKey = () => {
  const now = new Date();
  return `poll-history-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

const getUnlocksKey = () => {
  const now = new Date();
  return `poll-unlocks-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

const pollData: PollItem[] = [
  { question: "Do you believe your thoughts shape your reality?", options: [{ text: "Yes", percentage: 78 }, { text: "No", percentage: 22 }] },
  { question: "Do you practice self-reflection regularly?", options: [{ text: "Yes", percentage: 64 }, { text: "No", percentage: 36 }] },
  { question: "Is vulnerability a strength?", options: [{ text: "Yes", percentage: 81 }, { text: "No", percentage: 19 }] },
  { question: "Do you set intentions for your day?", options: [{ text: "Yes", percentage: 52 }, { text: "No", percentage: 48 }] },
  { question: "Can you control your emotions?", options: [{ text: "Yes", percentage: 43 }, { text: "No", percentage: 57 }] },
  { question: "Do you believe in growth mindset?", options: [{ text: "Yes", percentage: 89 }, { text: "No", percentage: 11 }] },
  { question: "Do you journal your thoughts?", options: [{ text: "Yes", percentage: 55 }, { text: "No", percentage: 45 }] },
  { question: "Is forgiveness essential for growth?", options: [{ text: "Yes", percentage: 91 }, { text: "No", percentage: 9 }] },
  { question: "Do you believe in setting boundaries?", options: [{ text: "Yes", percentage: 85 }, { text: "No", percentage: 15 }] },
  { question: "Can meditation change your life?", options: [{ text: "Yes", percentage: 72 }, { text: "No", percentage: 28 }] },
  { question: "Is solitude necessary for creativity?", options: [{ text: "Yes", percentage: 67 }, { text: "No", percentage: 33 }] },
  { question: "Do you trust your intuition?", options: [{ text: "Yes", percentage: 74 }, { text: "No", percentage: 26 }] },
  { question: "Should you always follow your passion?", options: [{ text: "Yes", percentage: 58 }, { text: "No", percentage: 42 }] },
  { question: "Is failure a better teacher than success?", options: [{ text: "Yes", percentage: 76 }, { text: "No", percentage: 24 }] },
  { question: "Do you practice gratitude daily?", options: [{ text: "Yes", percentage: 61 }, { text: "No", percentage: 39 }] },
  { question: "Can habits define your destiny?", options: [{ text: "Yes", percentage: 83 }, { text: "No", percentage: 17 }] },
  { question: "Is empathy a skill you can develop?", options: [{ text: "Yes", percentage: 88 }, { text: "No", percentage: 12 }] },
  { question: "Do you believe luck plays a role in success?", options: [{ text: "Yes", percentage: 54 }, { text: "No", percentage: 46 }] },
];

const tomorrowQuestions: PollItem[] = [
  { question: "Is perfectionism holding you back?", options: [{ text: "Yes", percentage: 0 }, { text: "No", percentage: 0 }] },
  { question: "Do you value experiences over things?", options: [{ text: "Yes", percentage: 0 }, { text: "No", percentage: 0 }] },
  { question: "Can you change your personality?", options: [{ text: "Yes", percentage: 0 }, { text: "No", percentage: 0 }] },
  { question: "Is self-discipline more important than motivation?", options: [{ text: "Yes", percentage: 0 }, { text: "No", percentage: 0 }] },
  { question: "Do you believe in second chances?", options: [{ text: "Yes", percentage: 0 }, { text: "No", percentage: 0 }] },
  { question: "Is authenticity the key to happiness?", options: [{ text: "Yes", percentage: 0 }, { text: "No", percentage: 0 }] },
  { question: "Can reading books transform your mindset?", options: [{ text: "Yes", percentage: 0 }, { text: "No", percentage: 0 }] },
  { question: "Do you believe age is just a number?", options: [{ text: "Yes", percentage: 0 }, { text: "No", percentage: 0 }] },
];

interface AnswerHistoryItem {
  question: string;
  answer: string;
  options: {text: string; percentage: number;}[];
}

const PollSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [showTomorrow, setShowTomorrow] = useState(false);

  const [dailyCount, setDailyCount] = useState(() => {
    const saved = localStorage.getItem(getTodayKey());
    return saved ? parseInt(saved, 10) : 0;
  });

  const [totalCount, setTotalCount] = useState(() => {
    const saved = localStorage.getItem('poll-answers-total');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [answerHistory, setAnswerHistory] = useState<AnswerHistoryItem[]>(() => {
    const saved = localStorage.getItem(getHistoryKey());
    return saved ? JSON.parse(saved) : [];
  });

  const [tokenBalance, setTokenBalance] = useState(() => {
    const saved = localStorage.getItem('poll-tokens');
    return saved ? parseInt(saved, 10) : 50;
  });

  const [bonusUnlocks, setBonusUnlocks] = useState(() => {
    const saved = localStorage.getItem(getUnlocksKey());
    return saved ? parseInt(saved, 10) : 0;
  });

  const dailyCap = BASE_DAILY_CAP + bonusUnlocks * UNLOCK_BONUS;

  useEffect(() => { localStorage.setItem(getTodayKey(), String(dailyCount)); }, [dailyCount]);
  useEffect(() => { localStorage.setItem('poll-answers-total', String(totalCount)); }, [totalCount]);
  useEffect(() => { localStorage.setItem(getHistoryKey(), JSON.stringify(answerHistory)); }, [answerHistory]);
  useEffect(() => { localStorage.setItem('poll-tokens', String(tokenBalance)); }, [tokenBalance]);
  useEffect(() => { localStorage.setItem(getUnlocksKey(), String(bonusUnlocks)); }, [bonusUnlocks]);

  const handleVote = useCallback((optionIndex?: number) => {
    const currentPoll = pollData[currentIndex];
    if (currentPoll) {
      const answer = optionIndex !== undefined ? currentPoll.options[optionIndex]?.text || 'Yes' : 'Yes';
      setAnswerHistory((prev) => [...prev, { question: currentPoll.question, answer, options: currentPoll.options }]);
    }
    setDailyCount((prev) => prev + 1);
    setTotalCount((prev) => prev + 1);
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < pollData.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const handleUnlockMore = () => {
    if (tokenBalance >= UNLOCK_COST) {
      setTokenBalance((prev) => prev - UNLOCK_COST);
      setBonusUnlocks((prev) => prev + 1);
    }
  };

  const isAtCap = dailyCount >= dailyCap;
  const canUnlock = tokenBalance >= UNLOCK_COST;
  const currentPoll = pollData[currentIndex];
  const hasMorePollsAvailable = currentIndex < pollData.length - 1;

  return (
    <div className="flex flex-col h-full w-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-1 mb-3 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{currentIndex + 1}/{pollData.length}</span>
          <span className="text-[10px] text-muted-foreground">·</span>
          <span className="text-[10px] text-muted-foreground">{dailyCount}/{dailyCap} today</span>
        </div>
        <div className="flex items-center gap-2">
          {/* History & Tomorrow icons */}
          <button
            onClick={() => setShowHistory(true)}
            className="w-7 h-7 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-foreground/10 transition-colors"
            title="Answer History"
          >
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          <button
            onClick={() => setShowTomorrow(true)}
            className="w-7 h-7 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-foreground/10 transition-colors"
            title="Tomorrow's Questions"
          >
            <CalendarDays className="w-3.5 h-3.5 text-muted-foreground" />
          </button>

          {/* Token balance */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 border border-primary/20">
            <Flame className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-semibold text-primary">{tokenBalance}</span>
          </div>
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
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-1.5 mb-4 shrink-0">
        {pollData.slice(0, dailyCap).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === currentIndex ? 'w-6 bg-primary' : i < currentIndex ? 'w-1.5 bg-primary/50' : 'w-1.5 bg-foreground/20'
            )}
          />
        ))}
      </div>

      {/* Card area */}
      <div className="flex items-center justify-center min-h-[420px] shrink-0">
        {isAtCap ? (
          <div className="text-center space-y-4 animate-fade-in px-6">
            <Lock className="w-10 h-10 text-muted-foreground mx-auto" />
            <p className="text-lg font-semibold text-foreground">Daily limit reached</p>
            <p className="text-sm text-muted-foreground">Come back tomorrow for more questions!</p>
            {hasMorePollsAvailable && (
              <div className="pt-2 space-y-2">
                <div className="h-px bg-border/50 w-full" />
                <p className="text-xs text-muted-foreground">Or use flames to unlock more</p>
                <button
                  onClick={handleUnlockMore}
                  disabled={!canUnlock}
                  className={cn(
                    'w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.97]',
                    canUnlock
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  )}
                >
                  <Flame className="w-4 h-4" />
                  <span>Unlock {UNLOCK_BONUS} questions for {UNLOCK_COST} flames</span>
                </button>
                {!canUnlock && (
                  <p className="text-[10px] text-destructive">Not enough flames ({tokenBalance}/{UNLOCK_COST})</p>
                )}
              </div>
            )}
          </div>
        ) : currentPoll ? (
          <SwipeablePollCard
            key={currentIndex}
            question={currentPoll.question}
            options={currentPoll.options}
            onVote={handleVote}
            onNext={handleNext}
            onPrev={handlePrev}
            canGoBack={currentIndex > 0}
            isLocked={isAtCap}
          />
        ) : (
          <div className="text-center space-y-3 animate-fade-in">
            <p className="text-lg font-semibold text-foreground">All done! 🎉</p>
            <p className="text-sm text-muted-foreground">Questions updated regularly</p>
          </div>
        )}
      </div>

      {/* Personality Test Category Boxes */}
      <div className="mt-4 px-1 pb-4 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-foreground">Personality Insights</span>
          <span className="text-[10px] text-muted-foreground">{totalCount} polls answered</span>
        </div>
        <PersonalityTestGrid totalCount={totalCount} />
      </div>

      {/* History Overlay */}
      <PollSubPageOverlay open={showHistory} onClose={() => setShowHistory(false)} title="Answer History">
        <div className="space-y-3">
          {answerHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No answers yet today</p>
          ) : (
            answerHistory.map((item, i) => (
              <AnswerHistoryCard
                key={i}
                question={item.question}
                answer={item.answer}
                options={item.options}
              />
            ))
          )}
        </div>
      </PollSubPageOverlay>

      {/* Tomorrow Overlay */}
      <PollSubPageOverlay open={showTomorrow} onClose={() => setShowTomorrow(false)} title="Tomorrow's Questions">
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground mb-2">{tomorrowQuestions.length} questions coming tomorrow</p>
          {tomorrowQuestions.map((q, i) => (
            <div key={i} className="rounded-xl border border-border/50 bg-foreground/5 p-3">
              <p className="text-xs font-medium text-foreground mb-2">{q.question}</p>
              <div className="space-y-1">
                {q.options.map((opt, j) => (
                  <div key={j} className="px-3 py-1.5 rounded-lg border border-border/30 bg-background">
                    <span className="text-[10px] text-muted-foreground">{opt.text}</span>
                  </div>
                ))}
              </div>
              <p className="text-[9px] text-muted-foreground mt-1.5">Available tomorrow</p>
            </div>
          ))}
        </div>
      </PollSubPageOverlay>
    </div>
  );
};

export default PollSection;
