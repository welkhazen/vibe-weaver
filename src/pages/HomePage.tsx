import { useState, useMemo } from 'react';
import CategoryFilter, { categories } from '@/components/CategoryFilter';
import ServiceCard from '@/components/ServiceCard';
import { Search } from 'lucide-react';

// Mock data for services
const mockServices = [
  { id: 1, title: 'Vinyasa Flow Yoga', provider: 'Sarah Chen', category: 'yoga', rating: 4.9, reviews: 128, price: '$45', location: 'Downtown', duration: '60 min' },
  { id: 2, title: 'CBT Therapy Session', provider: 'Dr. Michael Ross', category: 'therapy', rating: 4.8, reviews: 89, price: '$120', location: 'Online', duration: '50 min' },
  { id: 3, title: 'Brazilian Jiu-Jitsu', provider: 'Carlos Silva', category: 'sports', rating: 4.9, reviews: 256, price: '$35', location: 'Midtown', duration: '90 min' },
  { id: 4, title: 'Mountain Hiking Guide', provider: 'Alex Turner', category: 'outdoor', rating: 4.7, reviews: 67, price: '$80', location: 'Various', duration: '4 hrs' },
  { id: 5, title: 'Piano Lessons', provider: 'Emma Williams', category: 'arts', rating: 5.0, reviews: 42, price: '$55', location: 'East Side', duration: '45 min' },
  { id: 6, title: 'Math Tutoring', provider: 'David Kim', category: 'tutoring', rating: 4.8, reviews: 93, price: '$40', location: 'Online', duration: '60 min' },
  { id: 7, title: 'Pilates Reformer', provider: 'Lisa Park', category: 'yoga', rating: 4.9, reviews: 78, price: '$50', location: 'Westside', duration: '55 min' },
  { id: 8, title: 'Life Coaching', provider: 'James Wilson', category: 'other', rating: 4.6, reviews: 34, price: '$95', location: 'Online', duration: '60 min' },
];

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = useMemo(() => {
    return mockServices.filter((service) => {
      const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
      const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          service.provider.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="animate-fade-in">
      {/* Search bar */}
      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      {/* Category filters */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Featured section */}
      <div className="px-4 mt-4">
        <div className="metallic-card p-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />
          <div className="relative z-10">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Featured</span>
            <h2 className="text-xl font-bold text-foreground mt-1">Find Your Perfect Coach</h2>
            <p className="text-sm text-muted-foreground mt-1">Explore 500+ verified professionals</p>
          </div>
        </div>
      </div>

      {/* Services list */}
      <div className="px-4 py-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">
            {selectedCategory === 'all' 
              ? 'All Services' 
              : categories.find(c => c.id === selectedCategory)?.label}
          </h3>
          <span className="text-sm text-muted-foreground">{filteredServices.length} available</span>
        </div>

        <div className="space-y-3 pb-20">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} {...service} />
          ))}

          {filteredServices.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No services found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
