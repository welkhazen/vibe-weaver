import { useState } from 'react';
import { Lock, MapPin, Send, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import profileAvatar from '@/assets/profile-avatar.png';

interface LockedProfileModalProps {
  open: boolean;
  onClose: () => void;
  username: string;
}

const LockedProfileModal = ({ open, onClose, username }: LockedProfileModalProps) => {
  const [showMessageInput, setShowMessageInput] = useState(false);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (message.trim()) {
      setSent(true);
      setShowMessageInput(false);
      setMessage('');
      setTimeout(() => setSent(false), 2000);
    }
  };

  const handleClose = () => {
    setShowMessageInput(false);
    setMessage('');
    setSent(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xs p-0 overflow-hidden border-primary/30 bg-background">
        {/* Banner */}
        <div className="h-24 bg-gradient-to-br from-primary/30 via-primary/20 to-transparent relative">
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-background/50 text-foreground hover:bg-background/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center -mt-12 pb-6 px-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-card chrome-ring flex items-center justify-center overflow-hidden border-4 border-background">
              <img src={profileAvatar} alt="Profile" className="w-full h-full object-cover opacity-50 blur-[2px]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Lock className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          {/* Username */}
          <h3 className="text-lg font-bold text-primary mt-3">{username}</h3>
          <div className="flex items-center gap-1 mt-0.5 text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span className="text-xs">Private Account</span>
          </div>

          {/* Private notice */}
          <div className="mt-4 w-full text-center">
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
              <Lock className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">This account is private</span>
            </div>
            <p className="text-[10px] text-muted-foreground">Send a connect request to see their profile</p>
          </div>

          {/* Connect button or message input */}
          {!showMessageInput && !sent && (
            <button
              onClick={() => setShowMessageInput(true)}
              className="mt-4 w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 active:scale-[0.97] transition-all glow-primary"
            >
              Connect
            </button>
          )}

          {showMessageInput && (
            <div className="mt-4 w-full space-y-2 animate-fade-in">
              <p className="text-[10px] text-muted-foreground text-center">Add a message to your connect request</p>
              <div className="relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, 100))}
                  placeholder="Hi! I'd love to connect..."
                  maxLength={100}
                  rows={3}
                  autoFocus
                  className="w-full px-3 py-2 rounded-xl bg-accent border border-primary/30 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  style={{
                    boxShadow: '0 0 12px hsl(var(--primary) / 0.15)',
                  }}
                />
                <span className={cn(
                  'absolute bottom-2 right-3 text-[9px]',
                  message.length >= 90 ? 'text-destructive' : 'text-muted-foreground'
                )}>
                  {message.length}/100
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowMessageInput(false)}
                  className="flex-1 py-2 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-accent transition-all active:scale-[0.97]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSend}
                  disabled={!message.trim()}
                  className={cn(
                    'flex-1 py-2 rounded-xl font-semibold text-sm flex items-center justify-center gap-1.5 active:scale-[0.97] transition-all',
                    message.trim()
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90 glow-primary'
                      : 'bg-accent text-muted-foreground'
                  )}
                >
                  <Send className="w-3.5 h-3.5" />
                  Send
                </button>
              </div>
            </div>
          )}

          {sent && (
            <div className="mt-4 w-full py-3 rounded-xl border border-primary/30 text-center animate-fade-in"
              style={{ boxShadow: '0 0 16px hsl(var(--primary) / 0.2)' }}
            >
              <p className="text-sm font-medium text-primary">Request Sent ✓</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">They'll be notified</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LockedProfileModal;
