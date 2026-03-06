import { useEffect, useRef, useState } from 'react';
import { EVENT_THEME_CHANGED } from '@/constants/theme';
import { ThemeChangedEventDetail } from '@/lib/theme';

// Matrix characters - Moved outside to prevent re-creation
const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]|/\\';
const CHAR_ARRAY = CHARS.split('');
const CHAR_ARRAY_LENGTH = CHAR_ARRAY.length;

/**
 * MatrixBackground optimization:
 * 1. Moved static constants outside the component to avoid re-creation.
 * 2. Switched from setTimeout to requestAnimationFrame for smoother performance and power efficiency.
 * 3. Pre-calculated theme-dependent colors (matrixColor, fadeColor) to avoid template literal overhead in the loop.
 * 4. Implemented threshold-based opacity updates (0.005 delta) to minimize layout thrashing.
 * 5. Cached canvas context properties like ctx.font to avoid expensive re-parsing.
 * 6. Optimized animation loop by caching array lengths and reducing Date.now() / performance.now() calls.
 */
const MatrixBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animationKey, setAnimationKey] = useState(0);
  const speedRef = useRef(15);
  const targetSpeedRef = useRef(50);
  const startTimeRef = useRef(performance.now());
  const slowdownDuration = 5000;
  const fadeStartTime = 4000;
  const fadeDuration = 5000;
  
  // Track last opacity to prevent layout thrashing
  const lastOpacityRef = useRef<number>(-1);

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Reset timing for fresh animation
    startTimeRef.current = performance.now();
    speedRef.current = 15;
    lastOpacityRef.current = -1;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const fontSize = 14;
    const fontString = `${fontSize}px monospace`;

    // Pre-calculate colors based on theme accent
    const getMatrixColor = () => {
      const { h, s, l } = themeColorRef.current;
      if (isDarkRef.current) {
        return `hsl(${h}, ${Math.min(s, 70)}%, ${Math.min(l + 15, 80)}%)`;
      } else {
        return `hsl(${h}, ${Math.min(s, 60)}%, ${Math.max(l - 15, 35)}%)`;
      }
    };

    const getFadeColor = () => {
      return isDarkRef.current ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.08)';
    };

    const matrixColor = getMatrixColor();
    const fadeColor = getFadeColor();
    const baseOpacity = isDarkRef.current ? 0.3 : 0.2;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Context state is reset on resize, so we must re-apply font
      ctx.font = fontString;
    };
    
    resizeCanvas();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.opacity = String(baseOpacity);
    window.addEventListener('resize', resizeCanvas);

    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);
    for (let i = 0; i < drops.length; i++) {
      drops[i] = Math.floor(Math.random() * (canvas.height / fontSize));
    }
    const dropsLength = drops.length;

    // Calculate fade opacity based on elapsed time
    const calculateOpacity = (elapsed: number) => {
      if (elapsed < fadeStartTime) {
        return baseOpacity;
      } else if (elapsed < fadeStartTime + fadeDuration) {
        const fadeProgress = (elapsed - fadeStartTime) / fadeDuration;
        const easeOut = 1 - (fadeProgress * fadeProgress);
        return baseOpacity * easeOut;
      } else {
        return 0;
      }
    };
    
    // Update canvas opacity with threshold to reduce layout thrashing
    const updateCanvasOpacity = (elapsed: number) => {
      const newOpacity = calculateOpacity(elapsed);
      // Only update DOM if change is significant (> 0.005) or hitting 0
      if (Math.abs(newOpacity - lastOpacityRef.current) > 0.005 || (newOpacity === 0 && lastOpacityRef.current !== 0)) {
        canvas.style.opacity = String(newOpacity);
        lastOpacityRef.current = newOpacity;
      }
      return newOpacity > 0;
    };

    // Calculate current speed based on elapsed time
    const getCurrentInterval = (elapsed: number) => {
      const progress = Math.min(elapsed / slowdownDuration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      return speedRef.current + (targetSpeedRef.current - speedRef.current) * easeOut;
    };

    let animationFrameId: number;
    let lastDrawTime = 0;

    const loop = (currentTime: number) => {
      const elapsed = currentTime - startTimeRef.current;
      
      const shouldContinue = updateCanvasOpacity(elapsed);
      if (!shouldContinue) {
        // Animation finished, don't request next frame
        return;
      }

      const currentInterval = getCurrentInterval(elapsed);

      if (currentTime - lastDrawTime >= currentInterval) {
        // Semi-transparent fade to create trail effect
        ctx.fillStyle = fadeColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = matrixColor;
        // ctx.font is already set by resizeCanvas and maintained by context unless resized

        for (let i = 0; i < dropsLength; i++) {
          const char = CHAR_ARRAY[Math.floor(Math.random() * CHAR_ARRAY_LENGTH)];
          ctx.fillText(char, i * fontSize, drops[i] * fontSize);

          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
        lastDrawTime = currentTime;
      }
      
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame((t) => {
      // Initialize lastDrawTime to avoid immediate large jump
      lastDrawTime = t;
      loop(t);
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
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
