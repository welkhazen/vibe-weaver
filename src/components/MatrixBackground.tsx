import { useEffect, useRef } from 'react';

interface Dot {
  x: number;
  y: number;
  baseSize: number;
  currentSize: number;
  opacity: number;
}

const MatrixBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startTimeRef = useRef(Date.now());
  const dotsRef = useRef<Dot[]>([]);
  const animationCompleteRef = useRef(false);
  
  // Timing constants
  const matrixPhaseDuration = 2000; // 0-2s: matrix slowing
  const transitionDuration = 2000; // 2-4s: morph to dots
  const totalDuration = matrixPhaseDuration + transitionDuration; // 4s total
  
  // Theme refs
  const isDarkRef = useRef(
    document.documentElement.classList.contains('dark') || 
    !document.documentElement.classList.contains('light')
  );
  const themeColorRef = useRef({ h: 45, s: 90, l: 55 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Generate dot grid
    const generateDots = () => {
      const dots: Dot[] = [];
      const spacing = 45;
      const cols = Math.ceil(canvas.width / spacing) + 1;
      const rows = Math.ceil(canvas.height / spacing) + 1;
      
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          // Add slight randomization for organic feel
          const offsetX = (Math.random() - 0.5) * 10;
          const offsetY = (Math.random() - 0.5) * 10;
          
          dots.push({
            x: col * spacing + offsetX,
            y: row * spacing + offsetY,
            baseSize: 2 + Math.random() * 2, // 2-4px radius
            currentSize: 0,
            opacity: 0
          });
        }
      }
      dotsRef.current = dots;
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      generateDots();
      
      // If animation complete, redraw static dots
      if (animationCompleteRef.current) {
        drawStaticDots();
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix setup
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]|/\\';
    const charArray = chars.split('');
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);
    
    for (let i = 0; i < drops.length; i++) {
      drops[i] = Math.floor(Math.random() * (canvas.height / fontSize));
    }

    // Theme updates
    const updateThemeValues = () => {
      const root = document.documentElement;
      isDarkRef.current = root.classList.contains('dark') || !root.classList.contains('light');
      
      const h = parseInt(getComputedStyle(root).getPropertyValue('--gold-h').trim()) || 45;
      const s = parseInt(getComputedStyle(root).getPropertyValue('--gold-s').trim()) || 90;
      const l = parseInt(getComputedStyle(root).getPropertyValue('--gold-l').trim()) || 55;
      themeColorRef.current = { h, s, l };
      
      // Redraw static dots if animation complete
      if (animationCompleteRef.current) {
        drawStaticDots();
      }
    };

    updateThemeValues();
    
    const observer = new MutationObserver(updateThemeValues);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class', 'style'] 
    });

    // Color helpers
    const getMatrixColor = (opacity: number = 1) => {
      const { h, s, l } = themeColorRef.current;
      if (isDarkRef.current) {
        return `hsla(${h}, ${Math.min(s, 70)}%, ${Math.min(l + 15, 80)}%, ${opacity})`;
      }
      return `hsla(${h}, ${Math.min(s, 60)}%, ${Math.max(l - 15, 35)}%, ${opacity})`;
    };

    const getFadeColor = () => {
      if (isDarkRef.current) {
        return 'rgba(0, 0, 0, 0.05)';
      }
      return 'rgba(255, 255, 255, 0.08)';
    };

    const getChromeColors = () => {
      if (isDarkRef.current) {
        return {
          highlight: 'rgba(255, 255, 255, 0.9)',
          base: 'rgba(180, 180, 190, 0.7)',
          shadow: 'rgba(80, 80, 90, 0.5)',
          glow: 'rgba(200, 200, 210, 0.3)'
        };
      }
      return {
        highlight: 'rgba(255, 255, 255, 0.95)',
        base: 'rgba(120, 120, 130, 0.6)',
        shadow: 'rgba(60, 60, 70, 0.4)',
        glow: 'rgba(100, 100, 110, 0.2)'
      };
    };

    const updateCanvasOpacity = () => {
      canvas.style.opacity = isDarkRef.current ? '0.4' : '0.25';
    };
    updateCanvasOpacity();

    // Draw a single chrome dot
    const drawChromeDot = (x: number, y: number, size: number, opacity: number) => {
      if (size <= 0 || opacity <= 0) return;
      
      const colors = getChromeColors();
      
      // Outer glow
      const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
      glowGradient.addColorStop(0, colors.glow);
      glowGradient.addColorStop(1, 'transparent');
      ctx.globalAlpha = opacity * 0.5;
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(x, y, size * 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Main metallic sphere
      const metalGradient = ctx.createRadialGradient(
        x - size * 0.3, y - size * 0.3, 0,
        x, y, size
      );
      metalGradient.addColorStop(0, colors.highlight);
      metalGradient.addColorStop(0.4, colors.base);
      metalGradient.addColorStop(0.8, colors.shadow);
      metalGradient.addColorStop(1, 'transparent');
      
      ctx.globalAlpha = opacity;
      ctx.fillStyle = metalGradient;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.globalAlpha = 1;
    };

    // Draw static dots (final state)
    const drawStaticDots = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (const dot of dotsRef.current) {
        drawChromeDot(dot.x, dot.y, dot.baseSize, 1);
      }
    };

    // Easing functions
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    // Main animation loop
    let timeoutId: number;
    
    const loop = () => {
      const elapsed = Date.now() - startTimeRef.current;
      
      // Phase 3: Animation complete - draw static dots
      if (elapsed >= totalDuration) {
        if (!animationCompleteRef.current) {
          animationCompleteRef.current = true;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          drawStaticDots();
        }
        return;
      }
      
      updateCanvasOpacity();
      
      if (elapsed < matrixPhaseDuration) {
        // Phase 1: Matrix rain (0-2s)
        ctx.fillStyle = getFadeColor();
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const phaseProgress = elapsed / matrixPhaseDuration;
        const charOpacity = 1 - easeOutCubic(phaseProgress) * 0.3;
        
        ctx.fillStyle = getMatrixColor(charOpacity);
        ctx.font = `${fontSize}px monospace`;
        
        for (let i = 0; i < drops.length; i++) {
          const char = charArray[Math.floor(Math.random() * charArray.length)];
          ctx.fillText(char, i * fontSize, drops[i] * fontSize);
          
          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
        
        // Calculate interval (slowing down)
        const interval = 15 + easeOutCubic(phaseProgress) * 85; // 15ms -> 100ms
        timeoutId = window.setTimeout(loop, interval);
        
      } else {
        // Phase 2: Transition to dots (2-4s)
        const transitionElapsed = elapsed - matrixPhaseDuration;
        const morphProgress = easeInOutCubic(transitionElapsed / transitionDuration);
        
        // Clear with theme-appropriate background
        if (isDarkRef.current) {
          ctx.fillStyle = `rgba(0, 0, 0, ${0.1 + morphProgress * 0.9})`;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${0.1 + morphProgress * 0.9})`;
        }
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw fading matrix characters
        if (morphProgress < 0.7) {
          const charOpacity = (1 - morphProgress / 0.7) * 0.5;
          const charScale = 1 - morphProgress;
          
          ctx.fillStyle = getMatrixColor(charOpacity);
          ctx.font = `${fontSize * charScale}px monospace`;
          
          for (let i = 0; i < drops.length; i++) {
            if (Math.random() > 0.3) {
              const char = charArray[Math.floor(Math.random() * charArray.length)];
              ctx.fillText(char, i * fontSize, drops[i] * fontSize);
            }
          }
        }
        
        // Draw growing chrome dots
        for (const dot of dotsRef.current) {
          const dotOpacity = morphProgress;
          const dotSize = dot.baseSize * morphProgress;
          drawChromeDot(dot.x, dot.y, dotSize, dotOpacity);
        }
        
        // Slower updates during transition for smooth effect
        const interval = 30 + morphProgress * 20; // 30ms -> 50ms
        timeoutId = window.setTimeout(loop, interval);
      }
    };
    
    loop();

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
};

export default MatrixBackground;
