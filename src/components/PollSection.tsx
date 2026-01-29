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
      { text: "Yes", percentage: 78 },
      { text: "No", percentage: 22 },
    ],
  },
  {
    question: "Do you practice self-reflection regularly?",
    options: [
      { text: "Yes", percentage: 64 },
      { text: "No", percentage: 36 },
    ],
  },
  {
    question: "Is vulnerability a strength?",
    options: [
      { text: "Yes", percentage: 81 },
      { text: "No", percentage: 19 },
    ],
  },
  {
    question: "Do you set intentions for your day?",
    options: [
      { text: "Yes", percentage: 52 },
      { text: "No", percentage: 48 },
    ],
  },
  {
    question: "Can you control your emotions?",
    options: [
      { text: "Yes", percentage: 43 },
      { text: "No", percentage: 57 },
    ],
  },
  {
    question: "Do you believe in growth mindset?",
    options: [
      { text: "Yes", percentage: 89 },
      { text: "No", percentage: 11 },
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
