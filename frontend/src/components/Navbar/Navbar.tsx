import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Heart, Menu, Moon, Search, ShoppingCart, Sun, X, Home, Package, Grid3x3, Bell, User, ChevronDown, Zap, Star, TrendingUp } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { categorySectionId } from '../../lib/slug';
import { scrollToId } from '../../lib/scroll';
import { useTheme } from '../providers/ThemeProvider';
import { cn } from '../../lib/utils';
import { useCatalogStore } from '../../stores/catalogStore';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';
import { mockProducts } from '../../data/mockProducts';

const CATEGORIES = ['Smartphone', 'Laptop', 'Gadgets', 'PC Accessories', 'Gaming Console', 'Wearables', 'Audio', 'Fashion'];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<typeof mockProducts>([]);
  const [showResults, setShowResults] = useState(false);
  const categoryRef = useRef<HTMLDivElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const mobilePanelRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);

  const setCurrentCategory = useCatalogStore((s) => s.setCurrentCategory);
  const searchTerm = useCatalogStore((s) => s.searchTerm);
  const setSearchTerm = useCatalogStore((s) => s.setSearchTerm);
  const cart = useCartStore((s) => s.cart);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const [localSearch, setLocalSearch] = useState(searchTerm);

  // Sync local search when global search changes
  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(localSearch);
      // Live search
      if (localSearch.trim().length > 1) {
        const results = mockProducts.filter(p =>
          p.name.toLowerCase().includes(localSearch.toLowerCase()) ||
          p.category.toLowerCase().includes(localSearch.toLowerCase())
        ).slice(0, 6);
        setSearchResults(results);
        setShowResults(true);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [localSearch, setSearchTerm]);

  const cartItemsCount = useMemo(() => cart?.itemCount ?? 0, [cart?.itemCount]);

  const closeAll = () => {
    setIsCategoryOpen(false);
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(false);
    setShowResults(false);
  };

  const goHomeTop = () => {
    closeAll();
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: '__top__' } });
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToSection = (id: string) => {
    closeAll();
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: id } });
      return;
    }
    scrollToId(id);
  };

  const submitSearch = () => {
    const q = localSearch.trim();
    setSearchTerm(localSearch);
    setShowResults(false);
    goToSection('shop');
  };

  // Close on outside click
  useEffect(() => {
    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (categoryRef.current && !categoryRef.current.contains(target)) {
        setIsCategoryOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setIsUserMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(target)) {
        setShowResults(false);
      }
      if (isMobileMenuOpen && mobilePanelRef.current && !mobilePanelRef.current.contains(target)) {
        setIsMobileMenuOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAll();
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown, { passive: true });
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
    };
  }, [isMobileMenuOpen]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prevOverflow; };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-primary via-sky-500 to-emerald-500 px-4 py-2 text-center text-xs font-semibold text-white">
        <span className="inline-flex items-center gap-1">
          <Zap className="h-3 w-3" />
          FREE Shipping on orders above ₹999 | Use code: POPKART20 for 20% OFF
        </span>
      </div>

      <header className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
        <div className="pk-container flex h-[64px] items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" onClick={goHomeTop} className="flex items-center gap-2.5 group">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-sky-500 to-emerald-500 shadow-lg transition-transform group-hover:scale-110">
              <span className="text-sm font-bold text-white">P</span>
              <div className="absolute inset-0 rounded-xl bg-white/20 animate-pulse" />
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-primary via-sky-600 to-emerald-500 bg-clip-text text-transparent">
                PopKart
              </span>
              <span className="text-lg font-bold text-primary">.</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            <NavLink
              to="/"
              onClick={goHomeTop}
              className={({ isActive }) => cn(
                'pk-btn pk-btn-ghost h-9 px-3.5 text-sm transition-all',
                isActive ? 'bg-primary/10 text-primary shadow-sm' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <Home className="h-4 w-4" />
              Home
            </NavLink>

            {/* Categories Mega Menu */}
            <div className="relative" ref={categoryRef}>
              <button
                type="button"
                onClick={() => setIsCategoryOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={isCategoryOpen}
                className={cn(
                  'pk-btn h-9 px-3.5 text-sm transition-all',
                  isCategoryOpen ? 'bg-primary/10 text-primary shadow-sm' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <Grid3x3 className="h-4 w-4" />
                Categories
                <ChevronDown className={cn('h-3 w-3 transition-transform', isCategoryOpen && 'rotate-180')} />
              </button>

              {isCategoryOpen && (
                <div className="absolute left-0 top-full mt-3 w-[480px] overflow-hidden rounded-2xl border bg-popover shadow-2xl pk-pop">
                  <div className="grid grid-cols-2 gap-1 p-3">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setCurrentCategory(cat);
                          setIsCategoryOpen(false);
                          goToSection(categorySectionId(cat));
                        }}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all hover:bg-accent hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary/15 to-sky-500/15">
                          <Package className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium">{cat}</span>
                      </button>
                    ))}
                  </div>
                  <div className="border-t bg-muted/50 px-4 py-3">
                    <button
                      type="button"
                      onClick={() => { setCurrentCategory('All'); setIsCategoryOpen(false); goToSection('shop'); }}
                      className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                    >
                      View all products
                      <TrendingUp className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <NavLink
              to="/orders"
              onClick={closeAll}
              className={({ isActive }) => cn(
                'pk-btn pk-btn-ghost h-9 px-3.5 text-sm transition-all',
                isActive ? 'bg-primary/10 text-primary shadow-sm' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <Package className="h-4 w-4" />
              Orders
            </NavLink>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden flex-1 items-center justify-center px-4 md:flex" ref={searchRef}>
            <div className="relative w-full max-w-xl">
              <div className="group flex h-11 items-center gap-2 rounded-full border-2 border-transparent bg-card px-4 shadow-sm transition-all focus-within:border-primary/40 focus-within:shadow-md hover:border-border/80">
                <Search className="h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <input
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') submitSearch();
                    if (e.key === 'Escape') { setShowResults(false); setLocalSearch(''); }
                  }}
                  onFocus={() => localSearch.trim().length > 1 && setShowResults(true)}
                  placeholder="Search products, brands & more..."
                  className="h-full w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                  aria-label="Search products"
                />
                {localSearch && (
                  <button
                    type="button"
                    onClick={() => { setLocalSearch(''); setShowResults(false); }}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-muted hover:bg-accent"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={submitSearch}
                  className="pk-btn pk-btn-primary pk-btn-shine h-7 px-4 text-xs font-medium shrink-0"
                >
                  Search
                </button>
              </div>

              {/* Search Results Dropdown */}
              {showResults && searchResults.length > 0 && (
                <div className="absolute left-0 top-full mt-2 w-full overflow-hidden rounded-2xl border bg-popover shadow-2xl z-50">
                  <div className="p-2">
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Search Suggestions
                    </div>
                    {searchResults.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => {
                          closeAll();
                          navigate(`/product/${product.id}`);
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all hover:bg-accent"
                      >
                        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium">{product.name}</div>
                          <div className="text-xs text-muted-foreground">{product.category}</div>
                        </div>
                        <div className="text-sm font-semibold text-primary">₹{product.price.toLocaleString()}</div>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={submitSearch}
                      className="mt-2 w-full rounded-xl bg-primary/10 px-3 py-2.5 text-sm font-medium text-primary transition-all hover:bg-primary/20"
                    >
                      See all results for "{localSearch}"
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5">
            {/* Wishlist */}
            <button
              type="button"
              onClick={() => { navigate('/wishlist'); closeAll(); }}
              className="pk-btn pk-btn-outline relative h-10 w-10 shrink-0 hover:bg-accent/70"
              aria-label="Open wishlist"
            >
              <Heart className="h-4 w-4" />
            </button>

            {/* Cart */}
            <button
              type="button"
              onClick={() => { navigate('/cart'); }}
              className="pk-btn pk-btn-outline relative h-10 w-10 shrink-0 hover:bg-accent/70"
              aria-label="Open cart"
            >
              <ShoppingCart className="h-4 w-4" />
              {cartItemsCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-br from-primary to-sky-500 px-1.5 text-[10px] font-bold text-white shadow-lg animate-bounce">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="pk-btn pk-btn-outline h-10 w-10 shrink-0 hover:bg-accent/70"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* User Menu - Desktop */}
            {isAuthenticated ? (
              <div className="relative hidden lg:block" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen((v) => !v)}
                  className="pk-btn pk-btn-ghost h-10 px-2 gap-2 hover:bg-accent"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-emerald-500 text-white text-xs font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium">{user?.name?.split(' ')[0]}</span>
                  <ChevronDown className={cn('h-3 w-3 transition-transform', isUserMenuOpen && 'rotate-180')} />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border bg-popover shadow-2xl pk-pop z-50">
                    <div className="border-b p-4">
                      <div className="font-semibold">{user?.name}</div>
                      <div className="text-xs text-muted-foreground">{user?.email}</div>
                    </div>
                    <div className="p-2">
                      <button onClick={() => { navigate('/profile'); closeAll(); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all hover:bg-accent">
                        <User className="h-4 w-4" /> My Profile
                      </button>
                      <button onClick={() => { navigate('/orders'); closeAll(); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all hover:bg-accent">
                        <Package className="h-4 w-4" /> My Orders
                      </button>
                      <button onClick={() => { navigate('/wishlist'); closeAll(); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all hover:bg-accent">
                        <Heart className="h-4 w-4" /> Wishlist
                      </button>
                      {user?.role === 'SELLER' && (
                        <button onClick={() => { navigate('/seller/dashboard'); closeAll(); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-primary transition-all hover:bg-primary/10">
                          <TrendingUp className="h-4 w-4" /> Seller Dashboard
                        </button>
                      )}
                    </div>
                    <div className="border-t p-2">
                      <button onClick={() => { logout(); closeAll(); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-destructive transition-all hover:bg-destructive/10">
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="pk-btn pk-btn-outline h-10 px-4 text-sm hover:bg-accent/70"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="pk-btn pk-btn-primary pk-btn-shine h-10 px-4 text-sm shadow-lg"
                >
                  Sign up
                </button>
              </div>
            )}

            {/* Mobile Search Button */}
            <button
              type="button"
              className="pk-btn pk-btn-outline h-10 w-10 lg:hidden shrink-0 hover:bg-accent/70"
              onClick={() => setIsMobileSearchOpen(true)}
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="pk-btn pk-btn-outline h-10 w-10 md:hidden shrink-0 hover:bg-accent/70"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              onClick={() => { setIsMobileMenuOpen((v) => !v); setIsCategoryOpen(false); }}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        {isMobileSearchOpen && (
          <div className="absolute inset-x-0 top-0 z-50 lg:hidden">
            <div className="flex h-[64px] items-center gap-3 bg-gradient-to-r from-background via-background/95 to-background px-4 shadow-lg border-b">
              <div className="relative flex-1">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-sky-500/20">
                  <Search className="h-4 w-4 text-primary" />
                </div>
                <input
                  autoFocus
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') { submitSearch(); setIsMobileSearchOpen(false); }
                    if (e.key === 'Escape') setIsMobileSearchOpen(false);
                  }}
                  placeholder="Search products..."
                  className="h-12 w-full rounded-xl border-2 bg-card/50 pl-14 pr-4 text-sm font-medium outline-none transition-all focus:border-primary/50 focus:bg-card focus:shadow-lg placeholder:text-muted-foreground/60"
                />
              </div>
              <button
                type="button"
                onClick={() => setIsMobileSearchOpen(false)}
                className="flex h-12 shrink-0 items-center justify-center rounded-xl bg-muted/80 px-5 font-semibold transition-all hover:bg-muted active:scale-95"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden" aria-label="Mobile menu" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 z-40 bg-gradient-to-b from-black/70 via-black/60 to-black/70 backdrop-blur-md pk-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div
            ref={mobilePanelRef}
            className="fixed right-0 top-0 z-50 h-dvh w-[92%] max-w-sm bg-background shadow-2xl pk-slide-in-right overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-br from-primary/10 via-sky-500/10 to-emerald-500/10 border-b">
              <div className="absolute inset-0 bg-grid-white/5" />
              <div className="relative flex items-center justify-between p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-sky-500 to-emerald-500 shadow-lg">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-base font-bold tracking-tight">
                      {isAuthenticated ? user?.name : 'Guest'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {isAuthenticated ? 'Welcome back!' : 'Sign in for best experience'}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/80 backdrop-blur-sm border hover:bg-accent/80 transition-all duration-200 hover:scale-105 active:scale-95"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Quick Stats */}
              <div className="mb-4 grid grid-cols-3 gap-2">
                <button onClick={() => { navigate('/wishlist'); closeAll(); }} className="flex flex-col items-center gap-1.5 rounded-xl bg-card/80 border p-3 transition-all hover:scale-[1.02] active:scale-[0.98]">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span className="text-xs font-medium">Wishlist</span>
                </button>
                <button onClick={() => { navigate('/cart'); closeAll(); }} className="flex flex-col items-center gap-1.5 rounded-xl bg-card/80 border p-3 transition-all hover:scale-[1.02] active:scale-[0.98]">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  <span className="text-xs font-medium">Cart ({cartItemsCount})</span>
                </button>
                <button onClick={() => { navigate('/orders'); closeAll(); }} className="flex flex-col items-center gap-1.5 rounded-xl bg-card/80 border p-3 transition-all hover:scale-[1.02] active:scale-[0.98]">
                  <Package className="h-5 w-5 text-emerald-500" />
                  <span className="text-xs font-medium">Orders</span>
                </button>
              </div>

              {/* Main Navigation */}
              <div className="mb-4">
                <div className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Menu</div>
                <nav className="grid gap-1.5">
                  {[
                    { icon: Home, label: 'Home', action: goHomeTop, color: 'blue' },
                    { icon: Grid3x3, label: 'Categories', action: () => goToSection('categories'), color: 'purple' },
                    { icon: Package, label: 'Shop', action: () => goToSection('shop'), color: 'emerald' },
                    { icon: ShoppingCart, label: 'Cart', action: () => { navigate('/cart'); closeAll(); }, color: 'sky' },
                    { icon: Heart, label: 'Wishlist', action: () => { navigate('/wishlist'); closeAll(); }, color: 'pink' },
                    { icon: Package, label: 'Orders', action: () => { navigate('/orders'); closeAll(); }, color: 'orange' },
                  ].map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      className="group flex h-14 w-full items-center gap-4 rounded-xl bg-card/50 px-4 text-left transition-all duration-200 hover:bg-accent/80 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] border border-transparent hover:border-primary/20"
                      onClick={item.action}
                    >
                      <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-${item.color}-500/10 to-${item.color}-600/10 group-hover:from-${item.color}-500/20 group-hover:to-${item.color}-600/20 transition-colors`}>
                        <item.icon className="h-4.5 w-4.5" />
                      </div>
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Seller Section */}
              {isAuthenticated && user?.role === 'SELLER' && (
                <div className="mb-4">
                  <div className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Seller Zone</div>
                  <button
                    type="button"
                    className="group flex h-14 w-full items-center gap-4 rounded-xl bg-primary/10 px-4 text-left transition-all duration-200 hover:bg-primary/20 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] border border-primary/20"
                    onClick={() => { navigate('/seller/dashboard'); closeAll(); }}
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-emerald-500 shadow-sm text-white">
                      <TrendingUp className="h-4.5 w-4.5" />
                    </div>
                    <span className="text-sm font-medium text-primary">Seller Dashboard</span>
                  </button>
                </div>
              )}

              {/* Auth Buttons */}
              {!isAuthenticated && (
                <div className="mb-4 grid grid-cols-2 gap-3">
                  <button onClick={() => { navigate('/login'); closeAll(); }} className="pk-btn pk-btn-outline h-11 text-sm font-medium">
                    Login
                  </button>
                  <button onClick={() => { navigate('/signup'); closeAll(); }} className="pk-btn pk-btn-primary pk-btn-shine h-11 text-sm font-medium">
                    Sign up
                  </button>
                </div>
              )}

              {/* Theme Toggle */}
              <div className="mt-4 rounded-xl border bg-card/50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5 text-primary" />}
                    <span className="text-sm font-medium">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                  </div>
                  <button onClick={toggleTheme} className="pk-btn pk-btn-outline h-9 px-4 text-sm">
                    Toggle
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}