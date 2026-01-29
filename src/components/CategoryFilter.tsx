import { cn } from '@/lib/utils';

export const categories = [
  { id: 'all', label: 'All', icon: '✦' },
  { id: 'mental-health', label: 'Mental Health', icon: '🧠' },
  { id: 'physical', label: 'Physical', icon: '💪' },
  { id: 'arts-crafts', label: 'Creative Arts', icon: '✂️' },
  { id: 'dance', label: 'Dance', icon: '💃' },
  { id: 'music', label: 'Music', icon: '🎵' },
  { id: 'education', label: 'Education', icon: '📚' },
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
              'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-out whitespace-nowrap active:scale-95',
              selectedCategory === category.id
                ? 'bg-primary text-primary-foreground glow-primary scale-105'
                : 'metallic-button text-foreground hover:text-primary hover:scale-[1.02]'
            )}
          >
            <span className="transition-transform duration-300">{category.icon}</span>
            <span>{category.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
