import { Leaf, Heart, Brain, Zap, Droplets, Wind } from 'lucide-react';
import QASection from '@/components/QASection';

const TCMPage = () => {
  const principles = [
    {
      icon: <Leaf className="w-6 h-6" />,
      title: 'Five Elements',
      description: 'Wood, Fire, Earth, Metal, Water - the fundamental energies of nature',
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Yin & Yang',
      description: 'Balance between opposing forces for optimal health',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Qi Energy',
      description: 'Vital life force flowing through meridian pathways',
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'Mind-Body Connection',
      description: 'Holistic approach to mental and physical wellness',
    },
    {
      icon: <Droplets className="w-6 h-6" />,
      title: 'Blood & Fluids',
      description: 'Essential substances nourishing the body',
    },
    {
      icon: <Wind className="w-6 h-6" />,
      title: 'Meridians',
      description: 'Energy channels connecting organs and systems',
    },
  ];

  return (
    <div className="px-4 py-4 animate-fade-in pb-24">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Traditional Chinese Medicine</h2>
        <p className="text-muted-foreground text-sm">
          Ancient wisdom for modern wellness
        </p>
      </div>

      {/* Q&A Section from @thecumulativemind */}
      <div className="mb-6">
        <QASection />
      </div>

      {/* Principles Grid */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-3">Core Principles</h3>
        <div className="grid gap-3">
          {principles.map((principle) => (
            <div
              key={principle.title}
              className="metallic-card p-4 flex items-start gap-4 hover:bg-accent/30 transition-colors"
            >
              <div className="p-3 rounded-xl bg-gold/20 text-gold">
                {principle.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-1">{principle.title}</h4>
                <p className="text-sm text-muted-foreground">{principle.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="metallic-card p-4">
        <h3 className="font-semibold text-foreground mb-3">Our TCM Services</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            Acupuncture & Acupressure
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            Herbal Medicine Consultations
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            Cupping & Moxibustion Therapy
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            Tui Na Massage
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            Dietary & Lifestyle Guidance
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TCMPage;
