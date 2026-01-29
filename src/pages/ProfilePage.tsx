import { useState } from 'react';
import { Camera, Edit, MapPin, Star, Award, Calendar, Clock, Video, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const upcomingSessions = [
  {
    id: 1,
    title: 'Vinyasa Flow Yoga',
    instructor: 'Sarah Chen',
    date: 'Today',
    time: '10:00 AM',
    duration: '60 min',
    type: 'in-person',
    location: 'Downtown Studio',
  },
  {
    id: 2,
    title: 'CBT Therapy Session',
    instructor: 'Dr. Michael Ross',
    date: 'Tomorrow',
    time: '2:00 PM',
    duration: '50 min',
    type: 'online',
    location: 'Video Call',
  },
  {
    id: 3,
    title: 'Piano Lesson',
    instructor: 'Emma Williams',
    date: 'Jan 30',
    time: '4:30 PM',
    duration: '45 min',
    type: 'in-person',
    location: 'East Side Music Hall',
  },
];

const ProfilePage = () => {
  const [showAllBookings, setShowAllBookings] = useState(false);
  const displayedSessions = showAllBookings ? upcomingSessions : upcomingSessions.slice(0, 2);

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

      {/* Upcoming Bookings Section */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground">Upcoming Bookings</h3>
          <span className="text-xs text-primary font-medium">{upcomingSessions.length} scheduled</span>
        </div>

        {/* Calendar Preview */}
        <div className="metallic-card p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-foreground">January 2026</h4>
            <div className="flex gap-1">
              <button className="p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <div key={i} className="py-1.5 text-muted-foreground font-medium">
                {day}
              </div>
            ))}
            {Array.from({ length: 31 }, (_, i) => {
              const dayNum = i + 1;
              const isToday = dayNum === 29;
              const hasSession = dayNum === 29 || dayNum === 30;
              return (
                <button
                  key={i}
                  className={cn(
                    'py-1.5 rounded-lg text-xs transition-all duration-200',
                    isToday
                      ? 'bg-primary text-primary-foreground font-bold'
                      : hasSession
                      ? 'bg-primary/20 text-primary font-medium'
                      : 'hover:bg-accent text-foreground'
                  )}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="space-y-3">
          {displayedSessions.map((session) => (
            <div key={session.id} className="metallic-card p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-foreground">{session.title}</h4>
                  <p className="text-sm text-muted-foreground">{session.instructor}</p>
                </div>
                {session.type === 'online' ? (
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Video className="w-4 h-4 text-primary" />
                  </div>
                ) : (
                  <div className="p-2 rounded-lg bg-accent">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{session.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{session.time} ({session.duration})</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{session.location}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-all duration-300 hover:bg-primary/90 active:scale-[0.98]">
                  {session.type === 'online' ? 'Join Call' : 'Get Directions'}
                </button>
                <button className="py-2 px-4 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-accent transition-all duration-300 active:scale-[0.98]">
                  Reschedule
                </button>
              </div>
            </div>
          ))}
        </div>

        {upcomingSessions.length > 2 && (
          <button
            onClick={() => setShowAllBookings(!showAllBookings)}
            className="w-full mt-3 py-2 flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {showAllBookings ? (
              <>
                Show Less <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                View All ({upcomingSessions.length}) <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        )}
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
