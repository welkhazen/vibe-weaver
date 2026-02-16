import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PollSubPageOverlayProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const PollSubPageOverlay = ({ open, onClose, title, children }: PollSubPageOverlayProps) => {
  return (
    <div className={cn(
      'fixed inset-0 z-50 bg-background flex flex-col transition-all duration-300',
      open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'
    )}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-foreground/10 transition-colors"
        >
          <X className="w-4 h-4 text-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {children}
      </div>
    </div>
  );
};

export default PollSubPageOverlay;
