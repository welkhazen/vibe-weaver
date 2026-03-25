import { useEffect, useRef, useState } from 'react';
import { EVENT_THEME_CHANGED } from '@/constants/theme';
import { ThemeChangedEventDetail } from '@/lib/theme';

// Matrix characters hoisted to avoid re-allocation
const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]|/\\';
const CHAR_ARRAY = CHARS.split('');

/**
 * MatrixBackground optimization:
 * 1. Hoisted static constants (CHARS, CHAR_ARRAY) to prevent redundant memory allocation.
 * 2. Switched to performance.now() for more precise animation timing.
 * 3. Pre-calculated theme-derived color strings outside the drawing loop to reduce string concatenation.
 * 4. Moved ctx.font assignment outside the drawing loop (expensive browser operation).
 * 5. Added a threshold check (0.005) for canvas.style.opacity updates to reduce layout thrashing.
 * 6. Optimized loop to ensure final state is rendered before termination.
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

    const fontSize = 14;

    // Clear canvas for fresh start
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Context properties like font are reset on resize, must re-apply
      ctx.font = `${fontSize}px monospace`;
    };
    resizeCanvas();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.opacity = '0.3';
    window.addEventListener('resize', resizeCanvas);

    const columns = Math.floor(canvas.width / fontSize);
    
    const drops: number[] = Array(columns).fill(1);
    for (let i = 0; i < drops.length; i++) {
      drops[i] = Math.floor(Math.random() * (canvas.height / fontSize));
    }

    // Pre-calculate colors outside the loop
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
    let lastAppliedOpacity = -1;
    
    // Calculate fade opacity based on elapsed time
    const calculateOpacity = () => {
      const elapsed = performance.now() - startTimeRef.current;
      
      if (elapsed < fadeStartTime) {
        // Full opacity during initial animation
        return isDarkRef.current ? 0.3 : 0.2;
      } else if (elapsed < fadeStartTime + fadeDuration) {
        // Gradually fade out from 4s to 9s
        const fadeProgress = (elapsed - fadeStartTime) / fadeDuration;
        const easeOut = 1 - Math.pow(fadeProgress, 2); // Ease-out for smooth fade
        const baseOpacity = isDarkRef.current ? 0.3 : 0.2;
        return baseOpacity * easeOut;
      } else {
        // Fully faded after 9s
        return 0;
      }
    };
    
    // Update canvas opacity with threshold check
    const updateCanvasOpacity = () => {
      const newOpacity = calculateOpacity();
      // Optimization: Only update DOM if change is significant (> 0.005) or hitting 0
      if (Math.abs(newOpacity - lastAppliedOpacity) > 0.005 || (newOpacity === 0 && lastAppliedOpacity !== 0)) {
        canvas.style.opacity = String(newOpacity);
        lastAppliedOpacity = newOpacity;
      }
      return newOpacity > 0;
    };
    updateCanvasOpacity();

    // Calculate current speed based on elapsed time
    const getCurrentInterval = () => {
      const elapsed = performance.now() - startTimeRef.current;
      const progress = Math.min(elapsed / slowdownDuration, 1);
      
      // Ease-out function for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      // Interpolate from fast (15ms) to slow (50ms)
      return speedRef.current + (targetSpeedRef.current - speedRef.current) * easeOut;
    };

    const draw = () => {
      // Semi-transparent fade to create trail effect
      ctx.fillStyle = fadeColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = matrixColor;
      // ctx.font is already set and preserved unless resize occurs

      for (let i = 0; i < drops.length; i++) {
        // Random character from hoisted array
        const char = CHAR_ARRAY[Math.floor(Math.random() * CHAR_ARRAY.length)];
        
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
    let isRunning = true;
    
    const loop = () => {
      if (!isRunning) return;
      
      // Perform draw first so we render the final frame before potential stop
      draw();

      const shouldContinue = updateCanvasOpacity();
      if (!shouldContinue) {
        // Ensure final opacity is exactly 0 and stop the loop
        canvas.style.opacity = '0';
        return;
      }
      
      const currentInterval = getCurrentInterval();
      timeoutId = window.setTimeout(loop, currentInterval);
    };
    
    // Start loop
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
