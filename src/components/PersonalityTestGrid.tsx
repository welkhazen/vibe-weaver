import { Lock, Brain, Heart, Eye, Ghost, Link2, Map } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PersonalityTest {
  name: string;
  description: string;
  threshold: number;
  icon: React.ReactNode;
}

const personalityTests: PersonalityTest[] = [
  { name: 'Myers-Briggs', description: 'Discover your personality type across 4 key dimensions of how you see the world.', threshold: 0, icon: <Brain className="w-5 h-5" /> },
  { name: 'Big Five Profile', description: 'Measure your openness, conscientiousness, extraversion, agreeableness & neuroticism.', threshold: 0, icon: <Heart className="w-5 h-5" /> },
  { name: 'Emotional Intelligence', description: 'Assess your ability to perceive, understand, and manage emotions effectively.', threshold: 0, icon: <Eye className="w-5 h-5" /> },
  { name: 'Shadow Self', description: 'Explore the hidden aspects of your psyche that influence your behavior unconsciously.', threshold: 0, icon: <Ghost className="w-5 h-5" /> },
  { name: 'Attachment Style', description: 'Understand your patterns in relationships and emotional bonding with others.', threshold: 150, icon: <Link2 className="w-5 h-5" /> },
  { name: 'Cognitive Bias Map', description: 'Identify the mental shortcuts and biases that shape your decisions and thinking.', threshold: 200, icon: <Map className="w-5 h-5" /> },
];

interface PersonalityTestGridProps {
  totalCount: number;
}

const PersonalityTestGrid = ({ totalCount }: PersonalityTestGridProps) => {
  return (
    <div className="grid grid-cols-2 gap-3 px-1 animate-fade-in">
      {personalityTests.map((test) => {
        const isUnlocked = totalCount >= test.threshold;
        const remaining = Math.max(test.threshold - totalCount, 0);

        return (
          <button
            key={test.name}
            className={cn(
              'relative p-4 rounded-2xl border text-left transition-all duration-300',
              'flex flex-col gap-2',
              isUnlocked
                ? 'border-primary/50 bg-primary/5 hover:bg-primary/10 active:scale-[0.97]'
                : 'border-border/50 bg-foreground/5 opacity-80'
            )}
          >
            {/* Lock badge - top right */}
            {!isUnlocked && (
              <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-muted/80 border border-border/50">
                <Lock className="w-2.5 h-2.5 text-muted-foreground" />
                <span className="text-[8px] text-muted-foreground font-medium">{remaining} more</span>
              </div>
            )}

            {/* Unlocked indicator */}
            {isUnlocked && (
              <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-primary/20 border border-primary/30">
                <span className="text-[8px] text-primary font-semibold">Unlocked</span>
              </div>
            )}

            {/* Icon */}
            <span className={cn(
              'transition-colors',
              isUnlocked ? 'text-primary' : 'text-muted-foreground'
            )}>
              {test.icon}
            </span>

            {/* Name */}
            <span className={cn(
              'text-xs font-semibold leading-tight',
              isUnlocked ? 'text-foreground' : 'text-foreground/70'
            )}>
              {test.name}
            </span>

            {/* Description */}
            <p className="text-[9px] text-muted-foreground leading-snug line-clamp-3">
              {test.description}
            </p>
          </button>
        );
      })}
    </div>
  );
};

export default PersonalityTestGrid;
