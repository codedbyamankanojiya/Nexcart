import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Zap, Clock, Truck, Shield, ChevronRight, ArrowRight, Flame, BadgeCheck, Package, Search, Filter, SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { categories, categoryImages, mockProducts } from '../data/mockProducts';
import { formatPriceINR } from '../lib/format';
import { categorySectionId } from '../lib/slug';
import { scrollToId } from '../lib/scroll';
import ProductCard from '../components/products/ProductCard';
import { type SortBy, useCatalogStore } from '../stores/catalogStore';
import { useCartStore } from '../stores/cartStore';
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '../lib/products';
import { cn } from '../lib/utils';

// Particle Effect Component
function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-primary/20"
          style={{
            width: `${Math.random() * 6 + 2}px`,
            height: `${Math.random() * 6 + 2}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `pk-float ${Math.random() * 8 + 6}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 4}s`,
          }}
        />
      ))}
    </div>
  );
}

// Flash Sale Countdown
function FlashSaleTimer() {
  const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 42, seconds: 17 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else if (minutes > 0) { minutes--; seconds = 59; }
        else if (hours > 0) { hours--; minutes = 59; seconds = 59; }
        else { hours = 8; minutes = 42; seconds = 17; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-1.5">
      <Flame className="h-5 w-5 text-orange-500" />
      <span className="text-sm font-semibold text-orange-500">Ends in:</span>
      {[
        { v: timeLeft.hours, l: 'H' },
        { v: timeLeft.minutes, l: 'M' },
        { v: timeLeft.seconds, l: 'S' },
      ].map(({ v, l }, i) => (
        <div key={i} className="flex items-center gap-0.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-500 text-sm font-bold text-white shadow-md">
            {String(v).padStart(2, '0')}
          </div>
          {i < 2 && <span className="text-lg font-bold text-orange-500">:</span>}
        </div>
      ))}
    </div>
  );
}

// Brand Trust Badge
function TrustBadge({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-card/80 border p-4 transition-all hover:scale-[1.02] hover:shadow-md">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-sky-500/15">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div>
        <div className="text-sm font-bold">{title}</div>
        <div className="text-xs text-muted-foreground">{subtitle}</div>
      </div>
    </div>
  );
}

// Product Carousel Section
function ProductCarousel({ title, products, badge }: { title: string; products: any[]; badge?: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            {badge && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1 text-xs font-bold text-white">
                <Zap className="h-3 w-3" />
                {badge}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Handpicked deals just for you</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className={cn(
              'pk-btn pk-btn-outline h-10 w-10 p-0 transition-all',
              canScrollLeft ? 'opacity-100' : 'opacity-30 cursor-not-allowed'
            )}
            disabled={!canScrollLeft}
          >
            ←
          </button>
          <button
            onClick={() => scroll('right')}
            className={cn(
              'pk-btn pk-btn-outline h-10 w-10 p-0 transition-all',
              canScrollRight ? 'opacity-100' : 'opacity-30 cursor-not-allowed'
            )}
            disabled={!canScrollRight}
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 pk-no-scrollbar scroll-smooth"
        onScroll={checkScroll}
      >
        {products.map((product) => (
          <div key={product.id} className="w-[280px] shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();

  const addToCart = useCartStore((s) => s.addProductToCart);
  const wishlist = useCartStore((s) => s.wishlist);
  const toggleWishlist = useCartStore((s) => s.toggleWishlist);

  const currentCategory = useCatalogStore((s) => s.currentCategory);
  const setCurrentCategory = useCatalogStore((s) => s.setCurrentCategory);
  const searchTerm = useCatalogStore((s) => s.searchTerm);
  const setSearchTerm = useCatalogStore((s) => s.setSearchTerm);
  const sortBy = useCatalogStore((s) => s.sortBy);
  const setSortBy = useCatalogStore((s) => s.setSortBy);

  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsAPI.getProducts({ limit: 100 }),
  });

  const mappedMockProducts = useMemo(() => mockProducts.map(p => ({
    ...p,
    quantity: p.inStock ? 100 : 0,
    averageRating: p.rating,
    reviewCount: p.reviews,
    images: [p.image],
    category: { id: p.category, name: p.category }
  })), []);

  const products = [...(data?.products || []), ...mappedMockProducts] as any[];

  // Handle scroll to section from navigation
  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    const target = state?.scrollTo;
    if (!target) return;

    let cancelled = false;
    const waitForElement = async (id: string, timeoutMs: number) => {
      const started = Date.now();
      while (!cancelled && Date.now() - started < timeoutMs) {
        const el = document.getElementById(id);
        if (el) return el;
        await new Promise((r) => setTimeout(r, 50));
      }
      return null;
    };

    const doScroll = () => {
      if (target === '__top__') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        scrollToId(target);
      }
    };

    (async () => {
      requestAnimationFrame(() => {
        setTimeout(async () => {
          if (cancelled) return;
          if (target !== '__top__') await waitForElement(target, 1200);
          if (cancelled) return;
          doScroll();
          navigate('.', { replace: true, state: null });
        }, 0);
      });
    })();

    return () => { cancelled = true; };
  }, [location.state, navigate]);

  // Filter & Sort
  const filteredSorted = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const base = q ? products.filter((p) => p.name.toLowerCase().includes(q)) : products;

    const sorted = [...base].sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'rating': return (b.averageRating || 0) - (a.averageRating || 0);
        case 'name': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });
    return sorted;
  }, [products, searchTerm, sortBy]);

  const categorizedProducts = useMemo(() => {
    const map: Record<string, typeof filteredSorted> = {};
    for (const p of filteredSorted) {
      const catName = p.category?.name || 'Uncategorized';
      if (!map[catName]) map[catName] = [];
      map[catName].push(p);
    }
    return map;
  }, [filteredSorted]);

  const visibleCategories = useMemo(() => {
    return categories.filter((c) => currentCategory === 'All' || c === currentCategory);
  }, [currentCategory]);

  const hasVisibleProducts = useMemo(() => {
    for (const c of visibleCategories) {
      if ((categorizedProducts[c] ?? []).length > 0) return true;
    }
    return false;
  }, [categorizedProducts, visibleCategories]);

  const isSearching = useMemo(() => searchTerm.trim().length > 0, [searchTerm]);

  const featuredProducts = useMemo(() => {
    return [...products]
      .filter((p) => p.quantity > 0)
      .sort((a, b) => (b.averageRating || 0) + (b.reviewCount || 0) / 1000 - ((a.averageRating || 0) + (a.reviewCount || 0) / 1000))
      .slice(0, 8);
  }, [products]);

  const flashSaleProducts = useMemo(() => {
    return [...products]
      .filter(p => p.quantity > 0 && p.comparePrice && p.comparePrice > p.price)
      .sort((a, b) => (b.comparePrice! - b.price) - (a.comparePrice! - a.price))
      .slice(0, 6);
  }, [products]);

  const newArrivals = useMemo(() => {
    return [...products]
      .filter((p) => p.quantity > 0)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 6);
  }, [products]);

  // Newsletter state
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  return (
    <div className="pb-16">
      {/* ═══════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-b pk-hero-bg pk-particles pk-grid">
        <Particles />
        <div className="absolute inset-0">
          <div className="absolute -left-40 -top-20 h-96 w-96 rounded-full bg-gradient-to-br from-primary/20 via-sky-500/15 to-transparent blur-3xl pk-float" />
          <div className="absolute -right-32 -top-20 h-80 w-80 rounded-full bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-transparent blur-3xl pk-float pk-float-slow" />
          <div className="absolute bottom-[-140px] left-1/2 h-80 w-[48rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-sky-500/15 via-blue-500/10 to-purple-500/15 blur-3xl pk-float pk-float-fast" />
        </div>

        <div className="relative pk-container py-16 md:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary pk-slide-up">
                <Zap className="h-4 w-4" />
                India’s #1 Modern Megastore
              </div>
              <h1 className="pk-slide-up pk-delay-100 mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Discover <span className="bg-gradient-to-r from-primary via-sky-500 to-emerald-500 bg-clip-text text-transparent">tech</span>,<br />
                fashion &amp; <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">lifestyle</span>.
              </h1>
              <p className="pk-slide-up pk-delay-200 mt-5 max-w-prose text-base text-muted-foreground mx-auto lg:mx-0">
                Premium electronics, trendy fashion, and curated essentials.
                Enjoy seamless browsing, blazing fast checkout, and a stunning dark mode experience.
              </p>
              <div className="pk-slide-up pk-delay-300 mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <button
                  type="button"
                  onClick={() => scrollToId('shop')}
                  className="pk-btn pk-btn-primary pk-btn-shine h-12 px-8 text-base font-bold shadow-xl hover:shadow-2xl hover:shadow-primary/30"
                >
                  <Zap className="h-5 w-5" />
                  Shop Now
                </button>
                <button
                  type="button"
                  onClick={() => scrollToId('categories')}
                  className="pk-btn pk-btn-outline h-12 px-6 text-base font-semibold hover:bg-accent/80"
                >
                  Explore Categories
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Right - Quick Stats */}
            <div className="relative">
              <div className="rounded-3xl border bg-card/80 p-6 shadow-2xl backdrop-blur-xl pk-glass pk-slide-up pk-delay-200">
                {/* Flash Sale Timer */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Flame className="h-6 w-6 text-orange-500" />
                    <span className="text-lg font-bold">Flash Sale</span>
                  </div>
                  <FlashSaleTimer />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { icon: Truck, label: 'Free Shipping', sub: 'On ₹999+' },
                    { icon: Shield, label: 'Secure Pay', sub: '256-bit SSL' },
                    { icon: BadgeCheck, label: 'Easy Returns', sub: '7 Days' },
                  ].map((item) => (
                    <div key={item.label} className="flex flex-col items-center gap-2 rounded-2xl bg-muted/50 p-4 text-center">
                      <item.icon className="h-6 w-6 text-primary" />
                      <div className="text-xs font-semibold">{item.label}</div>
                      <div className="text-[10px] text-muted-foreground">{item.sub}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  {flashSaleProducts.slice(0, 4).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => navigate(`/product/${p.id}`)}
                      className="flex items-center gap-3 rounded-xl border bg-card/80 p-3 text-left transition-all hover:scale-[1.02] hover:border-primary/30 active:scale-[0.98]"
                    >
                      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                        <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-xs font-semibold">{p.name}</div>
                        <div className="text-sm font-bold text-primary">{formatPriceINR(p.price)}</div>
                        {p.comparePrice && (
                          <div className="text-[10px] text-muted-foreground line-through">{formatPriceINR(p.comparePrice)}</div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TRUST BADGES
          ═══════════════════════════════════════════ */}
      <section className="border-b bg-muted/30">
        <div className="pk-container py-6">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <TrustBadge icon={Truck} title="Free Shipping" subtitle="On orders ₹999+" />
            <TrustBadge icon={Shield} title="Secure Payment" subtitle="256-bit encryption" />
            <TrustBadge icon={Package} title="Easy Returns" subtitle="7-day return policy" />
            <TrustBadge icon={BadgeCheck} title="Quality Assured" subtitle="Verified products" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FLASH SALE CAROUSEL
          ═══════════════════════════════════════════ */}
      {flashSaleProducts.length > 0 && (
        <section className="border-b">
          <div className="pk-container py-12">
            <ProductCarousel title="🔥 Flash Deals" products={flashSaleProducts} badge="Up to 70% OFF" />
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          FEATURED PRODUCTS
          ═══════════════════════════════════════════ */}
      <section className="border-b pk-aurora pk-noise">
        <div className="pk-container py-12">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
                <Star className="h-3 w-3 fill-current" />
                Editor's Choice
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Featured Picks</h2>
              <p className="mt-1 text-sm text-muted-foreground">Top rated items loved by customers</p>
            </div>
            <button
              type="button"
              onClick={() => { setCurrentCategory('All'); scrollToId('shop'); }}
              className="pk-btn pk-btn-outline pk-btn-shine h-10 px-5 text-sm"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {featuredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CATEGORIES SECTION
          ═══════════════════════════════════════════ */}
      <section id="categories" className="scroll-mt-24 pk-backdrop-fashion pk-mesh">
        <div className="pk-container py-12">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 mb-3">
                Browse
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Shop by Category</h2>
              <p className="mt-1 text-sm text-muted-foreground">Explore our curated collections</p>
            </div>
            <button
              type="button"
              onClick={() => { setCurrentCategory('All'); scrollToId('shop'); }}
              className="pk-btn pk-btn-outline pk-btn-shine h-10 px-5 text-sm"
            >
              All Categories
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className="group relative overflow-hidden rounded-2xl border bg-card/90 text-left shadow-md transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/15 active:translate-y-0 pk-glass"
                onClick={() => {
                  setCurrentCategory(category);
                  scrollToId(categorySectionId(category));
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                <div className="aspect-[3/4] overflow-hidden bg-muted">
                  <img
                    src={categoryImages[category]}
                    alt={category}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute bottom-0 inset-x-0 p-4">
                  <div className="text-sm font-bold text-white drop-shadow-md">{category}</div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="text-xs text-white/80">{categorizedProducts[category]?.length ?? 0} items</div>
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform group-hover:translate-x-1">
                      <ArrowRight className="h-3 w-3 text-white" />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          NEW ARRIVALS CAROUSEL
          ═══════════════════════════════════════════ */}
      {newArrivals.length > 0 && (
        <section className="border-b">
          <div className="pk-container py-12">
            <ProductCarousel title="✨ New Arrivals" products={newArrivals} badge="Just Dropped" />
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          FILTER BAR + PRODUCT GRID
          ═══════════════════════════════════════════ */}
      <section id="shop" className="scroll-mt-24 pk-backdrop-tech">
        <div className="pk-container pb-6 pt-6">
          {/* Filter Controls */}
          <div className="rounded-2xl bg-card/80 p-4 shadow-sm backdrop-blur mb-6 pk-glass">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <SlidersHorizontal className="h-4 w-4" />
                  Sort by:
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortBy)}
                  className="pk-select w-full sm:w-[200px]"
                  aria-label="Sort products"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="name">Name A-Z</option>
                </select>

                <select
                  value={currentCategory}
                  onChange={(e) => setCurrentCategory(e.target.value)}
                  className="pk-select w-full sm:w-[200px]"
                  aria-label="Filter by category"
                >
                  <option value="All">All Categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {(searchTerm.trim() || currentCategory !== 'All') && (
                <button
                  type="button"
                  onClick={() => { setSearchTerm(''); setCurrentCategory('All'); }}
                  className="pk-btn pk-btn-ghost h-9 px-3 text-sm text-destructive hover:bg-destructive/10"
                >
                  Clear filters
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Product Grid */}
          <div className="pk-section p-5">
            {!hasVisibleProducts ? (
              <div className="rounded-3xl border bg-card/70 p-12 text-center pk-glass">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted/50 mb-4">
                  <Search className="h-10 w-10 text-muted-foreground/50" />
                </div>
                <div className="text-lg font-semibold">No products found</div>
                <p className="mt-2 text-sm text-muted-foreground">Try clearing filters or searching with a different keyword.</p>
                <button
                  type="button"
                  onClick={() => { setSearchTerm(''); setCurrentCategory('All'); }}
                  className="pk-btn pk-btn-primary pk-btn-shine mt-6 h-11 px-6"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                {/* Search Results View */}
                {isSearching && (
                  <section className="scroll-mt-24">
                    <div className="flex items-end justify-between gap-4 mb-6">
                      <div>
                        <h3 className="text-xl font-bold">Search Results</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{filteredSorted.length} items for "{searchTerm}"</p>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {filteredSorted.map((product) => (
                        <div key={product.id} className="rounded-2xl border bg-card/80 p-3 shadow-sm transition-all hover:border-primary/30 hover:shadow-lg pk-glass">
                          <div className="flex gap-4">
                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
                              <img
                                src={product.image || product.images?.[0]}
                                alt={product.name}
                                className="h-full w-full object-cover hover:scale-105 transition-transform cursor-pointer"
                                onClick={() => navigate(`/product/${product.id}`)}
                              />
                            </div>
                            <div className="flex flex-col justify-between min-w-0 flex-1">
                              <div>
                                <div className="text-xs text-muted-foreground font-semibold">{product.category?.name || product.category}</div>
                                <h4 className="mt-0.5 font-semibold line-clamp-2 cursor-pointer hover:text-primary" onClick={() => navigate(`/product/${product.id}`)}>
                                  {product.name}
                                </h4>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                <span className="text-xs font-semibold">{(product.averageRating || 0).toFixed(1)}</span>
                                <span className="text-xs text-muted-foreground">({product.reviewCount || 0})</span>
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-sm font-bold text-primary">{formatPriceINR(product.price)}</span>
                                <button
                                  type="button"
                                  onClick={() => { addToCart(product); toast.success('Added to cart'); }}
                                  className="pk-btn pk-btn-primary pk-btn-shine h-8 px-3 text-xs"
                                >
                                  <ShoppingCart className="h-3.5 w-3.5" />
                                  Add
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Category Sections View */}
                {!isSearching && visibleCategories.map((category) => {
                  const list = categorizedProducts[category] ?? [];
                  if (list.length === 0) return null;
                  return (
                    <section
                      key={category}
                      id={categorySectionId(category)}
                      className="scroll-mt-24 border-b pb-10 pt-8 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-end justify-between gap-4 mb-6">
                        <div>
                          <h3 className="text-xl font-bold tracking-tight">{category}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">{list.length} items</p>
                        </div>
                        {currentCategory !== 'All' && (
                          <button
                            type="button"
                            onClick={() => { setCurrentCategory('All'); scrollToId('shop'); }}
                            className="pk-btn pk-btn-outline pk-btn-shine hidden h-9 px-4 text-sm sm:inline-flex"
                          >
                            Show All
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {list.map((product) => (
                          <ProductCard key={product.id} product={product} />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          NEWSLETTER SECTION
          ═══════════════════════════════════════════ */}
      <section className="border-t bg-gradient-to-br from-primary/5 via-sky-500/5 to-emerald-500/5">
        <div className="pk-container py-16">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary mb-4">
              <Zap className="h-4 w-4" />
              Stay Updated
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Get exclusive deals</h2>
            <p className="mt-3 text-muted-foreground">
              Subscribe to our newsletter and get early access to sales, new arrivals, and insider-only discounts.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="pk-input flex-1 h-12 px-5"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && email.trim()) {
                    setSubscribed(true);
                    toast.success('Subscribed successfully!');
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  if (!email.trim()) return;
                  setSubscribed(true);
                  toast.success('Subscribed successfully!');
                }}
                className="pk-btn pk-btn-primary pk-btn-shine h-12 px-8 text-base font-semibold shadow-lg"
              >
                Subscribe
              </button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}