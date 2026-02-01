import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { 
  categories, 
  getSubcategoriesByCategory, 
  getCategoryById,
} from '@/data/categories';

const OrbitalCategorySelector = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const orbitalRef = useRef<HTMLDivElement>(null);

  const currentSubcategories = selectedCategory 
    ? getSubcategoriesByCategory(selectedCategory) 
    : [];

  const selectedCategoryData = getCategoryById(selectedCategory || '');

  // Smooth close function with animation
  const closeOrbital = () => {
    if (selectedCategory && !isClosing) {
      setIsClosing(true);
      setTimeout(() => {
        setSelectedCategory(null);
        setIsClosing(false);
      }, 400); // Match animation duration
    }
  };

  // Handle click outside to close expanded category
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectedCategory && !isClosing && orbitalRef.current && !orbitalRef.current.contains(event.target as Node)) {
        closeOrbital();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedCategory, isClosing]);

  const handleCategoryClick = (categoryId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
    }
  };

  const handleSubcategoryClick = (subcategoryId: string) => {
    navigate(`/instructors/${subcategoryId}`);
  };

  const handleClose = () => {
    closeOrbital();
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

  return (
    <div className="grid grid-cols-2 gap-3 px-4">
      {categories.map((category) => {
        const IconComponent = category.icon;
        const isSelected = selectedCategory === category.id;
        const hasSelection = selectedCategory !== null;

        // If this category is selected, render the expanded orbital view
        if (isSelected) {
          return (
            <div
              ref={orbitalRef}
              key={category.id}
              className={cn(
                "col-span-2 metallic-card theme-glow-box p-4 relative overflow-hidden",
                isClosing ? "animate-orbital-close" : "animate-orbital-open"
              )}
            >
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
                    animation: 'orbital-ring-in 400ms ease-out forwards',
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
                      animation: 'center-pop-in 350ms ease-out 100ms forwards',
                    }}
                  >
                    {selectedCategoryData && (
                      <selectedCategoryData.icon className="w-7 h-7 text-foreground" strokeWidth={1.5} />
                    )}
                  </div>
                  <p 
                    className="text-[10px] text-muted-foreground text-center mt-1.5 opacity-0"
                    style={{
                      animation: 'fade-in-up 300ms ease-out 200ms forwards',
                    }}
                  >
                    {selectedCategoryData?.label}
                  </p>
                </div>

                {/* Rotating orbital wrapper */}
                <div 
                  className="absolute inset-0"
                  style={{
                    animation: 'orbital-rotate 120s linear infinite',
                  }}
                >
                  {/* Subcategories */}
                  {currentSubcategories.map((sub, index) => {
                    const pos = orbitalPositions[index];
                    const SubIconComponent = sub.icon;
                    const delay = 80 + index * 40;

                    return (
                      <button
                        key={sub.id}
                        onClick={() => handleSubcategoryClick(sub.id)}
                        className="absolute top-1/2 left-1/2 group"
                        style={{
                          '--orbital-x': `${pos.x}px`,
                          '--orbital-y': `${pos.y}px`,
                          animation: `orbital-item-in 380ms ease-out ${delay}ms forwards`,
                        } as React.CSSProperties}
                      >
                        {/* Counter-rotate content to keep it upright */}
                        <div 
                          className="flex flex-col items-center"
                          style={{
                            animation: 'orbital-counter-rotate 120s linear infinite',
                          }}
                        >
                          <div className={cn(
                            'w-11 h-11 rounded-full flex items-center justify-center transition-all duration-150',
                            'bg-accent/60 border border-border/50 group-hover:bg-accent group-hover:scale-105'
                          )}>
                            <SubIconComponent 
                              className="w-5 h-5 transition-colors duration-150 text-foreground"
                              strokeWidth={1.5} 
                            />
                          </div>
                          <p className="text-[9px] text-center mt-1 max-w-[56px] leading-tight transition-colors duration-150 text-muted-foreground">
                            {sub.label}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <style>{`
                @keyframes orbital-ring-in {
                  from { opacity: 0; transform: scale(0.5); }
                  to { opacity: 1; transform: scale(1); }
                }
                @keyframes center-pop-in {
                  from { opacity: 0; transform: scale(0.3); }
                  to { opacity: 1; transform: scale(1); }
                }
                @keyframes orbital-item-in {
                  0% { 
                    opacity: 0; 
                    transform: translate(-50%, -50%) scale(0); 
                  }
                  100% { 
                    opacity: 1; 
                    transform: translate(calc(-50% + var(--orbital-x, 0px)), calc(-50% + var(--orbital-y, 0px))) scale(1); 
                  }
                }
                @keyframes fade-in-up {
                  from { opacity: 0; transform: translateY(8px) scale(0.9); }
                  to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes orbital-rotate {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
                @keyframes orbital-counter-rotate {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(-360deg); }
                }
                @keyframes orbital-open {
                  0% { 
                    opacity: 0; 
                    transform: scale(0.4);
                    filter: blur(8px);
                  }
                  60% {
                    opacity: 1;
                    transform: scale(1.02);
                    filter: blur(0px);
                  }
                  100% { 
                    opacity: 1; 
                    transform: scale(1);
                    filter: blur(0px);
                  }
                }
                @keyframes orbital-close {
                  0% { 
                    opacity: 1; 
                    transform: scale(1);
                    filter: blur(0px);
                  }
                  100% { 
                    opacity: 0; 
                    transform: scale(0.4);
                    filter: blur(8px);
                  }
                }
                .animate-orbital-open {
                  animation: orbital-open 450ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }
                .animate-orbital-close {
                  animation: orbital-close 400ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }
              `}</style>
            </div>
          );
        }

        // Regular category card (dimmed if another is selected)
        return (
          <button
            key={category.id}
            onClick={(e) => handleCategoryClick(category.id, e)}
            className={cn(
              'metallic-card theme-glow-box p-5 flex flex-col items-center gap-3',
              'transition-all duration-400 ease-out',
              'hover:scale-[1.02] active:scale-[0.98]',
              'group',
              hasSelection && 'opacity-40 scale-95'
            )}
            style={{
              transitionDuration: '400ms',
            }}
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
};

export default OrbitalCategorySelector;
