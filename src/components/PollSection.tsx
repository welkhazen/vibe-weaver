import { useState, useEffect } from 'react';
import { Instagram } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import PollCard from './PollCard';

interface PollItem {
  question: string;
  options: {
    text: string;
    percentage: number;
  }[];
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

const PollSection = () => {
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

  const isAtCap = dailyCount >= DAILY_CAP;

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-foreground">Community Polls</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Vote & see what others think</p>
        </div>
        <a
          href="https://instagram.com/thecumulativemind"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground/5 hover:bg-foreground/10 transition-all duration-300 active:scale-95"
        >
          <Instagram className="w-4 h-4 text-foreground" />
          <span className="text-xs font-medium text-foreground">@thecumulativemind</span>
        </a>
      </div>

      {/* Daily progress banner */}
      <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-foreground/5 border border-border/50">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-muted-foreground">
              {isAtCap ? 'Daily limit reached — come back tomorrow!' : `${dailyCount}/${DAILY_CAP} answered today`}
            </span>
          </div>
          <Progress value={(dailyCount / DAILY_CAP) * 100} className="h-1.5" />
        </div>
      </div>

      {/* Questions updated note */}
      <p className="text-[10px] text-muted-foreground/60 text-center">Questions updated regularly</p>

      {/* Poll Cards */}
      <div className="w-full grid gap-3">
        {pollData.map((item, index) => (
          <PollCard
            key={index}
            question={item.question}
            options={item.options}
            index={index}
            dailyCount={dailyCount}
            totalCount={totalCount}
            isLocked={dailyCount >= DAILY_CAP}
            onVote={handleVote}
          />
        ))}
      </div>
    </div>
  );
};

export default PollSection;
