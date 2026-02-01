import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import FilterSection, { FilterValues } from '@/components/FilterSection';
import InstructorDetail from '@/components/InstructorDetail';
import { getSubcategoryById, getCategoryById } from '@/data/categories';
import { getInstructorsBySubcategory, Instructor } from '@/data/instructors';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

// Category-specific photo keywords for professional images
const categoryPhotoKeywords: Record<string, string> = {
  'mental-health': 'therapist,counselor,psychologist',
  'physical': 'fitness,trainer,athlete',
  'arts-crafts': 'artist,creative,painter',
  'dance': 'dancer,ballet,choreographer',
  'music': 'musician,pianist,singer',
  'education': 'teacher,professor,tutor',
};

// Generate a consistent photo URL based on instructor id and category
const getInstructorPhotoUrl = (instructor: Instructor): string => {
  const keywords = categoryPhotoKeywords[instructor.category] || 'professional';
  // Use instructor id as seed for consistent photos
  return `https://images.unsplash.com/photo-${1500000000000 + instructor.id * 1000}?w=200&h=200&fit=crop&crop=face`;
};

const InstructorsListPage = () => {
  const { subcategoryId } = useParams<{ subcategoryId: string }>();
  const navigate = useNavigate();
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [filters, setFilters] = useState<FilterValues>({
    location: 'all',
    maxPrice: 200,
    sessionType: 'all',
  });

  const subcategory = getSubcategoryById(subcategoryId || '');
  const category = subcategory ? getCategoryById(subcategory.categoryId) : null;
  
  const allInstructors = useMemo(() => {
    if (!subcategoryId) return [];
    return getInstructorsBySubcategory(subcategoryId);
  }, [subcategoryId]);

  // Apply filters to instructors
  const instructors = useMemo(() => {
    return allInstructors.filter((instructor) => {
      // Price filter - extract numeric value from price string
      const priceNum = parseInt(instructor.price.replace(/[^0-9]/g, ''), 10);
      if (priceNum > filters.maxPrice) return false;

      // Location filter
      if (filters.location !== 'all') {
        const instructorLocation = instructor.location.toLowerCase();
        if (filters.location === 'online' && instructorLocation !== 'online') return false;
        if (filters.location === 'downtown' && !instructorLocation.includes('downtown')) return false;
        if (filters.location === 'midtown' && !instructorLocation.includes('midtown')) return false;
        if (filters.location === 'westside' && !instructorLocation.includes('westside')) return false;
        if (filters.location === 'east-side' && !instructorLocation.includes('east')) return false;
      }

      // Session type filter
      if (filters.sessionType !== 'all') {
        const location = instructor.location.toLowerCase();
        const title = instructor.title.toLowerCase();
        
        if (filters.sessionType === 'online' && location !== 'online') return false;
        if (filters.sessionType === 'group' && !title.includes('class') && !title.includes('group') && !title.includes('workshop')) return false;
        if (filters.sessionType === 'package' && !title.includes('package') && !title.includes('course') && !title.includes('bootcamp')) return false;
        if (filters.sessionType === 'single' && (title.includes('class') || title.includes('group') || title.includes('workshop') || title.includes('package') || title.includes('course'))) return false;
      }

      return true;
    });
  }, [allInstructors, filters]);

  // Show instructor detail view
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
      {/* Header with back button */}
      <div className="px-4 pt-4 pb-2">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back to Categories</span>
        </button>
        
        <div className="flex items-center gap-3">
          {subcategory && (
            <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
              <subcategory.icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {subcategory?.label || 'Instructors'}
            </h1>
            {category && (
              <p className="text-sm text-muted-foreground">{category.label}</p>
            )}
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <FilterSection filters={filters} onFiltersChange={setFilters} />

      {/* Instructors count */}
      <div className="px-4 pb-3">
        <p className="text-sm text-muted-foreground">
          {instructors.length} instructor{instructors.length !== 1 ? 's' : ''} available
        </p>
      </div>

      {/* Instructors list */}
      <div className="px-4 space-y-3">
        {instructors.length > 0 ? (
          instructors.map((instructor) => (
            <button
              key={instructor.id}
              onClick={() => setSelectedInstructor(instructor)}
              className={cn(
                'w-full metallic-card theme-glow-box p-4 text-left',
                'transition-transform duration-200 ease-out',
                'hover:scale-[1.01] active:scale-[0.99]'
              )}
            >
              <div className="flex items-start gap-4">
                <Avatar className="w-14 h-14 border-2 border-primary/30 flex-shrink-0">
                  <AvatarImage 
                    src={`https://i.pravatar.cc/150?u=${instructor.id}`} 
                    alt={instructor.provider}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-accent/60 text-lg font-semibold text-foreground">
                    {instructor.provider.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">
                    {instructor.provider}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                    {instructor.title}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-sm font-medium text-primary">
                      ${instructor.price}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {instructor.duration}
                    </span>
                    {instructor.rating && (
                      <span className="text-xs text-muted-foreground">
                        ★ {instructor.rating}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="metallic-card p-8 text-center">
            <p className="text-muted-foreground">No instructors found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your filters or check back later
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorsListPage;
