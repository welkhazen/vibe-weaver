import { useEffect, useRef, useState } from 'react';

const GoldenGlowBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [themeHue, setThemeHue] = useState(45);
  const [themeSaturation, setThemeSaturation] = useState(90);
  const [themeLightness, setThemeLightness] = useState(55);

  // Listen for theme color changes
  useEffect(() => {
    const updateThemeColor = () => {
      const root = document.documentElement;
      const h = getComputedStyle(root).getPropertyValue('--gold-h').trim();
      const s = getComputedStyle(root).getPropertyValue('--gold-s').trim();
      const l = getComputedStyle(root).getPropertyValue('--gold-l').trim();
      
      if (h) setThemeHue(parseInt(h) || 45);
      if (s) setThemeSaturation(parseInt(s) || 90);
      if (l) setThemeLightness(parseInt(l) || 55);
    };

    // Initial read
    updateThemeColor();

    // Create a MutationObserver to watch for style changes on root
    const observer = new MutationObserver(() => {
      updateThemeColor();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style']
    });

    // Also listen for storage changes (when color is saved)
    const handleStorage = () => updateThemeColor();
    window.addEventListener('storage', handleStorage);

    // Poll for changes as a fallback (for same-tab updates)
    const pollInterval = setInterval(updateThemeColor, 100);

    return () => {
      observer.disconnect();
      window.removeEventListener('storage', handleStorage);
      clearInterval(pollInterval);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear existing orbs
    const existingOrbs = container.querySelectorAll('.golden-orb');
    existingOrbs.forEach(orb => orb.remove());

    // Create floating orbs with current theme color
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
          hsla(${themeHue}, ${themeSaturation}%, ${themeLightness}%, 0.3) 0%, 
          hsla(${themeHue}, ${themeSaturation - 5}%, ${themeLightness - 5}%, 0.15) 30%,
          hsla(${themeHue - 5}, ${themeSaturation - 10}%, ${themeLightness - 10}%, 0.05) 60%,
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
  }, [themeHue, themeSaturation, themeLightness]);

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
              hsla(${themeHue}, ${themeSaturation}%, ${themeLightness + 5}%, 0.15) 0%,
              hsla(${themeHue}, ${themeSaturation - 5}%, ${themeLightness}%, 0.08) 40%,
              transparent 70%
            )`,
            filter: 'blur(60px)',
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
              hsla(${themeHue}, ${themeSaturation}%, ${themeLightness + 5}%, 0.15) 0%,
              hsla(${themeHue}, ${themeSaturation - 5}%, ${themeLightness}%, 0.08) 40%,
              transparent 70%
            )`,
            filter: 'blur(60px)',
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
            opacity: 0.5,
            background: `radial-gradient(ellipse at center,
              hsla(${themeHue}, ${themeSaturation}%, ${themeLightness + 5}%, 0.15) 0%,
              hsla(${themeHue}, ${themeSaturation - 5}%, ${themeLightness}%, 0.08) 40%,
              transparent 70%
            )`,
            filter: 'blur(60px)',
          }}
        />
      </div>
    </>
  );
};

export default GoldenGlowBackground;
