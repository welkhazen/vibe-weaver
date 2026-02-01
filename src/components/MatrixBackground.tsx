import { useEffect, useRef } from 'react';

const MatrixBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startTimeRef = useRef(Date.now());
  const animationStoppedRef = useRef(false);
  
  // Total duration: 5 seconds
  const totalDuration = 5000;
  
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
    
    // Array to track y position of each column
    const drops: number[] = Array(columns).fill(1);
    
    // Randomize initial drop positions
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
    };

    updateThemeValues();
    
    const observer = new MutationObserver(updateThemeValues);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class', 'style'] 
    });

    // Color helper
    const getMatrixColor = () => {
      const { h, s, l } = themeColorRef.current;
      if (isDarkRef.current) {
        return `hsl(${h}, ${Math.min(s, 70)}%, ${Math.min(l + 15, 80)}%)`;
      }
      return `hsl(${h}, ${Math.min(s, 60)}%, ${Math.max(l - 15, 35)}%)`;
    };

    const getFadeColor = () => {
      if (isDarkRef.current) {
        return 'rgba(0, 0, 0, 0.05)';
      }
      return 'rgba(255, 255, 255, 0.08)';
    };

    const updateCanvasOpacity = () => {
      canvas.style.opacity = isDarkRef.current ? '0.3' : '0.2';
    };
    updateCanvasOpacity();

    // Smooth easing function
    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

    // Track when to update matrix drops (controls speed)
    let lastDropUpdate = 0;
    let frameId: number;
    
    const draw = (timestamp: number) => {
      const elapsed = Date.now() - startTimeRef.current;
      
      // Animation complete - stop
      if (elapsed >= totalDuration) {
        if (!animationStoppedRef.current) {
          animationStoppedRef.current = true;
        }
        return;
      }
      
      updateCanvasOpacity();
      
      // Calculate progress (0 to 1)
      const progress = elapsed / totalDuration;
      
      // Calculate drop interval - starts fast (30ms), ends very slow (500ms)
      const baseInterval = 30;
      const maxInterval = 500;
      const currentInterval = baseInterval + easeOutQuart(progress) * (maxInterval - baseInterval);
      
      // Apply fade effect
      ctx.fillStyle = getFadeColor();
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Only update drops based on calculated interval
      if (timestamp - lastDropUpdate >= currentInterval) {
        lastDropUpdate = timestamp;
        
        ctx.fillStyle = getMatrixColor();
        ctx.font = `${fontSize}px monospace`;
        
        for (let i = 0; i < drops.length; i++) {
          const char = charArray[Math.floor(Math.random() * charArray.length)];
          ctx.fillText(char, i * fontSize, drops[i] * fontSize);
          
          // Reset drop randomly after reaching bottom
          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      }
      
      frameId = requestAnimationFrame(draw);
    };
    
    frameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameId);
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
