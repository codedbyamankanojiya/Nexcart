import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Star, Zap, Truck, Shield, ArrowRight, Flame, BadgeCheck, Search, SlidersHorizontal, X } from 'lucide-react';
import { toast } from 'sonner';
import { categories, categoryImages, mockProducts } from '../data/mockProducts';
import { categorySectionId } from '../lib/slug';
import { scrollToId } from '../lib/scroll';
import ProductCard from '../components/products/ProductCard';
import CinematicProductGrid from '../components/products/CinematicProductGrid';
import { type SortBy, useCatalogStore } from '../stores/catalogStore';
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '../lib/products';
import { cn } from '../lib/utils';
import { CinematicBg } from '../components/ui/CinematicBg';
import { FloatingProducts, ScrollReveal } from '../components/ui/Showcase';

// Marquee product images
const MARQUEE_ROW1 = [
  { url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=300&q=70', label: 'iPhone 15 Pro' },
  { url: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=300&q=70', label: 'PlayStation 5' },
  { url: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=300&q=70', label: 'MacBook Pro M3' },
  { url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=300&q=70', label: 'Nike Sneakers' },
  { url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=300&q=70', label: "Women's Fashion" },
  { url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=300&q=70', label: 'Apple Watch' },
  { url: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=300&q=70', label: 'RTX 4090' },
  { url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=300&q=70', label: 'MX Master 3S' },
];

const MARQUEE_ROW2 = [
  { url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=300&q=70', label: 'Ray-Ban' },
  { url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80', label: 'Galaxy S24 Ultra' },
  { url: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=300&q=70', label: 'ROG Gaming' },
  { url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=300&q=70', label: 'Luxury Bag' },
  { url: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=300&q=70', label: 'Nintendo Switch' },
  { url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=300&q=70', label: 'AirPods Pro' },
  { url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=300&q=70', label: "Men's Wear" },
  { url: 'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?auto=format&fit=crop&w=300&q=70', label: 'Samsung QLED TV' },
];

function MarqueeItem({ item, i }: { item: typeof MARQUEE_ROW1[0]; i: number }) {
  return (
    <div
      key={i}
      className="shrink-0 overflow-hidden rounded-2xl border border-border/30 shadow-lg w-28 h-20 sm:w-36 sm:h-24 relative group"
    >
      <img
        src={item.url}
        alt={item.label}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover transition duration-700 group-hover:scale-110 brightness-90"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1.5">
        <div className="text-[10px] font-semibold text-white/90 truncate">{item.label}</div>
      </div>
    </div>
  );
}

function MarqueeStrip() {
  const row1 = [...MARQUEE_ROW1, ...MARQUEE_ROW1];
  const row2 = [...MARQUEE_ROW2, ...MARQUEE_ROW2];
  return (
    <div className="py-6 overflow-hidden border-y border-border/20 bg-background/50 backdrop-blur-sm">
      <div className="pk-film-strip mb-2.5">
        <div className="pk-film-strip-track">
          {row1.map((item, i) => <MarqueeItem key={i} item={item} i={i} />)}
        </div>
      </div>
      <div className="pk-film-strip">
        <div className="pk-film-strip-track-reverse">
          {row2.map((item, i) => <MarqueeItem key={i} item={item} i={i} />)}
        </div>
      </div>
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
      .filter((p) => (p.quantity || 0) > 0)
      .sort((a, b) => (b.averageRating || 0) + (b.reviewCount || 0) / 1000 - ((a.averageRating || 0) + (a.reviewCount || 0) / 1000))
      .slice(0, 8);
  }, [products]);

  
  const newArrivals = useMemo(() => {
    return [...products]
      .filter((p) => (p.quantity || 0) > 0)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 6);
  }, [products]);

  // Newsletter state
  const [email, setEmail] = useState('');
  const [, setSubscribed] = useState(false);

  return (
    <div className="pb-16">
      {/* ═══════════════════════════════════════════
          CINEMATIC HERO SECTION
          ═══════════════════════════════════════════ */}
      <section className="overflow-hidden relative pk-hero-bg pk-grid" style={{ minHeight: 'clamp(500px, 88vh, 1000px)' }}>
        {/* Cinematic Slideshow Background */}
        <CinematicBg overlay="dark" interval={7000} />

        {/* Particles overlay */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute -top-20 -left-40 w-96 h-96 bg-gradient-to-br to-transparent rounded-full blur-3xl from-primary/15 via-sky-500/10 pk-float" />
          <div className="absolute -top-20 -right-32 w-80 h-80 bg-gradient-to-br to-transparent rounded-full blur-3xl from-emerald-500/10 via-teal-500/8 pk-float pk-float-slow" />
          <div className="absolute bottom-[-100px] left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-sky-500/10 via-blue-500/8 to-purple-500/10 blur-3xl pk-float pk-float-fast" />
        </div>

        {/* Floating product showcase — decorative */}
        <div className="absolute inset-0 z-10 hidden xl:block">
          <FloatingProducts />
        </div>

        {/* Announcement stripe */}
        <div className="absolute inset-x-0 top-0 z-20 py-1 text-center text-xs font-semibold text-white/90 bg-gradient-to-r from-primary/80 via-sky-500/80 to-emerald-500/80 backdrop-blur-sm">
          <span className="inline-flex items-center gap-1.5">
            <Zap className="w-3 h-3" />
            <span className="hidden xs:inline">NEW: Flash Sale Live — Up to 70% OFF on Premium Tech!</span>
            <span className="xs:hidden">Flash Sale — Up to 70% OFF!</span>
          </span>
        </div>

        {/* Hero content */}
        <div className="relative z-20 flex items-center" style={{ minHeight: 'clamp(500px, 88vh, 1000px)' }}>
          <div className="pk-container py-16 sm:py-20 md:py-24">
            <div className="grid gap-8 lg:gap-12 items-center lg:grid-cols-2 xl:grid-cols-[1fr_520px]">
              {/* Left Content */}
              <div className="text-center lg:text-left">
                <div className="inline-flex gap-2 items-center px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold rounded-full bg-primary/15 text-primary backdrop-blur-sm border border-primary/20 pk-slide-up">
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                  India's #1 Modern Megastore
                </div>
                <h1 className="mt-4 text-3xl font-bold tracking-tight pk-slide-up pk-delay-100 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                  Discover{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r via-sky-400 to-emerald-400 from-primary">
                    tech
                  </span>
                  ,{' '}
                  <br className="hidden lg:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400">
                    fashion
                  </span>{' '}
                  &amp;{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400">
                    lifestyle
                  </span>.
                </h1>
                <p className="mx-auto mt-4 max-w-prose text-sm pk-slide-up pk-delay-200 text-muted-foreground/90 lg:mx-0">
                  Premium electronics, trendy fashion, and curated essentials.
                  Enjoy seamless browsing and blazing fast checkout.
                </p>

                {/* Stats row */}
                <div className="flex flex-wrap gap-4 sm:gap-6 mt-6 justify-center lg:justify-start pk-slide-up pk-delay-300">
                  {[
                    { value: '50K+', label: 'Products' },
                    { value: '4.9★', label: 'Avg Rating' },
                    { value: '2M+', label: 'Happy Buyers' },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <div className="text-xl sm:text-2xl font-extrabold pk-gradient-text">{s.value}</div>
                      <div className="text-xs text-muted-foreground font-medium">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3 mt-6 pk-slide-up pk-delay-400 sm:flex-row sm:justify-center lg:justify-start">
                  <button
                    type="button"
                    onClick={() => scrollToId('shop')}
                    className="w-full sm:w-auto px-6 sm:px-8 h-12 text-sm sm:text-base font-bold shadow-xl pk-btn pk-btn-primary pk-btn-shine pk-btn-liquid hover:shadow-2xl hover:shadow-primary/30"
                  >
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                    Shop Now
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToId('categories')}
                    className="w-full sm:w-auto px-5 sm:px-6 h-12 text-sm sm:text-base font-semibold pk-btn pk-btn-outline hover:bg-accent/80 backdrop-blur-sm"
                  >
                    Explore Categories
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right — Flash Sale Card */}
              <ScrollReveal direction="right" delay={200}>
                <div className="p-4 sm:p-6 rounded-3xl border shadow-2xl backdrop-blur-xl bg-card/70 pk-glass">
                  {/* Flash Sale Timer */}
                  <div className="flex flex-wrap justify-between items-center mb-4 sm:mb-6 gap-2">
                    <div className="flex gap-2 items-center">
                      <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
                      <span className="text-base sm:text-lg font-bold">Flash Sale</span>
                    </div>
                    <FlashSaleTimer />
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:gap-4">
                    {[
                      { icon: Truck, label: 'Free Shipping', sub: 'On ₹999+' },
                      { icon: Shield, label: 'Secure Pay', sub: '256-bit SSL' },
                      { icon: BadgeCheck, label: 'Easy Returns', sub: '7 Days' },
                    ].map((item) => (
                      <div key={item.label} className="flex flex-col gap-1.5 sm:gap-2 items-center p-2 sm:p-4 text-center rounded-2xl bg-muted/50">
                        <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                        <div className="text-[10px] sm:text-xs font-semibold leading-tight">{item.label}</div>
                        <div className="text-[9px] sm:text-[10px] text-muted-foreground">{item.sub}</div>
                      </div>
                    ))}
                  </div>

                                  </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          ANIMATED PRODUCT MARQUEE
          ═══════════════════════════════════════════ */}
      <MarqueeStrip />

      {/* ═══ FEATURED PRODUCTS ═══ */}
      <section className="border-b pk-section-featured pk-featured-bg" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 800px' }}>
        <div className="relative py-10 sm:py-14 pk-container">
          <ScrollReveal>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-between sm:items-end mb-8 sm:mb-10">
              <div>
                <div className="inline-flex gap-2 items-center px-3 sm:px-4 py-1.5 mb-2 sm:mb-3 text-xs font-bold rounded-full bg-gradient-to-r from-primary/15 to-sky-500/10 text-primary border border-primary/20 backdrop-blur-sm">
                  <Star className="w-3 h-3 fill-current" />
                  Editor's Choice
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-5xl pk-text-premium mb-2 break-words">Featured Picks</h2>
                <p className="mt-1.5 sm:mt-2 text-sm text-muted-foreground">Handpicked items loved by thousands of customers</p>
              </div>
              <button
                type="button"
                onClick={() => { setCurrentCategory('All'); scrollToId('shop'); }}
                className="hidden px-5 h-10 text-sm pk-btn pk-btn-outline pk-btn-shine sm:inline-flex shrink-0"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </ScrollReveal>
          {/* overflow-visible so card hover translateY isn't clipped */}
          <CinematicProductGrid products={featuredProducts.slice(0, 8)} />
          {/* Mobile view all button */}
          <div className="mt-6 flex justify-center sm:hidden">
            <button
              type="button"
              onClick={() => { setCurrentCategory('All'); scrollToId('shop'); }}
              className="px-6 h-10 text-sm pk-btn pk-btn-outline pk-btn-shine"
            >
              View All Products
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ═══ CATEGORIES ═══ */}
      <section id="categories" className="scroll-mt-20 relative overflow-hidden" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 600px' }}>
        {/* Fashion background */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2400&q=50')",
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
              filter: 'saturate(1.3) contrast(1.1)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90" />
        </div>
        <div className="relative z-10 py-10 sm:py-14 pk-container">
          <ScrollReveal>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-between items-start sm:items-end mb-8 sm:mb-10">
              <div>
                <div className="inline-flex gap-2 items-center px-3 sm:px-4 py-1.5 mb-2 sm:mb-3 text-xs font-bold rounded-full bg-gradient-to-r from-emerald-500/15 to-teal-500/10 text-emerald-500 border border-emerald-500/20 backdrop-blur-sm">
                  Explore Collections
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-5xl pk-text-premium mb-2 break-words">Shop by Category</h2>
                <p className="mt-1.5 sm:mt-2 text-sm text-muted-foreground">From the latest gadgets to runway fashion</p>
              </div>
              <button
                type="button"
                onClick={() => { setCurrentCategory('All'); scrollToId('shop'); }}
                className="px-5 h-10 text-sm pk-btn pk-btn-outline pk-btn-shine shrink-0"
              >
                All Categories
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {categories.map((category, idx) => (
              <ScrollReveal key={category} delay={idx * 50} direction="scale">
                <button
                  type="button"
                  className="w-full group relative overflow-hidden rounded-2xl border border-white/15 bg-card/50 text-left shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/40 hover:bg-card/70 active:translate-y-0 backdrop-blur-md"
                  onClick={() => {
                    setCurrentCategory(category);
                    scrollToId(categorySectionId(category));
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t to-transparent opacity-0 transition duration-400 from-primary/50 via-primary/10 group-hover:opacity-100 z-10" />
                  <div className="aspect-[3/4] overflow-hidden bg-muted">
                    <img
                      src={categoryImages[category]}
                      alt={category}
                      loading="lazy"
                      decoding="async"
                      className="object-cover w-full h-full transition duration-700 group-hover:scale-115 brightness-90 group-hover:brightness-100"
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 z-20">
                    <div className="text-xs sm:text-sm font-bold text-white drop-shadow-lg">{category}</div>
                    <div className="flex justify-between items-center mt-1">
                      <div className="text-[10px] sm:text-xs text-white/80 font-medium">{categorizedProducts[category]?.length ?? 0} items</div>
                      <div className="flex justify-center items-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 transition-all group-hover:translate-x-1 group-hover:bg-primary">
                        <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                      </div>
                    </div>
                  </div>
                  {/* Glass shimmer overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </button>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ NEW ARRIVALS ═══ */}
      {newArrivals.length > 0 && (
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-500/4 via-transparent to-emerald-500/4 pointer-events-none" />
          <div className="relative py-12 pk-container">
            <ProductCarousel title="✨ New Arrivals" products={newArrivals} badge="Just Dropped" />
          </div>
        </section>
      )}

      {/* ═══ SHOP GRID ═══ */}
      <section id="shop" className="scroll-mt-20 pk-section-shop" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 1200px' }}>
        <div className="relative z-10 pt-8 pb-12 pk-container">
          {/* Section heading */}
          <ScrollReveal>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-between sm:items-end mb-6">
              <div>
                <div className="inline-flex gap-2 items-center px-3 sm:px-4 py-1.5 mb-2 text-xs font-bold rounded-full bg-gradient-to-r from-violet-500/15 to-primary/10 text-violet-500 border border-violet-500/20 backdrop-blur-sm">
                  <SlidersHorizontal className="w-3 h-3" />
                  All Products
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-5xl pk-text-premium mb-2 break-words">Browse the Store</h2>
              </div>
              {/* Filter Controls */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortBy)}
                  className="pk-select w-full sm:w-[175px]"
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
                  className="pk-select w-full sm:w-[175px]"
                  aria-label="Filter by category"
                >
                  <option value="All">All Categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                {(searchTerm.trim() || currentCategory !== 'All') && (
                  <button
                    type="button"
                    onClick={() => { setSearchTerm(''); setCurrentCategory('All'); }}
                    className="px-3 h-9 text-sm pk-btn pk-btn-ghost text-destructive hover:bg-destructive/10 shrink-0"
                  >
                    Clear
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </ScrollReveal>

          {/* Product Grid — no overflow wrapper so card hovers aren't clipped */}
          {!hasVisibleProducts ? (
            <div className="p-8 sm:p-12 text-center rounded-3xl border bg-card/70 pk-glass">
              <div className="flex justify-center items-center mx-auto mb-4 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-muted/50">
                <Search className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground/50" />
              </div>
              <div className="text-base sm:text-lg font-semibold">No products found</div>
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
                <section className="scroll-mt-20">
                  <div className="flex gap-4 justify-between items-end mb-6">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold">Search Results</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{filteredSorted.length} items for "{searchTerm}"</p>
                    </div>
                  </div>
                  <CinematicProductGrid products={filteredSorted} />
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
                    className="pt-8 pb-10 border-b scroll-mt-20 last:border-b-0 last:pb-0"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:gap-4 justify-between sm:items-end mb-5 sm:mb-6">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold tracking-tight">{category}</h3>
                        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">{list.length} items</p>
                      </div>
                      {currentCategory !== 'All' && (
                        <button
                          type="button"
                          onClick={() => { setCurrentCategory('All'); scrollToId('shop'); }}
                          className="hidden px-4 h-9 text-sm pk-btn pk-btn-outline pk-btn-shine sm:inline-flex shrink-0"
                        >
                          Show All
                        </button>
                      )}
                    </div>

                    <CinematicProductGrid products={list} />
                  </section>
                );
              })}
            </>
          )}
        </div>
      </section>

      {/* ═══ NEWSLETTER ═══ */}
      <section className="relative overflow-hidden border-t">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-sky-500/5 to-emerald-500/8 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="relative py-12 sm:py-16 md:py-20 pk-container">
          <ScrollReveal direction="scale">
            <div className="mx-auto max-w-2xl text-center p-6 sm:p-10 md:p-12 rounded-[2.5rem] pk-newsletter-card">
              <div className="inline-flex gap-2 items-center px-4 sm:px-5 py-2 mb-4 sm:mb-5 text-xs sm:text-sm font-bold rounded-full bg-gradient-to-r from-primary/15 to-sky-500/10 text-primary border border-primary/20 backdrop-blur-sm">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                Stay Updated
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Get exclusive deals</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Subscribe and get early access to sales, new arrivals, and insider-only discounts.
              </p>
              <div className="flex flex-col gap-3 mt-6 sm:mt-8 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 sm:px-5 h-12 pk-input bg-background/60 backdrop-blur-sm border-white/15"
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
                  className="px-6 sm:px-8 h-12 text-sm sm:text-base font-semibold shadow-lg pk-btn pk-btn-primary pk-btn-shine pk-btn-liquid"
                >
                  Subscribe
                </button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}