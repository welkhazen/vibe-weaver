import { Bell, Menu } from 'lucide-react';

interface HeaderProps {
  title?: string;
}

const Header = ({ title = 'The Art of Raw' }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50 safe-area-top">
      <div className="flex items-center justify-between px-4 h-14 max-w-lg mx-auto">
        <button className="p-2 rounded-xl hover:bg-accent transition-colors">
          <Menu className="w-5 h-5 text-foreground" />
        </button>
        
        <h1 className="text-lg font-bold text-foreground tracking-tight">
          <span className="text-gold drop-shadow-[0_0_8px_hsl(var(--gold)_/_0.5)]">The Art</span>
          <span className="text-foreground"> of Raw</span>
        </h1>

        <button className="p-2 rounded-xl hover:bg-accent transition-colors relative">
          <Bell className="w-5 h-5 text-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-gold rounded-full shadow-[0_0_8px_hsl(var(--gold))]" />
        </button>
      </div>
    </header>
  );
};

export default Header;
