import { useEffect, useRef, useState } from 'react';

const MatrixBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const speedRef = useRef(15); // Start fast (lower interval = faster)
  const targetSpeedRef = useRef(50); // Final slow speed
  const startTimeRef = useRef(Date.now());
  const slowdownDuration = 8000; // 8 seconds to slow down
  const [isDark, setIsDark] = useState(() => 
    document.documentElement.classList.contains('dark') || 
    !document.documentElement.classList.contains('light')
  );

  // Watch for theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isNowDark = document.documentElement.classList.contains('dark') || 
                        !document.documentElement.classList.contains('light');
      setIsDark(isNowDark);
    });
    
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix characters
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]|/\\';
    const charArray = chars.split('');

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    
    // Array to track y position of each column
    const drops: number[] = Array(columns).fill(1);

    // Get matrix color based on theme
    const getMatrixColor = () => {
      if (isDark) {
        // Light silver for dark mode
        return 'hsl(0, 0%, 75%)';
      } else {
        // Soft gray for light mode
        return 'hsl(0, 0%, 45%)';
      }
    };

    // Get background fade color based on theme
    const getFadeColor = () => {
      if (isDark) {
        return 'rgba(0, 0, 0, 0.05)';
      } else {
        return 'rgba(255, 255, 255, 0.08)';
      }
    };

    // Calculate current speed based on elapsed time
    const getCurrentInterval = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(elapsed / slowdownDuration, 1);
      
      // Ease-out function for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      // Interpolate from fast (15ms) to slow (50ms)
      return speedRef.current + (targetSpeedRef.current - speedRef.current) * easeOut;
    };

    const draw = () => {
      // Semi-transparent fade to create trail effect
      ctx.fillStyle = getFadeColor();
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const matrixColor = getMatrixColor();
      ctx.fillStyle = matrixColor;
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = charArray[Math.floor(Math.random() * charArray.length)];
        
        // Draw the character
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        // Reset drop randomly after reaching bottom
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    // Use dynamic timing with setTimeout instead of setInterval
    let timeoutId: number;
    
    const loop = () => {
      draw();
      const currentInterval = getCurrentInterval();
      timeoutId = window.setTimeout(loop, currentInterval);
    };
    
    loop();

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ 
        background: 'transparent',
        opacity: isDark ? 0.3 : 0.2
      }}
    />
  );
};

export default MatrixBackground;
