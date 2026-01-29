import { useState, useMemo } from 'react';
import CategoryGrid, { categories } from '@/components/CategoryGrid';
import ServiceCard from '@/components/ServiceCard';
import InstructorDetail from '@/components/InstructorDetail';
import FilterSection, { FilterValues } from '@/components/FilterSection';
import GuidedSearch from '@/components/GuidedSearch';
import { Search, ArrowLeft, Brain, Heart, Sparkles, Leaf, MessageCircle, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

// Subcategories for Mental Health
const mentalHealthSubcategories = [
  { id: 'therapy-sub', label: 'Therapy', icon: Brain },
  { id: 'meditation', label: 'Meditation', icon: Sparkles },
  { id: 'stress', label: 'Stress Management', icon: Brain },
  { id: 'coaching', label: 'Life Coaching', icon: Heart },
  { id: 'mindfulness', label: 'Mindfulness', icon: Leaf },
  { id: 'anxiety', label: 'Anxiety Support', icon: MessageCircle },
  { id: 'relationship', label: 'Relationship & Family', icon: Users },
];

// Mock data for services/instructors
const mockServices = [
  { id: 1, title: 'Vinyasa Flow Yoga', provider: 'Sarah Chen', category: 'yoga', subcategory: null, rating: 4.9, reviews: 128, price: '$45', location: 'Downtown', duration: '60 min' },
  { id: 2, title: 'CBT Therapy Session', provider: 'Dr. Michael Ross', category: 'therapy', subcategory: 'therapy-sub', rating: 4.8, reviews: 89, price: '$120', location: 'Online', duration: '50 min' },
  { id: 3, title: 'Brazilian Jiu-Jitsu', provider: 'Carlos Silva', category: 'sports', subcategory: null, rating: 4.9, reviews: 256, price: '$35', location: 'Midtown', duration: '90 min' },
  { id: 4, title: 'Mountain Hiking Guide', provider: 'Alex Turner', category: 'outdoor', subcategory: null, rating: 4.7, reviews: 67, price: '$80', location: 'Various', duration: '4 hrs' },
  { id: 5, title: 'Piano Lessons', provider: 'Emma Williams', category: 'arts', subcategory: null, rating: 5.0, reviews: 42, price: '$55', location: 'East Side', duration: '45 min' },
  { id: 6, title: 'Math Tutoring', provider: 'David Kim', category: 'tutoring', subcategory: null, rating: 4.8, reviews: 93, price: '$40', location: 'Online', duration: '60 min' },
  { id: 7, title: 'Pilates Reformer', provider: 'Lisa Park', category: 'yoga', subcategory: null, rating: 4.9, reviews: 78, price: '$50', location: 'Westside', duration: '55 min' },
  { id: 8, title: 'Life Coaching Session', provider: 'James Wilson', category: 'therapy', subcategory: 'coaching', rating: 4.6, reviews: 34, price: '$95', location: 'Online', duration: '60 min' },
  { id: 9, title: 'Kickboxing Training', provider: 'Mike Johnson', category: 'sports', subcategory: null, rating: 4.8, reviews: 112, price: '$40', location: 'Downtown', duration: '60 min' },
  { id: 10, title: 'Anxiety Counseling', provider: 'Dr. Sarah Lee', category: 'therapy', subcategory: 'anxiety', rating: 4.9, reviews: 156, price: '$110', location: 'Online', duration: '50 min' },
  { id: 11, title: 'Rock Climbing Guide', provider: 'Jake Miller', category: 'outdoor', subcategory: null, rating: 4.8, reviews: 89, price: '$75', location: 'Boulder Park', duration: '3 hrs' },
  { id: 12, title: 'Guitar Lessons', provider: 'Tom Garcia', category: 'arts', subcategory: null, rating: 4.7, reviews: 67, price: '$50', location: 'Midtown', duration: '45 min' },
  { id: 13, title: 'Guided Meditation', provider: 'Maya Johnson', category: 'therapy', subcategory: 'meditation', rating: 4.9, reviews: 203, price: '$35', location: 'Online', duration: '30 min' },
  { id: 14, title: 'Stress Relief Workshop', provider: 'Dr. Emily Chen', category: 'therapy', subcategory: 'stress', rating: 4.8, reviews: 87, price: '$65', location: 'Midtown', duration: '90 min' },
  { id: 15, title: 'Mindfulness Training', provider: 'Zen Master Liu', category: 'therapy', subcategory: 'mindfulness', rating: 5.0, reviews: 142, price: '$50', location: 'Downtown', duration: '45 min' },
  { id: 16, title: 'Couples Counseling', provider: 'Dr. Robert Hayes', category: 'therapy', subcategory: 'relationship', rating: 4.7, reviews: 68, price: '$150', location: 'Online', duration: '60 min' },
  { id: 17, title: 'Family Therapy', provider: 'Dr. Anna Martinez', category: 'therapy', subcategory: 'relationship', rating: 4.8, reviews: 95, price: '$140', location: 'Westside', duration: '75 min' },
  { id: 18, title: 'Executive Coaching', provider: 'Mark Stevens', category: 'therapy', subcategory: 'coaching', rating: 4.9, reviews: 56, price: '$200', location: 'Online', duration: '60 min' },
];

type Instructor = typeof mockServices[0];

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
    // If it's therapy/mental health, don't auto-select subcategory
    if (categoryId !== 'therapy') {
      setSelectedSubcategory(null);
    }
  };

  const handleBackFromSubcategory = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
  };

  const handleBackFromInstructors = () => {
    if (selectedCategory === 'therapy') {
      setSelectedSubcategory(null);
    } else {
      setSelectedCategory(null);
    }
  };
  const filteredServices = useMemo(() => {
    if (!selectedCategory) return [];
    return mockServices.filter((service) => {
      const matchesCategory = service.category === selectedCategory;
      const matchesSubcategory = selectedCategory === 'therapy' 
        ? (selectedSubcategory ? service.subcategory === selectedSubcategory : true)
        : true;
      const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          service.provider.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSubcategory && matchesSearch;
    });
  }, [selectedCategory, selectedSubcategory, searchQuery]);

  const selectedCategoryData = categories.find(c => c.id === selectedCategory);
  const selectedSubcategoryData = mentalHealthSubcategories.find(s => s.id === selectedSubcategory);

  // Instructor detail view
  if (selectedInstructor) {
    return (
      <InstructorDetail 
        instructor={selectedInstructor} 
        onBack={() => setSelectedInstructor(null)} 
      />
    );
  }

  // Category selection view
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

  // Subcategory selection for Mental Health
  if (selectedCategory === 'therapy' && !selectedSubcategory) {
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
          <p className="text-sm text-muted-foreground">Select the type of support you're looking for</p>
        </div>

        {/* Subcategory grid */}
        <div className="grid grid-cols-2 gap-3 px-4">
          {mentalHealthSubcategories.map((sub) => {
            const IconComponent = sub.icon;
            return (
              <button
                key={sub.id}
                onClick={() => setSelectedSubcategory(sub.id)}
                className={cn(
                  'metallic-card p-5 flex flex-col items-center gap-3 transition-all',
                  'hover:scale-[1.02] hover:border-primary/30 active:scale-[0.98]'
                )}
              >
                <IconComponent className="w-10 h-10 text-foreground" strokeWidth={1.5} />
                <span className="text-sm font-medium text-foreground text-center leading-tight">
                  {sub.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Instructors list view (after category/subcategory selection)
  return (
    <div className="animate-fade-in pb-24">
      {/* Back button and category header */}
      <div className="px-4 py-3 flex items-center gap-3">
        <button
          onClick={handleBackFromInstructors}
          className="p-2 rounded-xl bg-accent hover:bg-accent/80 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex items-center gap-2">
          {selectedCategory === 'therapy' && selectedSubcategoryData ? (
            <>
              <selectedSubcategoryData.icon className="w-6 h-6 text-foreground" strokeWidth={1.5} />
              <h2 className="text-lg font-bold text-foreground">{selectedSubcategoryData.label}</h2>
            </>
          ) : (
            <>
              {selectedCategoryData && <selectedCategoryData.icon className="w-6 h-6 text-foreground" strokeWidth={1.5} />}
              <h2 className="text-lg font-bold text-foreground">{selectedCategoryData?.label}</h2>
            </>
          )}
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
        <span className="text-sm text-muted-foreground">{filteredServices.length} instructors available</span>
      </div>

      {/* Instructors list */}
      <div className="px-4 space-y-3">
        {filteredServices.map((service) => (
          <ServiceCard 
            key={service.id} 
            {...service} 
            onClick={() => setSelectedInstructor(service)}
          />
        ))}

        {filteredServices.length === 0 && (
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
