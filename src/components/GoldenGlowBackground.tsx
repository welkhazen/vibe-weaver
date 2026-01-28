import { useEffect, useRef, useState } from 'react';

const GoldenGlowBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [intensity, setIntensity] = useState(0.6);

  // Listen for intensity changes from CSS variable
  useEffect(() => {
    const updateIntensity = () => {
      const saved = localStorage.getItem('glow-intensity');
      if (saved) {
        setIntensity(parseFloat(saved));
      }
    };

    updateIntensity();
    
    // Listen for storage changes
    window.addEventListener('storage', updateIntensity);
    
    // Also poll for changes (for same-tab updates)
    const interval = setInterval(updateIntensity, 100);

    return () => {
      window.removeEventListener('storage', updateIntensity);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear existing orbs
    container.querySelectorAll('.golden-orb').forEach(el => el.remove());

    if (intensity <= 0) return;

    // Create floating golden orbs
    const createOrb = () => {
      const orb = document.createElement('div');
      const size = Math.random() * 200 + 100;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const duration = Math.random() * 20 + 15;
      const delay = Math.random() * 5;

      orb.className = 'golden-orb';
      orb.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}%;
        top: ${y}%;
        background: radial-gradient(circle at center, 
          hsla(45, 90%, 55%, ${0.3 * intensity}) 0%, 
          hsla(45, 85%, 50%, ${0.15 * intensity}) 30%,
          hsla(40, 80%, 45%, ${0.05 * intensity}) 60%,
          transparent 70%
        );
        border-radius: 50%;
        filter: blur(${40 * intensity}px);
        animation: floatOrb ${duration}s ease-in-out ${delay}s infinite;
        pointer-events: none;
      `;

      container.appendChild(orb);
      return orb;
    };

    // Create orbs based on intensity
    const orbCount = Math.max(1, Math.floor(5 * intensity));
    const orbs: HTMLDivElement[] = [];
    for (let i = 0; i < orbCount; i++) {
      orbs.push(createOrb());
    }

    return () => {
      orbs.forEach(orb => orb.remove());
    };
  }, [intensity]);

  if (intensity <= 0) return null;

  return (
    <>
      <style>{`
        @keyframes floatOrb {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: ${0.6 * intensity};
          }
          25% {
            transform: translate(30px, -40px) scale(1.1);
            opacity: ${0.8 * intensity};
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
            opacity: ${0.5 * intensity};
          }
          75% {
            transform: translate(40px, 30px) scale(1.05);
            opacity: ${0.7 * intensity};
          }
        }
      `}</style>
      
      <div 
        ref={containerRef}
        className="fixed inset-0 pointer-events-none z-[1] overflow-hidden"
      >
        {/* Top-left golden highlight */}
        <div 
          className="absolute"
          style={{
            width: '60vw',
            height: '50vh',
            top: '-10%',
            left: '-15%',
            background: `radial-gradient(ellipse at center,
              hsla(45, 90%, 60%, ${0.15 * intensity}) 0%,
              hsla(45, 85%, 55%, ${0.08 * intensity}) 40%,
              transparent 70%
            )`,
            filter: `blur(${60 * intensity}px)`,
            pointerEvents: 'none',
          }}
        />
        
        {/* Bottom-right golden highlight */}
        <div 
          className="absolute"
          style={{
            width: '50vw',
            height: '40vh',
            bottom: '-5%',
            right: '-10%',
            background: `radial-gradient(ellipse at center,
              hsla(45, 90%, 60%, ${0.15 * intensity}) 0%,
              hsla(45, 85%, 55%, ${0.08 * intensity}) 40%,
              transparent 70%
            )`,
            filter: `blur(${60 * intensity}px)`,
            pointerEvents: 'none',
          }}
        />
        
        {/* Center accent */}
        <div 
          className="absolute"
          style={{
            width: '40vw',
            height: '30vh',
            top: '40%',
            left: '30%',
            opacity: 0.5 * intensity,
            background: `radial-gradient(ellipse at center,
              hsla(45, 90%, 60%, ${0.15 * intensity}) 0%,
              hsla(45, 85%, 55%, ${0.08 * intensity}) 40%,
              transparent 70%
            )`,
            filter: `blur(${60 * intensity}px)`,
            pointerEvents: 'none',
          }}
        />
      </div>
    </>
  );
};

export default GoldenGlowBackground;
