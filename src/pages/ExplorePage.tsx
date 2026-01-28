import { useState } from 'react';
import { Search, Filter, TrendingUp, Sparkles, X, Loader2 } from 'lucide-react';
import { useAISearch } from '@/hooks/useAISearch';
import ReactMarkdown from 'react-markdown';

const ExplorePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { search, isLoading, response, clearResponse } = useAISearch();

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      search(searchQuery);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    clearResponse();
  };

  const handleTrendingClick = (tag: string) => {
    setSearchQuery(`I'm looking for ${tag} classes or instructors`);
    search(`I'm looking for ${tag} classes or instructors`);
  };

  return (
    <div className="px-4 py-4 animate-fade-in pb-24">
      {/* AI Search header */}
      <form onSubmit={handleSearch} className="flex items-center gap-3">
        <div className="flex-1 relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-primary" />
            <Search className="w-4 h-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Ask AI to find what you need..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-14 pr-10 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          {(searchQuery || response) && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-accent"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
        <button 
          type="submit"
          disabled={isLoading || !searchQuery.trim()}
          className="h-12 w-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 hover:bg-primary/90 transition-colors"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Sparkles className="w-5 h-5" />
          )}
        </button>
      </form>

      {/* AI Response */}
      {(response || isLoading) && (
        <div className="mt-4 metallic-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">AI Assistant</span>
            {isLoading && <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />}
          </div>
          <div className="prose prose-sm prose-invert max-w-none text-foreground">
            <ReactMarkdown>{response || 'Thinking...'}</ReactMarkdown>
          </div>
        </div>
      )}

      {/* Only show the rest when there's no AI response */}
      {!response && !isLoading && (
        <>
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
                  onClick={() => handleTrendingClick(item.tag)}
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
                  onClick={() => handleTrendingClick(cat.name)}
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
        </>
      )}
    </div>
  );
};

export default ExplorePage;
