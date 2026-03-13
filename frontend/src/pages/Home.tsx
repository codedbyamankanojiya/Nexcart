import { useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { toast } from 'sonner';
import { categories, categoryImages, mockProducts } from '../data/mockProducts';
import { formatPriceINR } from '../lib/format';
import { categorySectionId } from '../lib/slug';
import { scrollToId } from '../lib/scroll';
import ProductCard from '../components/products/ProductCard';
import { type SortBy, useCatalogStore } from '../stores/catalogStore';
import { useCartStore } from '../stores/cartStore';

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();

  const addToCart = useCartStore((s) => s.addToCart);
  const wishlist = useCartStore((s) => s.wishlist);
  const toggleWishlist = useCartStore((s) => s.toggleWishlist);

  const currentCategory = useCatalogStore((s) => s.currentCategory);
  const setCurrentCategory = useCatalogStore((s) => s.setCurrentCategory);
  const searchTerm = useCatalogStore((s) => s.searchTerm);
  const setSearchTerm = useCatalogStore((s) => s.setSearchTerm);
  const sortBy = useCatalogStore((s) => s.sortBy);
  const setSortBy = useCatalogStore((s) => s.setSortBy);

  const products = mockProducts;

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
          if (target !== '__top__') {
            await waitForElement(target, 1200);
          }
          if (cancelled) return;
          doScroll();
          navigate('.', { replace: true, state: null });
        }, 0);
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [location.state, navigate]);

  const filteredSorted = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const base = q ? products.filter((p) => p.name.toLowerCase().includes(q)) : products;

    const sorted = [...base].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'relevance':
        default:
          return 0;
      }
    });

    return sorted;
  }, [products, searchTerm, sortBy]);

  const categorizedProducts = useMemo(() => {
    const map: Record<string, typeof filteredSorted> = {};
    for (const p of filteredSorted) {
      if (!map[p.category]) map[p.category] = [];
      map[p.category].push(p);
    }
    return map;
  }, [filteredSorted]);

  const visibleCategories = useMemo(() => {
    return categories.filter((c) => currentCategory === 'All' || c === currentCategory);
  }, [currentCategory]);

  const hasVisibleProducts = useMemo(() => {
    for (const c of visibleCategories) {
      const list = categorizedProducts[c] ?? [];
      if (list.length > 0) return true;
    }
    return false;
  }, [categorizedProducts, visibleCategories]);

  const isSearching = useMemo(() => searchTerm.trim().length > 0, [searchTerm]);

  const featuredProducts = useMemo(() => {
    return [...products]
      .filter((p) => p.inStock)
      .sort((a, b) => b.rating + b.reviews / 1000 - (a.rating + a.reviews / 1000))
      .slice(0, 6);
  }, [products]);

  return (
    <div className="pb-16 pk-mesh pk-aurora pk-noise">
      <section className="relative overflow-hidden border-b pk-hero-bg">
        <div className="absolute inset-0">
          <div className="absolute -left-40 -top-20 h-80 w-80 rounded-full bg-primary/15 blur-3xl pk-float" />
          <div className="absolute -right-32 -top-20 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl pk-float" />
          <div className="absolute bottom-[-120px] left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl pk-float" />
        </div>

        <div className="relative pk-container py-12 pk-fade-in">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <p className="pk-slide-up text-xs font-semibold uppercase tracking-[0.2em] text-primary">India’s modern megastore</p>
              <h1 className="pk-slide-up pk-delay-100 mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
                Discover tech, fashion & essentials.
              </h1>
              <p className="pk-slide-up pk-delay-200 mt-4 max-w-prose text-muted-foreground">
                Electronics, fashion, gadgets and more. Smooth browsing, clean checkout flow, and a true black
                dark mode that feels premium.
              </p>
              <div className="pk-slide-up pk-delay-300 mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => scrollToId('shop')}
                  className="pk-btn pk-btn-primary pk-btn-shine h-11 px-8 text-base shadow-lg hover:shadow-primary/25"
                >
                  Shop now
                </button>
                <button
                  type="button"
                  onClick={() => scrollToId('categories')}
                  className="pk-btn pk-btn-outline h-11 px-5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Explore categories
                </button>
              </div>
            </div>

            <div className="rounded-2xl border bg-card/70 p-4 shadow-sm backdrop-blur pk-pop pk-float pk-glass">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border bg-background/80 p-4 transition hover:bg-background">
                  <div className="text-sm font-semibold">Flash Sale</div>
                  <div className="mt-1 text-sm text-muted-foreground">Up to 70% OFF</div>
                </div>
                <div className="rounded-xl border bg-background/80 p-4 transition hover:bg-background">
                  <div className="text-sm font-semibold">Free Shipping</div>
                  <div className="mt-1 text-sm text-muted-foreground">On ₹999+</div>
                </div>
                <div className="rounded-xl border bg-background/80 p-4 transition hover:bg-background">
                  <div className="text-sm font-semibold">Secure Payments</div>
                  <div className="mt-1 text-sm text-muted-foreground">UPI / Card</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0">
          <div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -right-32 top-0 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
        </div>
        <div className="relative pk-container py-12">
          <div className="flex flex-col gap-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">Featured picks</h2>
                <p className="mt-2 text-sm text-muted-foreground">Top rated items loved by customers.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCurrentCategory('All');
                  scrollToId('shop');
                }}
                className="pk-btn pk-btn-outline pk-btn-shine hidden h-9 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:inline-flex"
              >
                Browse all
              </button>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="pk-select w-full sm:w-[220px]"
                aria-label="Sort products"
              >
                <option value="relevance">Sort: Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
                <option value="name">Name</option>
              </select>

              <select
                value={currentCategory}
                onChange={(e) => setCurrentCategory(e.target.value)}
                className="pk-select w-full sm:w-[220px]"
                aria-label="Filter by category"
              >
                <option value="All">Category: All</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section id="categories" className="scroll-mt-24 pk-backdrop-fashion">
        <div className="pk-container py-12">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Explore categories</h2>
              <p className="mt-2 text-sm text-muted-foreground">Browse by category and find your next favorite product.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setCurrentCategory('All');
                scrollToId('shop');
              }}
              className="pk-btn pk-btn-outline pk-btn-shine h-10 px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Show all products
            </button>
          </div>

          <div className="mt-6 pk-section p-4 sm:p-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className="group relative overflow-hidden rounded-2xl border bg-card/70 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring pk-glass"
                  onClick={() => {
                    setCurrentCategory(category);
                    scrollToId(categorySectionId(category));
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                  <div className="aspect-[16/9] overflow-hidden bg-muted">
                    <img
                      src={categoryImages[category]}
                      alt={category}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]"
                    />
                  </div>
                  <div className="p-4">
                    <div className="text-sm font-semibold">{category}</div>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <div className="text-sm text-muted-foreground">Tap to view</div>
                      <div className="rounded-full border bg-background/80 px-2 py-1 text-[11px] font-semibold text-foreground backdrop-blur">
                        {(categorizedProducts[category]?.length ?? 0).toString()} items
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>


      <section id="shop" className="scroll-mt-24 pk-backdrop-tech">
        <div className="pk-container pb-4 pt-4">
          <div className="rounded-3xl bg-card/70 p-4 shadow-sm backdrop-blur pk-glass">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              {(searchTerm.trim() || currentCategory !== 'All') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setCurrentCategory('All');
                  }}
                  className="pk-btn pk-btn-outline h-10 px-4 text-sm"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="pk-container pb-12 pt-4">
          <div className="pk-section p-4 sm:p-6">
            {!hasVisibleProducts ? (
              <div className="rounded-3xl border bg-card/70 p-6 text-center pk-glass">
                <div className="text-base font-semibold">No products found</div>
                <p className="mt-1 text-sm text-muted-foreground">Try clearing filters or searching with a different keyword.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setCurrentCategory('All');
                  }}
                  className="pk-btn pk-btn-primary pk-btn-shine mt-4 h-10 px-4 text-sm"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <>
                {isSearching ? (
                  <section className="scroll-mt-24">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold tracking-tight">Search results</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{filteredSorted.length} items</p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3">
                      {filteredSorted.map((product) => {
                        const isWishlisted = wishlist.includes(product.id);
                        return (
                          <div
                            key={product.id}
                            className="rounded-3xl border bg-card/70 p-3 shadow-sm backdrop-blur transition hover:border-primary/30 hover:shadow-md pk-glass"
                          >
                            <div className="grid gap-3 sm:grid-cols-[180px_1fr]">
                              <div className="relative overflow-hidden rounded-2xl border bg-muted">
                                <Link to={`/product/${product.id}`} className="block" aria-label={`View ${product.name}`}>
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    loading="lazy"
                                    decoding="async"
                                    onError={(e) => {
                                      e.currentTarget.src =
                                        categoryImages[product.category] ??
                                        'https://via.placeholder.com/800x600/111827/ffffff?text=Product+Image';
                                    }}
                                    className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
                                  />
                                </Link>
                              </div>

                              <div className="flex min-w-0 flex-col justify-between gap-3">
                                <div className="min-w-0">
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                      <Link
                                        to={`/product/${product.id}`}
                                        className="line-clamp-2 text-sm font-semibold leading-snug hover:underline"
                                      >
                                        {product.name}
                                      </Link>
                                      <div className="mt-1 text-xs text-muted-foreground">{product.category}</div>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        toggleWishlist(product.id);
                                        toast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
                                      }}
                                      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                                      className={
                                        'pk-btn pk-btn-outline h-9 w-9 rounded-full bg-background/70 backdrop-blur ' +
                                        (isWishlisted ? 'border-primary text-primary' : '')
                                      }
                                    >
                                      <Heart className={(isWishlisted ? 'fill-current ' : '') + 'h-4 w-4'} />
                                    </button>
                                  </div>

                                  <div className="mt-3 flex flex-wrap items-center gap-2">
                                    <div className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                      <span className="font-semibold text-foreground">{product.rating.toFixed(1)}</span>
                                      <span>({product.reviews})</span>
                                    </div>
                                    {!product.inStock && (
                                      <span className="rounded-full bg-destructive/10 px-2 py-1 text-xs font-semibold text-destructive">
                                        Out of stock
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                  <div className="text-base font-semibold text-primary">{formatPriceINR(product.price)}</div>
                                  <button
                                    type="button"
                                    disabled={!product.inStock}
                                    onClick={() => {
                                      if (!product.inStock) return;
                                      addToCart(product);
                                      toast('Added to cart');
                                    }}
                                    className="pk-btn pk-btn-primary pk-btn-shine h-10 px-4 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                    <ShoppingCart className="h-4 w-4" />
                                    Add to cart
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                ) : (
                  visibleCategories.map((category) => {
                    const list = categorizedProducts[category] ?? [];
                    if (list.length === 0) return null;
                    return (
                      <section
                        key={category}
                        id={categorySectionId(category)}
                        className="scroll-mt-24 border-b pb-10 pt-10 first:pt-2 last:border-b-0"
                      >
                        <div className="flex items-end justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-semibold tracking-tight">{category}</h3>
                            <p className="mt-1 text-sm text-muted-foreground">{list.length} items</p>
                          </div>
                          {currentCategory !== 'All' && (
                            <button
                              type="button"
                              onClick={() => {
                                setCurrentCategory('All');
                                scrollToId('shop');
                              }}
                              className="pk-btn pk-btn-outline pk-btn-shine hidden h-9 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:inline-flex"
                            >
                              Show all
                            </button>
                          )}
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                          {list.map((product) => (
                            <ProductCard key={product.id} product={product} />
                          ))}
                        </div>
                      </section>
                    );
                  })
                )}
              </>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
