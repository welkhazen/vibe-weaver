import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Sparkles, TrendingUp, Percent } from 'lucide-react';

interface LevelUpCelebrationProps {
  newLevel: number;
  cashbackPercent: number;
  onClose: () => void;
}

const LevelUpCelebration = ({ newLevel, cashbackPercent, onClose }: LevelUpCelebrationProps) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number; duration: number; color: string }>>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Generate confetti particles
    const colors = [
      'hsl(var(--primary))',
      'hsl(45, 90%, 55%)',
      'hsl(350, 80%, 60%)',
      'hsl(210, 80%, 55%)',
      'hsl(150, 70%, 45%)',
    ];
    
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setParticles(newParticles);
    
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 50);

    // Auto-close after 4 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center transition-all duration-300",
        isVisible ? "opacity-100" : "opacity-0"
      )}
      onClick={() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      
      {/* Confetti */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full animate-confetti"
            style={{
              left: `${particle.x}%`,
              top: '-10px',
              backgroundColor: particle.color,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Sparkle ring */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-64 h-64 rounded-full animate-sparkle-ring" 
          style={{
            background: 'conic-gradient(from 0deg, transparent, hsl(var(--primary) / 0.3), transparent, hsl(var(--primary) / 0.3), transparent)',
          }}
        />
      </div>

      {/* Main content */}
      <div 
        className={cn(
          "relative z-10 text-center transition-all duration-500",
          isVisible ? "scale-100 translate-y-0" : "scale-75 translate-y-8"
        )}
      >
        {/* Floating sparkles */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2">
          <Sparkles className="w-8 h-8 text-primary animate-pulse icon-glow" />
        </div>
        <div className="absolute top-0 -left-4">
          <Sparkles className="w-5 h-5 text-primary/70 animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
        <div className="absolute top-0 -right-4">
          <Sparkles className="w-5 h-5 text-primary/70 animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>

        {/* Level badge */}
        <div className="relative inline-block mb-4">
          <div className="w-28 h-28 rounded-full bg-primary flex items-center justify-center glow-primary animate-level-badge">
            <div className="text-center">
              <TrendingUp className="w-6 h-6 text-primary-foreground mx-auto mb-1" />
              <span className="text-4xl font-black text-primary-foreground">{newLevel}</span>
            </div>
          </div>
          {/* Rotating ring */}
          <div 
            className="absolute inset-0 rounded-full border-2 border-dashed border-primary/50 animate-spin-slow"
            style={{ margin: '-8px' }}
          />
        </div>

        {/* Text */}
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Level Up! 🎉
        </h2>
        <p className="text-muted-foreground mb-4">
          You've reached Level {newLevel}
        </p>

        {/* Reward card */}
        <div className="metallic-card theme-glow-box p-4 inline-block">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Percent className="w-5 h-5 text-primary icon-glow" />
            </div>
            <div className="text-left">
              <p className="text-xs text-muted-foreground">New Cashback Rate</p>
              <p className="text-xl font-bold text-primary">{cashbackPercent}%</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-4">Tap anywhere to continue</p>
      </div>
    </div>
  );
};

export default LevelUpCelebration;