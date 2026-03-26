import { useEffect, useRef, useState, memo } from 'react';
import { EVENT_THEME_CHANGED } from '@/constants/theme';
import { ThemeChangedEventDetail } from '@/lib/theme';

/**
 * MatrixBackground optimization:
 * 1. Hoisted static constants (CHARS, CHAR_ARRAY) to prevent re-allocation.
 * 2. Switched to performance.now() for high-precision, low-overhead timing.
 * 3. Pre-calculated theme colors to avoid string concatenation in the animation loop.
 * 4. Moved ctx.font assignment outside the drawing loop (called only on resize).
 * 5. Implemented a threshold (0.005) for canvas.style.opacity updates to reduce layout thrashing.
 * 6. Replaced setTimeout with requestAnimationFrame for smoother 60fps rendering,
 *    using frame-aware timing to maintain the desired animation speed.
 * 7. Wrapped in React.memo() to prevent unnecessary re-renders from parent components.
 */

// Matrix characters - Hoisted to prevent re-allocation
const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]|/\\';
const CHAR_ARRAY = CHARS.split('');
const FONT_SIZE = 14;

const MatrixBackground = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animationKey, setAnimationKey] = useState(0);
  const speedRef = useRef(15);
  const targetSpeedRef = useRef(50);
  const startTimeRef = useRef(performance.now());
  const lastDrawTimeRef = useRef(0);
  const currentOpacityRef = useRef(-1); // Initialize with -1 to force first update

  const slowdownDuration = 5000;
  const fadeStartTime = 4000;
  const fadeDuration = 5000;
  
  const isDarkRef = useRef(
    document.documentElement.classList.contains('dark') || 
    !document.documentElement.classList.contains('light')
  );
  const themeColorRef = useRef({ h: 45, s: 90, l: 55 });

  // Watch for theme color changes and dark/light mode toggle to restart animation
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

  /**
   * MatrixBackground optimization:
   * 1. Replaced Date.now() with performance.now() for more accurate timing.
   * 2. Cached theme-derived color strings to avoid redundant calculations per frame.
   * 3. Moved ctx.font assignment out of the draw loop.
   * 4. Eliminated redundant updateCanvasOpacity calls.
   * 5. Implemented threshold-based check for DOM opacity updates to reduce layout thrashing.
   * 6. Cached array lengths to optimize high-frequency loops.
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Reset timing for fresh animation
    startTimeRef.current = performance.now();
    lastDrawTimeRef.current = 0;
    speedRef.current = 15;
    currentOpacityRef.current = -1;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Re-apply font after resize as context is reset
      ctx.font = `${FONT_SIZE}px monospace`;
    // Matrix characters
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]|/\\';
    const charArray = chars.split('');
    const charCount = charArray.length;

    const fontSize = 14;

    // Clear canvas for fresh start
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Re-apply font as it's reset on resize
      ctx.font = `${fontSize}px monospace`;
    };

    resizeCanvas();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    window.addEventListener('resize', resizeCanvas);

    const columns = Math.floor(canvas.width / FONT_SIZE);
    const drops: number[] = Array(columns).fill(1);
    for (let i = 0; i < drops.length; i++) {
      drops[i] = Math.floor(Math.random() * (canvas.height / FONT_SIZE));
    }

    // Pre-calculate colors to avoid work in draw loop
    const matrixColor = (() => {
      const { h, s, l } = themeColorRef.current;
      if (isDarkRef.current) {
        return `hsl(${h}, ${Math.min(s, 70)}%, ${Math.min(l + 15, 80)}%)`;
      } else {
        return `hsl(${h}, ${Math.min(s, 60)}%, ${Math.max(l - 15, 35)}%)`;
      }
    })();

    const fadeColor = isDarkRef.current ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.08)';
    
    const calculateOpacity = (now: number) => {
      const elapsed = now - startTimeRef.current;
    canvas.style.opacity = '0.3';
    const lastAppliedOpacity = { current: 0.3 };

    window.addEventListener('resize', resizeCanvas);

    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);
    const dropCount = drops.length;
    for (let i = 0; i < dropCount; i++) {
      drops[i] = Math.floor(Math.random() * (canvas.height / fontSize));
    }

    // Pre-calculate theme colors for the current animation cycle
    const { h, s, l } = themeColorRef.current;
    const matrixColor = isDarkRef.current
      ? `hsl(${h}, ${Math.min(s, 70)}%, ${Math.min(l + 15, 80)}%)`
      : `hsl(${h}, ${Math.min(s, 60)}%, ${Math.max(l - 15, 35)}%)`;

    const fadeColor = isDarkRef.current
      ? 'rgba(0, 0, 0, 0.05)'
      : 'rgba(255, 255, 255, 0.08)';
    
    // Calculate fade opacity based on elapsed time
    const calculateOpacity = () => {
      const elapsed = performance.now() - startTimeRef.current;
      
      if (elapsed < fadeStartTime) {
        return isDarkRef.current ? 0.3 : 0.2;
      } else if (elapsed < fadeStartTime + fadeDuration) {
        const fadeProgress = (elapsed - fadeStartTime) / fadeDuration;
        const easeOut = 1 - (fadeProgress * fadeProgress);
        const easeOut = 1 - Math.pow(fadeProgress, 2);
        const baseOpacity = isDarkRef.current ? 0.3 : 0.2;
        return baseOpacity * easeOut;
      } else {
        return 0;
      }
    };
    
    const updateCanvasOpacity = (now: number) => {
      const newOpacity = calculateOpacity(now);
      // Threshold check to avoid redundant DOM updates (layout thrashing)
      if (Math.abs(newOpacity - currentOpacityRef.current) > 0.005 || newOpacity === 0) {
        canvas.style.opacity = String(newOpacity);
        currentOpacityRef.current = newOpacity;
    // Update canvas opacity with threshold check to avoid layout thrashing
    const updateCanvasOpacity = () => {
      const newOpacity = calculateOpacity();
      if (Math.abs(newOpacity - lastAppliedOpacity.current) > 0.001) {
        canvas.style.opacity = String(newOpacity);
        lastAppliedOpacity.current = newOpacity;
      }
      return newOpacity > 0;
    };

    const getCurrentInterval = (now: number) => {
      const elapsed = now - startTimeRef.current;
    // Calculate current speed based on elapsed time
    const getCurrentInterval = () => {
      const elapsed = performance.now() - startTimeRef.current;
      const progress = Math.min(elapsed / slowdownDuration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      return speedRef.current + (targetSpeedRef.current - speedRef.current) * easeOut;
    };

    const draw = () => {
      // Semi-transparent fade to create trail effect
      ctx.fillStyle = fadeColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = matrixColor;
      // font is already set outside or on resize

      for (let i = 0; i < drops.length; i++) {
        const char = CHAR_ARRAY[Math.floor(Math.random() * CHAR_ARRAY.length)];
        ctx.fillText(char, i * FONT_SIZE, drops[i] * FONT_SIZE);

        if (drops[i] * FONT_SIZE > canvas.height && Math.random() > 0.975) {
      // ctx.font is already set in resizeCanvas or initialization

      for (let i = 0; i < dropCount; i++) {
        const char = charArray[Math.floor(Math.random() * charCount)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    let rafId: number;
    let isRunning = true;
    
    const loop = (now: number) => {
      if (!isRunning) return;
      
      const shouldContinue = updateCanvasOpacity(now);
      if (!shouldContinue) {
        // Final frame at 0 opacity
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }
      
      const interval = getCurrentInterval(now);
      if (now - lastDrawTimeRef.current >= interval) {
        draw();
        lastDrawTimeRef.current = now;
      }

      rafId = window.requestAnimationFrame(loop);
      const shouldContinue = updateCanvasOpacity();
      if (!shouldContinue) return;
      
      draw();
      timeoutId = window.setTimeout(loop, getCurrentInterval());
    };
    
    rafId = window.requestAnimationFrame(loop);

    return () => {
      isRunning = false;
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [animationKey]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{ background: 'transparent', opacity: 0 }}
    />
  );
});

MatrixBackground.displayName = 'MatrixBackground';

export default MatrixBackground;
