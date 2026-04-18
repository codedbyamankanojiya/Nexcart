import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Camera, Edit2, Mail, Phone, MapPin, Calendar, Award, ShoppingBag, Heart, Star, ShoppingCart, User, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '../stores/authStore';
import { cn } from '../lib/utils';
import CinematicProductBackground from '../components/products/CinematicProductBackground';

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: (user?.customerProfile as any)?.location || '',
    bio: (user?.customerProfile as any)?.bio || '',
    avatar: user?.avatar || ''
  });

  const handleSave = async () => {
    try {
      // Update profile via API
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          customerProfile: {
            location: formData.location,
            bio: formData.bio
          }
        })
      });

      if (response.ok) {
        setIsEditing(false);
        toast.success('Profile updated successfully');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const stats = [
    { label: 'Orders', value: '24', icon: ShoppingBag, color: 'text-blue-500' },
    { label: 'Wishlist', value: '48', icon: Heart, color: 'text-rose-500' },
    { label: 'Reviews', value: '12', icon: Star, color: 'text-amber-500' },
    { label: 'Points', value: '1,250', icon: Award, color: 'text-emerald-500' },
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
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-primary/70 bg-clip-text text-transparent">
                    Profile
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">Manage your personal information</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          {/* Left Column - Avatar & Quick Stats */}
          <div className="space-y-6">
            {/* Avatar Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="pk-section p-6 text-center"
            >
              <div className="relative inline-block">
                <div className="relative h-24 w-24 mx-auto mb-4">
                  {formData.avatar ? (
                    <img
                      src={formData.avatar}
                      alt="Avatar"
                      className="h-full w-full rounded-full object-cover border-4 border-background"
                    />
                  ) : (
                    <div className="h-full w-full rounded-full bg-muted flex items-center justify-center border-4 border-background">
                      <User className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white cursor-pointer hover:bg-primary/90 transition-colors">
                      <Camera className="h-4 w-4" />
                      <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleAvatarChange}
                        accept="image/*"
                      />
                    </label>
                  )}
                </div>
                <h3 className="font-semibold">{formData.name}</h3>
                <p className="text-sm text-muted-foreground">{formData.email}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + idx * 0.05 }}
                    className="pk-glass p-4 rounded-xl text-center"
                  >
                    <stat.icon className={cn('h-5 w-5 mx-auto mb-2', stat.color)} />
                    <div className="text-lg font-bold">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="pk-section p-6"
            >
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full pk-btn pk-btn-outline flex items-center justify-center gap-2 h-11">
                  <ShoppingCart className="h-4 w-4" />
                  View Orders
                </button>
                <button className="w-full pk-btn pk-btn-outline flex items-center justify-center gap-2 h-11">
                  <Heart className="h-4 w-4" />
                  Wishlist
                </button>
                <button className="w-full pk-btn pk-btn-outline flex items-center justify-center gap-2 h-11">
                  <Star className="h-4 w-4" />
                  My Reviews
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Profile Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Basic Information */}
            <div className="pk-section p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="pk-btn pk-btn-outline h-9 px-4 flex items-center gap-2"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSave}
                      className="pk-btn pk-btn-primary h-9 px-4 flex items-center gap-2"
                    >
                      <Check className="h-4 w-4" />
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="pk-btn pk-btn-outline h-9 px-4"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="pk-input"
                    />
                  ) : (
                    <div className="pk-input bg-transparent">{formData.name}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="pk-input"
                    />
                  ) : (
                    <div className="pk-input bg-transparent flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {formData.email}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="pk-input"
                    />
                  ) : (
                    <div className="pk-input bg-transparent flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {formData.phone}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="pk-input"
                    />
                  ) : (
                    <div className="pk-input bg-transparent flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {formData.location}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  {isEditing ? (
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      className="pk-textarea"
                      rows={3}
                    />
                  ) : (
                    <div className="pk-input bg-transparent min-h-[80px]">{formData.bio}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Account Activity */}
            <div className="pk-section p-6">
              <h3 className="text-lg font-semibold mb-4">Account Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Member Since</div>
                      <div className="text-sm text-muted-foreground">January 2024</div>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">2 years ago</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <Check className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                      <div className="font-medium">Verified Account</div>
                      <div className="text-sm text-muted-foreground">Identity confirmed</div>
                    </div>
                  </div>
                  <span className="text-sm text-emerald-600 font-medium">Verified</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
