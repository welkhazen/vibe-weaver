import PollSection from '@/components/PollSection';

const TCMPage = () => {
  return (
    <div className="px-4 py-4 animate-fade-in pb-24">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">The Cumulative Mind</h2>
        <p className="text-muted-foreground text-sm">
          Collective wisdom through shared perspectives
        </p>
      </div>

      {/* Poll Section from @thecumulativemind */}
      <PollSection />
    </div>
  );
};

export default TCMPage;
