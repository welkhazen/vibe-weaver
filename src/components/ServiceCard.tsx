import { Star, MapPin, Clock, Flower2, Brain, Swords, Mountain, Palette, GraduationCap, LucideIcon } from 'lucide-react';

const categoryIcons: Record<string, LucideIcon> = {
  yoga: Flower2,
  therapy: Brain,
  sports: Swords,
  outdoor: Mountain,
  arts: Palette,
  tutoring: GraduationCap,
};

interface ServiceCardProps {
  id: number;
  title: string;
  provider: string;
  category: string;
  rating: number;
  reviews: number;
  price: string;
  location: string;
  duration: string;
  image?: string;
  onClick?: () => void;
}

const ServiceCard = ({
  title,
  provider,
  category,
  rating,
  reviews,
  price,
  location,
  duration,
  onClick,
}: ServiceCardProps) => {
  const IconComponent = categoryIcons[category] || Flower2;
  
  return (
    <div 
      className="metallic-card p-4 animate-fade-in hover:scale-[1.02] transition-transform cursor-pointer"
      onClick={onClick}
    >
      <div className="flex gap-4">
        {/* Avatar/Icon */}
        <div className="w-16 h-16 rounded-xl bg-accent/50 flex items-center justify-center chrome-ring shrink-0">
          <IconComponent className="w-7 h-7 text-foreground" strokeWidth={1.5} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{title}</h3>
          <p className="text-sm text-muted-foreground truncate">{provider}</p>
          
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-4 h-4 fill-foreground text-foreground" />
            <span className="text-sm font-medium text-foreground">{rating}</span>
            <span className="text-xs text-muted-foreground">({reviews})</span>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-lg font-bold text-foreground">{price}</span>
          <p className="text-xs text-muted-foreground">/session</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/50">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{duration}</span>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
