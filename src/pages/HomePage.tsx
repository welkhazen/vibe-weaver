import { useState, useMemo } from 'react';
import CategoryGrid from '@/components/CategoryGrid';
import ServiceCard from '@/components/ServiceCard';
import InstructorDetail from '@/components/InstructorDetail';
import FilterSection, { FilterValues } from '@/components/FilterSection';
import GuidedSearch from '@/components/GuidedSearch';
import { Search, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  categories, 
  getSubcategoriesByCategory, 
  getCategoryById, 
  getSubcategoryById 
} from '@/data/categories';
import { instructors, getInstructorsBySubcategory, Instructor } from '@/data/instructors';

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterValues>({
    location: 'all',
    maxPrice: 200,
    sessionType: 'all',
  });

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(null);
  };

  const handleSubcategorySelect = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId);
  };

  const handleBackFromSubcategory = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
  };

  const handleBackFromInstructors = () => {
    setSelectedSubcategory(null);
  };

  const currentSubcategories = selectedCategory 
    ? getSubcategoriesByCategory(selectedCategory) 
    : [];

  const filteredInstructors = useMemo(() => {
    if (!selectedSubcategory) return [];
    return getInstructorsBySubcategory(selectedSubcategory).filter((instructor) => {
      const matchesSearch = instructor.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          instructor.provider.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [selectedSubcategory, searchQuery]);

  const selectedCategoryData = getCategoryById(selectedCategory || '');
  const selectedSubcategoryData = getSubcategoryById(selectedSubcategory || '');

  // Instructor detail view
  if (selectedInstructor) {
    return (
      <InstructorDetail 
        instructor={selectedInstructor} 
        onBack={() => setSelectedInstructor(null)} 
      />
    );
  }

  // Category selection view (home)
  if (!selectedCategory) {
    return (
      <div className="animate-fade-in pb-24">
        {/* Hero section */}
        <div className="px-4 py-6">
          <div className="metallic-card p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
            <div className="relative z-10">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Welcome</span>
              <h2 className="text-xl font-bold text-foreground mt-1">Find Your Perfect Coach</h2>
              <p className="text-sm text-muted-foreground mt-1">Explore 500+ verified professionals</p>
            </div>
          </div>
        </div>

        {/* AI Guided Search */}
        <GuidedSearch />

        {/* Filter Section */}
        <FilterSection filters={filters} onFiltersChange={setFilters} />

        {/* Category title */}
        <div className="px-4 pb-4">
          <h3 className="text-lg font-semibold text-foreground">Browse Categories</h3>
          <p className="text-sm text-muted-foreground">Select a category to view instructors</p>
        </div>

        {/* Category grid - 2 columns */}
        <CategoryGrid onSelectCategory={handleCategorySelect} />
      </div>
    );
  }

  // Subcategory selection view
  if (selectedCategory && !selectedSubcategory) {
    return (
      <div className="animate-fade-in pb-24">
        {/* Back button and category header */}
        <div className="px-4 py-3 flex items-center gap-3">
          <button
            onClick={handleBackFromSubcategory}
            className="p-2 rounded-xl bg-accent hover:bg-accent/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex items-center gap-2">
            {selectedCategoryData && <selectedCategoryData.icon className="w-6 h-6 text-foreground" strokeWidth={1.5} />}
            <h2 className="text-lg font-bold text-foreground">{selectedCategoryData?.label}</h2>
          </div>
        </div>

        {/* Subcategory title */}
        <div className="px-4 pb-4">
          <h3 className="text-base font-medium text-foreground">Choose a Specialty</h3>
          <p className="text-sm text-muted-foreground">Select the type of service you're looking for</p>
        </div>

        {/* Subcategory grid */}
        <div className="grid grid-cols-2 gap-3 px-4">
          {currentSubcategories.map((sub) => {
            const IconComponent = sub.icon;
            return (
              <button
                key={sub.id}
                onClick={() => handleSubcategorySelect(sub.id)}
                className={cn(
                  'metallic-card p-5 flex flex-col items-center gap-3 transition-all duration-300 ease-out',
                  'hover:scale-[1.03] hover:border-primary/30 active:scale-[0.97]',
                  'group'
                )}
              >
                <IconComponent className="w-10 h-10 text-foreground transition-all duration-300 group-hover:scale-110 group-hover:text-primary" strokeWidth={1.5} />
                <span className="text-sm font-medium text-foreground text-center leading-tight transition-colors duration-300 group-hover:text-primary">
                  {sub.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Instructors list view (after subcategory selection)
  return (
    <div className="animate-fade-in pb-24">
      {/* Back button and subcategory header */}
      <div className="px-4 py-3 flex items-center gap-3">
        <button
          onClick={handleBackFromInstructors}
          className="p-2 rounded-xl bg-accent hover:bg-accent/80 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex items-center gap-2">
          {selectedSubcategoryData && <selectedSubcategoryData.icon className="w-6 h-6 text-foreground" strokeWidth={1.5} />}
          <h2 className="text-lg font-bold text-foreground">{selectedSubcategoryData?.label}</h2>
        </div>
      </div>

      {/* Search bar */}
      <div className="px-4 py-2">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search instructors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      {/* Instructors count */}
      <div className="px-4 py-3">
        <span className="text-sm text-muted-foreground">{filteredInstructors.length} instructors available</span>
      </div>

      {/* Instructors list */}
      <div className="px-4 space-y-3">
        {filteredInstructors.map((instructor) => (
          <ServiceCard 
            key={instructor.id} 
            {...instructor} 
            onClick={() => setSelectedInstructor(instructor)}
          />
        ))}

        {filteredInstructors.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No instructors found</p>
            <p className="text-sm mt-1">Try adjusting your search</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
