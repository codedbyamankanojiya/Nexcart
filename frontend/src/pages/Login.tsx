import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Lock, Mail, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '../stores/authStore';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(formData);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pk-auth-bg min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pk-fade-in">
      <div className="w-full max-w-md space-y-6 pk-scale-in">
        <div className="pk-glass rounded-2xl p-8 text-center">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-brand-4 flex items-center justify-center shadow-lg shadow-primary/30 mb-4">
            <ShoppingBag className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold">Welcome back</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            New to NexCart?{' '}
            <Link to="/signup" className="font-semibold text-primary hover:opacity-80">
              Create an account
            </Link>
          </p>
        </div>

        <div className="pk-glass rounded-2xl p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  Email address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="pk-input pl-10"
                    placeholder="e.g. rahul@example.com"
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="pk-input pl-10 pr-10"
                    placeholder="Enter your password"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30 bg-background/50"
                />
                <span className="text-muted-foreground">Remember me</span>
              </label>
              <Link to="/forgot-password" className="font-semibold text-primary hover:opacity-80">
                Forgot password?
              </Link>
            </div>

            <button type="submit" disabled={isLoading} className="pk-btn pk-btn-primary pk-btn-shine w-full h-11 text-sm">
              {isLoading ? (
                'Signing in...'
              ) : (
                <span className="flex items-center gap-2">
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </button>

            <div className="text-center pt-2 border-t border-border/50">
              <p className="text-sm text-muted-foreground">
                Want to sell on NexCart?{' '}
                <Link to="/signup?role=SELLER" className="font-semibold text-brand-2 hover:opacity-80">
                  Register as a seller
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
