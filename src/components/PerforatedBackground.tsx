import { useEffect, useState } from 'react';

const PerforatedBackground = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const checkTheme = () => {
      const isLight = document.documentElement.classList.contains('light');
      setIsDark(!isLight);
    };

    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  const darkBackground = `
    /* Center dark vignette */
    radial-gradient(ellipse 80% 80% at 50% 50%, transparent 20%, hsl(0 0% 3% / 0.4) 80%),
    /* Perforated dot pattern - small */
    radial-gradient(circle at center, hsl(0 0% 15%) 1px, transparent 1px),
    /* Perforated dot pattern - larger, more visible */
    radial-gradient(circle at center, hsl(0 0% 5%) 2.5px, transparent 2.5px),
    /* Base gunmetal gradient */
    linear-gradient(145deg, hsl(220 10% 8%) 0%, hsl(220 10% 4%) 50%, hsl(220 10% 6%) 100%)
  `;

  const lightBackground = `
    /* Center subtle vignette */
    radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, hsl(40 20% 90% / 0.5) 90%),
    /* Perforated dot pattern - small */
    radial-gradient(circle at center, hsl(40 15% 85%) 1px, transparent 1px),
    /* Perforated dot pattern - larger */
    radial-gradient(circle at center, hsl(40 15% 88%) 2.5px, transparent 2.5px),
    /* Base creamy gradient */
    linear-gradient(145deg, hsl(40 25% 97%) 0%, hsl(40 20% 94%) 50%, hsl(40 22% 96%) 100%)
  `;

  return (
    <>
      <style>{`
        @keyframes dotDrift {
          0%, 100% {
            background-position: 
              0% 0%,
              0px 0px,
              0px 0px,
              0% 0%;
          }
          25% {
            background-position: 
              0% 0%,
              2px 1px,
              -1px 2px,
              0% 0%;
          }
          50% {
            background-position: 
              0% 0%,
              0px 2px,
              2px 0px,
              0% 0%;
          }
          75% {
            background-position: 
              0% 0%,
              -1px 1px,
              1px -1px,
              0% 0%;
          }
        }
        
        @keyframes dotPulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.85;
          }
        }
      `}</style>
      <div
        className="fixed inset-0 pointer-events-none z-[0] transition-all duration-500"
        style={{
          background: isDark ? darkBackground : lightBackground,
          backgroundSize: '100% 100%, 8px 8px, 12px 12px, 100% 100%',
          backgroundAttachment: 'fixed',
          animation: 'dotDrift 20s ease-in-out infinite, dotPulse 8s ease-in-out infinite',
        }}
      />
    </>
  );
};

export default PerforatedBackground;
