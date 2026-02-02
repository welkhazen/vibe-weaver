import { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'matrix-animation-played';
const ANIMATION_DURATION = 5000; // 5 seconds

const MatrixBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasPlayed, setHasPlayed] = useState(() => 
    sessionStorage.getItem(STORAGE_KEY) === 'true'
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix characters
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]|/\\';
    const charArray = chars.split('');
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const rows = Math.floor(canvas.height / fontSize);

    // If animation already played this session, draw static grid immediately
    if (hasPlayed) {
      drawStaticGrid(ctx, canvas, charArray, fontSize, columns, rows);
      window.removeEventListener('resize', resizeCanvas);
      return;
    }

    // Animation state
    const drops: number[] = Array(columns).fill(0).map(() => 
      Math.floor(Math.random() * -20) // Start above screen
    );
    const startTime = Date.now();
    let animationId: number;
    let isStopped = false;

    const draw = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
      
      // Ease-out cubic for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      // Speed: starts fast (every frame), slows to a crawl
      const baseInterval = 30; // ms between drops at start
      const slowestInterval = 500; // ms at end
      const currentInterval = baseInterval + (slowestInterval - baseInterval) * easeOut;
      
      // Fade: starts strong, gets weaker (characters accumulate)
      const fadeOpacity = 0.08 - (0.06 * easeOut); // 0.08 -> 0.02
      
      // Clear with decreasing opacity (characters persist more)
      ctx.fillStyle = `rgba(0, 0, 0, ${fadeOpacity})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Use theme's matrix color (silver/gray from CSS variable)
      const matrixColor = getComputedStyle(document.documentElement).getPropertyValue('--matrix-color').trim() || 'hsl(0 0% 75%)';
      const brightness = 75 - (15 * easeOut); // Gets slightly dimmer
      ctx.fillStyle = `hsl(0, 0%, ${brightness}%)`;
      ctx.font = `${fontSize}px monospace`;

      // Slow down the drop rate as animation progresses
      const dropChance = 1 - (0.7 * easeOut); // 1.0 -> 0.3

      for (let i = 0; i < drops.length; i++) {
        if (Math.random() < dropChance) {
          const char = charArray[Math.floor(Math.random() * charArray.length)];
          ctx.fillText(char, i * fontSize, drops[i] * fontSize);

          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975 - (0.5 * easeOut)) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      }

      // Check if animation should stop
      if (progress >= 1 && !isStopped) {
        isStopped = true;
        sessionStorage.setItem(STORAGE_KEY, 'true');
        setHasPlayed(true);
        
        // Final: draw static grid overlay
        setTimeout(() => {
          drawStaticGrid(ctx, canvas, charArray, fontSize, columns, rows);
        }, 100);
        return;
      }

      if (!isStopped) {
        animationId = requestAnimationFrame(draw);
      }
    };

    // Start animation loop with dynamic timing
    let lastDraw = 0;
    const loop = (timestamp: number) => {
      if (isStopped) return;
      
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      const baseInterval = 16;
      const slowestInterval = 150;
      const currentInterval = baseInterval + (slowestInterval - baseInterval) * easeOut;
      
      if (timestamp - lastDraw >= currentInterval) {
        draw();
        lastDraw = timestamp;
      }
      
      if (!isStopped) {
        animationId = requestAnimationFrame(loop);
      }
    };

    animationId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [hasPlayed]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
};

// Draw a subtle static grid of characters
function drawStaticGrid(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  charArray: string[],
  fontSize: number,
  columns: number,
  rows: number
) {
  // Clear canvas first
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Very subtle silver/gray color (theme-aware)
  ctx.fillStyle = 'hsla(0, 0%, 50%, 0.08)';
  ctx.font = `${fontSize}px monospace`;

  // Draw grid of random characters
  for (let col = 0; col < columns; col++) {
    for (let row = 0; row < rows + 1; row++) {
      // Add some randomness to which cells get characters
      if (Math.random() > 0.3) {
        const char = charArray[Math.floor(Math.random() * charArray.length)];
        ctx.fillText(char, col * fontSize, row * fontSize);
      }
    }
  }
}

export default MatrixBackground;
