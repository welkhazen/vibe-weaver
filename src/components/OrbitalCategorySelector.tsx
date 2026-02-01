import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { 
  categories, 
  getSubcategoriesByCategory, 
  getCategoryById,
  Category,
  Subcategory
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
      // Close if clicking same category
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

  // Calculate position for orbital items
  const getOrbitalPosition = (index: number, total: number, radius: number) => {
    const angle = (index * (360 / total) - 90) * (Math.PI / 180);
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y };
  };

  // If no category selected, show grid
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
                'metallic-card theme-glow-box p-5 flex flex-col items-center gap-3 transition-all duration-300 ease-out',
                'hover:scale-[1.03] active:scale-[0.97]',
                'group'
              )}
            >
              <IconComponent className="w-10 h-10 text-foreground icon-glow transition-all duration-300 group-hover:scale-110" strokeWidth={1.5} />
              <span className="text-sm font-medium text-foreground text-center leading-tight transition-colors duration-300">
                {category.label}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  // Orbital view with subcategories
  return (
    <div className="px-4">
      <div className="metallic-card theme-glow-box p-4 relative overflow-hidden min-h-[400px]">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-accent/50 hover:bg-accent transition-colors"
        >
          <X className="w-4 h-4 text-foreground" />
        </button>

        {/* Orbital container */}
        <div className="relative w-full aspect-square max-w-[320px] mx-auto">
          {/* Orbital rings */}
          <div className="absolute inset-[15%] rounded-full border border-border/30" />
          <div className="absolute inset-[5%] rounded-full border border-border/20" />

          {/* Center - Selected Category */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/40 flex items-center justify-center chrome-ring">
              {selectedCategoryData && (
                <selectedCategoryData.icon className="w-8 h-8 text-foreground icon-glow" strokeWidth={1.5} />
              )}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2 max-w-[80px]">
              {selectedCategoryData?.label}
            </p>
          </div>

          {/* Subcategories in orbital positions */}
          {currentSubcategories.map((sub, index) => {
            const { x, y } = getOrbitalPosition(index, currentSubcategories.length, 120);
            const IconComponent = sub.icon;
            const isSelected = selectedSubcategory === sub.id;

            return (
              <button
                key={sub.id}
                onClick={() => handleSubcategoryClick(sub.id)}
                className={cn(
                  'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out group',
                  'animate-fade-in'
                )}
                style={{
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  animationDelay: `${index * 50}ms`
                }}
              >
                <div className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300',
                  isSelected 
                    ? 'bg-primary/30 border-2 border-primary scale-110' 
                    : 'bg-accent/50 border border-border/50 hover:bg-accent hover:scale-110'
                )}>
                  <IconComponent 
                    className={cn(
                      'w-5 h-5 transition-colors',
                      isSelected ? 'text-primary' : 'text-foreground'
                    )} 
                    strokeWidth={1.5} 
                  />
                </div>
                <p className={cn(
                  'text-[10px] text-center mt-1 max-w-[60px] leading-tight transition-colors',
                  isSelected ? 'text-primary font-medium' : 'text-muted-foreground'
                )}>
                  {sub.label}
                </p>
              </button>
            );
          })}
        </div>

        {/* Instructors list (shows when subcategory selected) */}
        {selectedSubcategory && instructors.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border/50 animate-fade-in">
            <p className="text-xs text-muted-foreground mb-3">
              {instructors.length} instructors available
            </p>
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
              {instructors.map((instructor) => (
                <button
                  key={instructor.id}
                  onClick={() => onSelectInstructor(instructor)}
                  className="w-full p-3 rounded-xl bg-accent/30 hover:bg-accent/50 transition-all duration-200 text-left group"
                >
                  <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {instructor.provider}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {instructor.title}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedSubcategory && instructors.length === 0 && (
          <div className="mt-4 pt-4 border-t border-border/50 text-center animate-fade-in">
            <p className="text-sm text-muted-foreground">No instructors found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrbitalCategorySelector;
