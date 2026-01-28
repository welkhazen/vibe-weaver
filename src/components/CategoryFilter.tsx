import { cn } from '@/lib/utils';

export const categories = [
  { id: 'all', label: 'All', icon: '✦' },
  { id: 'yoga', label: 'Yoga / Pilates', icon: '🧘' },
  { id: 'therapy', label: 'Therapy / Mental Health', icon: '🧠' },
  { id: 'sports', label: 'Sports / Martial Arts', icon: '🥋' },
  { id: 'outdoor', label: 'Outdoor Activities', icon: '🏔️' },
  { id: 'arts', label: 'Arts / Music / Dance', icon: '🎨' },
  { id: 'tutoring', label: 'Tutoring / Education', icon: '📚' },
  { id: 'other', label: 'Other', icon: '⚡' },
];

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryFilter = ({ selectedCategory, onSelectCategory }: CategoryFilterProps) => {
  return (
    <div className="overflow-x-auto scrollbar-hide py-2">
      <div className="flex gap-2 px-4 min-w-max">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap',
              selectedCategory === category.id
                ? 'bg-primary text-primary-foreground glow-primary'
                : 'metallic-button text-foreground hover:text-primary'
            )}
          >
            <span>{category.icon}</span>
            <span>{category.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
