import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { 
  categories, 
  getSubcategoriesByCategory, 
  getCategoryById,
} from '@/data/categories';
import { getInstructorsBySubcategory, Instructor } from '@/data/instructors';

interface OrbitalCategorySelectorProps {
  onSelectInstructor: (instructor: Instructor) => void;
}

const OrbitalCategorySelector = ({ onSelectInstructor }: OrbitalCategorySelectorProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  const currentSubcategories = selectedCategory 
    ? getSubcategoriesByCategory(selectedCategory) 
    : [];

  const instructors = useMemo(() => {
    if (!selectedSubcategory) return [];
    return getInstructorsBySubcategory(selectedSubcategory);
  }, [selectedSubcategory]);

  const selectedCategoryData = getCategoryById(selectedCategory || '');

  const handleCategoryClick = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
      setSelectedSubcategory(null);
    } else {
      setSelectedCategory(categoryId);
      setSelectedSubcategory(null);
    }
  };

  const handleSubcategoryClick = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId);
  };

  const handleClose = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
  };

  // Pre-calculate orbital positions (memoized)
  const orbitalPositions = useMemo(() => {
    return currentSubcategories.map((_, index) => {
      const total = currentSubcategories.length;
      const angle = (index * (360 / total) - 90) * (Math.PI / 180);
      const radius = 110;
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
      };
    });
  }, [currentSubcategories.length]);

  // Grid view when no category selected
  if (!selectedCategory) {
    return (
      <div className="grid grid-cols-2 gap-3 px-4">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={cn(
                'metallic-card theme-glow-box p-5 flex flex-col items-center gap-3',
                'transition-transform duration-200 ease-out',
                'hover:scale-[1.02] active:scale-[0.98]',
                'group'
              )}
            >
              <IconComponent className="w-10 h-10 text-foreground icon-glow" strokeWidth={1.5} />
              <span className="text-sm font-medium text-foreground text-center leading-tight">
                {category.label}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  // Orbital view
  return (
    <div className="px-4">
      <div className="metallic-card theme-glow-box p-4 relative overflow-hidden">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-accent/50 hover:bg-accent transition-colors duration-150"
        >
          <X className="w-4 h-4 text-foreground" />
        </button>

        {/* Orbital container */}
        <div className="relative w-full h-[280px] mx-auto max-w-[300px]">
          {/* Static orbital ring */}
          <div 
            className="absolute inset-[20%] rounded-full border border-border/30 opacity-0"
            style={{
              animation: 'orbital-ring-in 300ms ease-out forwards',
            }}
          />

          {/* Center - Selected Category */}
          <div 
            className="absolute top-1/2 left-1/2 z-10"
            style={{
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div 
              className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/40 flex items-center justify-center opacity-0"
              style={{
                animation: 'center-pop-in 250ms ease-out 50ms forwards',
              }}
            >
              {selectedCategoryData && (
                <selectedCategoryData.icon className="w-7 h-7 text-foreground" strokeWidth={1.5} />
              )}
            </div>
            <p 
              className="text-[10px] text-muted-foreground text-center mt-1.5 opacity-0"
              style={{
                animation: 'fade-in-up 200ms ease-out 150ms forwards',
              }}
            >
              {selectedCategoryData?.label}
            </p>
          </div>

          {/* Subcategories */}
          {currentSubcategories.map((sub, index) => {
            const pos = orbitalPositions[index];
            const IconComponent = sub.icon;
            const isSelected = selectedSubcategory === sub.id;
            const delay = 80 + index * 40;

            return (
              <button
                key={sub.id}
                onClick={() => handleSubcategoryClick(sub.id)}
                className="absolute top-1/2 left-1/2 group"
                style={{
                  '--orbital-x': `${pos.x}px`,
                  '--orbital-y': `${pos.y}px`,
                  animation: `orbital-item-in 280ms ease-out ${delay}ms forwards`,
                } as React.CSSProperties}
              >
                <div className={cn(
                  'w-11 h-11 rounded-full flex items-center justify-center transition-all duration-150',
                  isSelected 
                    ? 'bg-primary/30 border-2 border-primary scale-105' 
                    : 'bg-accent/60 border border-border/50 group-hover:bg-accent group-hover:scale-105'
                )}>
                  <IconComponent 
                    className={cn(
                      'w-5 h-5 transition-colors duration-150',
                      isSelected ? 'text-primary' : 'text-foreground'
                    )} 
                    strokeWidth={1.5} 
                  />
                </div>
                <p className={cn(
                  'text-[9px] text-center mt-1 max-w-[56px] leading-tight transition-colors duration-150',
                  isSelected ? 'text-primary font-medium' : 'text-muted-foreground'
                )}>
                  {sub.label}
                </p>
              </button>
            );
          })}
        </div>

        {/* Instructors list */}
        {selectedSubcategory && instructors.length > 0 && (
          <div 
            className="mt-2 pt-3 border-t border-border/50 opacity-0"
            style={{
              animation: 'fade-in-up 200ms ease-out forwards',
            }}
          >
            <p className="text-xs text-muted-foreground mb-2">
              {instructors.length} instructors
            </p>
            <div className="space-y-1.5 max-h-[180px] overflow-y-auto">
              {instructors.map((instructor) => (
                <button
                  key={instructor.id}
                  onClick={() => onSelectInstructor(instructor)}
                  className="w-full p-2.5 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors duration-150 text-left"
                >
                  <h4 className="font-medium text-sm text-foreground">
                    {instructor.provider}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {instructor.title}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedSubcategory && instructors.length === 0 && (
          <div 
            className="mt-2 pt-3 border-t border-border/50 text-center opacity-0"
            style={{
              animation: 'fade-in-up 200ms ease-out forwards',
            }}
          >
            <p className="text-sm text-muted-foreground">No instructors found</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes orbital-ring-in {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes center-pop-in {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes orbital-item-in {
          0% { 
            opacity: 0; 
            transform: translate(-50%, -50%) scale(0.3); 
          }
          100% { 
            opacity: 1; 
            transform: translate(calc(-50% + var(--orbital-x, 0px)), calc(-50% + var(--orbital-y, 0px))) scale(1); 
          }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default OrbitalCategorySelector;
