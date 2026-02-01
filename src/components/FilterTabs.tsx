import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Tag, DollarSign, ChevronDown, X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { categories, subcategories, getSubcategoriesByCategory } from '@/data/categories';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

const locations = [
  'New York',
  'Los Angeles',
  'Chicago',
  'Houston',
  'Miami',
  'San Francisco',
  'Seattle',
  'Boston',
  'Denver',
  'Austin',
];

const FilterTabs = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<number[]>([150]);

  const availableSubcategories = useMemo(() => {
    if (!selectedCategory) return [];
    return getSubcategoriesByCategory(selectedCategory);
  }, [selectedCategory]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setSelectedSubcategory(''); // Reset subcategory when category changes
  };

  const handleSearch = () => {
    if (selectedSubcategory) {
      navigate(`/instructors/${selectedSubcategory}`);
    } else if (selectedCategory) {
      // Navigate to first subcategory of selected category
      const subs = getSubcategoriesByCategory(selectedCategory);
      if (subs.length > 0) {
        navigate(`/instructors/${subs[0].id}`);
      }
    }
  };

  const clearFilters = () => {
    setLocation('');
    setSelectedCategory('');
    setSelectedSubcategory('');
    setMaxPrice([150]);
  };

  const hasFilters = location || selectedCategory || selectedSubcategory || maxPrice[0] !== 150;

  return (
    <div className="px-4 py-4">
      <div className="metallic-card theme-glow-box p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            Quick Filter
          </h3>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>

        {/* Filter Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Location Select */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Location
            </label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="h-9 bg-accent/50 border-border/50 text-sm">
                <SelectValue placeholder="Any location" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border z-50">
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc} className="text-sm">
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Select */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground flex items-center gap-1">
              <Tag className="w-3 h-3" />
              Category
            </label>
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="h-9 bg-accent/50 border-border/50 text-sm">
                <SelectValue placeholder="Any category" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border z-50">
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id} className="text-sm">
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subcategory Select */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Subcategory</label>
            <Select 
              value={selectedSubcategory} 
              onValueChange={setSelectedSubcategory}
              disabled={!selectedCategory}
            >
              <SelectTrigger className={cn(
                "h-9 bg-accent/50 border-border/50 text-sm",
                !selectedCategory && "opacity-50"
              )}>
                <SelectValue placeholder={selectedCategory ? "Select..." : "Pick category first"} />
              </SelectTrigger>
              <SelectContent className="bg-card border-border z-50">
                {availableSubcategories.map((sub) => (
                  <SelectItem key={sub.id} value={sub.id} className="text-sm">
                    {sub.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Max Price */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              Max Price: ${maxPrice[0]}
            </label>
            <div className="h-9 flex items-center px-2">
              <Slider
                value={maxPrice}
                onValueChange={setMaxPrice}
                max={300}
                min={10}
                step={10}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          disabled={!selectedCategory && !selectedSubcategory}
          className="w-full metallic-button h-10 text-sm font-medium"
        >
          <Search className="w-4 h-4 mr-2" />
          Find Instructors
        </Button>
      </div>
    </div>
  );
};

export default FilterTabs;
