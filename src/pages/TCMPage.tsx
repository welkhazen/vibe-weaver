import PollSection from '@/components/PollSection';

const TCMPage = () => {
  return (
    <div className="w-full h-[calc(100vh-8rem)] flex flex-col px-4 sm:px-6 py-3 animate-fade-in">
      {/* Hero - compact */}
      <div className="text-center mb-3">
        <h2 className="text-xl font-bold text-foreground">The Cumulative Mind</h2>
        <p className="text-muted-foreground text-xs">Collective wisdom through shared perspectives</p>
      </div>

      {/* Poll Section - fills remaining space */}
      <div className="flex-1 min-h-0 flex flex-col">
        <PollSection />
      </div>
    </div>
  );
};

export default TCMPage;
