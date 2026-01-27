import { Search, Filter, TrendingUp } from 'lucide-react';

const ExplorePage = () => {
  const trending = [
    { tag: 'Yoga', count: '2.3k' },
    { tag: 'Meditation', count: '1.8k' },
    { tag: 'Personal Training', count: '1.5k' },
    { tag: 'Dance', count: '1.2k' },
  ];

  const featured = [
    { title: 'Top Rated This Week', icon: '🏆', color: 'from-yellow-500/30' },
    { title: 'New Instructors', icon: '✨', color: 'from-purple-500/30' },
    { title: 'Near You', icon: '📍', color: 'from-blue-500/30' },
    { title: 'Online Sessions', icon: '💻', color: 'from-green-500/30' },
  ];

  return (
    <div className="px-4 py-4 animate-fade-in pb-24">
      {/* Search header */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <button className="h-12 w-12 rounded-xl metallic-button flex items-center justify-center">
          <Filter className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Trending */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Trending Now</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {trending.map((item) => (
            <button
              key={item.tag}
              className="px-4 py-2 rounded-full metallic-button text-sm font-medium text-foreground hover:text-primary transition-colors"
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
          {featured.map((item) => (
            <button
              key={item.title}
              className="metallic-card p-4 text-left hover:scale-[1.02] transition-transform"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} to-transparent rounded-2xl`} />
              <div className="relative">
                <span className="text-3xl">{item.icon}</span>
                <p className="font-medium text-foreground mt-2">{item.title}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Popular categories */}
      <div className="mt-6">
        <h3 className="font-semibold text-foreground mb-3">Popular Categories</h3>
        <div className="space-y-2">
          {[
            { name: 'Fitness & Sports', count: 245, icon: '💪' },
            { name: 'Wellness & Health', count: 189, icon: '🌿' },
            { name: 'Creative Arts', count: 156, icon: '🎨' },
            { name: 'Education', count: 134, icon: '📚' },
          ].map((cat) => (
            <button
              key={cat.name}
              className="w-full metallic-card p-4 flex items-center justify-between hover:bg-accent/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{cat.icon}</span>
                <span className="font-medium text-foreground">{cat.name}</span>
              </div>
              <span className="text-sm text-muted-foreground">{cat.count} providers</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
