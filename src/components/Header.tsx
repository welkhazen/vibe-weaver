import { useState, useEffect, useCallback } from 'react';
import { Bell, Menu, Palette, Sun, Moon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger } from
'@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { colorPresets, STORAGE_KEY_HUE, STORAGE_KEY_MODE } from '@/constants/theme';
import { dispatchThemeChanged } from '@/lib/theme';

interface HeaderProps {
  title?: string;
  onNavigate?: (tab: string) => void;
}

const Header = ({ title = 'The Art of Raw', onNavigate }: HeaderProps) => {
  const [selectedHue, setSelectedHue] = useState(() => {
    const savedHue = localStorage.getItem(STORAGE_KEY_HUE);
    return savedHue ? parseInt(savedHue) : 45;
  });
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem(STORAGE_KEY_MODE);
    return savedMode ? savedMode === 'dark' : true;
  });

  const applyThemeColor = useCallback((hue: number) => {
    const root = document.documentElement;
    const preset = colorPresets.find((p) => p.hue === hue) || colorPresets[0];
    const { saturation, lightness } = preset;

    root.style.setProperty('--gold-h', hue.toString());
    root.style.setProperty('--gold-s', `${saturation}%`);
    root.style.setProperty('--gold-l', `${lightness}%`);

    root.style.setProperty('--primary-h', hue.toString());
    root.style.setProperty('--primary-s', `${Math.min(saturation, 60)}%`);
    root.style.setProperty('--primary-l', `${lightness + 20}%`);

    return preset;
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.remove('light');
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem(STORAGE_KEY_MODE, isDarkMode ? 'dark' : 'light');

    const preset = applyThemeColor(selectedHue);

    // Dispatch event for components that need manual updates (like MatrixBackground)
    dispatchThemeChanged({
      hue: selectedHue,
      saturation: preset.saturation,
      lightness: preset.lightness,
      isDark: isDarkMode
    });
  }, [isDarkMode, selectedHue, applyThemeColor]);

  const handleColorSelect = (hue: number) => {
    setSelectedHue(hue);
    localStorage.setItem(STORAGE_KEY_HUE, hue.toString());
    setShowColorPicker(false);
  };


  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50 safe-area-top">
      {/* Unified header layout - same for mobile + tablet */}
      <div className="flex items-center justify-between px-4 sm:px-6 h-14 w-full max-w-lg mx-auto">
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 rounded-xl hover:bg-accent transition-colors">
                <Menu className="w-5 h-5 text-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 metallic-card border-border/50">
              <DropdownMenuLabel className="text-foreground font-semibold">Settings</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/50" />
              
              {/* Theme Color Picker - First Item */}
              <div className="px-2 py-2">
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="flex items-center gap-3 w-full px-2 py-1.5 rounded-sm hover:bg-accent/50 text-foreground text-sm">

                  <Palette className="w-4 h-4 text-muted-foreground" />
                  <span>Theme Color</span>
                  <div
                    className="w-4 h-4 rounded-full border border-border/50 ml-auto text-primary bg-primary"
                    style={{
                      backgroundColor: `hsl(${colorPresets.find((p) => p.hue === selectedHue)?.hue ?? 45}, ${colorPresets.find((p) => p.hue === selectedHue)?.saturation ?? 90}%, ${colorPresets.find((p) => p.hue === selectedHue)?.lightness ?? 55}%)`
                    }} />

                </button>
                
                {showColorPicker &&
                <div className="grid grid-cols-3 gap-2 mt-2 p-2 bg-accent/30 rounded-lg">
                    {colorPresets.map((preset) =>
                  <button
                    key={preset.name}
                    onClick={() => handleColorSelect(preset.hue)}
                    className={cn(
                      "flex flex-col items-center gap-1 p-1.5 rounded-lg transition-all duration-200",
                      "hover:bg-accent/50 active:scale-95",
                      selectedHue === preset.hue && "bg-accent ring-1 ring-primary/50"
                    )}>

                        <div
                      className="w-6 h-6 rounded-full border transition-all duration-300"
                      style={{
                        backgroundColor: `hsl(${preset.hue}, ${preset.saturation}%, ${preset.lightness}%)`,
                        borderColor: selectedHue === preset.hue ?
                        `hsl(${preset.hue}, ${preset.saturation}%, ${preset.lightness}%)` :
                        'hsl(var(--border))',
                        boxShadow: selectedHue === preset.hue ?
                        `0 0 8px hsl(${preset.hue}, ${preset.saturation}%, ${preset.lightness}%, 0.6)` :
                        'none'
                      }} />

                        <span className="text-[10px] text-muted-foreground">{preset.name}</span>
                      </button>
                  )}
                  </div>
                }
              </div>
              
              {/* Dark/Light Mode Toggle */}
              <div className="px-2 py-1">
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="flex items-center gap-3 w-full px-2 py-1.5 rounded-sm hover:bg-accent/50 text-foreground text-sm">

                  {isDarkMode ?
                  <Moon className="w-4 h-4 text-muted-foreground" /> :

                  <Sun className="w-4 h-4 text-muted-foreground" />
                  }
                  <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
                  <div
                    className={cn(
                      "w-10 h-5 rounded-full ml-auto relative transition-colors duration-300",
                      isDarkMode ? "bg-primary/30" : "bg-accent"
                    )}>

                    <div
                      className={cn(
                        "absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300",
                        isDarkMode ?
                        "right-0.5 bg-primary" :
                        "left-0.5 bg-foreground/50"
                      )} />

                  </div>
                </button>
              </div>
              
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Centered title - consistent across all sizes */}
        <h1 className="text-lg font-bold text-foreground tracking-tight text-center flex-1 min-w-0 truncate px-2">
          {title}
        </h1>
        <button className="p-2 rounded-xl hover:bg-accent transition-colors relative flex-shrink-0">
          <Bell className="w-5 h-5 text-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
        </button>
      </div>
    </header>);

};

export default Header;