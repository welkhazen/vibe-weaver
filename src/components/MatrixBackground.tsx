import { useEffect, useRef, useState } from 'react';
import { EVENT_THEME_CHANGED } from '@/constants/theme';
import { ThemeChangedEventDetail } from '@/lib/theme';

// Matrix characters - hoisted to avoid recreation on re-renders
const MATRIX_CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]|/\\';
const CHAR_ARRAY = MATRIX_CHARS.split('');

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

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    
    const drops: number[] = Array(columns).fill(1);
    for (let i = 0; i < drops.length; i++) {
      drops[i] = Math.floor(Math.random() * (canvas.height / fontSize));
    }

    // Initial theme values are already set via refs or will be updated by the first event

    // Get matrix color based on theme accent
    const getMatrixColor = () => {
      const { h, s, l } = themeColorRef.current;
      if (isDarkRef.current) {
        return `hsl(${h}, ${Math.min(s, 70)}%, ${Math.min(l + 15, 80)}%)`;
      } else {
        return `hsl(${h}, ${Math.min(s, 60)}%, ${Math.max(l - 15, 35)}%)`;
      }
    };

    // Get background fade color based on theme
    const getFadeColor = () => {
      if (isDarkRef.current) {
        return 'rgba(0, 0, 0, 0.05)';
      } else {
        return 'rgba(255, 255, 255, 0.08)';
      }
    };

    // Cache theme colors to avoid recalculation in the loop
    const themeMatrixColor = getMatrixColor();
    const themeFadeColor = getFadeColor();
    
    // Calculate fade opacity based on elapsed time
    const calculateOpacity = (currentTime: number) => {
      const elapsed = currentTime - startTimeRef.current;
      
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
    
    // Track current opacity to avoid redundant DOM updates (layout thrashing)
    let currentOpacity = isDarkRef.current ? 0.3 : 0.2;
    canvas.style.opacity = String(currentOpacity);

    // Update canvas opacity with threshold check
    const updateCanvasOpacity = (currentTime: number) => {
      const newOpacity = calculateOpacity(currentTime);

      // Only update DOM if the change is significant enough (> 0.005) or reaches 0
      if (Math.abs(newOpacity - currentOpacity) > 0.005 || (newOpacity === 0 && currentOpacity !== 0)) {
        canvas.style.opacity = String(newOpacity);
        currentOpacity = newOpacity;
      }

      return newOpacity > 0;
    };
    updateCanvasOpacity(performance.now());

    // Calculate current speed based on elapsed time
    const getCurrentInterval = (currentTime: number) => {
      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / slowdownDuration, 1);
      
      // Ease-out function for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      // Interpolate from fast (15ms) to slow (50ms)
      return speedRef.current + (targetSpeedRef.current - speedRef.current) * easeOut;
    };

    // Use requestAnimationFrame for smoother performance
    let rafId: number;
    let isRunning = true;
    let lastDrawTime = 0;

    const draw = () => {
      // Semi-transparent fade to create trail effect
      ctx.fillStyle = themeFadeColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = themeMatrixColor;
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        // Random character
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

    const loop = (currentTime: number) => {
      if (!isRunning) return;
      
      const shouldContinue = updateCanvasOpacity(currentTime);
      if (!shouldContinue) {
        // Stop the animation once fully faded
        return;
      }
      
      const interval = getCurrentInterval(currentTime);
      if (currentTime - lastDrawTime >= interval) {
        draw();
        lastDrawTime = currentTime;
      }

      rafId = window.requestAnimationFrame(loop);
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
      style={{ background: 'transparent' }}
    />
  );
};

export default MatrixBackground;
