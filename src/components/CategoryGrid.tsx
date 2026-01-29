import { cn } from '@/lib/utils';
import { categories } from '@/data/categories';

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
