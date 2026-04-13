import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, Zap, Truck, Shield, ArrowRight, Flame, BadgeCheck, Package, Search, SlidersHorizontal, X } from 'lucide-react';
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
  const [particles] = useState<any[]>(() => [...Array(20)].map(() => ({
    width: `${Math.random() * 6 + 2}px`,
    height: `${Math.random() * 6 + 2}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animation: `pk-float ${Math.random() * 8 + 6}s ease-in-out infinite`,
    animationDelay: `${Math.random() * 4}s`,
  })));

  return (
    <div className="overflow-hidden absolute inset-0 pointer-events-none">
      {particles.map((style, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-primary/20"
          style={style}
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
      <Flame className="w-5 h-5 text-orange-500" />
      <span className="text-sm font-semibold text-orange-500">Ends in:</span>
      {[
        { v: timeLeft.hours, l: 'H' },
        { v: timeLeft.minutes, l: 'M' },
        { v: timeLeft.seconds, l: 'S' },
      ].map(({ v }, i) => (
        <div key={i} className="flex items-center gap-0.5">
          <div className="flex justify-center items-center w-8 h-8 text-sm font-bold text-white bg-gradient-to-br from-orange-500 to-red-500 rounded-lg shadow-md">
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
      <div className="flex justify-center items-center w-12 h-12 bg-gradient-to-br rounded-xl from-primary/15 to-sky-500/15">
        <Icon className="w-6 h-6 text-primary" />
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex gap-3 items-center">
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            {badge && (
              <span className="inline-flex gap-1 items-center px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
                <Zap className="w-3 h-3" />
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
              'p-0 w-10 h-10 transition-all pk-btn pk-btn-outline',
              canScrollLeft ? 'opacity-100' : 'opacity-30 cursor-not-allowed'
            )}
            disabled={!canScrollLeft}
          >
            ←
          </button>
          <button
            onClick={() => scroll('right')}
            className={cn(
              'p-0 w-10 h-10 transition-all pk-btn pk-btn-outline',
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
        className="flex overflow-x-auto gap-4 pb-4 pk-no-scrollbar scroll-smooth"
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


  const currentCategory = useCatalogStore((s) => s.currentCategory);
  const setCurrentCategory = useCatalogStore((s) => s.setCurrentCategory);
  const searchTerm = useCatalogStore((s) => s.searchTerm);
  const setSearchTerm = useCatalogStore((s) => s.setSearchTerm);
  const sortBy = useCatalogStore((s) => s.sortBy);
  const setSortBy = useCatalogStore((s) => s.setSortBy);

  const { data } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsAPI.getProducts({ limit: 100 }),
  });

  const mappedMockProducts = useMemo(() => mockProducts.map(p => ({
    ...p,
    quantity: p.inStock ? 100 : 0,
    averageRating: p.rating,
    reviewCount: p.reviews,
    images: [p.image],
    category: { id: p.category, name: p.category },
    createdAt: new Date().toISOString()
  })), []);

  const products = useMemo(() => [...(data?.products || []), ...mappedMockProducts], [data?.products, mappedMockProducts]);

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
  const [, setSubscribed] = useState(false);

  return (
    <div className="pb-16">
      {/* ═══════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════ */}
      <section className="overflow-hidden relative border-b pk-hero-bg pk-particles pk-grid">
        <Particles />
        <div className="absolute inset-0">
          <div className="absolute -top-20 -left-40 w-96 h-96 bg-gradient-to-br to-transparent rounded-full blur-3xl from-primary/20 via-sky-500/15 pk-float" />
          <div className="absolute -top-20 -right-32 w-80 h-80 bg-gradient-to-br to-transparent rounded-full blur-3xl from-emerald-500/15 via-teal-500/10 pk-float pk-float-slow" />
          <div className="absolute bottom-[-140px] left-1/2 h-80 w-[48rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-sky-500/15 via-blue-500/10 to-purple-500/15 blur-3xl pk-float pk-float-fast" />
        </div>

        <div className="relative py-16 pk-container md:py-24">
          <div className="grid gap-10 items-center lg:grid-cols-2">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex gap-2 items-center px-4 py-2 text-sm font-semibold rounded-full bg-primary/10 text-primary pk-slide-up">
                <Zap className="w-4 h-4" />
                India’s #1 Modern Megastore
              </div>
              <h1 className="mt-4 text-4xl font-bold tracking-tight pk-slide-up pk-delay-100 sm:text-5xl lg:text-6xl">
                Discover <span className="text-transparent bg-clip-text bg-gradient-to-r via-sky-500 to-emerald-500 from-primary">tech</span>,<br />
                fashion &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">lifestyle</span>.
              </h1>
              <p className="mx-auto mt-5 max-w-prose text-base pk-slide-up pk-delay-200 text-muted-foreground lg:mx-0">
                Premium electronics, trendy fashion, and curated essentials.
                Enjoy seamless browsing, blazing fast checkout, and a stunning dark mode experience.
              </p>
              <div className="flex flex-col gap-4 mt-8 pk-slide-up pk-delay-300 sm:flex-row sm:justify-center lg:justify-start">
                <button
                  type="button"
                  onClick={() => scrollToId('shop')}
                  className="px-8 h-12 text-base font-bold shadow-xl pk-btn pk-btn-primary pk-btn-shine hover:shadow-2xl hover:shadow-primary/30"
                >
                  <Zap className="w-5 h-5" />
                  Shop Now
                </button>
                <button
                  type="button"
                  onClick={() => scrollToId('categories')}
                  className="px-6 h-12 text-base font-semibold pk-btn pk-btn-outline hover:bg-accent/80"
                >
                  Explore Categories
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right - Quick Stats */}
            <div className="relative">
              <div className="p-6 rounded-3xl border shadow-2xl backdrop-blur-xl bg-card/80 pk-glass pk-slide-up pk-delay-200">
                {/* Flash Sale Timer */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex gap-2 items-center">
                    <Flame className="w-6 h-6 text-orange-500" />
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
                    <div key={item.label} className="flex flex-col gap-2 items-center p-4 text-center rounded-2xl bg-muted/50">
                      <item.icon className="w-6 h-6 text-primary" />
                      <div className="text-xs font-semibold">{item.label}</div>
                      <div className="text-[10px] text-muted-foreground">{item.sub}</div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                  {flashSaleProducts.slice(0, 4).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => navigate(`/product/${p.id}`)}
                      className="flex items-center gap-3 rounded-xl border bg-card/80 p-3 text-left transition-all hover:scale-[1.02] hover:border-primary/30 active:scale-[0.98]"
                    >
                      <div className="overflow-hidden flex-shrink-0 w-12 h-12 rounded-lg bg-muted">
                        <img src={p.images?.[0] || (p as any).image} alt={p.name} className="object-cover w-full h-full" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold truncate">{p.name}</div>
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
        <div className="py-6 pk-container">
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
          <div className="py-12 pk-container">
            <ProductCarousel title="🔥 Flash Deals" products={flashSaleProducts} badge="Up to 70% OFF" />
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          FEATURED PRODUCTS
          ═══════════════════════════════════════════ */}
      <section className="border-b pk-aurora pk-noise">
        <div className="py-12 pk-container">
          <div className="flex gap-4 justify-between items-end mb-8">
            <div>
              <div className="inline-flex gap-2 items-center px-3 py-1 mb-3 text-xs font-semibold rounded-full bg-primary/10 text-primary">
                <Star className="w-3 h-3 fill-current" />
                Editor's Choice
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Featured Picks</h2>
              <p className="mt-1 text-sm text-muted-foreground">Top rated items loved by customers</p>
            </div>
            <button
              type="button"
              onClick={() => { setCurrentCategory('All'); scrollToId('shop'); }}
              className="px-5 h-10 text-sm pk-btn pk-btn-outline pk-btn-shine"
            >
              View All
              <ArrowRight className="w-4 h-4" />
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
        <div className="py-12 pk-container">
          <div className="flex flex-col gap-4 justify-between items-start sm:flex-row sm:items-end">
            <div>
              <div className="inline-flex gap-2 items-center px-3 py-1 mb-3 text-xs font-semibold text-emerald-600 rounded-full bg-emerald-500/10">
                Browse
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Shop by Category</h2>
              <p className="mt-1 text-sm text-muted-foreground">Explore our curated collections</p>
            </div>
            <button
              type="button"
              onClick={() => { setCurrentCategory('All'); scrollToId('shop'); }}
              className="px-5 h-10 text-sm pk-btn pk-btn-outline pk-btn-shine"
            >
              All Categories
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
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
                <div className="absolute inset-0 bg-gradient-to-t to-transparent opacity-0 transition duration-300 from-black/70 via-black/20 group-hover:opacity-100" />
                <div className="aspect-[3/4] overflow-hidden bg-muted">
                  <img
                    src={categoryImages[category]}
                    alt={category}
                    loading="lazy"
                    decoding="async"
                    className="object-cover w-full h-full transition duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <div className="text-sm font-bold text-white drop-shadow-md">{category}</div>
                  <div className="flex justify-between items-center mt-1">
                    <div className="text-xs text-white/80">{categorizedProducts[category]?.length ?? 0} items</div>
                    <div className="flex justify-center items-center w-6 h-6 rounded-full backdrop-blur-sm transition-transform bg-white/20 group-hover:translate-x-1">
                      <ArrowRight className="w-3 h-3 text-white" />
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
          <div className="py-12 pk-container">
            <ProductCarousel title="✨ New Arrivals" products={newArrivals} badge="Just Dropped" />
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          FILTER BAR + PRODUCT GRID
          ═══════════════════════════════════════════ */}
      <section id="shop" className="scroll-mt-24 pk-backdrop-tech">
        <div className="pt-6 pb-6 pk-container">
          {/* Filter Controls */}
          <div className="p-4 mb-6 rounded-2xl shadow-sm backdrop-blur bg-card/80 pk-glass">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex gap-2 items-center text-sm font-semibold">
                  <SlidersHorizontal className="w-4 h-4" />
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
                  className="px-3 h-9 text-sm pk-btn pk-btn-ghost text-destructive hover:bg-destructive/10"
                >
                  Clear filters
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Product Grid */}
          <div className="p-5 pk-section">
            {!hasVisibleProducts ? (
              <div className="p-12 text-center rounded-3xl border bg-card/70 pk-glass">
                <div className="flex justify-center items-center mx-auto mb-4 w-20 h-20 rounded-full bg-muted/50">
                  <Search className="w-10 h-10 text-muted-foreground/50" />
                </div>
                <div className="text-lg font-semibold">No products found</div>
                <p className="mt-2 text-sm text-muted-foreground">Try clearing filters or searching with a different keyword.</p>
                <button
                  type="button"
                  onClick={() => { setSearchTerm(''); setCurrentCategory('All'); }}
                  className="px-6 mt-6 h-11 pk-btn pk-btn-primary pk-btn-shine"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                {/* Search Results View */}
                {isSearching && (
                  <section className="scroll-mt-24">
                    <div className="flex gap-4 justify-between items-end mb-6">
                      <div>
                        <h3 className="text-xl font-bold">Search Results</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{filteredSorted.length} items for "{searchTerm}"</p>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {filteredSorted.map((product) => (
                        <div key={product.id} className="p-3 rounded-2xl border shadow-sm transition-all bg-card/80 hover:border-primary/30 hover:shadow-lg pk-glass">
                          <div className="flex gap-4">
                            <div className="overflow-hidden flex-shrink-0 w-24 h-24 rounded-xl bg-muted">
                              <img
                                src={product.images?.[0] || (product as any).image}
                                alt={product.name}
                                className="object-cover w-full h-full transition-transform cursor-pointer hover:scale-105"
                                onClick={() => navigate(`/product/${product.id}`)}
                              />
                            </div>
                            <div className="flex flex-col flex-1 justify-between min-w-0">
                              <div>
                                <div className="text-xs font-semibold text-muted-foreground">{product.category?.name || String(product.category)}</div>
                                <h4 className="mt-0.5 font-semibold line-clamp-2 cursor-pointer hover:text-primary" onClick={() => navigate(`/product/${product.id}`)}>
                                  {product.name}
                                </h4>
                              </div>
                              <div className="flex gap-1 items-center">
                                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                <span className="text-xs font-semibold">{(product.averageRating || 0).toFixed(1)}</span>
                                <span className="text-xs text-muted-foreground">({product.reviewCount || 0})</span>
                              </div>
                              <div className="flex justify-between items-center mt-1">
                                <span className="text-sm font-bold text-primary">{formatPriceINR(product.price)}</span>
                                <button
                                  type="button"
                                  onClick={() => { addToCart(product); toast.success('Added to cart'); }}
                                  className="px-3 h-8 text-xs pk-btn pk-btn-primary pk-btn-shine"
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
                      className="pt-8 pb-10 border-b scroll-mt-24 last:border-b-0 last:pb-0"
                    >
                      <div className="flex gap-4 justify-between items-end mb-6">
                        <div>
                          <h3 className="text-xl font-bold tracking-tight">{category}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">{list.length} items</p>
                        </div>
                        {currentCategory !== 'All' && (
                          <button
                            type="button"
                            onClick={() => { setCurrentCategory('All'); scrollToId('shop'); }}
                            className="hidden px-4 h-9 text-sm pk-btn pk-btn-outline pk-btn-shine sm:inline-flex"
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
      <section className="bg-gradient-to-br border-t from-primary/5 via-sky-500/5 to-emerald-500/5">
        <div className="py-16 pk-container">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex gap-2 items-center px-4 py-2 mb-4 text-sm font-semibold rounded-full bg-primary/10 text-primary">
              <Zap className="w-4 h-4" />
              Stay Updated
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Get exclusive deals</h2>
            <p className="mt-3 text-muted-foreground">
              Subscribe to our newsletter and get early access to sales, new arrivals, and insider-only discounts.
            </p>
            <div className="flex flex-col gap-3 mt-8 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-5 h-12 pk-input"
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
                className="px-8 h-12 text-base font-semibold shadow-lg pk-btn pk-btn-primary pk-btn-shine"
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