import { Bell, Menu, Settings, User, Lock, Shield, Eye, HelpCircle, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  title?: string;
  onNavigate?: (tab: string) => void;
}

const Header = ({ title = 'The Art of Raw', onNavigate }: HeaderProps) => {
  const menuItems = [
    { icon: <User className="w-4 h-4" />, label: 'Edit Profile', action: 'profile' },
    { icon: <Lock className="w-4 h-4" />, label: 'Change Password', action: 'password' },
    { icon: <Shield className="w-4 h-4" />, label: 'Privacy & Security', action: 'privacy' },
    { icon: <Bell className="w-4 h-4" />, label: 'Notifications', action: 'notifications' },
    { icon: <Eye className="w-4 h-4" />, label: 'Visibility', action: 'visibility' },
    { icon: <HelpCircle className="w-4 h-4" />, label: 'Help & FAQ', action: 'help' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50 safe-area-top">
      <div className="flex items-center justify-between px-4 h-14 max-w-lg mx-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-xl hover:bg-accent transition-colors">
              <Menu className="w-5 h-5 text-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 metallic-card border-border/50">
            <DropdownMenuLabel className="text-foreground font-semibold">Settings</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border/50" />
            
            {menuItems.map((item) => (
              <DropdownMenuItem 
                key={item.action}
                className="flex items-center gap-3 cursor-pointer hover:bg-accent/50 text-foreground"
                onClick={() => onNavigate?.(item.action)}
              >
                <span className="text-muted-foreground">{item.icon}</span>
                {item.label}
              </DropdownMenuItem>
            ))}
            
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem className="flex items-center gap-3 cursor-pointer text-destructive hover:bg-destructive/10">
              <LogOut className="w-4 h-4" />
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <h1 className="text-lg font-bold text-foreground tracking-tight">
          {title}
        </h1>

        <button className="p-2 rounded-xl hover:bg-accent transition-colors relative">
          <Bell className="w-5 h-5 text-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
        </button>
      </div>
    </header>
  );
};

export default Header;
