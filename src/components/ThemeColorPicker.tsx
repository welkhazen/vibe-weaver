import { useState, useEffect } from 'react';
import { Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const colorPresets = [
  { name: 'Gold', hue: 45, saturation: 90, lightness: 55 },
  { name: 'Rose', hue: 350, saturation: 80, lightness: 60 },
  { name: 'Violet', hue: 270, saturation: 70, lightness: 60 },
  { name: 'Blue', hue: 210, saturation: 80, lightness: 55 },
  { name: 'Cyan', hue: 180, saturation: 70, lightness: 50 },
  { name: 'Emerald', hue: 150, saturation: 70, lightness: 45 },
  { name: 'Orange', hue: 25, saturation: 90, lightness: 55 },
  { name: 'Pink', hue: 320, saturation: 75, lightness: 60 },
  { name: 'Silver', hue: 0, saturation: 0, lightness: 70 },
];

const ThemeColorPicker = () => {
  const [selectedHue, setSelectedHue] = useState(45);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load saved color from localStorage
    const savedHue = localStorage.getItem('theme-hue');
    if (savedHue) {
      setSelectedHue(parseInt(savedHue));
      applyThemeColor(parseInt(savedHue));
    }
  }, []);

  const applyThemeColor = (hue: number) => {
    const root = document.documentElement;
    const preset = colorPresets.find(p => p.hue === hue);
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

  const handleColorSelect = (hue: number) => {
    setSelectedHue(hue);
    applyThemeColor(hue);
    localStorage.setItem('theme-hue', hue.toString());
    setIsOpen(false);
  };

  const currentPreset = colorPresets.find(p => p.hue === selectedHue) || colorPresets[0];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button 
          className="p-2 rounded-xl hover:bg-accent transition-all duration-300 relative group"
          aria-label="Change theme color"
        >
          <div 
            className="w-5 h-5 rounded-full border-2 border-foreground/30 transition-all duration-300 group-hover:scale-110"
            style={{ 
              backgroundColor: `hsl(${currentPreset.hue}, ${currentPreset.saturation}%, ${currentPreset.lightness}%)`,
              boxShadow: `0 0 10px hsl(${currentPreset.hue}, ${currentPreset.saturation}%, ${currentPreset.lightness}%, 0.5)`
            }}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent 
        align="start" 
        className="w-64 p-4 metallic-card border-border/50"
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Theme Color</span>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {colorPresets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => handleColorSelect(preset.hue)}
                className={cn(
                  "flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all duration-200",
                  "hover:bg-accent/50 active:scale-95",
                  selectedHue === preset.hue && "bg-accent ring-1 ring-primary/50"
                )}
              >
                <div 
                  className="w-8 h-8 rounded-full border-2 transition-all duration-300"
                  style={{ 
                    backgroundColor: `hsl(${preset.hue}, ${preset.saturation}%, ${preset.lightness}%)`,
                    borderColor: selectedHue === preset.hue 
                      ? `hsl(${preset.hue}, ${preset.saturation}%, ${preset.lightness}%)` 
                      : 'hsl(var(--border))',
                    boxShadow: selectedHue === preset.hue 
                      ? `0 0 12px hsl(${preset.hue}, ${preset.saturation}%, ${preset.lightness}%, 0.6)` 
                      : 'none'
                  }}
                />
                <span className="text-xs text-muted-foreground">{preset.name}</span>
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ThemeColorPicker;
