import { cn } from '@/lib/utils';

export const categories = [
  { id: 'yoga', label: 'Yoga / Pilates', icon: '🧘' },
  { id: 'therapy', label: 'Therapy / Mental Health', icon: '🧠' },
  { id: 'sports', label: 'Sports / Martial Arts', icon: '🥋' },
  { id: 'outdoor', label: 'Outdoor Activities', icon: '🏔️' },
  { id: 'arts', label: 'Arts / Music / Dance', icon: '🎨' },
  { id: 'tutoring', label: 'Tutoring / Education', icon: '📚' },
  { id: 'other', label: 'Other', icon: '⚡' },
];

interface CategoryGridProps {
  onSelectCategory: (category: string) => void;
}

const CategoryGrid = ({ onSelectCategory }: CategoryGridProps) => {
  return (
    <div className="grid grid-cols-2 gap-3 px-4">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={cn(
            'metallic-card p-5 flex flex-col items-center gap-3 transition-all',
            'hover:scale-[1.02] hover:border-primary/30 active:scale-[0.98]'
          )}
        >
          <span className="text-4xl">{category.icon}</span>
          <span className="text-sm font-medium text-foreground text-center leading-tight">
            {category.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default CategoryGrid;
