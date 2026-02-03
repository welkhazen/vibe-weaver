import { useEffect, useState } from 'react';

const PerforatedBackground = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Start transition after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[2] transition-opacity duration-[3000ms] ease-in-out"
      style={{
        opacity: isVisible ? 1 : 0,
        background: `
          /* Center dark vignette */
          radial-gradient(ellipse 80% 80% at 50% 50%, transparent 20%, hsl(0 0% 3% / 0.4) 80%),
          /* Perforated dot pattern - small */
          radial-gradient(circle at center, hsl(0 0% 15%) 1px, transparent 1px),
          /* Perforated dot pattern - larger, more visible */
          radial-gradient(circle at center, hsl(0 0% 5%) 2.5px, transparent 2.5px),
          /* Base gunmetal gradient */
          linear-gradient(145deg, hsl(220 10% 8%) 0%, hsl(220 10% 4%) 50%, hsl(220 10% 6%) 100%)
        `,
        backgroundSize: '100% 100%, 8px 8px, 12px 12px, 100% 100%',
        backgroundAttachment: 'fixed',
      }}
    />
  );
};

export default PerforatedBackground;
