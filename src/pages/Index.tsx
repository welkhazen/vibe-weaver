import { useState, useEffect } from 'react';
import MatrixBackground from '@/components/MatrixBackground';
import GoldenGlowBackground from '@/components/GoldenGlowBackground';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import HomePage from '@/pages/HomePage';
import ExplorePage from '@/pages/ExplorePage';
import SchedulePage from '@/pages/SchedulePage';
import ProfilePage from '@/pages/ProfilePage';
import TCMPage from '@/pages/TCMPage';
import { useThemeColor } from '@/hooks/useThemeColor';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  
  // Initialize theme color from localStorage on mount
  useThemeColor();

  const getPageTitle = () => {
    switch (activeTab) {
      case 'home': return 'The Art of Raw';
      case 'search': return 'Explore';
      case 'calendar': return 'Schedule';
      case 'profile': return 'Profile';
      case 'tcm': return 'The Cumulative Mind';
      default: return 'The Art of Raw';
    }
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'home': return <HomePage />;
      case 'search': return <ExplorePage />;
      case 'calendar': return <SchedulePage />;
      case 'profile': return <ProfilePage />;
      case 'tcm': return <TCMPage />;
      default: return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Matrix falling code background */}
      <MatrixBackground />
      
      {/* Golden glow ambient lighting */}
      <GoldenGlowBackground />
      
      {/* Main app container */}
      <div className="relative z-10 max-w-lg mx-auto min-h-screen flex flex-col">
        <Header title={getPageTitle()} />
        
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
        
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

export default Index;
