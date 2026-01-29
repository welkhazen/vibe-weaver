import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Clock, Check, CreditCard, Coins, Banknote } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
];

const paymentMethods = [
  { id: 'card', label: 'Card', icon: CreditCard, description: 'Credit or Debit card' },
  { id: 'token', label: 'Token', icon: Coins, description: 'Use your tokens' },
  { id: 'cash', label: 'Cash', icon: Banknote, description: 'Pay at session' },
];

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  instructor: {
    provider: string;
    title: string;
    price: string;
    duration: string;
  };
}

const BookingModal = ({ isOpen, onClose, instructor }: BookingModalProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  const handleBooking = () => {
    if (selectedDate && selectedTime && selectedPayment) {
      const paymentMethod = paymentMethods.find(p => p.id === selectedPayment);
      toast({
        title: "Booking Confirmed!",
        description: `Your session with ${instructor.provider} is scheduled for ${format(selectedDate, 'PPP')} at ${selectedTime}. Payment: ${paymentMethod?.label}.`,
      });
      onClose();
      setSelectedDate(undefined);
      setSelectedTime(null);
      setSelectedPayment(null);
    }
  };

  const isDateDisabled = (date: Date) => {
    return date < new Date() || date.getDay() === 0; // Disable past dates and Sundays
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-background border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">Book a Session</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Schedule your {instructor.duration} session with {instructor.provider}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Date Selection */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CalendarIcon className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Select Date</span>
            </div>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={isDateDisabled}
                className={cn("rounded-md border border-border pointer-events-auto")}
              />
            </div>
          </div>

          {/* Time Slots */}
          {selectedDate && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Select Time</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                      "border border-border hover:border-primary/50",
                      selectedTime === time
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-accent/50 text-foreground"
                    )}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Payment Method Selection */}
          {selectedDate && selectedTime && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Payment Method</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {paymentMethods.map((method) => {
                  const IconComponent = method.icon;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={cn(
                        "p-3 rounded-lg flex flex-col items-center gap-2 transition-all",
                        "border border-border hover:border-primary/50",
                        selectedPayment === method.id
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-accent/50 text-foreground"
                      )}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="text-xs font-medium">{method.label}</span>
                    </button>
                  );
                })}
              </div>
              {selectedPayment && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  {paymentMethods.find(p => p.id === selectedPayment)?.description}
                </p>
              )}
            </div>
          )}

          {/* Summary */}
          {selectedDate && selectedTime && selectedPayment && (
            <div className="animate-fade-in p-4 rounded-lg bg-accent/30 border border-border">
              <h4 className="text-sm font-semibold text-foreground mb-2">Booking Summary</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p><span className="text-foreground">Service:</span> {instructor.title}</p>
                <p><span className="text-foreground">Date:</span> {format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
                <p><span className="text-foreground">Time:</span> {selectedTime}</p>
                <p><span className="text-foreground">Duration:</span> {instructor.duration}</p>
                <p><span className="text-foreground">Payment:</span> {paymentMethods.find(p => p.id === selectedPayment)?.label}</p>
                <p className="pt-2 text-lg font-bold text-foreground">{instructor.price}</p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleBooking} 
            disabled={!selectedDate || !selectedTime || !selectedPayment}
            className="flex-1 gap-2"
          >
            <Check className="w-4 h-4" />
            Confirm Booking
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
