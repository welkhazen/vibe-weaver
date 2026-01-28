import ColorPicker from '@/components/ColorPicker';
import GlowIntensitySlider from '@/components/GlowIntensitySlider';
import { ChevronRight, Bell, Lock, Eye, HelpCircle, LogOut, Palette, User, Shield, Sparkles } from 'lucide-react';

const SettingsPage = () => {
  const settingsGroups = [
    {
      title: 'Appearance',
      items: [
        { icon: <Palette className="w-5 h-5" />, label: 'Theme Color', custom: 'color' },
        { icon: <Sparkles className="w-5 h-5" />, label: 'Glow Intensity', custom: 'glow' },
      ],
    },
    {
      title: 'Account',
      items: [
        { icon: <User className="w-5 h-5" />, label: 'Edit Profile' },
        { icon: <Lock className="w-5 h-5" />, label: 'Change Password' },
        { icon: <Shield className="w-5 h-5" />, label: 'Privacy & Security' },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: <Bell className="w-5 h-5" />, label: 'Notifications' },
        { icon: <Eye className="w-5 h-5" />, label: 'Visibility' },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: <HelpCircle className="w-5 h-5" />, label: 'Help & FAQ' },
      ],
    },
  ];

  return (
    <div className="px-4 py-4 animate-fade-in pb-24">
      <h2 className="text-2xl font-bold text-foreground mb-6">Settings</h2>

      <div className="space-y-6">
        {settingsGroups.map((group) => (
          <div key={group.title}>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
              {group.title}
            </h3>
            <div className="metallic-card overflow-hidden">
              {group.items.map((item, index) => (
                <div key={item.label}>
                  {item.custom === 'color' ? (
                    <div className="p-4 space-y-4">
                      <div className="flex items-center gap-3 text-foreground">
                        <div className="text-gold">{item.icon}</div>
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <ColorPicker />
                    </div>
                  ) : item.custom === 'glow' ? (
                    <div className="p-4 space-y-4">
                      <div className="flex items-center gap-3 text-foreground">
                        <div className="text-gold">{item.icon}</div>
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <GlowIntensitySlider />
                    </div>
                  ) : (
                    <button
                      className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 text-foreground">
                        <div className="text-muted-foreground">{item.icon}</div>
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                  )}
                  {index < group.items.length - 1 && (
                    <div className="border-b border-border/50 mx-4" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Logout button */}
        <button className="w-full metallic-card p-4 flex items-center justify-center gap-2 text-destructive hover:bg-destructive/10 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
