import { useState, useEffect } from 'react';

export interface ThemeColor {
  name: string;
  h: number;
  s: string;
  l: string;
}

export const themeColors: ThemeColor[] = [
  { name: 'Cyan', h: 180, s: '100%', l: '50%' },
  { name: 'Purple', h: 270, s: '80%', l: '60%' },
  { name: 'Blue', h: 220, s: '90%', l: '55%' },
  { name: 'Green', h: 140, s: '70%', l: '45%' },
  { name: 'Orange', h: 25, s: '95%', l: '55%' },
  { name: 'Pink', h: 330, s: '85%', l: '60%' },
  { name: 'Red', h: 0, s: '80%', l: '55%' },
  { name: 'Gold', h: 45, s: '90%', l: '50%' },
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
