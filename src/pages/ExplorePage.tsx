import { TrendingUp, Trophy, UserPlus, MapPin, Video, Dumbbell, Heart, Palette, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

const ExplorePage = () => {
  const trending = [
    { tag: 'Yoga', count: '2.3k' },
    { tag: 'Meditation', count: '1.8k' },
    { tag: 'Personal Training', count: '1.5k' },
    { tag: 'Dance', count: '1.2k' },
  ];

  const featured = [
    { title: 'Top Rated This Week', icon: Trophy },
    { title: 'New Instructors', icon: UserPlus },
    { title: 'Near You', icon: MapPin },
    { title: 'Online Sessions', icon: Video },
  ];

  const popularCategories = [
    { name: 'Fitness & Sports', count: 245, icon: Dumbbell },
    { name: 'Wellness & Health', count: 189, icon: Heart },
    { name: 'Creative Arts', count: 156, icon: Palette },
    { name: 'Education', count: 134, icon: GraduationCap },
  ];

  return (
    <div className="px-4 py-4 animate-fade-in pb-24">
      {/* Trending */}
      <div className="mt-2">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-foreground" />
          <h3 className="font-semibold text-foreground">Trending Now</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {trending.map((item) => (
            <button
              key={item.tag}
              className="px-4 py-2 rounded-full metallic-button text-sm font-medium text-foreground hover:text-primary transition-all duration-300 active:scale-[0.97]"
            >
              #{item.tag} <span className="text-muted-foreground ml-1">{item.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured categories */}
      <div className="mt-6">
        <h3 className="font-semibold text-foreground mb-3">Discover</h3>
        <div className="grid grid-cols-2 gap-3">
          {featured.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.title}
                className={cn(
                  'metallic-card theme-glow-box p-4 text-left transition-all duration-300',
                  'hover:scale-[1.02] hover:border-primary/30 active:scale-[0.98]',
                  'group'
                )}
              >
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center mb-3 transition-all duration-300 group-hover:bg-primary/20">
                  <IconComponent className="w-5 h-5 text-foreground transition-colors group-hover:text-primary icon-glow" strokeWidth={1.5} />
                </div>
                <p className="font-medium text-foreground text-sm">{item.title}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Popular categories */}
      <div className="mt-6">
        <h3 className="font-semibold text-foreground mb-3">Popular Categories</h3>
        <div className="space-y-2">
          {popularCategories.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <button
                key={cat.name}
                className="w-full metallic-card theme-glow-box p-4 flex items-center justify-between transition-all duration-300 hover:border-primary/30 active:scale-[0.98] group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center transition-all duration-300 group-hover:bg-primary/20">
                    <IconComponent className="w-5 h-5 text-foreground transition-colors group-hover:text-primary icon-glow" strokeWidth={1.5} />
                  </div>
                  <span className="font-medium text-foreground">{cat.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">{cat.count} providers</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
