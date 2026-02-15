import { useState, useEffect } from 'react';
import { Instagram, ChevronUp, ChevronDown, Lock, Unlock, Brain, Heart, Eye, Ghost, Link2, Map, Clock, CalendarDays, Flame } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import SwipeablePollCard from './SwipeablePollCard';
import AnswerHistoryCard from './AnswerHistoryCard';

interface PollItem {
  question: string;
  options: {text: string;percentage: number;}[];
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
// Bonus questions (unlockable with flames)
{ question: "Do you believe in setting boundaries?", options: [{ text: "Yes", percentage: 85 }, { text: "No", percentage: 15 }] },
{ question: "Can meditation change your life?", options: [{ text: "Yes", percentage: 72 }, { text: "No", percentage: 28 }] },
{ question: "Is solitude necessary for creativity?", options: [{ text: "Yes", percentage: 67 }, { text: "No", percentage: 33 }] },
{ question: "Do you trust your intuition?", options: [{ text: "Yes", percentage: 74 }, { text: "No", percentage: 26 }] },
{ question: "Should you always follow your passion?", options: [{ text: "Yes", percentage: 58 }, { text: "No", percentage: 42 }] },
{ question: "Is failure a better teacher than success?", options: [{ text: "Yes", percentage: 76 }, { text: "No", percentage: 24 }] },
{ question: "Do you practice gratitude daily?", options: [{ text: "Yes", percentage: 61 }, { text: "No", percentage: 39 }] },
{ question: "Can habits define your destiny?", options: [{ text: "Yes", percentage: 83 }, { text: "No", percentage: 17 }] },
{ question: "Is empathy a skill you can develop?", options: [{ text: "Yes", percentage: 88 }, { text: "No", percentage: 12 }] },
{ question: "Do you believe luck plays a role in success?", options: [{ text: "Yes", percentage: 54 }, { text: "No", percentage: 46 }] }];


const tomorrowQuestions: PollItem[] = [
{ question: "Is perfectionism holding you back?", options: [{ text: "Yes", percentage: 0 }, { text: "No", percentage: 0 }] },
{ question: "Do you value experiences over things?", options: [{ text: "Yes", percentage: 0 }, { text: "No", percentage: 0 }] },
{ question: "Can you change your personality?", options: [{ text: "Yes", percentage: 0 }, { text: "No", percentage: 0 }] },
{ question: "Is self-discipline more important than motivation?", options: [{ text: "Yes", percentage: 0 }, { text: "No", percentage: 0 }] },
{ question: "Do you believe in second chances?", options: [{ text: "Yes", percentage: 0 }, { text: "No", percentage: 0 }] },
{ question: "Is authenticity the key to happiness?", options: [{ text: "Yes", percentage: 0 }, { text: "No", percentage: 0 }] },
{ question: "Can reading books transform your mindset?", options: [{ text: "Yes", percentage: 0 }, { text: "No", percentage: 0 }] },
{ question: "Do you believe age is just a number?", options: [{ text: "Yes", percentage: 0 }, { text: "No", percentage: 0 }] }];


interface AnswerHistoryItem {
  question: string;
  answer: string;
  options: {text: string;percentage: number;}[];
}

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
{ name: 'Cognitive Bias Mapping', threshold: 200, icon: <Map className="w-3.5 h-3.5" /> }];


const PollSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [statsExpanded, setStatsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'stats' | 'history' | 'tomorrow'>('stats');

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
    return saved ? parseInt(saved, 10) : 50; // Start with 50 flames
  });

  const [bonusUnlocks, setBonusUnlocks] = useState(() => {
    const saved = localStorage.getItem(getUnlocksKey());
    return saved ? parseInt(saved, 10) : 0;
  });

  const dailyCap = BASE_DAILY_CAP + bonusUnlocks * UNLOCK_BONUS;

  useEffect(() => {
    localStorage.setItem(getTodayKey(), String(dailyCount));
  }, [dailyCount]);

  useEffect(() => {
    localStorage.setItem('poll-answers-total', String(totalCount));
  }, [totalCount]);

  useEffect(() => {
    localStorage.setItem(getHistoryKey(), JSON.stringify(answerHistory));
  }, [answerHistory]);

  useEffect(() => {
    localStorage.setItem('poll-tokens', String(tokenBalance));
  }, [tokenBalance]);

  useEffect(() => {
    localStorage.setItem(getUnlocksKey(), String(bonusUnlocks));
  }, [bonusUnlocks]);

  const handleVote = (optionIndex?: number) => {
    const currentPoll = pollData[currentIndex];
    if (currentPoll) {
      const answer = optionIndex !== undefined ? currentPoll.options[optionIndex]?.text || 'Yes' : 'Yes';
      setAnswerHistory((prev) => [...prev, { question: currentPoll.question, answer, options: currentPoll.options }]);
    }
    setDailyCount((prev) => prev + 1);
    setTotalCount((prev) => prev + 1);
  };

  const handleNext = () => {
    if (currentIndex < pollData.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

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
    <div className="flex flex-col h-full w-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-1 mb-3">
        <span className="text-xs text-muted-foreground">{currentIndex + 1}/{pollData.length}</span>
        <div className="flex items-center gap-2">
          {/* Token balance */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 border border-primary/20">
            <Flame className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-semibold text-primary">{tokenBalance}</span>
          </div>
          <a
            href="https://instagram.com/thecumulativemind"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-foreground/5 hover:bg-foreground/10 transition-all active:scale-95">

            <Instagram className="w-3.5 h-3.5 text-foreground" />
            <span className="text-[10px] font-medium text-foreground">@thecumulativemind</span>
          </a>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-1.5 mb-4">
        {pollData.slice(0, dailyCap).map((_, i) =>
        <div
          key={i}
          className={cn("h-1.5 rounded-full transition-all duration-300 border-gold-light",

          i === currentIndex ? 'w-6 bg-gold' : i < currentIndex ? 'w-1.5 bg-primary/50' : 'w-1.5 bg-foreground/20'
          )} />

        )}
      </div>

      {/* Card area */}
      <div className="flex-1 flex items-center justify-center min-h-0">
        {isAtCap ?
        <div className="text-center space-y-4 animate-fade-in px-6">
            <Lock className="w-10 h-10 text-muted-foreground mx-auto" />
            <p className="text-lg font-semibold text-foreground">Daily limit reached</p>
            <p className="text-sm text-muted-foreground">Come back tomorrow for more questions!</p>
            
            {/* Unlock with tokens */}
            {hasMorePollsAvailable &&
          <div className="pt-2 space-y-2">
                <div className="h-px bg-border/50 w-full" />
                <p className="text-xs text-muted-foreground">Or use flames to unlock more</p>
                <button
              onClick={handleUnlockMore}
              disabled={!canUnlock}
              className={cn(
                'w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.97]',
                canUnlock ?
                'bg-primary text-primary-foreground hover:bg-primary/90' :
                'bg-muted text-muted-foreground cursor-not-allowed'
              )}>

                   <Flame className="w-4 h-4" />
                   <span>Unlock {UNLOCK_BONUS} questions for {UNLOCK_COST} flames</span>
                </button>
                {!canUnlock &&
            <p className="text-[10px] text-destructive">Not enough flames ({tokenBalance}/{UNLOCK_COST})</p>
            }
              </div>
          }
          </div> :
        currentPoll ?
        <SwipeablePollCard
          key={currentIndex}
          question={currentPoll.question}
          options={currentPoll.options}
          onVote={handleVote}
          onNext={handleNext}
          isLocked={isAtCap} /> :


        <div className="text-center space-y-3 animate-fade-in">
            <p className="text-lg font-semibold text-foreground">All done! 🎉</p>
            <p className="text-sm text-muted-foreground">Questions updated regularly</p>
          </div>
        }
      </div>

      {/* Collapsible bottom panel */}
      <div className="mt-3 border-t border-border/50">
        <button
          onClick={() => setStatsExpanded(!statsExpanded)}
          className="w-full flex items-center justify-between px-3 py-2.5">

          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-foreground">{dailyCount}/{dailyCap} today</span>
            <Progress value={dailyCount / dailyCap * 100} className="h-1.5 w-20" />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>{totalCount} total</span>
            {statsExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </div>
        </button>

        <div className={cn(
          'overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]',
          statsExpanded ? 'max-h-[600px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 translate-y-4'
        )}>
          {/* Tabs */}
          <div className="flex gap-1 px-3 mb-2">
            {[
            { key: 'stats' as const, label: 'Milestones', icon: <Unlock className="w-3 h-3" /> },
            { key: 'history' as const, label: 'History', icon: <Clock className="w-3 h-3" /> },
            { key: 'tomorrow' as const, label: 'Tomorrow', icon: <CalendarDays className="w-3 h-3" /> }].
            map((tab) =>
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all',
                activeTab === tab.key ?
                'bg-primary text-primary-foreground' :
                'bg-foreground/5 text-muted-foreground hover:bg-foreground/10'
              )}>

                {tab.icon}
                {tab.label}
              </button>
            )}
          </div>

          <div className="px-3 pb-3 max-h-64 overflow-y-auto">
            {/* Milestones tab */}
            {activeTab === 'stats' &&
            <div className="space-y-2 animate-fade-in">
                <span className="text-[11px] font-medium text-muted-foreground">Unlock Personality Tests</span>
                {unlockableTests.map((test) => {
                const isUnlocked = totalCount >= test.threshold;
                const progress = Math.min(totalCount / test.threshold * 100, 100);
                const remaining = Math.max(test.threshold - totalCount, 0);

                return (
                  <div key={test.name} className="space-y-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={isUnlocked ? 'text-gold' : 'text-muted-foreground'}>{test.icon}</span>
                          <span className="text-[10px] text-foreground truncate">{test.name}</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {isUnlocked ?
                        <Unlock className="w-3 h-3 text-gold" /> :

                        <>
                              <Lock className="w-3 h-3 text-muted-foreground" />
                              <span className="text-[9px] text-muted-foreground">{remaining} more</span>
                            </>
                        }
                        </div>
                      </div>
                      <Progress value={progress} className="h-1" />
                    </div>);

              })}
              </div>
            }

            {/* History tab */}
            {activeTab === 'history' &&
            <div className="space-y-3 animate-fade-in">
                {answerHistory.length === 0 ?
              <p className="text-[11px] text-muted-foreground text-center py-4">No answers yet today</p> :

              answerHistory.map((item, i) =>
              <AnswerHistoryCard
                key={i}
                question={item.question}
                answer={item.answer}
                options={item.options} />

              )
              }
              </div>
            }

            {/* Tomorrow tab */}
            {activeTab === 'tomorrow' &&
            <div className="space-y-2 animate-fade-in">
                <span className="text-[11px] font-medium text-muted-foreground">Coming tomorrow — {tomorrowQuestions.length} questions</span>
                {tomorrowQuestions.map((q, i) =>
              <div key={i} className="rounded-xl border border-border/50 bg-background p-3">
                    <p className="text-xs font-medium text-foreground mb-2">{q.question}</p>
                    <div className="space-y-1">
                      {q.options.map((opt, j) =>
                  <div key={j} className="px-3 py-1.5 rounded-lg border border-border/30 bg-foreground/5">
                          <span className="text-[10px] text-muted-foreground">{opt.text}</span>
                        </div>
                  )}
                    </div>
                    <p className="text-[9px] text-muted-foreground mt-1.5">Available tomorrow</p>
                  </div>
              )}
              </div>
            }
          </div>
        </div>
      </div>
    </div>);

};

export default PollSection;