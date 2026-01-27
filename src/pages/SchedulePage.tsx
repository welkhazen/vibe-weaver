import { Calendar, Clock, MapPin, Video } from 'lucide-react';

const SchedulePage = () => {
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

  return (
    <div className="px-4 py-4 animate-fade-in pb-24">
      <h2 className="text-2xl font-bold text-foreground mb-2">Schedule</h2>
      <p className="text-muted-foreground mb-6">Your upcoming sessions</p>

      {/* Calendar preview */}
      <div className="metallic-card p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">January 2026</h3>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground">
              ←
            </button>
            <button className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground">
              →
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <div key={i} className="py-2 text-muted-foreground font-medium">
              {day}
            </div>
          ))}
          {Array.from({ length: 31 }, (_, i) => (
            <button
              key={i}
              className={`py-2 rounded-lg transition-colors ${
                i === 26
                  ? 'bg-primary text-primary-foreground font-bold'
                  : i === 27 || i === 29
                  ? 'bg-primary/20 text-primary'
                  : 'hover:bg-accent text-foreground'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Upcoming sessions */}
      <h3 className="font-semibold text-foreground mb-3">Upcoming</h3>
      <div className="space-y-3">
        {upcomingSessions.map((session) => (
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
              <button className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
                {session.type === 'online' ? 'Join Call' : 'Get Directions'}
              </button>
              <button className="py-2 px-4 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-accent transition-colors">
                Reschedule
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchedulePage;
