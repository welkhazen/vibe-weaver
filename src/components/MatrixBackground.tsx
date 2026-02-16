import { useEffect, useRef, useState } from 'react';
import { EVENT_THEME_CHANGED } from '@/constants/theme';
import { ThemeChangedEventDetail } from '@/lib/theme';

// Matrix rain animation - restarts on theme color change
const MatrixBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animationKey, setAnimationKey] = useState(0);
  const speedRef = useRef(15);
  const targetSpeedRef = useRef(50);
  const startTimeRef = useRef(performance.now());
  const slowdownDuration = 5000;
  const fadeStartTime = 4000;
  const fadeDuration = 5000;
  
  const isDarkRef = useRef(
    document.documentElement.classList.contains('dark') || 
    !document.documentElement.classList.contains('light')
  );
  const themeColorRef = useRef({ h: 45, s: 90, l: 55 });

  // Watch for theme color changes and dark/light mode toggle to restart animation
  // Optimized: Using custom event instead of MutationObserver/getComputedStyle
  useEffect(() => {
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<ThemeChangedEventDetail>;
      const { hue, saturation, lightness, isDark } = customEvent.detail;

      if (hue !== themeColorRef.current.h || isDark !== isDarkRef.current) {
        themeColorRef.current = { h: hue, s: saturation, l: lightness };
        isDarkRef.current = isDark;

        startTimeRef.current = performance.now();
        speedRef.current = 15;
        setAnimationKey(k => k + 1);
      }
    };

    window.addEventListener(EVENT_THEME_CHANGED, handleThemeChange);
    return () => window.removeEventListener(EVENT_THEME_CHANGED, handleThemeChange);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Reset timing for fresh animation
    startTimeRef.current = performance.now();
    speedRef.current = 15;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas for fresh start
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.opacity = '0.3';
    window.addEventListener('resize', resizeCanvas);

    // Matrix characters
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]|/\\';
    const charArray = chars.split('');

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    
    const drops: number[] = Array(columns).fill(1);
    for (let i = 0; i < drops.length; i++) {
      drops[i] = Math.floor(Math.random() * (canvas.height / fontSize));
    }

    // Initial theme values are already set via refs or will be updated by the first event

    // BOLT OPTIMIZATION: Pre-calculate colors and values to avoid redundant work in the animation loop
    const { h, s, l } = themeColorRef.current;
    const isDark = isDarkRef.current;
    
    const matrixColor = isDark
      ? `hsl(${h}, ${Math.min(s, 70)}%, ${Math.min(l + 15, 80)}%)`
      : `hsl(${h}, ${Math.min(s, 60)}%, ${Math.max(l - 15, 35)}%)`;

    const fadeColor = isDark ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.08)';
    const baseOpacity = isDark ? 0.3 : 0.2;
    const charArrayLength = charArray.length;

    // Calculate fade opacity based on elapsed time
    const calculateOpacity = (now: number) => {
      const elapsed = now - startTimeRef.current;
      
      if (elapsed < fadeStartTime) {
        return baseOpacity;
      } else if (elapsed < fadeStartTime + fadeDuration) {
        const fadeProgress = (elapsed - fadeStartTime) / fadeDuration;
        const easeOut = 1 - Math.pow(fadeProgress, 2);
        return baseOpacity * easeOut;
      } else {
        return 0;
      }
    };
    
    // Update canvas opacity - BOLT: Consistently called once per frame
    const updateCanvasOpacity = (now: number) => {
      const newOpacity = calculateOpacity(now);
      canvas.style.opacity = String(newOpacity);
      return newOpacity > 0;
    };

    // Calculate current speed based on elapsed time
    const getCurrentInterval = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(elapsed / slowdownDuration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      return speedRef.current + (targetSpeedRef.current - speedRef.current) * easeOut;
    };

    const draw = () => {
      // BOLT: Use pre-calculated fade color
      ctx.fillStyle = fadeColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // BOLT: Use pre-calculated matrix color
      ctx.fillStyle = matrixColor;
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        // BOLT: Use cached charArrayLength
        const char = charArray[Math.floor(Math.random() * charArrayLength)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    // BOLT OPTIMIZATION: Use requestAnimationFrame for smoother performance and better power efficiency
    let requestId: number;
    let isRunning = true;
    let lastDrawTime = performance.now();
    
    const loop = (now: number) => {
      if (!isRunning) return;
      
      const shouldContinue = updateCanvasOpacity(now);
      if (!shouldContinue) {
        return;
      }
      
      const interval = getCurrentInterval(now);
      if (now - lastDrawTime >= interval) {
        draw();
        lastDrawTime = now;
      }

      requestId = window.requestAnimationFrame(loop);
    };
    
    requestId = window.requestAnimationFrame(loop);

    return () => {
      isRunning = false;
      window.cancelAnimationFrame(requestId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [animationKey]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{ background: 'transparent' }}
    />
  );
};

export default MatrixBackground;
