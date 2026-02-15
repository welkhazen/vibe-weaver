import { EVENT_THEME_CHANGED } from '@/constants/theme';

export interface ThemeChangedEventDetail {
  hue: number;
  saturation: number;
  lightness: number;
  isDark: boolean;
}

export const dispatchThemeChanged = (detail: ThemeChangedEventDetail) => {
  const event = new CustomEvent(EVENT_THEME_CHANGED, { detail });
  window.dispatchEvent(event);
};
