import { COLOR_PRESETS } from "@/constants/theme";

export const applyThemeColor = (hue: number) => {
  if (typeof window === "undefined") return;

  const root = document.documentElement;
  const preset = COLOR_PRESETS.find(p => p.hue === hue);
  const saturation = preset?.saturation ?? 80;
  const lightness = preset?.lightness ?? 55;

  root.style.setProperty('--gold-h', hue.toString());
  root.style.setProperty('--gold-s', `${saturation}%`);
  root.style.setProperty('--gold-l', `${lightness}%`);

  // Also update primary to match the accent color
  root.style.setProperty('--primary-h', hue.toString());
  root.style.setProperty('--primary-s', `${Math.min(saturation, 60)}%`);
  root.style.setProperty('--primary-l', `${lightness + 20}%`);
};

export const getAccentStyles = (hue: number) => {
  const preset = COLOR_PRESETS.find(p => p.hue === hue) || COLOR_PRESETS[0];
  return { s: preset.saturation, l: preset.lightness };
};
