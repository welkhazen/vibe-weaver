import { cn } from '@/lib/utils';
import { Flower2, Brain, Swords, Mountain, Palette, GraduationCap } from 'lucide-react';

export const categories = [
  { id: 'yoga', label: 'Yoga / Pilates', icon: Flower2 },
  { id: 'therapy', label: 'Therapy / Mental Health', icon: Brain },
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
              'gold-accent-card p-5 flex flex-col items-center gap-3 transition-all',
              'hover:scale-[1.02] active:scale-[0.98]',
              'hover:shadow-[0_0_25px_hsl(var(--gold)_/_0.2)]'
            )}
          >
            <div className="p-3 rounded-full bg-gradient-to-br from-gold/20 to-gold-dark/10 border border-gold/30">
              <IconComponent className="w-8 h-8 text-gold" strokeWidth={1.5} />
            </div>
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
