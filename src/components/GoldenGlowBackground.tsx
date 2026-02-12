import { useEffect, useRef } from 'react';

/**
 * GoldenGlowBackground - Performance optimized theme-aware background.
 *
 * OPTIMIZATION:
 * Replaced a 100ms JS polling interval and MutationObserver with native CSS variables.
 * Previously, every 100ms or theme change triggered a React state update and DOM churn.
 * Now, the component renders once on mount, and reactivity is handled by the CSS engine.
 *
 * IMPACT:
 * - Reduces main thread work by eliminating periodic JS execution.
 * - Prevents layout thrashing and unnecessary re-renders of the background.
 * - Improves battery life and responsiveness on low-end devices.
 */
const GoldenGlowBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear existing orbs
    const existingOrbs = container.querySelectorAll('.golden-orb');
    existingOrbs.forEach(orb => orb.remove());

    // Create floating orbs with CSS variables for automatic theme reactivity
    const createOrb = () => {
      const orb = document.createElement('div');
      const size = Math.random() * 200 + 100;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const duration = Math.random() * 20 + 15;
      const delay = Math.random() * 5;

      orb.className = 'golden-orb';
      // Use CSS variables directly to avoid JS polling and re-renders on theme change
      orb.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}%;
        top: ${y}%;
        background: radial-gradient(circle at center, 
          hsla(var(--gold-h, 45), var(--gold-s, 90%), var(--gold-l, 55%), 0.3) 0%,
          hsla(var(--gold-h, 45), var(--gold-s, 90%), var(--gold-l, 55%), 0.15) 30%,
          hsla(var(--gold-h, 45), var(--gold-s, 90%), var(--gold-l, 55%), 0.05) 60%,
          transparent 70%
        );
        border-radius: 50%;
        filter: blur(40px);
        animation: floatOrb ${duration}s ease-in-out ${delay}s infinite;
        pointer-events: none;
      `;

      container.appendChild(orb);
      return orb;
    };

    // Create multiple orbs once on mount
    const orbs: HTMLDivElement[] = [];
    for (let i = 0; i < 5; i++) {
      orbs.push(createOrb());
    }

    return () => {
      orbs.forEach(orb => orb.remove());
    };
  }, []); // Run only once on mount

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
      
      <div 
        ref={containerRef}
        className="fixed inset-0 pointer-events-none z-[1] overflow-hidden"
      >
        {/* Top-left highlight */}
        <div 
          className="absolute pointer-events-none"
          style={{
            width: '60vw',
            height: '50vh',
            top: '-10%',
            left: '-15%',
            background: `radial-gradient(ellipse at center,
              hsla(var(--gold-h, 45), var(--gold-s, 90%), calc(var(--gold-l, 55%) + 5%), 0.15) 0%,
              hsla(var(--gold-h, 45), var(--gold-s, 90%), var(--gold-l, 55%), 0.08) 40%,
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
              hsla(var(--gold-h, 45), var(--gold-s, 90%), calc(var(--gold-l, 55%) + 5%), 0.15) 0%,
              hsla(var(--gold-h, 45), var(--gold-s, 90%), var(--gold-l, 55%), 0.08) 40%,
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
              hsla(var(--gold-h, 45), var(--gold-s, 90%), calc(var(--gold-l, 55%) + 5%), 0.15) 0%,
              hsla(var(--gold-h, 45), var(--gold-s, 90%), var(--gold-l, 55%), 0.08) 40%,
              transparent 70%
            )`,
            animation: 'shimmerPulse 6s ease-in-out 2s infinite',
          }}
        />
      </div>
    </>
  );
};

export default GoldenGlowBackground;
