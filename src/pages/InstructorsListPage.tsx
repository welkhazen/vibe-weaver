import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import FilterSection, { FilterValues } from '@/components/FilterSection';
import InstructorDetail from '@/components/InstructorDetail';
import { getSubcategoryById, getCategoryById } from '@/data/categories';
import { getInstructorsBySubcategory, Instructor } from '@/data/instructors';
import { cn } from '@/lib/utils';

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
  
  const instructors = useMemo(() => {
    if (!subcategoryId) return [];
    return getInstructorsBySubcategory(subcategoryId);
  }, [subcategoryId]);

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
                <div className="w-14 h-14 rounded-full bg-accent/60 border border-border/50 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-semibold text-foreground">
                    {instructor.provider.charAt(0)}
                  </span>
                </div>
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
