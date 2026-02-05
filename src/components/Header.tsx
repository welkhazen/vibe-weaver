import { useState, useEffect } from 'react';
import { Bell, Menu, User, Lock, Shield, Eye, HelpCircle, LogOut, Palette, Sun, Moon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

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

interface HeaderProps {
  title?: string;
  onNavigate?: (tab: string) => void;
}

const Header = ({ title = 'The Art of Raw', onNavigate }: HeaderProps) => {
  const [selectedHue, setSelectedHue] = useState(() => {
    const savedHue = localStorage.getItem('theme-hue');
    return savedHue ? parseInt(savedHue) : 45;
  });
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('theme-mode');
    return savedMode ? savedMode === 'dark' : true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.remove('light');
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem('theme-mode', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const applyThemeColor = (hue: number) => {
    const root = document.documentElement;
    const preset = colorPresets.find(p => p.hue === hue);
    const saturation = preset?.saturation ?? 80;
    const lightness = preset?.lightness ?? 55;
    
    root.style.setProperty('--gold-h', hue.toString());
    root.style.setProperty('--gold-s', `${saturation}%`);
    root.style.setProperty('--gold-l', `${lightness}%`);
    
    root.style.setProperty('--primary-h', hue.toString());
    root.style.setProperty('--primary-s', `${Math.min(saturation, 60)}%`);
    root.style.setProperty('--primary-l', `${lightness + 20}%`);
  };

  const handleColorSelect = (hue: number) => {
    setSelectedHue(hue);
    applyThemeColor(hue);
    localStorage.setItem('theme-hue', hue.toString());
    setShowColorPicker(false);
  };

  const menuItems = [
    { icon: <User className="w-4 h-4" />, label: 'Edit Profile', action: 'profile' },
    { icon: <Lock className="w-4 h-4" />, label: 'Change Password', action: 'password' },
    { icon: <Shield className="w-4 h-4" />, label: 'Privacy & Security', action: 'privacy' },
    { icon: <Bell className="w-4 h-4" />, label: 'Notifications', action: 'notifications' },
    { icon: <Eye className="w-4 h-4" />, label: 'Visibility', action: 'visibility' },
    { icon: <HelpCircle className="w-4 h-4" />, label: 'Help & FAQ', action: 'help' },
  ];

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
                  className="flex items-center gap-3 w-full px-2 py-1.5 rounded-sm hover:bg-accent/50 text-foreground text-sm"
                >
                  <Palette className="w-4 h-4 text-muted-foreground" />
                  <span>Theme Color</span>
                  <div 
                    className="w-4 h-4 rounded-full border border-border/50 ml-auto"
                    style={{ 
                      backgroundColor: `hsl(${colorPresets.find(p => p.hue === selectedHue)?.hue ?? 45}, ${colorPresets.find(p => p.hue === selectedHue)?.saturation ?? 90}%, ${colorPresets.find(p => p.hue === selectedHue)?.lightness ?? 55}%)`
                    }}
                  />
                </button>
                
                {showColorPicker && (
                  <div className="grid grid-cols-3 gap-2 mt-2 p-2 bg-accent/30 rounded-lg">
                    {colorPresets.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => handleColorSelect(preset.hue)}
                        className={cn(
                          "flex flex-col items-center gap-1 p-1.5 rounded-lg transition-all duration-200",
                          "hover:bg-accent/50 active:scale-95",
                          selectedHue === preset.hue && "bg-accent ring-1 ring-primary/50"
                        )}
                      >
                        <div 
                          className="w-6 h-6 rounded-full border transition-all duration-300"
                          style={{ 
                            backgroundColor: `hsl(${preset.hue}, ${preset.saturation}%, ${preset.lightness}%)`,
                            borderColor: selectedHue === preset.hue 
                              ? `hsl(${preset.hue}, ${preset.saturation}%, ${preset.lightness}%)` 
                              : 'hsl(var(--border))',
                            boxShadow: selectedHue === preset.hue 
                              ? `0 0 8px hsl(${preset.hue}, ${preset.saturation}%, ${preset.lightness}%, 0.6)` 
                              : 'none'
                          }}
                        />
                        <span className="text-[10px] text-muted-foreground">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Dark/Light Mode Toggle */}
              <div className="px-2 py-1">
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="flex items-center gap-3 w-full px-2 py-1.5 rounded-sm hover:bg-accent/50 text-foreground text-sm"
                >
                  {isDarkMode ? (
                    <Moon className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Sun className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
                  <div 
                    className={cn(
                      "w-10 h-5 rounded-full ml-auto relative transition-colors duration-300",
                      isDarkMode ? "bg-primary/30" : "bg-accent"
                    )}
                  >
                    <div 
                      className={cn(
                        "absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300",
                        isDarkMode 
                          ? "right-0.5 bg-primary" 
                          : "left-0.5 bg-foreground/50"
                      )}
                    />
                  </div>
                </button>
              </div>
              
              <DropdownMenuSeparator className="bg-border/50" />
              
              {menuItems.map((item) => (
                <DropdownMenuItem 
                  key={item.action}
                  className="flex items-center gap-3 cursor-pointer hover:bg-accent/50 text-foreground"
                  onClick={() => onNavigate?.(item.action)}
                >
                  <span className="text-muted-foreground">{item.icon}</span>
                  {item.label}
                </DropdownMenuItem>
              ))}
              
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem className="flex items-center gap-3 cursor-pointer text-destructive hover:bg-destructive/10">
                <LogOut className="w-4 h-4" />
                Log Out
              </DropdownMenuItem>
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
    </header>
  );
};

export default Header;
