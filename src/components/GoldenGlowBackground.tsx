import { useMemo } from 'react';

/**
 * GoldenGlowBackground optimization:
 * 1. Removed expensive setInterval polling (100ms) that was checking for theme changes.
 * 2. Removed MutationObserver and getComputedStyle calls which were causing layout thrashing.
 * 3. Replaced manual DOM manipulation (clear/re-create orbs) with stable React components.
 * 4. Utilized CSS variables and calc() to handle theme updates natively in the browser.
 * 5. Memoized orb properties to prevent unnecessary calculations on re-renders.
 */
const GoldenGlowBackground = () => {
  // Memoize orb properties so they only change on mount
  const orbs = useMemo(() => {
    return Array.from({ length: 5 }).map((_, i) => ({
      id: i,
      size: Math.random() * 200 + 100,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <>
      <style>{`
        @keyframes floatOrb {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.6;
          }
          25% {
            transform: translate(30px, -40px) scale(1.1);
            opacity: 0.8;
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
            opacity: 0.5;
          }
          75% {
            transform: translate(40px, 30px) scale(1.05);
            opacity: 0.7;
          }
        }
        
        @keyframes shimmerPulse {
          0%, 100% {
            opacity: 0.4;
            filter: blur(60px) brightness(1);
          }
          50% {
            opacity: 0.7;
            filter: blur(55px) brightness(1.2);
          }
        }
      `}</style>
      
      <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
        {/* Top-left highlight */}
        <div 
          className="absolute pointer-events-none"
          style={{
            width: '60vw',
            height: '50vh',
            top: '-10%',
            left: '-15%',
            background: `radial-gradient(ellipse at center,
              hsla(var(--gold-h, 45), calc(var(--gold-s, 90) * 1%), calc(var(--gold-l, 55) * 1% + 5%), 0.15) 0%,
              hsla(var(--gold-h, 45), calc(var(--gold-s, 90) * 1% - 5%), calc(var(--gold-l, 55) * 1%), 0.08) 40%,
              transparent 70%
            )`,
            animation: 'shimmerPulse 4s ease-in-out infinite',
          }}
        />
        
        {/* Bottom-right highlight */}
        <div 
          className="absolute pointer-events-none"
          style={{
            width: '50vw',
            height: '40vh',
            bottom: '-5%',
            right: '-10%',
            background: `radial-gradient(ellipse at center,
              hsla(var(--gold-h, 45), calc(var(--gold-s, 90) * 1%), calc(var(--gold-l, 55) * 1% + 5%), 0.15) 0%,
              hsla(var(--gold-h, 45), calc(var(--gold-s, 90) * 1% - 5%), calc(var(--gold-l, 55) * 1%), 0.08) 40%,
              transparent 70%
            )`,
            animation: 'shimmerPulse 5s ease-in-out 1s infinite',
          }}
        />
        
        {/* Center accent */}
        <div 
          className="absolute pointer-events-none"
          style={{
            width: '40vw',
            height: '30vh',
            top: '40%',
            left: '30%',
            background: `radial-gradient(ellipse at center,
              hsla(var(--gold-h, 45), calc(var(--gold-s, 90) * 1%), calc(var(--gold-l, 55) * 1% + 5%), 0.15) 0%,
              hsla(var(--gold-h, 45), calc(var(--gold-s, 90) * 1% - 5%), calc(var(--gold-l, 55) * 1%), 0.08) 40%,
              transparent 70%
            )`,
            animation: 'shimmerPulse 6s ease-in-out 2s infinite',
          }}
        />

        {/* Floating Orbs */}
        {orbs.map(orb => (
          <div
            key={orb.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: `${orb.size}px`,
              height: `${orb.size}px`,
              left: `${orb.x}%`,
              top: `${orb.y}%`,
              background: `radial-gradient(circle at center,
                hsla(var(--gold-h, 45), calc(var(--gold-s, 90) * 1%), calc(var(--gold-l, 55) * 1%), 0.3) 0%,
                hsla(var(--gold-h, 45), calc(var(--gold-s, 90) * 1% - 5%), calc(var(--gold-l, 55) * 1% - 5%), 0.15) 30%,
                hsla(calc(var(--gold-h, 45) - 5), calc(var(--gold-s, 90) * 1% - 10%), calc(var(--gold-l, 55) * 1% - 10%), 0.05) 60%,
                transparent 70%
              )`,
              filter: 'blur(40px)',
              animation: `floatOrb ${orb.duration}s ease-in-out ${orb.delay}s infinite`,
            }}
          />
        ))}
      </div>
    </>
  );
};

export default GoldenGlowBackground;
