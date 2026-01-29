export interface Instructor {
  id: number;
  title: string;
  provider: string;
  category: string;
  subcategory: string;
  rating: number;
  reviews: number;
  price: string;
  location: string;
  duration: string;
  description?: string;
}

export const instructors: Instructor[] = [
  // Mental Health - Therapy
  { id: 1, title: 'CBT Therapy Session', provider: 'Dr. Michael Ross', category: 'mental-health', subcategory: 'therapy', rating: 4.8, reviews: 89, price: '$120', location: 'Online', duration: '50 min', description: 'Certified CBT therapist with 10+ years experience helping clients overcome anxiety and depression through evidence-based techniques.' },
  { id: 2, title: 'Psychotherapy Session', provider: 'Dr. Emily Watson', category: 'mental-health', subcategory: 'therapy', rating: 4.9, reviews: 124, price: '$130', location: 'Downtown', duration: '60 min', description: 'Licensed psychotherapist specializing in trauma recovery and emotional healing.' },
  
  // Mental Health - Meditation
  { id: 3, title: 'Guided Meditation', provider: 'Maya Johnson', category: 'mental-health', subcategory: 'meditation', rating: 4.9, reviews: 203, price: '$35', location: 'Online', duration: '30 min', description: 'Mindfulness instructor trained in Tibetan meditation traditions. Perfect for beginners and advanced practitioners.' },
  { id: 4, title: 'Deep Relaxation Meditation', provider: 'Zen Master Liu', category: 'mental-health', subcategory: 'meditation', rating: 5.0, reviews: 178, price: '$45', location: 'Zen Center', duration: '45 min', description: '20 years of meditation practice. Specializing in stress relief and inner peace cultivation.' },
  
  // Mental Health - Anxiety
  { id: 5, title: 'Anxiety Counseling', provider: 'Dr. Sarah Lee', category: 'mental-health', subcategory: 'anxiety', rating: 4.9, reviews: 156, price: '$110', location: 'Online', duration: '50 min', description: 'Specialized in anxiety disorders and panic attacks. Compassionate care with proven results.' },
  
  // Mental Health - Coaching
  { id: 6, title: 'Life Coaching Session', provider: 'James Wilson', category: 'mental-health', subcategory: 'coaching', rating: 4.6, reviews: 34, price: '$95', location: 'Online', duration: '60 min', description: 'ICF certified coach helping you achieve your goals and unlock your potential.' },
  { id: 7, title: 'Executive Coaching', provider: 'Mark Stevens', category: 'mental-health', subcategory: 'coaching', rating: 4.9, reviews: 56, price: '$200', location: 'Online', duration: '60 min', description: 'Former Fortune 500 executive. Helping leaders reach peak performance.' },
  
  // Mental Health - Mindfulness
  { id: 8, title: 'Mindfulness Training', provider: 'Lisa Chen', category: 'mental-health', subcategory: 'mindfulness', rating: 5.0, reviews: 142, price: '$50', location: 'Downtown', duration: '45 min', description: 'MBSR certified instructor bringing presence and awareness to everyday life.' },
  
  // Mental Health - Stress
  { id: 9, title: 'Stress Relief Workshop', provider: 'Dr. Emily Chen', category: 'mental-health', subcategory: 'stress', rating: 4.8, reviews: 87, price: '$65', location: 'Midtown', duration: '90 min', description: 'Interactive workshop combining breathing techniques, movement, and cognitive strategies.' },
  
  // Mental Health - Relationship
  { id: 10, title: 'Couples Counseling', provider: 'Dr. Robert Hayes', category: 'mental-health', subcategory: 'relationship', rating: 4.7, reviews: 68, price: '$150', location: 'Online', duration: '60 min', description: 'Gottman-certified therapist helping couples build stronger relationships.' },
  { id: 11, title: 'Family Therapy', provider: 'Dr. Anna Martinez', category: 'mental-health', subcategory: 'relationship', rating: 4.8, reviews: 95, price: '$140', location: 'Westside', duration: '75 min', description: 'Family systems therapist creating harmony and understanding in families.' },

  // Physical - Yoga
  { id: 12, title: 'Vinyasa Flow Yoga', provider: 'Sarah Chen', category: 'physical', subcategory: 'yoga', rating: 4.9, reviews: 128, price: '$45', location: 'Downtown', duration: '60 min', description: 'RYT-500 certified instructor with a focus on breath-synchronized movement.' },
  { id: 13, title: 'Yin Yoga', provider: 'Amanda White', category: 'physical', subcategory: 'yoga', rating: 4.8, reviews: 89, price: '$40', location: 'Zen Studio', duration: '75 min', description: 'Deep stretching and meditation for flexibility and calm.' },
  
  // Physical - Pilates
  { id: 14, title: 'Pilates Reformer', provider: 'Lisa Park', category: 'physical', subcategory: 'pilates', rating: 4.9, reviews: 78, price: '$50', location: 'Westside', duration: '55 min', description: 'Classical Pilates with modern rehabilitation techniques.' },
  
  // Physical - Martial Arts
  { id: 15, title: 'Brazilian Jiu-Jitsu', provider: 'Carlos Silva', category: 'physical', subcategory: 'martial-arts', rating: 4.9, reviews: 256, price: '$35', location: 'Midtown', duration: '90 min', description: 'Black belt with competition experience. All skill levels welcome.' },
  { id: 16, title: 'Kickboxing Training', provider: 'Mike Johnson', category: 'physical', subcategory: 'martial-arts', rating: 4.8, reviews: 112, price: '$40', location: 'Downtown', duration: '60 min', description: 'Former professional fighter. High-intensity cardio and self-defense.' },
  
  // Physical - Fitness
  { id: 17, title: 'Personal Training', provider: 'Jake Miller', category: 'physical', subcategory: 'fitness', rating: 4.8, reviews: 134, price: '$60', location: 'Fitness Center', duration: '60 min', description: 'NASM certified trainer specializing in strength and conditioning.' },
  
  // Physical - Swimming
  { id: 18, title: 'Swimming Lessons', provider: 'Olympic Swimmer Kate', category: 'physical', subcategory: 'swimming', rating: 4.9, reviews: 67, price: '$55', location: 'Aquatic Center', duration: '45 min', description: 'Former Olympic athlete teaching all ages and skill levels.' },
  
  // Physical - Hiking
  { id: 19, title: 'Mountain Hiking Guide', provider: 'Alex Turner', category: 'physical', subcategory: 'hiking', rating: 4.7, reviews: 67, price: '$80', location: 'Various', duration: '4 hrs', description: 'Certified wilderness guide with extensive local trail knowledge.' },
  { id: 20, title: 'Rock Climbing', provider: 'Tom Richards', category: 'physical', subcategory: 'hiking', rating: 4.8, reviews: 89, price: '$75', location: 'Boulder Park', duration: '3 hrs', description: 'Indoor and outdoor climbing instruction for all levels.' },
  
  // Physical - Cycling
  { id: 21, title: 'Spin Class', provider: 'Coach Marcus', category: 'physical', subcategory: 'cycling', rating: 4.7, reviews: 156, price: '$25', location: 'Fitness Studio', duration: '45 min', description: 'High-energy indoor cycling with great music and motivation.' },

  // Arts & Crafts - Painting
  { id: 22, title: 'Oil Painting Class', provider: 'Marcus Lee', category: 'arts-crafts', subcategory: 'painting', rating: 4.8, reviews: 67, price: '$55', location: 'Art District', duration: '2 hrs', description: 'Classical techniques meet contemporary expression. All materials provided.' },
  { id: 23, title: 'Watercolor Workshop', provider: 'Sophie Turner', category: 'arts-crafts', subcategory: 'painting', rating: 4.9, reviews: 54, price: '$50', location: 'Downtown', duration: '90 min', description: 'Loose, expressive watercolor techniques for beginners and intermediates.' },
  
  // Arts & Crafts - Drawing
  { id: 24, title: 'Figure Drawing', provider: 'David Chen', category: 'arts-crafts', subcategory: 'drawing', rating: 4.7, reviews: 43, price: '$45', location: 'Art Studio', duration: '2 hrs', description: 'Learn anatomy and gesture drawing with live models.' },
  
  // Arts & Crafts - Pottery
  { id: 25, title: 'Pottery Workshop', provider: 'Claire Adams', category: 'arts-crafts', subcategory: 'pottery', rating: 4.7, reviews: 54, price: '$60', location: 'Ceramic Studio', duration: '2 hrs', description: 'Wheel throwing and hand-building techniques. Create your own pieces.' },
  
  // Arts & Crafts - Jewelry
  { id: 26, title: 'Jewelry Making', provider: 'Sofia Rivera', category: 'arts-crafts', subcategory: 'jewelry', rating: 4.9, reviews: 42, price: '$70', location: 'Craft Center', duration: '2 hrs', description: 'Design and create your own unique jewelry pieces.' },
  
  // Arts & Crafts - Photography
  { id: 27, title: 'Photography Basics', provider: 'James Wright', category: 'arts-crafts', subcategory: 'photography', rating: 4.8, reviews: 89, price: '$65', location: 'Various', duration: '3 hrs', description: 'Master composition, lighting, and camera settings.' },
  
  // Arts & Crafts - Knitting
  { id: 28, title: 'Knitting Circle', provider: 'Martha Brown', category: 'arts-crafts', subcategory: 'knitting', rating: 4.6, reviews: 34, price: '$35', location: 'Craft Cafe', duration: '2 hrs', description: 'Relaxing group sessions for all skill levels. Yarn provided.' },

  // Dance - Ballet
  { id: 29, title: 'Ballet Fundamentals', provider: 'Anna Petrov', category: 'dance', subcategory: 'ballet', rating: 4.9, reviews: 89, price: '$45', location: 'Dance Academy', duration: '60 min', description: 'Former professional ballerina teaching classical technique.' },
  { id: 30, title: 'Adult Ballet', provider: 'Maria Santos', category: 'dance', subcategory: 'ballet', rating: 4.8, reviews: 67, price: '$40', location: 'Dance Studio', duration: '75 min', description: 'Never too late to start! Beginner-friendly ballet for adults.' },
  
  // Dance - Hip Hop
  { id: 31, title: 'Hip Hop Dance', provider: 'Jordan Blake', category: 'dance', subcategory: 'hip-hop', rating: 4.8, reviews: 156, price: '$35', location: 'Urban Studio', duration: '60 min', description: 'Learn the latest moves and choreography. High energy, all levels.' },
  
  // Dance - Salsa
  { id: 32, title: 'Salsa Classes', provider: 'Carlos Mendez', category: 'dance', subcategory: 'salsa', rating: 4.7, reviews: 98, price: '$40', location: 'Latin Quarter', duration: '75 min', description: 'Cuban salsa with authentic styling. Partners not required.' },
  { id: 33, title: 'Bachata Nights', provider: 'Rosa Martinez', category: 'dance', subcategory: 'salsa', rating: 4.8, reviews: 76, price: '$35', location: 'Dance Lounge', duration: '60 min', description: 'Sensual bachata with Dominican roots. Beginner friendly.' },
  
  // Dance - Contemporary
  { id: 34, title: 'Contemporary Dance', provider: 'Alex Moore', category: 'dance', subcategory: 'contemporary', rating: 4.9, reviews: 54, price: '$45', location: 'Modern Dance Center', duration: '90 min', description: 'Expressive movement combining ballet and modern techniques.' },
  
  // Dance - Ballroom
  { id: 35, title: 'Ballroom Dancing', provider: 'William & Grace', category: 'dance', subcategory: 'ballroom', rating: 4.8, reviews: 123, price: '$50', location: 'Grand Ballroom', duration: '60 min', description: 'Champion dancers teaching waltz, foxtrot, and tango.' },
  
  // Dance - Jazz
  { id: 36, title: 'Jazz Fusion', provider: 'Tina Roberts', category: 'dance', subcategory: 'jazz', rating: 4.7, reviews: 67, price: '$40', location: 'Dance Factory', duration: '60 min', description: 'Broadway-style jazz with modern influences.' },

  // Music - Piano
  { id: 37, title: 'Piano Lessons', provider: 'Emma Williams', category: 'music', subcategory: 'piano', rating: 5.0, reviews: 42, price: '$55', location: 'Music Academy', duration: '45 min', description: 'Julliard-trained pianist. Classical, jazz, and contemporary styles.' },
  { id: 38, title: 'Kids Piano', provider: 'Sarah Miller', category: 'music', subcategory: 'piano', rating: 4.9, reviews: 78, price: '$45', location: 'Music School', duration: '30 min', description: 'Making music fun for children ages 5-12.' },
  
  // Music - Guitar
  { id: 39, title: 'Guitar Lessons', provider: 'Tom Garcia', category: 'music', subcategory: 'guitar', rating: 4.7, reviews: 67, price: '$50', location: 'Music Studio', duration: '45 min', description: 'Acoustic and electric guitar. Rock, blues, country, and more.' },
  { id: 40, title: 'Fingerstyle Guitar', provider: 'Chris Anderson', category: 'music', subcategory: 'guitar', rating: 4.8, reviews: 45, price: '$55', location: 'Home Studio', duration: '60 min', description: 'Advanced fingerpicking and arrangement techniques.' },
  
  // Music - Voice
  { id: 41, title: 'Voice Training', provider: 'Diana Ross Jr.', category: 'music', subcategory: 'voice', rating: 4.8, reviews: 73, price: '$60', location: 'Vocal Studio', duration: '50 min', description: 'Pop, R&B, and musical theater vocal coaching.' },
  { id: 42, title: 'Opera Singing', provider: 'Maestro Giovanni', category: 'music', subcategory: 'voice', rating: 4.9, reviews: 34, price: '$80', location: 'Conservatory', duration: '60 min', description: 'Classical vocal training from La Scala veteran.' },
  
  // Music - Drums
  { id: 43, title: 'Drum Lessons', provider: 'Beat Master Dave', category: 'music', subcategory: 'drums', rating: 4.7, reviews: 89, price: '$50', location: 'Sound Studio', duration: '45 min', description: 'Rock, funk, and jazz drumming. Electronic drums available.' },
  
  // Music - Violin
  { id: 44, title: 'Violin Lessons', provider: 'Professor Chen', category: 'music', subcategory: 'violin', rating: 4.9, reviews: 56, price: '$65', location: 'Music Academy', duration: '45 min', description: 'Suzuki and traditional methods. All ages welcome.' },
  
  // Music - Theory
  { id: 45, title: 'Music Theory', provider: 'Dr. Bach', category: 'music', subcategory: 'music-theory', rating: 4.8, reviews: 34, price: '$45', location: 'Online', duration: '60 min', description: 'Understanding harmony, composition, and arrangement.' },

  // Education - Tutoring
  { id: 46, title: 'Academic Tutoring', provider: 'David Kim', category: 'education', subcategory: 'tutoring', rating: 4.8, reviews: 93, price: '$40', location: 'Online', duration: '60 min', description: 'All subjects K-12. Personalized learning plans.' },
  { id: 47, title: 'College Prep Tutoring', provider: 'Dr. Jennifer Smith', category: 'education', subcategory: 'tutoring', rating: 4.9, reviews: 67, price: '$60', location: 'Library', duration: '90 min', description: 'Essay writing, applications, and interview prep.' },
  
  // Education - Online Courses
  { id: 48, title: 'Coding Bootcamp', provider: 'Tech Academy', category: 'education', subcategory: 'online-courses', rating: 4.8, reviews: 234, price: '$100', location: 'Online', duration: '2 hrs', description: 'Learn Python, JavaScript, and web development from scratch.' },
  
  // Education - Math
  { id: 49, title: 'Math Tutoring', provider: 'Professor Adams', category: 'education', subcategory: 'math', rating: 4.7, reviews: 78, price: '$55', location: 'Online', duration: '60 min', description: 'Algebra through Calculus. Making math make sense.' },
  { id: 50, title: 'Advanced Math', provider: 'Dr. Newton', category: 'education', subcategory: 'math', rating: 4.9, reviews: 45, price: '$70', location: 'University', duration: '90 min', description: 'Calculus, Statistics, and Linear Algebra.' },
  
  // Education - Languages
  { id: 51, title: 'Spanish Lessons', provider: 'Sofia Martin', category: 'education', subcategory: 'languages', rating: 4.9, reviews: 112, price: '$45', location: 'Online', duration: '60 min', description: 'Native speaker from Madrid. Conversational and formal Spanish.' },
  { id: 52, title: 'French Lessons', provider: 'Pierre Dubois', category: 'education', subcategory: 'languages', rating: 4.8, reviews: 89, price: '$50', location: 'Cafe', duration: '60 min', description: 'Parisian French with cultural immersion.' },
  { id: 53, title: 'Mandarin Chinese', provider: 'Teacher Wang', category: 'education', subcategory: 'languages', rating: 4.7, reviews: 67, price: '$55', location: 'Online', duration: '60 min', description: 'HSK prep and business Chinese.' },
  
  // Education - Science
  { id: 54, title: 'Physics Tutoring', provider: 'Dr. Einstein Jr.', category: 'education', subcategory: 'science', rating: 4.8, reviews: 56, price: '$60', location: 'Lab', duration: '75 min', description: 'Making physics intuitive and exciting.' },
  { id: 55, title: 'Chemistry Tutoring', provider: 'Dr. Marie Chen', category: 'education', subcategory: 'science', rating: 4.9, reviews: 43, price: '$55', location: 'Online', duration: '60 min', description: 'AP Chemistry and college-level organic chemistry.' },
  
  // Education - Test Prep
  { id: 56, title: 'SAT Prep Course', provider: 'Dr. James Chen', category: 'education', subcategory: 'test-prep', rating: 4.8, reviews: 87, price: '$80', location: 'Learning Center', duration: '90 min', description: '200+ point improvement guarantee. Proven strategies.' },
  { id: 57, title: 'ACT Prep', provider: 'Test Prep Pro', category: 'education', subcategory: 'test-prep', rating: 4.7, reviews: 65, price: '$75', location: 'Online', duration: '90 min', description: 'Comprehensive ACT preparation with practice tests.' },
];

export const getInstructorsBySubcategory = (subcategoryId: string): Instructor[] => {
  return instructors.filter(inst => inst.subcategory === subcategoryId);
};

export const getInstructorsByCategory = (categoryId: string): Instructor[] => {
  return instructors.filter(inst => inst.category === categoryId);
};
