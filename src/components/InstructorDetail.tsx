import { useState } from 'react';
import { ArrowLeft, Star, MapPin, Clock, Calendar, MessageCircle, Flower2, Brain, Swords, Mountain, Palette, GraduationCap, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import BookingModal from '@/components/BookingModal';

const categoryIcons: Record<string, LucideIcon> = {
  yoga: Flower2,
  therapy: Brain,
  sports: Swords,
  outdoor: Mountain,
  arts: Palette,
  tutoring: GraduationCap,
};

// Random avatar photos by category
const categoryPhotos: Record<string, string[]> = {
  yoga: [
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
  ],
  therapy: [
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face',
  ],
  sports: [
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
  ],
  outdoor: [
    'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=200&h=200&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face',
  ],
  arts: [
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop&crop=face',
  ],
  tutoring: [
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face',
  ],
};

// Mock reviews data
const mockReviews = [
  { id: 1, name: 'Alex M.', rating: 5, date: '2 days ago', comment: 'Absolutely fantastic session! Highly recommend.' },
  { id: 2, name: 'Jordan K.', rating: 5, date: '1 week ago', comment: 'Very professional and knowledgeable. Will book again.' },
  { id: 3, name: 'Sam T.', rating: 4, date: '2 weeks ago', comment: 'Great experience overall. Learned a lot!' },
];

interface InstructorDetailProps {
  instructor: {
    id: number;
    title: string;
    provider: string;
    category: string;
    rating: number;
    reviews: number;
    price: string;
    location: string;
    duration: string;
  };
  onBack: () => void;
}

const InstructorDetail = ({ instructor, onBack }: InstructorDetailProps) => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const IconComponent = categoryIcons[instructor.category] || Flower2;
  const photos = categoryPhotos[instructor.category] || categoryPhotos.yoga;
  const randomPhoto = photos[instructor.id % photos.length];


  return (
    <div className="animate-fade-in pb-24">
      {/* Header with back button */}
      <div className="px-4 py-3 flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-accent hover:bg-accent/80 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h2 className="text-lg font-bold text-foreground">Instructor Profile</h2>
      </div>

      {/* Profile Card */}
      <div className="px-4 py-2">
        <div className="gold-accent-card p-6">
          <div className="flex flex-col items-center text-center">
            <Avatar className="w-24 h-24 ring-2 ring-gold/50 shadow-[0_0_20px_hsl(var(--gold)_/_0.3)]">
              <AvatarImage src={randomPhoto} alt={instructor.provider} />
              <AvatarFallback className="bg-accent">
                <IconComponent className="w-10 h-10 text-gold" strokeWidth={1.5} />
              </AvatarFallback>
            </Avatar>
            
            <h1 className="text-xl font-bold text-foreground mt-4">{instructor.provider}</h1>
            <p className="text-sm text-muted-foreground">{instructor.title}</p>
            
            <div className="flex items-center gap-1 mt-2">
              <Star className="w-5 h-5 fill-gold text-gold" />
              <span className="font-semibold text-foreground">{instructor.rating}</span>
              <span className="text-muted-foreground">({instructor.reviews} reviews)</span>
            </div>

            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-gold/70" />
                <span>{instructor.location}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 text-gold/70" />
                <span>{instructor.duration}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Price & Booking */}
      <div className="px-4 py-2">
        <div className="gold-accent-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-gold drop-shadow-[0_0_10px_hsl(var(--gold)_/_0.4)]">{instructor.price}</span>
              <span className="text-muted-foreground"> / session</span>
            </div>
            <Button 
              className="gap-2 bg-gradient-to-r from-gold to-gold-dark hover:from-gold-light hover:to-gold text-primary-foreground shadow-[0_0_15px_hsl(var(--gold)_/_0.3)]" 
              onClick={() => setIsBookingOpen(true)}
            >
              <Calendar className="w-4 h-4" />
              Book Now
            </Button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
        instructor={instructor}
      />

      {/* About Section */}
      <div className="px-4 py-2">
        <div className="metallic-card p-4">
          <h3 className="font-semibold text-foreground mb-2">About</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {instructor.provider} is a certified professional with over 5 years of experience in {instructor.title.toLowerCase()}. 
            Passionate about helping clients achieve their goals through personalized sessions tailored to individual needs.
          </p>
        </div>
      </div>

      {/* Specialties */}
      <div className="px-4 py-2">
        <div className="metallic-card p-4">
          <h3 className="font-semibold text-foreground mb-3">Specialties</h3>
          <div className="flex flex-wrap gap-2">
            {['Beginner Friendly', 'Advanced Techniques', 'One-on-One', 'Group Sessions'].map((specialty) => (
              <span 
                key={specialty}
                className="px-3 py-1 rounded-full bg-gold/10 text-xs text-gold border border-gold/30"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="px-4 py-2">
        <div className="metallic-card p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Reviews</h3>
            <span className="text-sm text-muted-foreground">{instructor.reviews} total</span>
          </div>
          
          <div className="space-y-4">
            {mockReviews.map((review) => (
              <div key={review.id} className="border-b border-border/50 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                      <span className="text-xs font-medium text-foreground">{review.name[0]}</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">{review.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{review.date}</span>
                </div>
                <div className="flex items-center gap-0.5 mb-2">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Button */}
      <div className="px-4 py-4">
        <Button variant="outline" className="w-full gap-2">
          <MessageCircle className="w-4 h-4" />
          Message Instructor
        </Button>
      </div>
    </div>
  );
};

export default InstructorDetail;
