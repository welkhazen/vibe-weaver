import { useState, useEffect } from 'react';

export interface ThemeColor {
  name: string;
  h: number;
  s: string;
  l: string;
}

export const themeColors: ThemeColor[] = [
  { name: 'White', h: 0, s: '0%', l: '95%' },
  { name: 'Silver', h: 0, s: '0%', l: '75%' },
  { name: 'Steel', h: 210, s: '5%', l: '65%' },
  { name: 'Platinum', h: 0, s: '0%', l: '85%' },
  { name: 'Ash', h: 0, s: '0%', l: '55%' },
  { name: 'Chrome', h: 220, s: '3%', l: '70%' },
  { name: 'Pearl', h: 30, s: '5%', l: '88%' },
  { name: 'Graphite', h: 0, s: '0%', l: '40%' },
];

const STORAGE_KEY = 'theme-primary-color';

export const useThemeColor = () => {
  const [currentColor, setCurrentColor] = useState<ThemeColor>(() => {
    if (typeof window === 'undefined') return themeColors[0];
    
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return themeColors[0];
      }
    }
    return themeColors[0];
  });

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-h', String(currentColor.h));
    root.style.setProperty('--primary-s', currentColor.s);
    root.style.setProperty('--primary-l', currentColor.l);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentColor));
  }, [currentColor]);

  const setColor = (color: ThemeColor) => {
    setCurrentColor(color);
  };

  const setCustomColor = (h: number, s: string = '80%', l: string = '55%') => {
    const custom: ThemeColor = { name: 'Custom', h, s, l };
    setCurrentColor(custom);
  };

  return { currentColor, setColor, setCustomColor, themeColors };
};
