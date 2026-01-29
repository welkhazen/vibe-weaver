import { cn } from '@/lib/utils';
import { Brain, Dumbbell, Scissors, Music2, Drama, GraduationCap } from 'lucide-react';

export const categories = [
  { id: 'mental-health', label: 'Mental Health', icon: Brain },
  { id: 'physical', label: 'Physical Activities', icon: Dumbbell },
  { id: 'arts-crafts', label: 'Arts and Crafts', icon: Scissors },
  { id: 'dance', label: 'Dance', icon: Drama },
  { id: 'music', label: 'Music', icon: Music2 },
  { id: 'education', label: 'Education', icon: GraduationCap },
];

interface CategoryGridProps {
  onSelectCategory: (category: string) => void;
}

const CategoryGrid = ({ onSelectCategory }: CategoryGridProps) => {
  return (
    <div className="grid grid-cols-2 gap-3 px-4">
      {categories.map((category) => {
        const IconComponent = category.icon;
        return (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={cn(
              'metallic-card p-5 flex flex-col items-center gap-3 transition-all duration-300 ease-out',
              'hover:scale-[1.03] hover:border-primary/30 active:scale-[0.97]',
              'group'
            )}
          >
            <IconComponent className="w-10 h-10 text-foreground transition-all duration-300 group-hover:scale-110 group-hover:text-primary" strokeWidth={1.5} />
            <span className="text-sm font-medium text-foreground text-center leading-tight transition-colors duration-300 group-hover:text-primary">
              {category.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryGrid;
