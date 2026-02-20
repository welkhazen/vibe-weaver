import { useEffect, useRef, useCallback } from 'react';
import { EVENT_THEME_CHANGED } from '@/constants/theme';
import { ThemeChangedEventDetail } from '@/lib/theme';

// Matrix rain animation - restarts on theme color change
const SLOWDOWN_DURATION = 5000;
const FADE_START_TIME = 4000;
const FADE_DURATION = 5000;
const FONT_SIZE = 14;
const INITIAL_SPEED = 15;
const TARGET_SPEED = 50;

// Matrix characters - pre-calculate array once
const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]|/\\';
const CHAR_ARRAY = CHARS.split('');
const CHAR_ARRAY_LENGTH = CHAR_ARRAY.length;

const MatrixBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startTimeRef = useRef(performance.now());
  const isLoopingRef = useRef(false);
  const animationFrameIdRef = useRef<number>();
  
  const isDarkRef = useRef(
    document.documentElement.classList.contains('dark') || 
    !document.documentElement.classList.contains('light')
  );
  const themeColorRef = useRef({ h: 45, s: 90, l: 55 });
  const matrixColorRef = useRef('');
  const fadeColorRef = useRef('');

  // Helper to get matrix color based on theme accent
  const getMatrixColor = useCallback(() => {
    const { h, s, l } = themeColorRef.current;
    if (isDarkRef.current) {
      return `hsl(${h}, ${Math.min(s, 70)}%, ${Math.min(l + 15, 80)}%)`;
    } else {
      return `hsl(${h}, ${Math.min(s, 60)}%, ${Math.max(l - 15, 35)}%)`;
    }
  }, []);

  // Helper to get background fade color based on theme
  const getFadeColor = useCallback(() => {
    if (isDarkRef.current) {
      return 'rgba(0, 0, 0, 0.05)';
    } else {
      return 'rgba(255, 255, 255, 0.08)';
    }
  }, []);

  // Animation logic moved to a stable function that uses refs
  const startAnimation = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.font = `${FONT_SIZE}px monospace`;

    // Reset drops array if needed or use existing
    const columns = Math.floor(canvas.width / FONT_SIZE);
    const drops: number[] = Array(columns).fill(1);
    for (let i = 0; i < drops.length; i++) {
      drops[i] = Math.floor(Math.random() * (canvas.height / FONT_SIZE));
    }

    let lastDrawTime = performance.now();

    const loop = (currentTime: number) => {
      if (!isLoopingRef.current) return;

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / SLOWDOWN_DURATION, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentInterval = INITIAL_SPEED + (TARGET_SPEED - INITIAL_SPEED) * easeOut;

      const deltaTime = currentTime - lastDrawTime;

      if (deltaTime >= currentInterval) {
        // Calculate and update opacity
        let opacity = 0;
        if (elapsed < FADE_START_TIME) {
          opacity = isDarkRef.current ? 0.3 : 0.2;
        } else if (elapsed < FADE_START_TIME + FADE_DURATION) {
          const fadeProgress = (elapsed - FADE_START_TIME) / FADE_DURATION;
          const fadeEaseOut = 1 - Math.pow(fadeProgress, 2);
          const baseOpacity = isDarkRef.current ? 0.3 : 0.2;
          opacity = baseOpacity * fadeEaseOut;
        }

        canvas.style.opacity = String(opacity);

        if (opacity <= 0) {
          isLoopingRef.current = false;
          return;
        }

        // Draw frame
        ctx.fillStyle = fadeColorRef.current;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = matrixColorRef.current;

        const canvasHeight = canvas.height;
        for (let i = 0; i < drops.length; i++) {
          const char = CHAR_ARRAY[Math.floor(Math.random() * CHAR_ARRAY_LENGTH)];
          const y = drops[i] * FONT_SIZE;
          ctx.fillText(char, i * FONT_SIZE, y);

          if (y > canvasHeight && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }

        lastDrawTime = currentTime;
      }

      animationFrameIdRef.current = requestAnimationFrame(loop);
    };

    if (isLoopingRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current!);
    }
    isLoopingRef.current = true;
    animationFrameIdRef.current = requestAnimationFrame(loop);
  }, []);

  // Watch for theme color changes and dark/light mode toggle to restart animation
  useEffect(() => {
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<ThemeChangedEventDetail>;
      const { hue, saturation, lightness, isDark } = customEvent.detail;

      if (hue !== themeColorRef.current.h || isDark !== isDarkRef.current) {
        themeColorRef.current = { h: hue, s: saturation, l: lightness };
        isDarkRef.current = isDark;

        // Update cached colors
        matrixColorRef.current = getMatrixColor();
        fadeColorRef.current = getFadeColor();

        startTimeRef.current = performance.now();

        // Restart animation
        startAnimation();
      }
    };

    window.addEventListener(EVENT_THEME_CHANGED, handleThemeChange);
    return () => window.removeEventListener(EVENT_THEME_CHANGED, handleThemeChange);
  }, [startAnimation]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize cached colors on mount
    matrixColorRef.current = getMatrixColor();
    fadeColorRef.current = getFadeColor();

    // Reset timing for fresh animation
    startTimeRef.current = performance.now();

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas for fresh start
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Restart animation on resize to adjust columns
      startAnimation();
    };
    resizeCanvas();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.opacity = '0.3';
    window.addEventListener('resize', resizeCanvas);

    startAnimation();

    return () => {
      isLoopingRef.current = false;
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [startAnimation]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{ background: 'transparent' }}
    />
  );
};

export default MatrixBackground;
