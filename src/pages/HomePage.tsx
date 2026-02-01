import { useState } from 'react';
import InstructorDetail from '@/components/InstructorDetail';
import FilterSection, { FilterValues } from '@/components/FilterSection';
import GuidedSearch from '@/components/GuidedSearch';
import OrbitalCategorySelector from '@/components/OrbitalCategorySelector';
import { Instructor } from '@/data/instructors';

const HomePage = () => {
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [filters, setFilters] = useState<FilterValues>({
    location: 'all',
    maxPrice: 200,
    sessionType: 'all',
  });

  // Instructor detail view
  if (selectedInstructor) {
    return (
      <InstructorDetail 
        instructor={selectedInstructor} 
        onBack={() => setSelectedInstructor(null)} 
      />
    );
  }

  return (
    <div className="animate-fade-in pb-24">
      {/* Combined Hero + AI Search */}
      <GuidedSearch />

      {/* Filter Section */}
      <FilterSection filters={filters} onFiltersChange={setFilters} />

      {/* Category title */}
      <div className="px-4 pb-4">
        <h3 className="text-lg font-semibold text-foreground">Browse Categories</h3>
        <p className="text-sm text-muted-foreground">Tap a category to explore</p>
      </div>

      {/* Orbital Category Selector */}
      <OrbitalCategorySelector onSelectInstructor={setSelectedInstructor} />
    </div>
  );
};

export default HomePage;
