import QACard from './QACard';
import { Instagram } from 'lucide-react';

interface QAItem {
  question: string;
  answer: string;
}

const qaData: QAItem[] = [
  {
    question: "What is the foundation of Traditional Chinese Medicine?",
    answer: "TCM is built on the concept of Qi (vital energy), the balance of Yin and Yang, and the Five Element theory. It views the body as an interconnected system where physical, emotional, and spiritual health are inseparable."
  },
  {
    question: "How does acupuncture work?",
    answer: "Acupuncture stimulates specific points along meridian pathways to restore the flow of Qi. Fine needles inserted at these points help unblock energy stagnation and promote the body's natural healing response."
  },
  {
    question: "What are the Five Elements in TCM?",
    answer: "Wood, Fire, Earth, Metal, and Water represent the fundamental energies of nature. Each element corresponds to specific organs, emotions, seasons, and life cycles, creating a framework for understanding health patterns."
  },
  {
    question: "Can TCM help with stress and anxiety?",
    answer: "Yes, TCM addresses the root causes of stress through herbal formulas, acupuncture, and lifestyle practices. It views anxiety as an imbalance in the Heart and Kidney systems, treating both the physical and emotional aspects."
  },
  {
    question: "What is the difference between Yin and Yang?",
    answer: "Yin represents qualities like coolness, rest, and introspection while Yang embodies warmth, activity, and expression. Health exists when these opposing forces remain in dynamic balance within the body."
  },
  {
    question: "How long does it take to see results from TCM?",
    answer: "Results vary based on the condition and individual constitution. Acute issues may improve within days, while chronic conditions typically require consistent treatment over weeks or months for lasting change."
  },
];

const QASection = () => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Questions to Ask</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Tap to reveal answers</p>
        </div>
        <a
          href="https://instagram.com/thecumulativemind"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground/5 hover:bg-foreground/10 transition-colors"
        >
          <Instagram className="w-4 h-4 text-foreground" />
          <span className="text-xs font-medium text-foreground">@thecumulativemind</span>
        </a>
      </div>

      {/* Q&A Cards */}
      <div className="grid gap-3">
        {qaData.map((item, index) => (
          <QACard
            key={index}
            question={item.question}
            answer={item.answer}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default QASection;
