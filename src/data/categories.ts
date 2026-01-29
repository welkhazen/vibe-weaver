import { 
  Brain, Dumbbell, Scissors, Music2, Drama, GraduationCap,
  Heart, Sparkles, Leaf, MessageCircle, Users, Smile,
  PersonStanding, Swords, Waves, Mountain, Bike,
  Palette, PenTool, Brush, Gem, Camera,
  Music, Guitar, Mic2, Piano, Drum,
  BookOpen, Calculator, Languages, FlaskConical, Award
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface Category {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface Subcategory {
  id: string;
  label: string;
  icon: LucideIcon;
  categoryId: string;
}

export const categories: Category[] = [
  { id: 'mental-health', label: 'Mental Health', icon: Brain },
  { id: 'physical', label: 'Physical Activities', icon: Dumbbell },
  { id: 'arts-crafts', label: 'Creative Arts', icon: Scissors },
  { id: 'dance', label: 'Dance', icon: Drama },
  { id: 'music', label: 'Music', icon: Music2 },
  { id: 'education', label: 'Education', icon: GraduationCap },
];

export const subcategories: Subcategory[] = [
  // Mental Health subcategories
  { id: 'therapy', label: 'Therapy', icon: Brain, categoryId: 'mental-health' },
  { id: 'meditation', label: 'Meditation', icon: Sparkles, categoryId: 'mental-health' },
  { id: 'stress', label: 'Stress Management', icon: Leaf, categoryId: 'mental-health' },
  { id: 'coaching', label: 'Life Coaching', icon: Heart, categoryId: 'mental-health' },
  { id: 'mindfulness', label: 'Mindfulness', icon: Smile, categoryId: 'mental-health' },
  { id: 'anxiety', label: 'Anxiety Support', icon: MessageCircle, categoryId: 'mental-health' },
  { id: 'relationship', label: 'Relationship & Family', icon: Users, categoryId: 'mental-health' },

  // Physical Activities subcategories
  { id: 'yoga', label: 'Yoga', icon: PersonStanding, categoryId: 'physical' },
  { id: 'pilates', label: 'Pilates', icon: PersonStanding, categoryId: 'physical' },
  { id: 'martial-arts', label: 'Martial Arts', icon: Swords, categoryId: 'physical' },
  { id: 'swimming', label: 'Swimming', icon: Waves, categoryId: 'physical' },
  { id: 'hiking', label: 'Hiking & Outdoor', icon: Mountain, categoryId: 'physical' },
  { id: 'fitness', label: 'Fitness Training', icon: Dumbbell, categoryId: 'physical' },
  { id: 'cycling', label: 'Cycling', icon: Bike, categoryId: 'physical' },

  // Arts and Crafts subcategories
  { id: 'painting', label: 'Painting', icon: Palette, categoryId: 'arts-crafts' },
  { id: 'drawing', label: 'Drawing', icon: PenTool, categoryId: 'arts-crafts' },
  { id: 'pottery', label: 'Pottery', icon: Brush, categoryId: 'arts-crafts' },
  { id: 'jewelry', label: 'Jewelry Making', icon: Gem, categoryId: 'arts-crafts' },
  { id: 'photography', label: 'Photography', icon: Camera, categoryId: 'arts-crafts' },
  { id: 'knitting', label: 'Knitting & Sewing', icon: Scissors, categoryId: 'arts-crafts' },

  // Dance subcategories
  { id: 'ballet', label: 'Ballet', icon: Drama, categoryId: 'dance' },
  { id: 'hip-hop', label: 'Hip Hop', icon: Music, categoryId: 'dance' },
  { id: 'salsa', label: 'Salsa & Latin', icon: Drama, categoryId: 'dance' },
  { id: 'contemporary', label: 'Contemporary', icon: Drama, categoryId: 'dance' },
  { id: 'ballroom', label: 'Ballroom', icon: Drama, categoryId: 'dance' },
  { id: 'jazz', label: 'Jazz', icon: Music, categoryId: 'dance' },

  // Music subcategories
  { id: 'piano', label: 'Piano', icon: Piano, categoryId: 'music' },
  { id: 'guitar', label: 'Guitar', icon: Guitar, categoryId: 'music' },
  { id: 'voice', label: 'Voice & Singing', icon: Mic2, categoryId: 'music' },
  { id: 'drums', label: 'Drums', icon: Drum, categoryId: 'music' },
  { id: 'violin', label: 'Violin', icon: Music2, categoryId: 'music' },
  { id: 'music-theory', label: 'Music Theory', icon: BookOpen, categoryId: 'music' },

  // Education subcategories
  { id: 'tutoring', label: 'Tutoring', icon: BookOpen, categoryId: 'education' },
  { id: 'online-courses', label: 'Online Courses', icon: GraduationCap, categoryId: 'education' },
  { id: 'math', label: 'Mathematics', icon: Calculator, categoryId: 'education' },
  { id: 'languages', label: 'Languages', icon: Languages, categoryId: 'education' },
  { id: 'science', label: 'Science', icon: FlaskConical, categoryId: 'education' },
  { id: 'test-prep', label: 'Test Prep (SAT/ACT)', icon: Award, categoryId: 'education' },
];

export const getSubcategoriesByCategory = (categoryId: string): Subcategory[] => {
  return subcategories.filter(sub => sub.categoryId === categoryId);
};

export const getCategoryById = (categoryId: string): Category | undefined => {
  return categories.find(cat => cat.id === categoryId);
};

export const getSubcategoryById = (subcategoryId: string): Subcategory | undefined => {
  return subcategories.find(sub => sub.id === subcategoryId);
};
