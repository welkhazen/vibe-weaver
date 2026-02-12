import { useEffect, useRef, useState } from 'react';

// Matrix rain animation - restarts on theme color change
const MatrixBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animationKey, setAnimationKey] = useState(0);
  const speedRef = useRef(15);
  const targetSpeedRef = useRef(50);
  const startTimeRef = useRef(Date.now());
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
    let prevDark = isDarkRef.current;
    const observer = new MutationObserver(() => {
      const root = document.documentElement;
      const h = parseInt(getComputedStyle(root).getPropertyValue('--gold-h').trim()) || 45;
      const prevH = themeColorRef.current.h;
      const nowDark = root.classList.contains('dark') || !root.classList.contains('light');
      if (h !== prevH || nowDark !== prevDark) {
        prevDark = nowDark;
        startTimeRef.current = Date.now();
        speedRef.current = 15;
        setAnimationKey(k => k + 1);
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style', 'class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Reset timing for fresh animation
    startTimeRef.current = Date.now();
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

    // Matrix characters
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]|/\\';
    const charArray = chars.split('');

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    
    const drops: number[] = Array(columns).fill(1);
    for (let i = 0; i < drops.length; i++) {
      drops[i] = Math.floor(Math.random() * (canvas.height / fontSize));
    }

    // Update theme values from DOM
    const updateThemeValues = () => {
      const root = document.documentElement;
      isDarkRef.current = root.classList.contains('dark') || !root.classList.contains('light');
      
      const h = parseInt(getComputedStyle(root).getPropertyValue('--gold-h').trim()) || 45;
      const s = parseInt(getComputedStyle(root).getPropertyValue('--gold-s').trim()) || 90;
      const l = parseInt(getComputedStyle(root).getPropertyValue('--gold-l').trim()) || 55;
      themeColorRef.current = { h, s, l };
    };

    updateThemeValues();

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
    
    // Calculate fade opacity based on elapsed time
    const calculateOpacity = () => {
      const elapsed = Date.now() - startTimeRef.current;
      
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
    
    // Update canvas opacity
    const updateCanvasOpacity = () => {
      const newOpacity = calculateOpacity();
      canvas.style.opacity = String(newOpacity);
      return newOpacity > 0;
    };
    updateCanvasOpacity();

    // Calculate current speed based on elapsed time
    const getCurrentInterval = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(elapsed / slowdownDuration, 1);
      
      // Ease-out function for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      // Interpolate from fast (15ms) to slow (50ms)
      return speedRef.current + (targetSpeedRef.current - speedRef.current) * easeOut;
    };

    const draw = () => {
      // Update opacity on each frame for smooth transitions
      updateCanvasOpacity();
      
      // Semi-transparent fade to create trail effect
      ctx.fillStyle = getFadeColor();
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const matrixColor = getMatrixColor();
      ctx.fillStyle = matrixColor;
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = charArray[Math.floor(Math.random() * charArray.length)];
        
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
      
      const shouldContinue = updateCanvasOpacity();
      if (!shouldContinue) {
        // Stop the animation once fully faded
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
