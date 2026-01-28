import { useState, useEffect } from 'react';

const STORAGE_KEY = 'glow-intensity';
const DEFAULT_INTENSITY = 0.6;

export const useGlowIntensity = () => {
  const [intensity, setIntensity] = useState<number>(() => {
    if (typeof window === 'undefined') return DEFAULT_INTENSITY;
    
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = parseFloat(saved);
      return isNaN(parsed) ? DEFAULT_INTENSITY : parsed;
    }
    return DEFAULT_INTENSITY;
  });

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--glow-intensity', String(intensity));
    localStorage.setItem(STORAGE_KEY, String(intensity));
  }, [intensity]);

  return { intensity, setIntensity };
};
