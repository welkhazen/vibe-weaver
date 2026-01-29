import { useState } from 'react';
import { Trophy, Coins, Target, CheckCircle2, Clock, Flame, Gift, Star, Calendar, MessageCircle, Users, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: number;
  progress: number;
  total: number;
  category: 'booking' | 'engagement' | 'streak' | 'social';
  icon: React.ReactNode;
  completed: boolean;
  expiresIn?: string;
}

const challenges: Challenge[] = [
  {
    id: '1',
    title: 'First Session',
    description: 'Book your first session with any instructor',
    reward: 50,
    progress: 0,
    total: 1,
    category: 'booking',
    icon: <Calendar className="w-5 h-5" />,
    completed: false,
  },
  {
    id: '2',
    title: 'Weekly Warrior',
    description: 'Complete 3 sessions this week',
    reward: 100,
    progress: 1,
    total: 3,
    category: 'booking',
    icon: <Target className="w-5 h-5" />,
    completed: false,
    expiresIn: '5 days',
  },
  {
    id: '3',
    title: 'Voice Your Opinion',
    description: 'Answer 5 polls in The Cumulative Mind',
    reward: 30,
    progress: 3,
    total: 5,
    category: 'engagement',
    icon: <MessageCircle className="w-5 h-5" />,
    completed: false,
  },
  {
    id: '4',
    title: '7-Day Streak',
    description: 'Open the app 7 days in a row',
    reward: 75,
    progress: 4,
    total: 7,
    category: 'streak',
    icon: <Flame className="w-5 h-5" />,
    completed: false,
  },
  {
    id: '5',
    title: 'Review Master',
    description: 'Leave a review after your session',
    reward: 25,
    progress: 1,
    total: 1,
    category: 'engagement',
    icon: <Star className="w-5 h-5" />,
    completed: true,
  },
  {
    id: '6',
    title: 'Refer a Friend',
    description: 'Invite a friend who books their first session',
    reward: 200,
    progress: 0,
    total: 1,
    category: 'social',
    icon: <Users className="w-5 h-5" />,
    completed: false,
  },
  {
    id: '7',
    title: 'Explorer',
    description: 'Try 3 different categories',
    reward: 60,
    progress: 2,
    total: 3,
    category: 'booking',
    icon: <Zap className="w-5 h-5" />,
    completed: false,
  },
];

const categoryColors = {
  booking: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
  engagement: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
  streak: 'from-orange-500/20 to-orange-600/20 border-orange-500/30',
  social: 'from-green-500/20 to-green-600/20 border-green-500/30',
};

const categoryIconColors = {
  booking: 'text-blue-400',
  engagement: 'text-purple-400',
  streak: 'text-orange-400',
  social: 'text-green-400',
};

const ChallengesPage = () => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const userTokens = 275;
  const currentStreak = 4;

  const filteredChallenges = challenges.filter((c) => {
    if (filter === 'active') return !c.completed;
    if (filter === 'completed') return c.completed;
    return true;
  });

  const handleClaimReward = (challenge: Challenge) => {
    if (challenge.completed) {
      toast.success(`🎉 Claimed ${challenge.reward} tokens!`);
    }
  };

  return (
    <div className="animate-fade-in pb-24">
      {/* Header Stats */}
      <div className="px-4 py-4">
        <div className="metallic-card p-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Your Balance</p>
              <div className="flex items-center gap-2 mt-1">
                <Coins className="w-6 h-6 text-yellow-400" />
                <span className="text-3xl font-bold text-foreground">{userTokens}</span>
                <span className="text-sm text-muted-foreground">tokens</span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end">
                <Flame className="w-5 h-5 text-orange-400" />
                <span className="text-xl font-bold text-foreground">{currentStreak}</span>
              </div>
              <p className="text-xs text-muted-foreground">day streak</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-3">
          <button className="metallic-card p-3 flex items-center gap-3 transition-all duration-300 hover:border-primary/30 active:scale-[0.98]">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Gift className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">Redeem</p>
              <p className="text-xs text-muted-foreground">Use tokens</p>
            </div>
          </button>
          <button className="metallic-card p-3 flex items-center gap-3 transition-all duration-300 hover:border-primary/30 active:scale-[0.98]">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">Leaderboard</p>
              <p className="text-xs text-muted-foreground">Top earners</p>
            </div>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 pb-4">
        <div className="flex gap-2">
          {(['all', 'active', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
                filter === tab
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-accent text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Challenges List */}
      <div className="px-4 space-y-3">
        <h3 className="font-semibold text-foreground">
          {filter === 'all' ? 'All Challenges' : filter === 'active' ? 'Active Challenges' : 'Completed'}
        </h3>

        {filteredChallenges.map((challenge) => (
          <div
            key={challenge.id}
            className={cn(
              'metallic-card p-4 relative overflow-hidden transition-all duration-300',
              challenge.completed && 'opacity-75'
            )}
          >
            {/* Background gradient based on category */}
            <div
              className={cn(
                'absolute inset-0 bg-gradient-to-r opacity-50',
                categoryColors[challenge.category]
              )}
            />

            <div className="relative z-10">
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div
                  className={cn(
                    'w-10 h-10 rounded-xl bg-background/50 flex items-center justify-center',
                    categoryIconColors[challenge.category]
                  )}
                >
                  {challenge.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-foreground flex items-center gap-2">
                        {challenge.title}
                        {challenge.completed && (
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                        )}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {challenge.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded-full shrink-0">
                      <Coins className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs font-semibold text-yellow-400">
                        +{challenge.reward}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">
                        {challenge.progress}/{challenge.total}
                      </span>
                      {challenge.expiresIn && (
                        <span className="flex items-center gap-1 text-orange-400">
                          <Clock className="w-3 h-3" />
                          {challenge.expiresIn}
                        </span>
                      )}
                    </div>
                    <div className="h-2 bg-background/50 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-500',
                          challenge.completed ? 'bg-green-500' : 'bg-primary'
                        )}
                        style={{
                          width: `${(challenge.progress / challenge.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Claim button for completed */}
                  {challenge.completed && (
                    <button
                      onClick={() => handleClaimReward(challenge)}
                      className="mt-3 w-full py-2 rounded-lg bg-green-500/20 text-green-400 text-sm font-medium transition-all duration-300 hover:bg-green-500/30 active:scale-[0.98]"
                    >
                      Claim Reward
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredChallenges.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No challenges found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengesPage;
