import { useEffect, useRef, useState } from 'react';
import { EVENT_THEME_CHANGED } from '@/constants/theme';
import { ThemeChangedEventDetail } from '@/lib/theme';

// Matrix characters - Moved outside to prevent redundant allocation and processing
const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]|/\\';
const CHAR_ARRAY = CHARS.split('');

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

  // Cached color values to avoid string interpolation on every frame
  const matrixColorRef = useRef('');
  const fadeColorRef = useRef('');
  const lastOpacityRef = useRef(-1);

  // Helper to update cached colors based on current theme
  const updateCachedColors = () => {
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
    updateCachedColors();
  }

  // Watch for theme color changes and dark/light mode toggle to restart animation
  // Optimized: Using custom event instead of MutationObserver/getComputedStyle
  useEffect(() => {
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<ThemeChangedEventDetail>;
      const { hue, saturation, lightness, isDark } = customEvent.detail;

      if (hue !== themeColorRef.current.h || isDark !== isDarkRef.current) {
        themeColorRef.current = { h: hue, s: saturation, l: lightness };
        isDarkRef.current = isDark;

        // Update cached colors for the new theme
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

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const fontSize = 14;

    // Clear canvas for fresh start
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Re-apply font after resize as it gets reset
      ctx.font = `${fontSize}px monospace`;
    };
    resizeCanvas();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const initialOpacity = isDarkRef.current ? 0.3 : 0.2;
    canvas.style.opacity = String(initialOpacity);
    lastOpacityRef.current = initialOpacity;

    window.addEventListener('resize', resizeCanvas);

    const columns = Math.floor(canvas.width / fontSize);
    
    const drops: number[] = Array(columns).fill(1);
    for (let i = 0; i < drops.length; i++) {
      drops[i] = Math.floor(Math.random() * (canvas.height / fontSize));
    }

    // Pre-set font for the drawing loop
    ctx.font = `${fontSize}px monospace`;

    // Calculate fade opacity based on elapsed time
    const calculateOpacity = (now: number) => {
      const elapsed = now - startTimeRef.current;
      
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
    
    // Update canvas opacity with threshold check to minimize layout thrashing
    const updateCanvasOpacity = (now: number) => {
      const newOpacity = calculateOpacity(now);
      if (Math.abs(newOpacity - lastOpacityRef.current) > 0.005) {
        canvas.style.opacity = String(newOpacity);
        lastOpacityRef.current = newOpacity;
      }
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
      // Semi-transparent fade to create trail effect - using cached color
      ctx.fillStyle = fadeColorRef.current;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Using cached matrix color
      ctx.fillStyle = matrixColorRef.current;

      // Cache array lengths for loop performance
      const dropsCount = drops.length;
      const charsCount = CHAR_ARRAY.length;

      for (let i = 0; i < dropsCount; i++) {
        // Random character from cached array
        const char = CHAR_ARRAY[Math.floor(Math.random() * charsCount)];
        
        // Draw the character
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        // Reset drop randomly after reaching bottom
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    // Use requestAnimationFrame for smoother and more efficient animation
    let animationFrameId: number;
    let lastFrameTime = performance.now();
    let isRunning = true;
    
    const loop = (now: number) => {
      if (!isRunning) return;
      
      const elapsedSinceLastFrame = now - lastFrameTime;
      const targetInterval = getCurrentInterval(now);

      // Throttle to match the desired matrix speed (dynamic 15ms-50ms)
      if (elapsedSinceLastFrame >= targetInterval) {
        lastFrameTime = now;

        const shouldContinue = updateCanvasOpacity(now);
        if (!shouldContinue) {
          isRunning = false;
          return;
        }

        draw();
      }
      
      animationFrameId = requestAnimationFrame(loop);
    };
    
    animationFrameId = requestAnimationFrame(loop);

    return () => {
      isRunning = false;
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
