import { useEffect, useRef, useState } from 'react';
import { EVENT_THEME_CHANGED } from '@/constants/theme';
import { ThemeChangedEventDetail } from '@/lib/theme';

// Matrix characters - extracted outside for performance
const MATRIX_CHARACTERS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]|/\\';
const CHAR_ARRAY = MATRIX_CHARACTERS.split('');
const CHAR_ARRAY_LENGTH = CHAR_ARRAY.length;

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

  // Cache for colors and opacity to minimize calculations and DOM updates
  const cachedMatrixColorRef = useRef('');
  const cachedFadeColorRef = useRef('');
  const lastOpacityRef = useRef(-1);

  // Get matrix color based on theme accent - cached version
  const updateCachedColors = () => {
    const { h, s, l } = themeColorRef.current;
    if (isDarkRef.current) {
      cachedMatrixColorRef.current = `hsl(${h}, ${Math.min(s, 70)}%, ${Math.min(l + 15, 80)}%)`;
      cachedFadeColorRef.current = 'rgba(0, 0, 0, 0.05)';
    } else {
      cachedMatrixColorRef.current = `hsl(${h}, ${Math.min(s, 60)}%, ${Math.max(l - 15, 35)}%)`;
      cachedFadeColorRef.current = 'rgba(255, 255, 255, 0.08)';
    }
  };

  // Watch for theme color changes and dark/light mode toggle to restart animation
  // Optimized: Using custom event instead of MutationObserver/getComputedStyle
  useEffect(() => {
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<ThemeChangedEventDetail>;
      const { hue, saturation, lightness, isDark } = customEvent.detail;

      if (hue !== themeColorRef.current.h || isDark !== isDarkRef.current) {
        themeColorRef.current = { h: hue, s: saturation, l: lightness };
        isDarkRef.current = isDark;
        updateCachedColors();

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
    updateCachedColors();

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const fontSize = 14;
    // Set font once to avoid re-setting every frame
    ctx.font = `${fontSize}px monospace`;

    // Clear canvas for fresh start
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Re-apply font after resize as it gets reset
      ctx.font = `${fontSize}px monospace`;
    };
    resizeCanvas();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.opacity = '0.3';
    window.addEventListener('resize', resizeCanvas);

    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);
    const dropsLength = drops.length;
    for (let i = 0; i < dropsLength; i++) {
      drops[i] = Math.floor(Math.random() * (canvas.height / fontSize));
    }

    // Calculate fade opacity based on elapsed time - uses performance.now()
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
    
    // Update canvas opacity - optimized to avoid redundant DOM updates
    const updateCanvasOpacity = () => {
      const newOpacity = calculateOpacity();
      // Only update DOM if there's a measurable change
      if (Math.abs(newOpacity - lastOpacityRef.current) > 0.005) {
        canvas.style.opacity = String(newOpacity);
        lastOpacityRef.current = newOpacity;
      }
      return newOpacity > 0;
    };
    updateCanvasOpacity();

    // Calculate current speed based on elapsed time - uses performance.now()
    const getCurrentInterval = () => {
      const elapsed = performance.now() - startTimeRef.current;
      const progress = Math.min(elapsed / slowdownDuration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      return speedRef.current + (targetSpeedRef.current - speedRef.current) * easeOut;
    };

    const draw = () => {
      // Semi-transparent fade to create trail effect - uses cached color
      ctx.fillStyle = cachedFadeColorRef.current;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set matrix color from cache
      ctx.fillStyle = cachedMatrixColorRef.current;

      const currentCanvasHeight = canvas.height;

      for (let i = 0; i < dropsLength; i++) {
        // Random character from pre-split array
        const char = CHAR_ARRAY[Math.floor(Math.random() * CHAR_ARRAY_LENGTH)];
        
        // Draw the character
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        ctx.fillText(char, x, y);

        // Reset drop randomly after reaching bottom
        if (y > currentCanvasHeight && Math.random() > 0.975) {
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
      
      const shouldContinue = updateCanvasOpacity();
      if (!shouldContinue) {
        return;
      }
      
      draw();
      const currentInterval = getCurrentInterval();
      timeoutId = window.setTimeout(loop, currentInterval);
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
