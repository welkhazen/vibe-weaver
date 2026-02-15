import { Home, Search, User, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const BrainIcon = ({ themeColor }: { themeColor: string }) => (
  <svg viewBox="0 0 24 24" className="w-10 h-10" xmlns="http://www.w3.org/2000/svg">
    {/* Brain outline - always white */}
    <path
      d="M12 2C9.5 2 7.5 3.5 7 5.5C5.5 5.5 4 7 4 9C3 9.5 2 11 2 12.5C2 14.5 3.5 16 5 16.5C5 18 6.5 20 9 20C10.5 21.5 12 22 12 22C12 22 13.5 21.5 15 20C17.5 20 19 18 19 16.5C20.5 16 22 14.5 22 12.5C22 11 21 9.5 20 9C20 7 18.5 5.5 17 5.5C16.5 3.5 14.5 2 12 2Z"
      fill="none"
      stroke="white"
      strokeWidth="1.2"
      strokeLinejoin="round"
      style={{ filter: 'drop-shadow(0 0 0.5px rgba(255,255,255,0.4))' }}
    />
    {/* Internal brain features - theme colored */}
    <path
      d="M12 4V22M8 8C9.5 8.5 10.5 9 12 9M16 8C14.5 8.5 13.5 9 12 9M7 13C8.5 12.5 10 12 12 12M17 13C15.5 12.5 14 12 12 12M8 17C9.5 16.5 10.5 16 12 16M16 17C14.5 16.5 13.5 16 12 16"
      fill="none"
      stroke={themeColor}
      strokeWidth="1"
      strokeLinecap="round"
      opacity="0.9"
    />
  </svg>
);

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  useThemeColor?: boolean;
}

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  const [themeHue, setThemeHue] = useState(45);
  const [themeSat, setThemeSat] = useState('90%');
  const [themeLit, setThemeLit] = useState('55%');

  useEffect(() => {
    const readTheme = () => {
      const style = getComputedStyle(document.documentElement);
      const h = style.getPropertyValue('--gold-h').trim();
      const s = style.getPropertyValue('--gold-s').trim();
      const l = style.getPropertyValue('--gold-l').trim();
      if (h) setThemeHue(parseFloat(h));
      if (s) setThemeSat(s);
      if (l) setThemeLit(l);
    };
    readTheme();
    const observer = new MutationObserver(readTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });
    return () => observer.disconnect();
  }, []);

  const themeColor = `hsl(${themeHue}, ${themeSat}, ${themeLit})`;

  const navItems: NavItem[] = [
    { id: "home", label: "Home", icon: <Home className="w-5 h-5" strokeWidth={2.5} /> },
    { id: "search", label: "Explore", icon: <Search className="w-5 h-5" strokeWidth={2.5} /> },
    {
      id: "tcm", label: "", useThemeColor: true,
      icon: <BrainIcon themeColor={themeColor} />,
    },
    { id: "challenges", label: "Challenges", icon: <Trophy className="w-5 h-5" strokeWidth={2.5} /> },
    { id: "profile", label: "Profile", icon: <User className="w-5 h-5" strokeWidth={2.5} /> },
  ];

  return (
    <>
      <style>{`
        @keyframes brainGlow {
          0%, 100% {
            box-shadow: 0 0 6px 1px hsla(var(--gold-h, 45), var(--gold-s, 90%), var(--gold-l, 55%), 0.2);
          }
          50% {
            box-shadow: 0 0 12px 3px hsla(var(--gold-h, 45), var(--gold-s, 90%), var(--gold-l, 55%), 0.4);
          }
        }
      `}</style>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-t border-border safe-area-bottom">
        <div className="flex justify-around items-center h-16 w-full max-w-lg mx-auto px-4 sm:px-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex flex-col items-center justify-center w-16 h-full transition-all duration-300 ease-out",
                activeTab === item.id ? "text-foreground" : "text-foreground/70 hover:text-foreground",
              )}
            >
              <div
                className={cn(
                  "p-2 rounded-xl transition-all duration-300 ease-out",
                  activeTab === item.id ? "bg-primary/20 glow-primary scale-110" : "hover:scale-105 active:scale-95",
                )}
                style={
                  item.useThemeColor
                    ? {
                        color: `hsl(var(--gold-h, 45), var(--gold-s, 90%), var(--gold-l, 55%))`,
                        animation: "brainGlow 5s ease-in-out infinite",
                        borderRadius: "12px",
                      }
                    : undefined
                }
              >
                {item.icon}
              </div>
              <span
                className="text-[10px] mt-1 font-medium"
                style={
                  item.useThemeColor
                    ? {
                        color: `hsl(var(--gold-h, 45), var(--gold-s, 90%), var(--gold-l, 55%))`,
                      }
                    : undefined
                }
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};

export default BottomNav;
