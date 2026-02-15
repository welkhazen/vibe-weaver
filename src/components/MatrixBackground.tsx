import { useEffect, useRef, memo, useMemo } from 'react';

interface MatrixBackgroundProps {
  h: number;
  s: number;
  l: number;
  isDark: boolean;
}

/**
 * MatrixBackground optimization:
 * 1. Replaced setTimeout loop with requestAnimationFrame for better performance and battery life.
 * 2. Removed MutationObserver and getComputedStyle, eliminating layout thrashing.
 * 3. Utilizes React props for theme reactivity, following the single source of truth from Index.
 * 4. Pre-calculates color strings and caches them to avoid redundant per-frame calculations.
 * 5. Optimized DOM writes by only updating canvas opacity when a significant change occurs.
 * 6. Wrapped in React.memo to prevent unnecessary re-renders.
 */
const MatrixBackground = memo(({ h, s, l, isDark }: MatrixBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const speedRef = useRef(15);
  const targetSpeedRef = useRef(50);
  const startTimeRef = useRef<number | null>(null);
  const lastOpacityRef = useRef(-1);
  const slowdownDuration = 5000;
  const fadeStartTime = 4000;
  const fadeDuration = 5000;

  // Pre-calculate colors and update only when theme changes
  const colors = useMemo(() => {
    const matrixColor = isDark
      ? `hsl(${h}, ${Math.min(s, 70)}%, ${Math.min(l + 15, 80)}%)`
      : `hsl(${h}, ${Math.min(s, 60)}%, ${Math.max(l - 15, 35)}%)`;

    const fadeColor = isDark ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.08)';

    return { matrixColor, fadeColor };
  }, [h, s, l, isDark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Reset timing for fresh animation whenever theme changes
    startTimeRef.current = null;
    speedRef.current = 15;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.opacity = isDark ? '0.3' : '0.2';
    window.addEventListener('resize', resizeCanvas);

    // Matrix characters
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]|/\\';
    const charArray = chars.split('');

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    
    const drops: number[] = Array(columns).fill(1).map(() =>
      Math.floor(Math.random() * (canvas.height / fontSize))
    );

    let animationFrameId: number;
    let lastDrawTime = 0;

    const calculateOpacity = (time: number) => {
      const elapsed = time - (startTimeRef.current || time);
      
      if (elapsed < fadeStartTime) {
        return isDark ? 0.3 : 0.2;
      } else if (elapsed < fadeStartTime + fadeDuration) {
        const fadeProgress = (elapsed - fadeStartTime) / fadeDuration;
        const easeOut = 1 - Math.pow(fadeProgress, 2);
        const baseOpacity = isDark ? 0.3 : 0.2;
        return baseOpacity * easeOut;
      } else {
        return 0;
      }
    };
    
    const updateCanvasOpacity = (time: number) => {
      const newOpacity = calculateOpacity(time);
      // Only update DOM if change is significant (> 1%)
      if (Math.abs(newOpacity - lastOpacityRef.current) > 0.01) {
        canvas.style.opacity = String(newOpacity);
        lastOpacityRef.current = newOpacity;
      }
      return newOpacity > 0;
    };

    const getCurrentInterval = (time: number) => {
      const elapsed = time - (startTimeRef.current || time);
      const progress = Math.min(elapsed / slowdownDuration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      return speedRef.current + (targetSpeedRef.current - speedRef.current) * easeOut;
    };

    const draw = () => {
      ctx.fillStyle = colors.fadeColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = colors.matrixColor;
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = charArray[Math.floor(Math.random() * charArray.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const animate = (time: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = time;
      }

      const interval = getCurrentInterval(time);
      if (time - lastDrawTime >= interval) {
        draw();
        lastDrawTime = time;
      }
      
      if (updateCanvasOpacity(time)) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [h, s, l, isDark, colors]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{ background: 'transparent' }}
    />
  );
});

MatrixBackground.displayName = 'MatrixBackground';

export default MatrixBackground;
