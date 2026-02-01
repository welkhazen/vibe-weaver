import { useEffect, useRef } from 'react';

const MatrixBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const speedRef = useRef(15); // Start fast (lower interval = faster)
  const targetSpeedRef = useRef(200); // Final slow speed before stopping
  const startTimeRef = useRef(Date.now());
  const stoppedRef = useRef(false);
  const slowdownDuration = 3000; // 3 seconds to slow down and stop
  
  // Use refs for theme to avoid re-running effect
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
    const rows = Math.floor(canvas.height / fontSize);
    
    // Array to track y position of each column
    const drops: number[] = Array(columns).fill(1);
    
    // Grid to store characters for final static display
    const charGrid: string[][] = Array(columns).fill(null).map(() => Array(rows).fill(''));
    
    // Randomize initial drop positions for immediate visual effect
    for (let i = 0; i < drops.length; i++) {
      drops[i] = Math.floor(Math.random() * (canvas.height / fontSize));
    }
    
    // Pre-fill the grid with random characters
    for (let col = 0; col < columns; col++) {
      for (let row = 0; row < rows; row++) {
        charGrid[col][row] = charArray[Math.floor(Math.random() * charArray.length)];
      }
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

    // Initial update
    updateThemeValues();
    
    // Watch for theme changes
    const observer = new MutationObserver(updateThemeValues);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class', 'style'] 
    });

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
    
    // Update canvas opacity based on theme
    const updateCanvasOpacity = () => {
      canvas.style.opacity = isDarkRef.current ? '0.3' : '0.2';
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

    // Draw the complete grid (used for final static state)
    const drawFullGrid = () => {
      updateCanvasOpacity();
      
      // Clear canvas with background color
      if (isDarkRef.current) {
        ctx.fillStyle = 'rgba(0, 0, 0, 1)';
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
      }
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const matrixColor = getMatrixColor();
      ctx.fillStyle = matrixColor;
      ctx.font = `${fontSize}px monospace`;
      
      // Draw all characters in the grid
      for (let col = 0; col < columns; col++) {
        for (let row = 0; row < rows; row++) {
          ctx.fillText(charGrid[col][row], col * fontSize, (row + 1) * fontSize);
        }
      }
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
        
        // Update the grid with this character for the final static state
        const rowIndex = Math.floor(drops[i]) % rows;
        if (rowIndex >= 0 && rowIndex < rows) {
          charGrid[i][rowIndex] = char;
        }
        
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
    
    const loop = () => {
      const elapsed = Date.now() - startTimeRef.current;
      
      // Stop completely after duration
      if (elapsed >= slowdownDuration) {
        if (!stoppedRef.current) {
          stoppedRef.current = true;
          drawFullGrid(); // Draw the complete grid for even coverage
        }
        return; // Don't schedule another frame
      }
      
      draw();
      const currentInterval = getCurrentInterval();
      timeoutId = window.setTimeout(loop, currentInterval);
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
