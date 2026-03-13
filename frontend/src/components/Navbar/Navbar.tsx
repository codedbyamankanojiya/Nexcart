import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Heart, Menu, Moon, Search, ShoppingCart, Sun, X, Home, Package, Grid3x3, Phone, User } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { categories } from '../../data/mockProducts';
import { categorySectionId } from '../../lib/slug';
import { scrollToId } from '../../lib/scroll';
import { useTheme } from '../providers/ThemeProvider';
import { cn } from '../../lib/utils';
import { useCatalogStore } from '../../stores/catalogStore';
import { cartCount, useCartStore } from '../../stores/cartStore';


export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement | null>(null);
  const mobilePanelRef = useRef<HTMLDivElement | null>(null);

  const setCurrentCategory = useCatalogStore((s) => s.setCurrentCategory);
  const searchTerm = useCatalogStore((s) => s.searchTerm);
  const setSearchTerm = useCatalogStore((s) => s.setSearchTerm);
  const cartItems = useCartStore((s) => s.items);
  const wishlistCount = useCartStore((s) => s.wishlist.length);

  const [localSearch, setLocalSearch] = useState(searchTerm);

  // Sync local search when global search changes (e.g. clear filters)
  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  // Debounce updates to global store
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(localSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, setSearchTerm]);

  const cartItemsCount = useMemo(() => cartCount(cartItems), [cartItems]);

  const closeAll = () => {
    setIsCategoryOpen(false);
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(false);
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
    if (!q) {
      goToSection('shop');
      return;
    }
    // Ensure store is synced immediately on submit
    setSearchTerm(localSearch);
    goToSection('shop');
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAll();
    };

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (categoryRef.current && !categoryRef.current.contains(target)) {
        setIsCategoryOpen(false);
      }
      if (isMobileMenuOpen && mobilePanelRef.current && !mobilePanelRef.current.contains(target)) {
        setIsMobileMenuOpen(false);
      }
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

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      mobilePanelRef.current?.querySelector<HTMLElement>('button, a')?.focus();
    });
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="pk-container flex h-[68px] items-center justify-between gap-4">
        <Link to="/" onClick={goHomeTop} className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="text-lg font-semibold tracking-tight text-transparent bg-gradient-to-r from-primary via-sky-500 to-emerald-500 bg-clip-text">
            PopKart
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          <NavLink
            to="/"
            onClick={goHomeTop}
            className={({ isActive }) =>
              cn(
                'pk-btn pk-btn-ghost h-9 px-3 text-sm text-muted-foreground hover:bg-accent/80 hover:text-foreground',
                isActive && 'bg-accent/80 text-foreground shadow-sm'
              )
            }
          >
            Home
          </NavLink>

          <div className="relative" ref={categoryRef}>
            <button
              type="button"
              onClick={() => setIsCategoryOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={isCategoryOpen}
              className="pk-btn pk-btn-ghost h-9 px-3 text-sm text-muted-foreground hover:bg-accent/80 hover:text-foreground"
            >
              Categories
            </button>

            <div
              role="menu"
              className={cn(
                'absolute left-0 top-full mt-2 w-56 overflow-hidden rounded-xl border bg-popover p-1 shadow-lg',
                !isCategoryOpen && 'hidden',
                isCategoryOpen && 'pk-pop'
              )}
            >
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  role="menuitem"
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-popover-foreground transition hover:bg-accent/80"
                  onClick={() => {
                    setCurrentCategory(category);
                    setIsCategoryOpen(false);
                    goToSection(categorySectionId(category));
                  }}
                >
                  <span>{category}</span>
                </button>
              ))}
            </div>
          </div>



          <NavLink
            to="/orders"
            onClick={closeAll}
            className={({ isActive }) =>
              cn(
                'pk-btn pk-btn-ghost h-9 px-3 text-sm text-muted-foreground hover:bg-accent/80 hover:text-foreground',
                isActive && 'bg-accent/80 text-foreground shadow-sm'
              )
            }
          >
            Orders
          </NavLink>
          <button
            type="button"
            className="pk-btn pk-btn-ghost h-9 px-3 text-sm text-muted-foreground hover:bg-accent/80 hover:text-foreground"
            onClick={() => goToSection('contact')}
          >
            Contact
          </button>
        </nav>

        <div className="hidden flex-1 items-center justify-center px-4 md:flex">
          <div className="w-full max-w-lg">
            <div className="flex h-10 items-center gap-2 rounded-full border bg-card/90 px-4 shadow-sm backdrop-blur pk-glass transition-all hover:shadow-md focus-within:ring-2 focus-within:ring-primary/20">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submitSearch();
                }}
                placeholder="Search products..."
                className="h-full w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                aria-label="Search products"
              />
              <button
                type="button"
                onClick={submitSearch}
                className="pk-btn pk-btn-primary pk-btn-shine h-7 px-4 text-xs font-medium"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              navigate('/wishlist');
              closeAll();
            }}
            className="pk-btn pk-btn-outline relative h-9 w-9 hover:bg-accent/70"
            aria-label="Open wishlist"
          >
            <Heart className="h-4 w-4" />
            {wishlistCount > 0 && (
              <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              navigate('/cart');
            }}
            className="pk-btn pk-btn-outline relative h-9 w-9 hover:bg-accent/70"
            aria-label="Open cart"
          >
            <ShoppingCart className="h-4 w-4" />
            {cartItemsCount > 0 && (
              <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {cartItemsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="pk-btn pk-btn-outline h-9 w-9 hover:bg-accent/70"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {isMobileSearchOpen ? (
            <div className="absolute inset-x-0 top-0 z-50 flex h-[68px] items-center gap-3 bg-gradient-to-r from-background via-background/95 to-background px-4 shadow-lg border-b md:hidden">
              <div className="relative flex-1">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Search className="h-4 w-4 text-primary" />
                </div>
                <input
                  autoFocus
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      submitSearch();
                      setIsMobileSearchOpen(false);
                    }
                    if (e.key === 'Escape') {
                      setIsMobileSearchOpen(false);
                    }
                  }}
                  placeholder="Search products..."
                  className="h-11 w-full rounded-xl border-2 bg-card/50 pl-14 pr-4 text-sm font-medium outline-none transition-all focus:border-primary/50 focus:bg-card focus:shadow-lg placeholder:text-muted-foreground/60"
                />
              </div>
              <button
                type="button"
                onClick={() => setIsMobileSearchOpen(false)}
                className="flex h-11 shrink-0 items-center justify-center rounded-xl bg-muted/80 px-4 text-sm font-semibold transition-all hover:bg-muted active:scale-95"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="pk-btn pk-btn-outline h-9 w-9 hover:bg-accent/70 md:hidden"
              onClick={() => setIsMobileSearchOpen(true)}
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>
          )}

          <button
            type="button"
            className="pk-btn pk-btn-outline h-9 w-9 hover:bg-accent/70 md:hidden"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            onClick={() => {
              setIsMobileMenuOpen((v) => !v);
              setIsCategoryOpen(false);
            }}
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>



      {isMobileMenuOpen && (
        <div className="md:hidden" aria-label="Mobile menu" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 z-40 bg-gradient-to-b from-black/60 via-black/50 to-black/60 backdrop-blur-md pk-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div
            ref={mobilePanelRef}
            className="fixed right-0 top-0 z-50 h-dvh w-[90%] max-w-sm bg-background shadow-2xl pk-slide-in-right overflow-hidden"
          >
            <div className="flex h-full flex-col">
              {/* Enhanced Header with Gradient */}
              <div className="relative bg-gradient-to-br from-primary/10 via-sky-500/10 to-emerald-500/10 border-b">
                <div className="absolute inset-0 bg-grid-white/5" />
                <div className="relative flex items-center justify-between p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-sky-500 to-emerald-500 shadow-lg">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-base font-bold tracking-tight">Menu</div>
                      <div className="text-xs text-muted-foreground">PopKart Shopping</div>
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
                {/* Main Navigation */}
                <div className="mb-4">
                  <div className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Navigation</div>
                  <nav className="grid gap-1.5">
                    <button
                      type="button"
                      className="group flex h-14 w-full items-center gap-4 rounded-xl bg-card/50 px-4 text-left transition-all duration-200 hover:bg-accent/80 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] border border-transparent hover:border-primary/20"
                      onClick={() => {
                        goHomeTop();
                      }}
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/10 group-hover:from-blue-500/20 group-hover:to-blue-600/20 transition-colors">
                        <Home className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm font-medium">Home</span>
                    </button>

                    <button
                      type="button"
                      className="group flex h-14 w-full items-center gap-4 rounded-xl bg-card/50 px-4 text-left transition-all duration-200 hover:bg-accent/80 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] border border-transparent hover:border-primary/20"
                      onClick={() => {
                        goToSection('categories');
                      }}
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-600/10 group-hover:from-purple-500/20 group-hover:to-purple-600/20 transition-colors">
                        <Grid3x3 className="h-4.5 w-4.5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="text-sm font-medium">Categories</span>
                    </button>

                    <button
                      type="button"
                      className="group flex h-14 w-full items-center gap-4 rounded-xl bg-card/50 px-4 text-left transition-all duration-200 hover:bg-accent/80 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] border border-transparent hover:border-primary/20"
                      onClick={() => {
                        goToSection('shop');
                      }}
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 group-hover:from-emerald-500/20 group-hover:to-emerald-600/20 transition-colors">
                        <Package className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span className="text-sm font-medium">Shop</span>
                    </button>

                    <button
                      type="button"
                      className="group flex h-14 w-full items-center gap-4 rounded-xl bg-card/50 px-4 text-left transition-all duration-200 hover:bg-accent/80 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] border border-transparent hover:border-primary/20"
                      onClick={() => {
                        navigate('/orders');
                        closeAll();
                      }}
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500/10 to-orange-600/10 group-hover:from-orange-500/20 group-hover:to-orange-600/20 transition-colors">
                        <Package className="h-4.5 w-4.5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <span className="text-sm font-medium">Orders</span>
                    </button>

                    <button
                      type="button"
                      className="group flex h-14 w-full items-center gap-4 rounded-xl bg-card/50 px-4 text-left transition-all duration-200 hover:bg-accent/80 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] border border-transparent hover:border-primary/20"
                      onClick={() => {
                        goToSection('contact');
                      }}
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500/10 to-pink-600/10 group-hover:from-pink-500/20 group-hover:to-pink-600/20 transition-colors">
                        <Phone className="h-4.5 w-4.5 text-pink-600 dark:text-pink-400" />
                      </div>
                      <span className="text-sm font-medium">Contact</span>
                    </button>
                  </nav>
                </div>

                {/* Shopping Section */}
                <div className="mb-4">
                  <div className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Shopping</div>
                  <nav className="grid gap-1.5">
                    <button
                      type="button"
                      className="group relative flex h-14 w-full items-center gap-4 rounded-xl bg-gradient-to-br from-red-500/5 to-pink-500/5 px-4 text-left transition-all duration-200 hover:from-red-500/10 hover:to-pink-500/10 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] border border-red-500/20 hover:border-red-500/40"
                      onClick={() => {
                        navigate('/wishlist');
                        closeAll();
                      }}
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-red-500/20 to-pink-500/20 group-hover:from-red-500/30 group-hover:to-pink-500/30 transition-colors">
                        <Heart className="h-4.5 w-4.5 text-red-600 dark:text-red-400" />
                      </div>
                      <span className="text-sm font-medium">Wishlist</span>
                      {wishlistCount > 0 && (
                        <span className="ml-auto flex h-6 min-w-6 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-pink-500 px-2 text-xs font-bold text-white shadow-lg">
                          {wishlistCount}
                        </span>
                      )}
                    </button>

                    <button
                      type="button"
                      className="group relative flex h-14 w-full items-center gap-4 rounded-xl bg-gradient-to-br from-primary/5 to-sky-500/5 px-4 text-left transition-all duration-200 hover:from-primary/10 hover:to-sky-500/10 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] border border-primary/20 hover:border-primary/40"
                      onClick={() => {
                        navigate('/cart');
                        closeAll();
                      }}
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-sky-500/20 group-hover:from-primary/30 group-hover:to-sky-500/30 transition-colors">
                        <ShoppingCart className="h-4.5 w-4.5 text-primary" />
                      </div>
                      <span className="text-sm font-medium">Shopping Cart</span>
                      {cartItemsCount > 0 && (
                        <span className="ml-auto flex h-6 min-w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary to-sky-500 px-2 text-xs font-bold text-white shadow-lg">
                          {cartItemsCount}
                        </span>
                      )}
                    </button>
                  </nav>
                </div>

                {/* Info Card */}
                <div className="mt-6 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 p-4 border">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <span className="text-lg">💡</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-medium text-foreground mb-1">Quick Tip</div>
                      <div className="text-xs text-muted-foreground leading-relaxed">
                        Tap outside the menu or press Esc to close. Swipe right to dismiss.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
