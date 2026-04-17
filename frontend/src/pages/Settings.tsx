import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, Globe, Moon, Sun, Shield, Smartphone, CreditCard, HelpCircle, LogOut, ChevronRight, Palette, Volume2, Wifi, Settings as SettingsIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '../stores/authStore';
import { cn } from '../lib/utils';
import CinematicProductBackground from '../components/products/CinematicProductBackground';

type SettingsItem = {
  icon: any;
  label: string;
  href?: string;
  toggle?: boolean;
  onToggle?: (value: boolean) => void;
  value?: string;
};

type SettingsSection = {
  title: string;
  items: SettingsItem[];
};

export default function Settings() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [notifications, setNotifications] = useState(() => localStorage.getItem('notifications') !== 'false');
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('soundEnabled') !== 'false');
  const [autoPlayVideos, setAutoPlayVideos] = useState(() => localStorage.getItem('autoPlayVideos') !== 'false');
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'English');
  const [isSaving, setIsSaving] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const updateSetting = (key: string, value: boolean | string) => {
    if (typeof value === 'boolean') {
      localStorage.setItem(key, value.toString());
    } else {
      localStorage.setItem(key, value);
    }
    toast.success('Setting updated');
  };

  const settingsSections: SettingsSection[] = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Edit Profile', href: '/profile' },
        { icon: CreditCard, label: 'Payment Methods', href: '/profile#payment' },
        { icon: Bell, label: 'Notifications', toggle: notifications, onToggle: (value) => { setNotifications(value); updateSetting('notifications', value); } },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: darkMode ? Moon : Sun, label: 'Dark Mode', toggle: darkMode, onToggle: (value) => { setDarkMode(value); updateSetting('darkMode', value); } },
        { icon: Globe, label: 'Language', value: language },
        { icon: Palette, label: 'Theme', value: 'Auto' },
        { icon: Volume2, label: 'Sound Effects', toggle: soundEnabled, onToggle: (value) => { setSoundEnabled(value); updateSetting('soundEnabled', value); } },
        { icon: Wifi, label: 'Auto-play Videos', toggle: autoPlayVideos, onToggle: (value) => { setAutoPlayVideos(value); updateSetting('autoPlayVideos', value); } },
      ],
    },
    {
      title: 'Privacy & Security',
      items: [
        { icon: Shield, label: 'Privacy Policy', href: '#' },
        { icon: Smartphone, label: 'App Permissions', href: '#' },
        { icon: HelpCircle, label: 'Help Center', href: '#' },
      ],
    },
  ];

  return (
    <div className="pk-container py-6">
      <CinematicProductBackground category="default" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Header */}
        <motion.div
          className="pk-section p-6 mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-4">
            <motion.button
              type="button"
              onClick={() => navigate(-1)}
              className="pk-btn pk-btn-ghost h-12 w-12 p-0 rounded-2xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="h-6 w-6" />
            </motion.button>
            <div className="flex-1">
              <motion.div
                className="flex items-center gap-3 mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-sky-500/20">
                  <SettingsIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-primary/70 bg-clip-text text-transparent">
                    Settings
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">Manage your preferences and account</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Settings Sections */}
        <div className="space-y-8 max-w-3xl">
          {settingsSections.map((section, idx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="pk-section p-6">
                <h2 className="text-lg font-semibold mb-4 text-primary">{section.title}</h2>
                <div className="space-y-1">
                  {section.items.map((item, itemIdx) => (
                    <motion.div
                      key={item.label}
                      className={cn(
                        'flex items-center justify-between p-4 rounded-xl cursor-pointer group',
                        'border border-border/20 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10',
                        'transition-all duration-300 hover:scale-[1.02]',
                        itemIdx < section.items.length - 1 && 'border-b-0'
                      )}
                      onClick={() => {
                        if (item.href) navigate(item.href);
                        if (item.onToggle) item.onToggle(!item.toggle);
                      }}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-4">
                        <motion.div
                          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-sky-500/10 border border-primary/20"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <item.icon className="h-6 w-6 text-primary" />
                        </motion.div>
                        <div className="flex-1">
                          <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {item.label}
                          </div>
                          {item.value && (
                            <div className="text-sm text-muted-foreground mt-0.5">{item.value}</div>
                          )}
                        </div>
                      </div>
                      {item.toggle !== undefined ? (
                        <motion.button
                          type="button"
                          role="switch"
                          aria-checked={item.toggle}
                          className={cn(
                            'relative inline-flex h-7 w-13 items-center rounded-full transition-all duration-300',
                            'border-2 border-border/30',
                            item.toggle ? 'bg-gradient-to-r from-primary to-sky-500 border-primary/50' : 'bg-muted'
                          )}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.span
                            className={cn(
                              'inline-block h-5 w-5 transform rounded-full bg-white shadow-md',
                              'transition-transform duration-300',
                              item.toggle ? 'translate-x-7' : 'translate-x-1'
                            )}
                            layout
                          />
                        </motion.button>
                      ) : (
                        <motion.div
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/50 group-hover:bg-primary/10 transition-colors"
                          whileHover={{ scale: 1.1 }}
                        >
                          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Logout Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.button
              type="button"
              onClick={handleLogout}
              className="w-full pk-btn pk-btn-danger flex items-center justify-center gap-3 h-14 text-base font-semibold"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <LogOut className="h-5 w-5" />
              </motion.div>
              Log Out
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function User({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}
