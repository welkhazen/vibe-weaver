import { useState, useEffect } from 'react';
import MatrixBackground from '@/components/MatrixBackground';
import GoldenGlowBackground from '@/components/GoldenGlowBackground';
import PerforatedBackground from '@/components/PerforatedBackground';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import HomePage from '@/pages/HomePage';
import ExplorePage from '@/pages/ExplorePage';
import ProfilePage from '@/pages/ProfilePage';
import TCMPage from '@/pages/TCMPage';
import ChallengesPage from '@/pages/ChallengesPage';
import { useThemeColor } from '@/hooks/useThemeColor';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');

  // Initialize theme color from localStorage on mount
  useThemeColor();

  // Deep-link: allow ?tab=raw or #raw to open a specific tab on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    const hash = (window.location.hash || "").replace("#", "");
    const target = (tab || hash || "").toLowerCase();

    if (target === "raw" || target === "community" || target === "polls") {
      setActiveTab("tcm");
    } else if (target === "explore" || target === "search") {
      setActiveTab("search");
    } else if (target === "challenges") {
      setActiveTab("challenges");
    } else if (target === "profile") {
      setActiveTab("profile");
    }
  }, []);

  // Listen for hash changes at runtime
  useEffect(() => {
    const onHashChange = () => {
      const hash = (window.location.hash || "").replace("#", "").toLowerCase();
      if (hash === "raw" || hash === "community" || hash === "polls") {
        setActiveTab("tcm");
      } else if (hash === "explore" || hash === "search") {
        setActiveTab("search");
      } else if (hash === "challenges") {
        setActiveTab("challenges");
      } else if (hash === "profile") {
        setActiveTab("profile");
      }
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const getPageTitle = () => {
    switch (activeTab) {
      case 'home':return 'The Art of raW';
      case 'search':return 'Explore';
      case 'challenges':return 'Challenges';
      case 'profile':return 'Profile';
      case 'tcm':return 'The Cumulative Mind';
      default:return 'The Art of raW';
    }
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'home':return <HomePage />;
      case 'search':return <ExplorePage />;
      case 'challenges':return <ChallengesPage />;
      case 'profile':return <ProfilePage />;
      case 'tcm':return <TCMPage />;
      default:return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen text-foreground relative bg-destructive-foreground">
      {/* Matrix falling code background */}
      <MatrixBackground />
      
      {/* Golden glow ambient lighting */}
      <GoldenGlowBackground />
      
      {/* Perforated overlay that fades in after 5s */}
      <PerforatedBackground />
      
      {/* Main app container - unified layout for mobile + tablet */}
      <div className="relative z-10 w-full max-w-lg mx-auto min-h-screen flex flex-col">
        <Header title={getPageTitle()} />
        
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
        
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>);

};

export default Index;