import GuidedSearch from '@/components/GuidedSearch';
import OrbitalCategorySelector from '@/components/OrbitalCategorySelector';
import FilterTabs from '@/components/FilterTabs';

const HomePage = () => {
  return (
    <div className="animate-fade-in pb-24">
      {/* Combined Hero + AI Search */}
      <GuidedSearch />

      {/* Quick Filter */}
      <FilterTabs />

      {/* Category title */}
      <div className="px-4 pb-4">
        <h3 className="text-lg font-semibold text-foreground">Browse Categories</h3>
        <p className="text-sm text-muted-foreground">Tap a category to explore</p>
      </div>

      {/* Orbital Category Selector */}
      <OrbitalCategorySelector />
    </div>
  );
};

export default HomePage;
