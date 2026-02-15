import { Lock, Unlock, Brain, Heart, Eye, Ghost, Link2, Map } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface UnlockableTest {
  name: string;
  threshold: number;
  icon: React.ReactNode;
}

const unlockableTests: UnlockableTest[] = [
  { name: 'Myers-Briggs Personality Type', threshold: 25, icon: <Brain className="w-4 h-4" /> },
  { name: 'Big Five Personality Profile', threshold: 50, icon: <Heart className="w-4 h-4" /> },
  { name: 'Emotional Intelligence Assessment', threshold: 75, icon: <Eye className="w-4 h-4" /> },
  { name: 'Shadow Self Analysis', threshold: 100, icon: <Ghost className="w-4 h-4" /> },
  { name: 'Attachment Style Profile', threshold: 150, icon: <Link2 className="w-4 h-4" /> },
  { name: 'Cognitive Bias Mapping', threshold: 200, icon: <Map className="w-4 h-4" /> },
];

interface PollStatsProps {
  dailyCount: number;
  totalCount: number;
}

const DAILY_CAP = 11;

const PollStats = ({ dailyCount, totalCount }: PollStatsProps) => {
  return (
    <div className="mt-4 space-y-3 animate-fade-in">
      {/* Daily Progress */}
      <div className="p-3 rounded-xl bg-foreground/5 border border-border/50">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-foreground">Today's Progress</span>
          <span className="text-xs font-semibold text-gold">{dailyCount}/{DAILY_CAP}</span>
        </div>
        <Progress value={(dailyCount / DAILY_CAP) * 100} className="h-2" />
      </div>

      {/* Unlockable Tests */}
      <div className="p-3 rounded-xl bg-foreground/5 border border-border/50 space-y-2.5">
        <span className="text-xs font-medium text-foreground">Unlock Personality Tests</span>
        {unlockableTests.map((test) => {
          const isUnlocked = totalCount >= test.threshold;
          const progress = Math.min((totalCount / test.threshold) * 100, 100);
          const remaining = Math.max(test.threshold - totalCount, 0);

          return (
            <div key={test.name} className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={isUnlocked ? 'text-gold' : 'text-muted-foreground'}>
                    {test.icon}
                  </span>
                  <span className="text-[11px] text-foreground truncate">{test.name}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {isUnlocked ? (
                    <Unlock className="w-3 h-3 text-gold" />
                  ) : (
                    <>
                      <Lock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">{remaining} more</span>
                    </>
                  )}
                </div>
              </div>
              <Progress value={progress} className="h-1.5" />
              {!isUnlocked && (
                <span className="text-[9px] text-muted-foreground/60">Coming Soon</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PollStats;
