import { cn } from '@/lib/utils';
import { Flower2, Brain, Swords, Mountain, Palette, GraduationCap } from 'lucide-react';

export const categories = [
  { id: 'therapy', label: 'Therapy / Mental Health', icon: Brain },
  { id: 'yoga', label: 'Yoga / Pilates', icon: Flower2 },
  { id: 'sports', label: 'Sports / Martial Arts', icon: Swords },
  { id: 'outdoor', label: 'Outdoor Activities', icon: Mountain },
  { id: 'arts', label: 'Arts / Music / Dance', icon: Palette },
  { id: 'tutoring', label: 'Tutoring / Education', icon: GraduationCap },
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
              'metallic-card p-5 flex flex-col items-center gap-3 transition-all',
              'hover:scale-[1.02] hover:border-primary/30 active:scale-[0.98]'
            )}
          >
            <IconComponent className="w-10 h-10 text-foreground" strokeWidth={1.5} />
            <span className="text-sm font-medium text-foreground text-center leading-tight">
              {category.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryGrid;
