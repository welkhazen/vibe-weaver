import { useState } from 'react';
import { MapPin, DollarSign, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const sessionTypes = [
  { id: 'all', label: 'All Types' },
  { id: 'single', label: 'Single Session' },
  { id: 'package', label: 'Package Deal' },
  { id: 'online', label: 'Online' },
  { id: 'group', label: 'Group Classes' },
];

const locations = [
  { id: 'all', label: 'All Locations' },
  { id: 'downtown', label: 'Downtown' },
  { id: 'midtown', label: 'Midtown' },
  { id: 'westside', label: 'Westside' },
  { id: 'east-side', label: 'East Side' },
  { id: 'online', label: 'Online Only' },
];

export interface FilterValues {
  location: string;
  maxPrice: number;
  sessionType: string;
}

interface FilterSectionProps {
  filters: FilterValues;
  onFiltersChange: (filters: FilterValues) => void;
}

const FilterSection = ({ filters, onFiltersChange }: FilterSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLocationChange = (value: string) => {
    onFiltersChange({ ...filters, location: value });
  };

  const handlePriceChange = (value: number[]) => {
    onFiltersChange({ ...filters, maxPrice: value[0] });
  };

  const handleSessionTypeChange = (typeId: string) => {
    onFiltersChange({ ...filters, sessionType: typeId });
  };

  const activeFiltersCount = [
    filters.location !== 'all',
    filters.maxPrice < 200,
    filters.sessionType !== 'all',
  ].filter(Boolean).length;

  return (
    <div className="px-4 pb-4">
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'w-full metallic-card p-3 flex items-center justify-between transition-all duration-300',
          isExpanded && 'border-primary/30'
        )}
      >
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Filters</span>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium bg-primary/20 text-primary rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <span className="text-xs text-muted-foreground">
          {isExpanded ? 'Hide' : 'Show'}
        </span>
      </button>

      {/* Expandable Filter Content */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-out',
          isExpanded ? 'max-h-[400px] opacity-100 mt-3' : 'max-h-0 opacity-0'
        )}
      >
        <div className="metallic-card p-4 space-y-4">
          {/* Location Select */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              Location
            </label>
            <Select value={filters.location} onValueChange={handleLocationChange}>
              <SelectTrigger className="w-full bg-background border-border">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border z-50">
                {locations.map((loc) => (
                  <SelectItem key={loc.id} value={loc.id}>
                    {loc.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Max Price Slider */}
          <div className="space-y-3">
            <label className="flex items-center justify-between text-sm font-medium text-foreground">
              <span className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                Maximum Price
              </span>
              <span className="text-primary font-semibold">
                ${filters.maxPrice}
              </span>
            </label>
            <Slider
              value={[filters.maxPrice]}
              onValueChange={handlePriceChange}
              max={200}
              min={10}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>$10</span>
              <span>$200+</span>
            </div>
          </div>

          {/* Session Type Pills */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Session Type
            </label>
            <div className="flex flex-wrap gap-2">
              {sessionTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleSessionTypeChange(type.id)}
                  className={cn(
                    'px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-300',
                    filters.sessionType === type.id
                      ? 'bg-primary text-primary-foreground scale-[1.02]'
                      : 'bg-accent text-foreground hover:bg-accent/80 active:scale-[0.97]'
                  )}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reset Button */}
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                onFiltersChange({
                  location: 'all',
                  maxPrice: 200,
                  sessionType: 'all',
                })
              }
              className="w-full text-muted-foreground hover:text-foreground"
            >
              Reset Filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
