import { Home, Search, User, Leaf, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
  { id: 'search', label: 'Explore', icon: <Search className="w-5 h-5" /> },
  { id: 'tcm', label: 'raW', icon: <Leaf className="w-5 h-5" /> },
  { id: 'challenges', label: 'Challenges', icon: <Trophy className="w-5 h-5" /> },
  { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
];

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-t border-border safe-area-bottom">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              'flex flex-col items-center justify-center w-16 h-full transition-all duration-300 ease-out',
              activeTab === item.id
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <div
              className={cn(
                'p-2 rounded-xl transition-all duration-300 ease-out',
                activeTab === item.id 
                  ? 'bg-primary/20 glow-primary scale-110' 
                  : 'hover:scale-105 active:scale-95'
              )}
            >
              {item.icon}
            </div>
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
