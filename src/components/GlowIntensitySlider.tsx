import { Slider } from '@/components/ui/slider';
import { useGlowIntensity } from '@/hooks/useGlowIntensity';
import { Sparkles } from 'lucide-react';

const GlowIntensitySlider = () => {
  const { intensity, setIntensity } = useGlowIntensity();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-gold" />
          <span className="text-sm text-muted-foreground">Golden Glow</span>
        </div>
        <span className="text-sm font-medium text-gold">
          {Math.round(intensity * 100)}%
        </span>
      </div>
      
      <div className="relative">
        <Slider
          value={[intensity]}
          onValueChange={(value) => setIntensity(value[0])}
          min={0}
          max={1}
          step={0.05}
          className="w-full"
        />
        
        {/* Preview glow indicator */}
        <div 
          className="mt-4 h-12 rounded-lg flex items-center justify-center transition-all duration-300"
          style={{
            background: `linear-gradient(135deg, 
              hsla(45, 90%, 55%, ${intensity * 0.3}) 0%, 
              hsla(40, 85%, 45%, ${intensity * 0.15}) 50%,
              transparent 100%
            )`,
            boxShadow: `0 0 ${30 * intensity}px hsla(45, 90%, 55%, ${intensity * 0.4}),
                        0 0 ${60 * intensity}px hsla(45, 85%, 50%, ${intensity * 0.2})`,
            border: `1px solid hsla(45, 90%, 55%, ${intensity * 0.3})`
          }}
        >
          <span 
            className="text-sm font-medium transition-all duration-300"
            style={{
              color: `hsl(45, 90%, ${55 + intensity * 20}%)`,
              textShadow: `0 0 ${10 * intensity}px hsla(45, 90%, 55%, ${intensity * 0.8})`
            }}
          >
            Preview
          </span>
        </div>
      </div>
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Off</span>
        <span>Subtle</span>
        <span>Intense</span>
      </div>
    </div>
  );
};

export default GlowIntensitySlider;
