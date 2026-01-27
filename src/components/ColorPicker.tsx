import { useThemeColor, themeColors, ThemeColor } from '@/hooks/useThemeColor';
import { Check } from 'lucide-react';

interface ColorPickerProps {
  onColorChange?: (color: ThemeColor) => void;
}

const ColorPicker = ({ onColorChange }: ColorPickerProps) => {
  const { currentColor, setColor, setCustomColor } = useThemeColor();

  const handleColorSelect = (color: ThemeColor) => {
    setColor(color);
    onColorChange?.(color);
  };

  const handleCustomHue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const h = parseInt(e.target.value);
    setCustomColor(h);
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium text-foreground">Theme Color</label>
      
      {/* Preset colors */}
      <div className="grid grid-cols-4 gap-3">
        {themeColors.map((color) => (
          <button
            key={color.name}
            onClick={() => handleColorSelect(color)}
            className="relative w-12 h-12 rounded-full chrome-ring transition-transform hover:scale-110 flex items-center justify-center"
            style={{
              backgroundColor: `hsl(${color.h}, ${color.s}, ${color.l})`,
            }}
            title={color.name}
          >
            {currentColor.h === color.h && currentColor.name !== 'Custom' && (
              <Check className="w-5 h-5 text-white drop-shadow-md" />
            )}
          </button>
        ))}
      </div>

      {/* Custom color slider */}
      <div className="space-y-2">
        <label className="text-xs text-muted-foreground">Custom Color</label>
        <div className="relative">
          <input
            type="range"
            min="0"
            max="360"
            value={currentColor.h}
            onChange={handleCustomHue}
            className="w-full h-3 rounded-full appearance-none cursor-pointer"
            style={{
              background: 'linear-gradient(to right, hsl(0, 80%, 55%), hsl(60, 80%, 55%), hsl(120, 80%, 55%), hsl(180, 80%, 55%), hsl(240, 80%, 55%), hsl(300, 80%, 55%), hsl(360, 80%, 55%))',
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Hue: {currentColor.h}°</span>
          <div 
            className="w-6 h-6 rounded-full border border-white/20"
            style={{ backgroundColor: `hsl(${currentColor.h}, ${currentColor.s}, ${currentColor.l})` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
