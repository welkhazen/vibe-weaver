import { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  Users, Lock, Flame, Star, Crown, 
  Heart, Dumbbell, Brain, Music2, Sparkles,
  BookOpen, MessageCircle, Palette, Zap,
  ChevronRight, Check
} from 'lucide-react';

interface Community {
  id: string;
  name: string;
  description: string;
  members: number;
  icon: React.ElementType;
  status: 'open' | 'flames' | 'level';
  flamesCost?: number;
  levelRequired?: number;
  joined?: boolean;
  tag?: string;
}

const communities: Community[] = [
  { id: '1', name: 'Overcoming Depression', description: 'A safe space to share, support, and heal together.', members: 1243, icon: Heart, status: 'open', tag: 'Wellness', joined: true },
  { id: '2', name: 'Movement & Fitness Work!', description: 'Daily motivation, routines, and accountability partners.', members: 892, icon: Dumbbell, status: 'open', tag: 'Fitness' },
  { id: '3', name: 'What Should I Book? Opinions?', description: 'Get recommendations from people who have been there.', members: 2105, icon: MessageCircle, status: 'open', tag: 'Advice', joined: true },
  { id: '4', name: 'AI Learning Community', description: 'Explore AI tools, courses, and career paths together.', members: 1567, icon: Brain, status: 'open', tag: 'Tech' },
  { id: '5', name: 'Dance and Dance', description: 'All styles, all levels. Find your rhythm.', members: 734, icon: Music2, status: 'open', tag: 'Creative' },
  { id: '6', name: 'Mindfulness Masters', description: 'Advanced meditation techniques and spiritual growth.', members: 456, icon: Sparkles, status: 'flames', flamesCost: 25, tag: 'Premium' },
  { id: '7', name: 'Elite Coaching Circle', description: 'Exclusive insights from top-rated instructors.', members: 189, icon: Crown, status: 'level', levelRequired: 5, tag: 'Exclusive' },
  { id: '8', name: 'Creative Expression Lab', description: 'Art therapy, journaling, and creative healing.', members: 623, icon: Palette, status: 'open', tag: 'Creative' },
  { id: '9', name: 'Biohacking & Optimization', description: 'Science-backed strategies for peak performance.', members: 312, icon: Zap, status: 'flames', flamesCost: 15, tag: 'Premium' },
  { id: '10', name: 'Book Club: Self-Growth', description: 'Monthly reads on psychology, habits, and growth.', members: 548, icon: BookOpen, status: 'open', tag: 'Learning' },
  { id: '11', name: 'Inner Circle VIP', description: 'For committed members. Early access to everything.', members: 97, icon: Star, status: 'level', levelRequired: 8, tag: 'VIP' },
];

const filters = ['All', 'Joined', 'Open', 'Locked'];

const ExplorePage = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set(['1', '3']));

  const userLevel = 3; // Mock
  const userFlames = 20; // Mock

  const filtered = communities.filter((c) => {
    if (activeFilter === 'Joined') return joinedIds.has(c.id);
    if (activeFilter === 'Open') return c.status === 'open';
    if (activeFilter === 'Locked') return c.status === 'flames' || c.status === 'level';
    return true;
  });

  const handleJoin = (community: Community) => {
    if (community.status === 'flames' && (community.flamesCost || 0) > userFlames) return;
    if (community.status === 'level' && (community.levelRequired || 0) > userLevel) return;
    setJoinedIds((prev) => {
      const next = new Set(prev);
      if (next.has(community.id)) next.delete(community.id);
      else next.add(community.id);
      return next;
    });
  };

  const getStatusUI = (community: Community) => {
    const isJoined = joinedIds.has(community.id);
    if (isJoined) {
      return (
        <div className="flex items-center gap-1 text-xs text-primary font-medium">
          <Check className="w-3.5 h-3.5" />
          Joined
        </div>
      );
    }
    if (community.status === 'flames') {
      const canAfford = userFlames >= (community.flamesCost || 0);
      return (
        <div className={cn('flex items-center gap-1 text-xs font-medium', canAfford ? 'text-destructive' : 'text-muted-foreground')}>
          <Flame className="w-3.5 h-3.5" />
          {community.flamesCost}
        </div>
      );
    }
    if (community.status === 'level') {
      const meetsLevel = userLevel >= (community.levelRequired || 0);
      return (
        <div className={cn('flex items-center gap-1 text-xs font-medium', meetsLevel ? 'text-primary' : 'text-muted-foreground')}>
          <Lock className="w-3.5 h-3.5" />
          Lvl {community.levelRequired}
        </div>
      );
    }
    return (
      <div className="text-xs text-muted-foreground font-medium">Open</div>
    );
  };

  const isLocked = (community: Community) => {
    if (joinedIds.has(community.id)) return false;
    if (community.status === 'flames') return userFlames < (community.flamesCost || 0);
    if (community.status === 'level') return userLevel < (community.levelRequired || 0);
    return false;
  };

  return (
    <div className="px-4 py-4 animate-fade-in pb-24">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-foreground">Communities</h2>
        <span className="ml-auto text-xs text-muted-foreground">{communities.length} communities</span>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={cn(
              'px-4 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap',
              activeFilter === f
                ? 'bg-primary text-primary-foreground'
                : 'bg-accent text-muted-foreground hover:text-foreground'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Community List */}
      <div className="space-y-2.5">
        {filtered.map((community) => {
          const Icon = community.icon;
          const locked = isLocked(community);
          const joined = joinedIds.has(community.id);

          return (
            <button
              key={community.id}
              onClick={() => handleJoin(community)}
              disabled={locked}
              className={cn(
                'w-full metallic-card theme-glow-box p-3.5 flex items-center gap-3 transition-all duration-300 group text-left',
                locked ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/30 active:scale-[0.98]',
                joined && 'border-primary/20'
              )}
            >
              {/* Icon */}
              <div className={cn(
                'w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300',
                joined ? 'bg-primary/15' : 'bg-accent',
                !locked && 'group-hover:bg-primary/20'
              )}>
                {locked ? (
                  <Lock className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
                ) : (
                  <Icon className={cn('w-5 h-5 transition-colors', joined ? 'text-primary' : 'text-foreground group-hover:text-primary')} strokeWidth={1.5} />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground text-sm truncate">{community.name}</span>
                  {community.tag && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent text-muted-foreground shrink-0">
                      {community.tag}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{community.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-muted-foreground">{community.members.toLocaleString()} members</span>
                </div>
              </div>

              {/* Status / Action */}
              <div className="shrink-0 flex items-center gap-1">
                {getStatusUI(community)}
                {!locked && !joined && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ExplorePage;
