import { Instagram } from 'lucide-react';
import PollCard from './PollCard';

interface PollItem {
  question: string;
  options: {
    text: string;
    percentage: number;
  }[];
}

const pollData: PollItem[] = [
  {
    question: "Do you believe your thoughts shape your reality?",
    options: [
      { text: "Absolutely", percentage: 72 },
      { text: "Sometimes", percentage: 23 },
      { text: "Not really", percentage: 5 },
    ],
  },
  {
    question: "How often do you practice self-reflection?",
    options: [
      { text: "Daily", percentage: 34 },
      { text: "Weekly", percentage: 41 },
      { text: "Rarely", percentage: 25 },
    ],
  },
  {
    question: "What helps you most with mental clarity?",
    options: [
      { text: "Meditation", percentage: 45 },
      { text: "Exercise", percentage: 32 },
      { text: "Journaling", percentage: 23 },
    ],
  },
  {
    question: "Do you set intentions for your day?",
    options: [
      { text: "Every morning", percentage: 28 },
      { text: "Sometimes", percentage: 47 },
      { text: "Never tried", percentage: 25 },
    ],
  },
  {
    question: "Is vulnerability a strength or weakness?",
    options: [
      { text: "Strength", percentage: 81 },
      { text: "Weakness", percentage: 7 },
      { text: "Depends", percentage: 12 },
    ],
  },
  {
    question: "How do you handle negative self-talk?",
    options: [
      { text: "Reframe it", percentage: 38 },
      { text: "Let it pass", percentage: 35 },
      { text: "Still learning", percentage: 27 },
    ],
  },
];

const PollSection = () => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Community Polls</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Vote & see what others think</p>
        </div>
        <a
          href="https://instagram.com/thecumulativemind"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground/5 hover:bg-foreground/10 transition-all duration-300 active:scale-95"
        >
          <Instagram className="w-4 h-4 text-foreground" />
          <span className="text-xs font-medium text-foreground">@thecumulativemind</span>
        </a>
      </div>

      {/* Poll Cards */}
      <div className="grid gap-3">
        {pollData.map((item, index) => (
          <PollCard
            key={index}
            question={item.question}
            options={item.options}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default PollSection;
