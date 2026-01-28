import { useEffect, useRef } from 'react';

const GoldenGlowBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

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
          hsla(45, 90%, 55%, 0.3) 0%, 
          hsla(45, 85%, 50%, 0.15) 30%,
          hsla(40, 80%, 45%, 0.05) 60%,
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

    // Create multiple orbs
    const orbs: HTMLDivElement[] = [];
    for (let i = 0; i < 5; i++) {
      orbs.push(createOrb());
    }

    return () => {
      orbs.forEach(orb => orb.remove());
    };
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

        .golden-highlight {
          position: absolute;
          background: radial-gradient(ellipse at center,
            hsla(45, 90%, 60%, 0.15) 0%,
            hsla(45, 85%, 55%, 0.08) 40%,
            transparent 70%
          );
          filter: blur(60px);
          pointer-events: none;
        }
      `}</style>
      
      <div 
        ref={containerRef}
        className="fixed inset-0 pointer-events-none z-[1] overflow-hidden"
      >
        {/* Top-left golden highlight */}
        <div 
          className="golden-highlight"
          style={{
            width: '60vw',
            height: '50vh',
            top: '-10%',
            left: '-15%',
          }}
        />
        
        {/* Bottom-right golden highlight */}
        <div 
          className="golden-highlight"
          style={{
            width: '50vw',
            height: '40vh',
            bottom: '-5%',
            right: '-10%',
          }}
        />
        
        {/* Center accent */}
        <div 
          className="golden-highlight"
          style={{
            width: '40vw',
            height: '30vh',
            top: '40%',
            left: '30%',
            opacity: 0.5,
          }}
        />
      </div>
    </>
  );
};

export default GoldenGlowBackground;
