import { Camera, Edit, MapPin, Star, Award, Calendar } from 'lucide-react';

const ProfilePage = () => {
  return (
    <div className="animate-fade-in pb-24">
      {/* Profile header */}
      <div className="relative">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-br from-primary/30 via-primary/20 to-transparent" />
        
        {/* Avatar */}
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-16">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-card chrome-ring flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-primary/40 to-primary/10 flex items-center justify-center">
                <span className="text-5xl">👤</span>
              </div>
            </div>
            <button className="absolute bottom-2 right-2 p-2 rounded-full bg-primary text-primary-foreground shadow-lg">
              <Camera className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Profile info */}
      <div className="mt-20 px-4 text-center">
        <h2 className="text-2xl font-bold text-foreground">John Doe</h2>
        <div className="flex items-center justify-center gap-1 mt-1 text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">New York, USA</span>
        </div>
        
        <button className="mt-4 px-6 py-2 rounded-full bg-primary text-primary-foreground font-medium inline-flex items-center gap-2 glow-primary">
          <Edit className="w-4 h-4" />
          Edit Profile
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 px-4 mt-6">
        <div className="metallic-card p-4 text-center">
          <div className="flex justify-center mb-2">
            <Calendar className="w-6 h-6 text-primary" />
          </div>
          <span className="text-2xl font-bold text-foreground">24</span>
          <p className="text-xs text-muted-foreground mt-1">Sessions</p>
        </div>
        <div className="metallic-card p-4 text-center">
          <div className="flex justify-center mb-2">
            <Star className="w-6 h-6 text-primary" />
          </div>
          <span className="text-2xl font-bold text-foreground">4.9</span>
          <p className="text-xs text-muted-foreground mt-1">Rating</p>
        </div>
        <div className="metallic-card p-4 text-center">
          <div className="flex justify-center mb-2">
            <Award className="w-6 h-6 text-primary" />
          </div>
          <span className="text-2xl font-bold text-foreground">5</span>
          <p className="text-xs text-muted-foreground mt-1">Badges</p>
        </div>
      </div>

      {/* Recent activity */}
      <div className="px-4 mt-6">
        <h3 className="font-semibold text-foreground mb-3">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { title: 'Completed Yoga Session', date: 'Today', icon: '🧘' },
            { title: 'Left a 5-star review', date: 'Yesterday', icon: '⭐' },
            { title: 'Booked Piano Lesson', date: '2 days ago', icon: '🎹' },
          ].map((activity, i) => (
            <div key={i} className="metallic-card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <span>{activity.icon}</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{activity.title}</p>
                <p className="text-xs text-muted-foreground">{activity.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
