import { useEffect, useRef } from 'react';

interface StaticChar {
  x: number;
  y: number;
  char: string;
  opacity: number;
  size: number;
}

const MatrixBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startTimeRef = useRef(Date.now());
  const staticCharsRef = useRef<StaticChar[]>([]);
  const animationCompleteRef = useRef(false);
  const frameIdRef = useRef<number>(0);
  
  // Timing constants - 5 seconds total
  const matrixPhaseDuration = 2500; // 0-2.5s: matrix rain slowing
  const transitionDuration = 2500; // 2.5-5s: morph to static chars
  const totalDuration = matrixPhaseDuration + transitionDuration;
  
  // Matrix characters
  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]|/\\';
  const charArray = chars.split('');
  
  // Theme refs
  const isDarkRef = useRef(
    document.documentElement.classList.contains('dark') || 
    !document.documentElement.classList.contains('light')
  );
  const themeColorRef = useRef({ h: 45, s: 90, l: 55 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const fontSize = 14;
    
    // Generate static character grid (denser than dots)
    const generateStaticChars = () => {
      const chars: StaticChar[] = [];
      const spacingX = 20; // Denser horizontal spacing
      const spacingY = 22; // Denser vertical spacing
      const cols = Math.ceil(canvas.width / spacingX) + 1;
      const rows = Math.ceil(canvas.height / spacingY) + 1;
      
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          // Slight position variation for organic feel
          const offsetX = (Math.random() - 0.5) * 4;
          const offsetY = (Math.random() - 0.5) * 4;
          
          chars.push({
            x: col * spacingX + offsetX,
            y: row * spacingY + offsetY,
            char: charArray[Math.floor(Math.random() * charArray.length)],
            opacity: 0.3 + Math.random() * 0.5, // Varied opacity for depth
            size: fontSize * (0.7 + Math.random() * 0.4) // Varied sizes
          });
        }
      }
      staticCharsRef.current = chars;
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      generateStaticChars();
      
      if (animationCompleteRef.current) {
        drawStaticChars(1);
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix rain setup
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
      
      if (animationCompleteRef.current) {
        drawStaticChars(1);
      }
    };

    updateThemeValues();
    
    const observer = new MutationObserver(updateThemeValues);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class', 'style'] 
    });

    // Color helpers
    const getCharColor = (opacity: number = 1) => {
      const { h, s, l } = themeColorRef.current;
      if (isDarkRef.current) {
        return `hsla(${h}, ${Math.min(s, 70)}%, ${Math.min(l + 15, 80)}%, ${opacity})`;
      }
      return `hsla(${h}, ${Math.min(s, 60)}%, ${Math.max(l - 15, 35)}%, ${opacity})`;
    };

    const getStaticCharColor = (baseOpacity: number, morphProgress: number) => {
      const { h, s, l } = themeColorRef.current;
      const finalOpacity = baseOpacity * morphProgress;
      
      if (isDarkRef.current) {
        // Chrome/silver tint in dark mode
        const chromeSaturation = Math.max(s * 0.3, 10);
        const chromeLightness = 65 + (l * 0.15);
        return `hsla(${h}, ${chromeSaturation}%, ${chromeLightness}%, ${finalOpacity})`;
      }
      // Darker metallic in light mode
      const chromeSaturation = Math.max(s * 0.25, 8);
      const chromeLightness = 30 + (l * 0.1);
      return `hsla(${h}, ${chromeSaturation}%, ${chromeLightness}%, ${finalOpacity})`;
    };

    const getFadeColor = (opacity: number = 0.05) => {
      if (isDarkRef.current) {
        return `rgba(0, 0, 0, ${opacity})`;
      }
      return `rgba(255, 255, 255, ${opacity * 1.5})`;
    };

    const updateCanvasOpacity = (phase: 'matrix' | 'transition' | 'static') => {
      if (phase === 'static') {
        canvas.style.opacity = isDarkRef.current ? '0.35' : '0.2';
      } else {
        canvas.style.opacity = isDarkRef.current ? '0.4' : '0.25';
      }
    };

    // Draw static characters (final state)
    const drawStaticChars = (morphProgress: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (const charData of staticCharsRef.current) {
        const color = getStaticCharColor(charData.opacity, morphProgress);
        ctx.fillStyle = color;
        ctx.font = `${charData.size * morphProgress}px monospace`;
        ctx.fillText(charData.char, charData.x, charData.y);
      }
    };

    // Smooth easing functions
    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
    const easeInOutQuart = (t: number) => 
      t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

    // Use requestAnimationFrame for smooth animation
    let lastFrameTime = 0;
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;
    
    // Matrix rain speed control
    let matrixSpeed = 1;
    let lastMatrixUpdate = 0;
    
    const animate = (currentTime: number) => {
      const elapsed = Date.now() - startTimeRef.current;
      
      // Animation complete - draw final static state
      if (elapsed >= totalDuration) {
        if (!animationCompleteRef.current) {
          animationCompleteRef.current = true;
          updateCanvasOpacity('static');
          drawStaticChars(1);
        }
        return;
      }
      
      // Throttle to target FPS for smooth animation
      const deltaTime = currentTime - lastFrameTime;
      if (deltaTime < frameInterval) {
        frameIdRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTime = currentTime - (deltaTime % frameInterval);
      
      if (elapsed < matrixPhaseDuration) {
        // Phase 1: Matrix rain (0-2.5s) - gradually slowing
        updateCanvasOpacity('matrix');
        
        const phaseProgress = elapsed / matrixPhaseDuration;
        const slowdownFactor = easeOutQuart(phaseProgress);
        
        // Fade effect
        ctx.fillStyle = getFadeColor(0.03 + slowdownFactor * 0.05);
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Matrix speed slows down over time
        matrixSpeed = 1 - slowdownFactor * 0.85; // Slows to 15% speed
        
        // Only update matrix drops based on speed
        const matrixUpdateInterval = 16 / matrixSpeed;
        if (currentTime - lastMatrixUpdate > matrixUpdateInterval) {
          lastMatrixUpdate = currentTime;
          
          const charOpacity = 1 - slowdownFactor * 0.4;
          ctx.fillStyle = getCharColor(charOpacity);
          ctx.font = `${fontSize}px monospace`;
          
          for (let i = 0; i < drops.length; i++) {
            const char = charArray[Math.floor(Math.random() * charArray.length)];
            ctx.fillText(char, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
              drops[i] = 0;
            }
            drops[i]++;
          }
        }
        
      } else {
        // Phase 2: Transition to static characters (2.5-5s)
        updateCanvasOpacity('transition');
        
        const transitionElapsed = elapsed - matrixPhaseDuration;
        const morphProgress = easeInOutQuart(transitionElapsed / transitionDuration);
        
        // Smooth clear with crossfade
        if (isDarkRef.current) {
          ctx.fillStyle = `rgba(0, 0, 0, ${0.08 + morphProgress * 0.15})`;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${0.1 + morphProgress * 0.2})`;
        }
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Fading matrix rain (only in first half of transition)
        if (morphProgress < 0.5) {
          const fadeProgress = morphProgress / 0.5;
          const charOpacity = (1 - fadeProgress) * 0.6;
          const charScale = 1 - fadeProgress * 0.5;
          
          ctx.fillStyle = getCharColor(charOpacity);
          ctx.font = `${fontSize * charScale}px monospace`;
          
          // Reduce density as we fade
          const drawChance = 1 - fadeProgress * 0.7;
          for (let i = 0; i < drops.length; i++) {
            if (Math.random() < drawChance) {
              const char = charArray[Math.floor(Math.random() * charArray.length)];
              ctx.fillText(char, i * fontSize, drops[i] * fontSize);
            }
          }
        }
        
        // Growing static characters
        const staticProgress = morphProgress;
        for (const charData of staticCharsRef.current) {
          const color = getStaticCharColor(charData.opacity, staticProgress);
          const size = charData.size * staticProgress;
          
          if (size > 0.5) {
            ctx.fillStyle = color;
            ctx.font = `${size}px monospace`;
            ctx.fillText(charData.char, charData.x, charData.y);
          }
        }
      }
      
      frameIdRef.current = requestAnimationFrame(animate);
    };
    
    frameIdRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameIdRef.current);
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
