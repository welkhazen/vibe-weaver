import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Tag, DollarSign, X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { categories, getSubcategoriesByCategory } from '@/data/categories';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

// Lebanon districts and their areas
const lebanonLocations: Record<string, string[]> = {
  'Beirut': ['Achrafieh', 'Hamra', 'Verdun', 'Mar Mikhael', 'Gemmayzeh', 'Downtown', 'Badaro', 'Clemenceau'],
  'Mount Lebanon': ['Jounieh', 'Byblos', 'Baabda', 'Aley', 'Chouf', 'Metn', 'Kesrwan', 'Broummana'],
  'North Lebanon': ['Tripoli', 'Batroun', 'Bcharre', 'Koura', 'Zgharta', 'Minieh', 'Akkar'],
  'South Lebanon': ['Sidon', 'Tyre', 'Jezzine', 'Nabatieh', 'Bint Jbeil', 'Marjayoun'],
  'Bekaa': ['Zahle', 'Baalbek', 'Hermel', 'Rachaya', 'West Bekaa'],
};

const districts = Object.keys(lebanonLocations);

const FilterTabs = () => {
  const navigate = useNavigate();
  const [district, setDistrict] = useState<string>('');
  const [area, setArea] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<number[]>([150]);

  const availableAreas = useMemo(() => {
    if (!district) return [];
    return lebanonLocations[district] || [];
  }, [district]);

  const availableSubcategories = useMemo(() => {
    if (!selectedCategory) return [];
    return getSubcategoriesByCategory(selectedCategory);
  }, [selectedCategory]);

  const handleDistrictChange = (value: string) => {
    setDistrict(value);
    setArea(''); // Reset area when district changes
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setSelectedSubcategory('');
  };

  const handleSearch = () => {
    if (selectedSubcategory) {
      navigate(`/instructors/${selectedSubcategory}`);
    } else if (selectedCategory) {
      const subs = getSubcategoriesByCategory(selectedCategory);
      if (subs.length > 0) {
        navigate(`/instructors/${subs[0].id}`);
      }
    }
  };

  const clearFilters = () => {
    setDistrict('');
    setArea('');
    setSelectedCategory('');
    setSelectedSubcategory('');
    setMaxPrice([150]);
  };

  const hasFilters = district || area || selectedCategory || selectedSubcategory || maxPrice[0] !== 150;

  return (
    <div className="px-4 py-2">
      <div className="metallic-card theme-glow-box p-3 space-y-2.5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Quick Filter</span>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-0.5 transition-colors"
            >
              <X className="w-2.5 h-2.5" />
              Clear
            </button>
          )}
        </div>

        {/* Filter Grid - Compact */}
        <div className="grid grid-cols-2 gap-2">
          {/* District */}
          <Select value={district} onValueChange={handleDistrictChange}>
            <SelectTrigger className="h-8 bg-accent/50 border-border/50 text-xs">
              <MapPin className="w-3 h-3 mr-1 text-muted-foreground shrink-0" />
              <SelectValue placeholder="District" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border z-50">
              {districts.map((d) => (
                <SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Area */}
          <Select value={area} onValueChange={setArea} disabled={!district}>
            <SelectTrigger className={cn("h-8 bg-accent/50 border-border/50 text-xs", !district && "opacity-50")}>
              <SelectValue placeholder={district ? "Area" : "Select district"} />
            </SelectTrigger>
            <SelectContent className="bg-card border-border z-50">
              {availableAreas.map((a) => (
                <SelectItem key={a} value={a} className="text-xs">{a}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Category */}
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="h-8 bg-accent/50 border-border/50 text-xs">
              <Tag className="w-3 h-3 mr-1 text-muted-foreground shrink-0" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border z-50">
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id} className="text-xs">{cat.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Subcategory */}
          <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory} disabled={!selectedCategory}>
            <SelectTrigger className={cn("h-8 bg-accent/50 border-border/50 text-xs", !selectedCategory && "opacity-50")}>
              <SelectValue placeholder={selectedCategory ? "Subcategory" : "Select category"} />
            </SelectTrigger>
            <SelectContent className="bg-card border-border z-50">
              {availableSubcategories.map((sub) => (
                <SelectItem key={sub.id} value={sub.id} className="text-xs">{sub.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price + Search Row */}
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2">
            <DollarSign className="w-3 h-3 text-muted-foreground shrink-0" />
            <Slider
              value={maxPrice}
              onValueChange={setMaxPrice}
              max={300}
              min={10}
              step={10}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-8">${maxPrice[0]}</span>
          </div>
          <Button
            onClick={handleSearch}
            disabled={!selectedCategory && !selectedSubcategory}
            size="sm"
            className="metallic-button h-7 text-xs px-3"
          >
            <Search className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterTabs;
