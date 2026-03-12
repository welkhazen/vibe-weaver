import { useEffect, useRef, useState } from 'react';
import { EVENT_THEME_CHANGED } from '@/constants/theme';
import { ThemeChangedEventDetail } from '@/lib/theme';

/**
 * MatrixBackground optimized for performance:
 * 1. Moved static constants (characters) outside the component to reduce allocation churn.
 * 2. Cached theme-derived color strings in refs to avoid redundant HSL/RGBA string generation in the draw loop.
 * 3. Used performance.now() for high-resolution timing.
 * 4. Moved ctx.font assignment out of the high-frequency draw loop (font is only set once per animation/resize).
 * 5. Implemented threshold-based updates for canvas.style.opacity to reduce layout thrashing.
 * 6. Removed redundant double-calls to updateCanvasOpacity per frame.
 */

const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]|/\\';
const CHAR_ARRAY = CHARS.split('');
const FONT_SIZE = 14;

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

  // Cache derived colors and opacity to avoid redundant calculations/DOM updates
  const matrixColorRef = useRef('');
  const fadeColorRef = useRef('');
  const lastCanvasOpacityRef = useRef(-1);

  const updateDerivedThemeColors = () => {
    const { h, s, l } = themeColorRef.current;
    if (isDarkRef.current) {
      matrixColorRef.current = `hsl(${h}, ${Math.min(s, 70)}%, ${Math.min(l + 15, 80)}%)`;
      fadeColorRef.current = 'rgba(0, 0, 0, 0.05)';
    } else {
      matrixColorRef.current = `hsl(${h}, ${Math.min(s, 60)}%, ${Math.max(l - 15, 35)}%)`;
      fadeColorRef.current = 'rgba(255, 255, 255, 0.08)';
    }
  };

  // Initial color setup
  if (!matrixColorRef.current) {
    updateDerivedThemeColors();
  }

  // Watch for theme color changes and dark/light mode toggle to restart animation
  useEffect(() => {
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<ThemeChangedEventDetail>;
      const { hue, saturation, lightness, isDark } = customEvent.detail;

      if (hue !== themeColorRef.current.h || isDark !== isDarkRef.current) {
        themeColorRef.current = { h: hue, s: saturation, l: lightness };
        isDarkRef.current = isDark;
        updateDerivedThemeColors();

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
      // Re-apply font as context properties are reset on canvas resize
      ctx.font = `${FONT_SIZE}px monospace`;
    };

    resizeCanvas();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Initial opacity
    const initialOpacity = isDarkRef.current ? 0.3 : 0.2;
    canvas.style.opacity = String(initialOpacity);
    lastCanvasOpacityRef.current = initialOpacity;

    window.addEventListener('resize', resizeCanvas);

    const columns = Math.floor(canvas.width / FONT_SIZE);
    const drops: number[] = Array(columns).fill(1);
    for (let i = 0; i < drops.length; i++) {
      drops[i] = Math.floor(Math.random() * (canvas.height / FONT_SIZE));
    }
    
    // Calculate fade opacity based on elapsed time
    const calculateOpacity = () => {
      const elapsed = performance.now() - startTimeRef.current;
      
      if (elapsed < fadeStartTime) {
        return isDarkRef.current ? 0.3 : 0.2;
      } else if (elapsed < fadeStartTime + fadeDuration) {
        const fadeProgress = (elapsed - fadeStartTime) / fadeDuration;
        const easeOut = 1 - Math.pow(fadeProgress, 2);
        const baseOpacity = isDarkRef.current ? 0.3 : 0.2;
        return baseOpacity * easeOut;
      } else {
        return 0;
      }
    };
    
    // Update canvas opacity with threshold to prevent layout thrashing
    const updateCanvasOpacity = () => {
      const newOpacity = calculateOpacity();

      // Only update DOM if change is significant (> 0.005)
      if (Math.abs(newOpacity - lastCanvasOpacityRef.current) > 0.005) {
        canvas.style.opacity = String(newOpacity);
        lastCanvasOpacityRef.current = newOpacity;
      }

      return newOpacity > 0;
    };

    // Calculate current speed based on elapsed time
    const getCurrentInterval = () => {
      const elapsed = performance.now() - startTimeRef.current;
      const progress = Math.min(elapsed / slowdownDuration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      return speedRef.current + (targetSpeedRef.current - speedRef.current) * easeOut;
    };

    const draw = () => {
      // Semi-transparent fade to create trail effect
      ctx.fillStyle = fadeColorRef.current;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = matrixColorRef.current;

      for (let i = 0; i < drops.length; i++) {
        // Random character from pre-split array
        const char = CHAR_ARRAY[Math.floor(Math.random() * CHAR_ARRAY.length)];
        
        // Draw the character
        ctx.fillText(char, i * FONT_SIZE, drops[i] * FONT_SIZE);

        // Reset drop randomly after reaching bottom
        if (drops[i] * FONT_SIZE > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    let timeoutId: number;
    let isRunning = true;
    
    const loop = () => {
      if (!isRunning) return;
      
      const shouldContinue = updateCanvasOpacity();
      if (!shouldContinue) {
        // Animation complete
        return;
      }
      
      draw();
      timeoutId = window.setTimeout(loop, getCurrentInterval());
    };
    
    loop();

    return () => {
      isRunning = false;
      clearTimeout(timeoutId);
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
