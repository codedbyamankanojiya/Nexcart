import { useMemo, useState, type SyntheticEvent, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BadgeCheck, ChevronRight, Heart, MessageCircleQuestion, ShoppingCart, Star, Truck, Shield, Minus, Plus, Check, Share2, ChevronDown, ChevronUp, ZoomIn, RotateCcw, Clock, MapPin, Package } from 'lucide-react';
import { toast } from 'sonner';
import { mockProducts, categoryImages } from '../data/mockProducts';
import { getProductDetails } from '../data/mockProductDetails';
import { formatPriceINR } from '../lib/format';
import { cn } from '../lib/utils';
import { useCartStore } from '../stores/cartStore';
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '../lib/products';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const addToCart = useCartStore((s) => s.addProductToCart);
  const wishlist = useCartStore((s) => s.wishlist);
  const toggleWishlist = useCartStore((s) => s.toggleWishlist);

  const productId = Number(id);
  const mockProduct = useMemo(() => {
    const p = mockProducts.find((p) => p.id === productId || String(p.id) === id);
    if (!p) return null;
    return {
      ...p,
      quantity: p.inStock ? 100 : 0,
      averageRating: p.rating,
      reviewCount: p.reviews,
      images: [p.image],
      category: { id: p.category, name: p.category }
    };
  }, [id, productId]);

  const { data: qData } = useQuery({
    queryKey: ['product', id],
    queryFn: () => id ? productsAPI.getProduct(id) : null,
    enabled: !!id,
    retry: false
  });

  const product = (qData?.product || qData || mockProduct) as any;

  const details = useMemo(() => (product ? getProductDetails(product) : null), [product]);

  const images = product?.images?.length ? product.images : product ? [product.image] : [];

  const { data: relatedData } = useQuery({
    queryKey: ['products', 'related', product?.category?.id || product?.category?.name || product?.categoryId],
    queryFn: () => productsAPI.getProducts({ category: product?.categoryId || product?.category?.id, limit: 10 }),
    enabled: !!(product?.categoryId || product?.category?.id)
  });

  const mappedRelatedMocks = useMemo(() => mockProducts
    .filter(p => p.category === (product?.category?.name || product?.category) && String(p.id) !== String(product?.id))
    .slice(0, 6)
    .map(p => ({
      ...p,
      quantity: p.inStock ? 100 : 0,
      averageRating: p.rating,
      reviewCount: p.reviews,
      images: [p.image],
      category: { id: p.category, name: p.category }
    })), [product]);

  const apiRelated = relatedData?.products?.filter((p: any) => String(p.id) !== String(product?.id)) || [];
  const relatedProducts = [...apiRelated, ...mappedRelatedMocks].slice(0, 6);

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isImgLoaded, setIsImgLoaded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState<'description' | 'specs' | 'reviews' | 'qa'>('description');
  const [isZoomed, setIsZoomed] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [helpfulness, setHelpfulness] = useState<Record<string, boolean>>({});
  const imageRef = useRef<HTMLDivElement>(null);

  const isWishlisted = product ? wishlist.includes(String(product.id)) : false;

  const handleImgError = (e: SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    const fallbacks = [
      product?.category ? (categoryImages as any)[product.category?.name || product.category?.id || (typeof product.category === 'string' ? product.category : '')] : undefined,
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=800&q=80',
      'https://via.placeholder.com/800x600/111827/ffffff?text=Product+Image',
    ].filter(Boolean) as string[];

    const currentSrc = target.currentSrc || target.src;
    const idx = fallbacks.findIndex((u) => currentSrc.includes(u));
    const next = idx >= 0 ? fallbacks[idx + 1] : fallbacks[0];
    if (next) {
      target.srcset = '';
      target.src = next;
    }
  };

  const handleAddToCart = () => {
    if (!product || product.quantity === 0) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success(`${quantity} × ${product.name} added to cart!`);
  };

  const ratingSummary = (() => {
    const r = details?.reviews ?? [];
    const counts = [0, 0, 0, 0, 0];
    for (const item of r) {
      const idx = Math.max(1, Math.min(5, Math.round(item.rating))) - 1;
      counts[idx] += 1;
    }
    const total = r.length;
    const avg = total ? counts.reduce((acc, c, i) => acc + c * (i + 1), 0) / total : product.rating;
    return { counts, total, avg };
  })();

  const discountPct = product?.comparePrice && product.comparePrice > product.price
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : 0;

  if (!product) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-8">
        <div className="pk-section p-6">
          <div className="text-lg font-semibold">Product not found</div>
          <p className="mt-1 text-sm text-muted-foreground">This product may have been removed or the link is incorrect.</p>
          <div className="mt-4 flex gap-2">
            <button type="button" onClick={() => navigate(-1)} className="pk-btn pk-btn-outline h-10 px-4">Go back</button>
            <Link to="/" className="pk-btn pk-btn-primary pk-btn-shine h-10 px-4">Browse products</Link>
          </div>
        </div>
      </div>
    );
  }

  const activeImage = images[activeImageIdx] ?? product.image;

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'specs', label: 'Specifications' },
    { id: 'reviews', label: `Reviews (${ratingSummary.total || product.reviews})` },
    { id: 'qa', label: 'Q&A' },
  ] as const;

  return (
    <div className="pk-container py-6">
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <button type="button" onClick={() => navigate(-1)} className="pk-btn pk-btn-ghost h-9 px-3 text-sm">
          ← Back
        </button>
        <nav className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/" className="truncate hover:text-foreground">{product.category?.name || product.category}</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="truncate text-foreground font-medium">{product.name}</span>
        </nav>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: product.name, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
                toast.success('Link copied to clipboard!');
              }
            }}
            className="pk-btn pk-btn-outline h-9 px-3 text-sm"
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid gap-6 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_480px]">
        {/* Left: Image Gallery */}
        <section className="pk-section overflow-hidden p-4">
          <div className="grid gap-4 lg:grid-cols-[80px_1fr]">
            {/* Thumbnails */}
            <div className="order-2 flex gap-3 overflow-x-auto pb-1 lg:order-1 lg:flex-col lg:overflow-visible">
              {images.map((src: string, idx: number) => (
                <button
                  key={`${product.id}-thumb-${idx}`}
                  type="button"
                  onClick={() => { setActiveImageIdx(idx); setIsImgLoaded(false); }}
                  className={cn(
                    'relative shrink-0 overflow-hidden rounded-2xl border-2 bg-muted shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    idx === activeImageIdx ? 'border-primary shadow-md' : 'border-transparent hover:border-border'
                  )}
                  aria-label={`View image ${idx + 1}`}
                >
                  <img src={src} alt="" className="h-16 w-20 object-cover lg:h-16 lg:w-20" loading="lazy" decoding="async" />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div
              ref={imageRef}
              className="order-1 lg:order-2 relative"
              onClick={() => setIsZoomed(true)}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-muted cursor-zoom-in group">
                {!isImgLoaded && <div className="absolute inset-0 pk-shimmer" />}
                <img
                  src={activeImage}
                  alt={product.name}
                  loading="eager"
                  decoding="async"
                  onError={handleImgError}
                  onLoad={() => setIsImgLoaded(true)}
                  className={cn(
                    'h-full w-full object-cover transition-all duration-500',
                    !isImgLoaded && 'opacity-0',
                    isImgLoaded && 'opacity-100'
                  )}
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg">
                    <ZoomIn className="h-6 w-6" />
                  </div>
                </div>
              </div>
              {discountPct > 0 && (
                <div className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-red-500 to-pink-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                  -{discountPct}%
                </div>
              )}
            </div>
          </div>

          {/* Highlights */}
          {details?.highlights?.length ? (
            <div className="mt-5 rounded-2xl border bg-card/70 p-5 pk-glass">
              <div className="text-sm font-bold mb-3">Highlights</div>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {details.highlights.slice(0, 8).map((h) => (
                  <li key={h} className="flex items-start gap-2.5 text-sm">
                    <span className="mt-1 inline-flex h-2 w-2 shrink-0 rounded-full bg-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{h}</span>
                  </li>
                ))}
              </div>
            </div>
          ) : null}
        </section>

        {/* Right: Product Info (Sticky) */}
        <aside className="pk-section p-6 lg:sticky lg:top-[88px] lg:self-start space-y-5">
          {/* Title & Price */}
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              {product.category?.name || product.category}
            </div>
            <h1 className="text-2xl font-bold leading-tight tracking-tight">{product.name}</h1>

            <div className="flex items-center gap-3 mt-3">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-muted/80 px-3 py-1.5 text-sm">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-bold">{ratingSummary.avg.toFixed(1)}</span>
                <span className="text-muted-foreground">({ratingSummary.total || product.reviews} reviews)</span>
              </div>
              {product.quantity > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-600">
                  <Check className="h-3 w-3" />
                  In Stock
                </span>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-primary">{formatPriceINR(product.price)}</span>
            {product.comparePrice && product.comparePrice > product.price && (
              <>
                <span className="text-lg text-muted-foreground line-through">{formatPriceINR(product.comparePrice)}</span>
                <span className="rounded-full bg-red-100 px-3 py-1.5 text-sm font-bold text-red-600">-{discountPct}% OFF</span>
              </>
            )}
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
            {product.description || 'Premium quality product with cutting-edge features and exceptional craftsmanship. Designed for modern lifestyle with attention to every detail.'}
          </p>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold">Quantity:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="pk-btn pk-btn-outline h-10 w-10 p-0 flex items-center justify-center"
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </button>
              <div className="h-10 w-16 flex items-center justify-center rounded-xl border-2 bg-card font-bold text-lg">
                {quantity}
              </div>
              <button
                type="button"
                onClick={() => setQuantity(q => Math.min(product.quantity, q + 1))}
                className="pk-btn pk-btn-outline h-10 w-10 p-0 flex items-center justify-center"
                disabled={quantity >= product.quantity}
              >
                <Plus className="h-4 w-4" />
              </button>
              {product.quantity < 10 && product.quantity > 0 && (
                <span className="text-xs text-orange-500 font-medium">Only {product.quantity} left</span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => { toggleWishlist(String(product.id)); toast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist'); }}
              className={cn('pk-btn h-12 px-5 flex-1 transition-all', isWishlisted ? 'border-primary text-primary bg-primary/10' : 'pk-btn-outline')}
            >
              <Heart className={cn('h-5 w-5', isWishlisted && 'fill-current')} />
              {isWishlisted ? 'Wishlisted' : 'Wishlist'}
            </button>
            <button
              type="button"
              disabled={product.quantity === 0}
              onClick={handleAddToCart}
              className="pk-btn pk-btn-primary pk-btn-shine flex-1 h-12 text-base font-bold shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </button>
          </div>

          <button
            type="button"
            onClick={() => { handleAddToCart(); navigate('/checkout'); }}
            disabled={product.quantity === 0}
            className="pk-btn w-full h-12 bg-gradient-to-r from-primary to-sky-500 text-white font-bold shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Buy Now
          </button>

          {/* Trust Badges */}
          <div className="grid gap-3">
            {[
              { icon: Truck, title: 'Free Delivery', sub: 'On orders above ₹999' },
              { icon: RotateCcw, title: '7-Day Returns', sub: 'Hassle-free returns' },
              { icon: Shield, title: 'Warranty', sub: details?.warranty ?? 'Manufacturer warranty' },
              { icon: BadgeCheck, title: 'Quality Assured', sub: 'Verified seller' },
            ].map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-center gap-3 rounded-xl border bg-card/70 p-3.5 pk-glass">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{title}</div>
                  <div className="text-xs text-muted-foreground">{sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Info */}
          <div className="rounded-xl border bg-gradient-to-br from-emerald-500/5 to-teal-500/5 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-500 mb-3">
              <MapPin className="h-4 w-4" />
              Delivery Options
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                Free delivery on orders above ₹999
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Estimated delivery: 2-4 business days
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-sky-500" />
                COD available on select locations
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Tabs Section */}
      <div className="mt-8 pk-section p-6">
        {/* Tab Headers */}
        <div className="flex gap-1 border-b border-border overflow-x-auto pk-no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedTab(tab.id)}
              className={cn(
                'px-5 py-3 text-sm font-semibold whitespace-nowrap transition-all border-b-2 -mb-px',
                selectedTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="pt-6 animate-in fade-in slide-in-from-top-2 duration-300">
          {selectedTab === 'description' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold mb-3">Product Description</h3>
                <div className={cn('text-sm leading-relaxed text-muted-foreground', !showFullDesc && 'line-clamp-5')}>
                  {product.description || details?.description || 'Premium quality product with cutting-edge features. This product is crafted with attention to detail, ensuring durability and performance. Perfect for everyday use with a modern design that complements any style.'}
                </div>
                <button
                  type="button"
                  onClick={() => setShowFullDesc(v => !v)}
                  className="mt-2 text-sm font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  {showFullDesc ? (
                    <><ChevronUp className="h-4 w-4" /> Show less</>
                  ) : (
                    <><ChevronDown className="h-4 w-4" /> Read more</>
                  )}
                </button>
              </div>

              {details?.boxContents?.length ? (
                <div className="rounded-xl border bg-card/70 p-5 pk-glass">
                  <div className="text-sm font-bold mb-3">In the Box</div>
                  <div className="flex flex-wrap gap-2">
                    {details.boxContents.map((item) => (
                      <span key={item} className="rounded-full border bg-background/80 px-4 py-2 text-sm font-medium">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {selectedTab === 'specs' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Technical Specifications</h3>
              <div className="overflow-hidden rounded-2xl border">
                <div className="grid divide-y">
                  {(details?.specs ?? []).slice(0, 16).map((row) => (
                    <div key={row.label} className="grid grid-cols-[1fr_1.5fr] gap-4 p-4 text-sm">
                      <div className="font-semibold text-muted-foreground bg-muted/30 px-3 py-2 -mx-4 -my-4 rounded-l-xl">{row.label}</div>
                      <div className="font-medium px-3 py-2">{row.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'reviews' && (
            <div className="space-y-6">
              {/* Rating Summary */}
              <div className="rounded-2xl border bg-card/70 p-6 pk-glass">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                  <div className="text-center">
                    <div className="text-5xl font-extrabold">{ratingSummary.avg.toFixed(1)}</div>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={cn('h-5 w-5', s <= Math.round(ratingSummary.avg) ? 'fill-amber-400 text-amber-400' : 'text-muted')} />
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">{ratingSummary.total || product.reviews} reviews</div>
                  </div>
                  <div className="flex-1 grid gap-2">
                    {[5,4,3,2,1].map((star) => {
                      const count = ratingSummary.counts[star-1] ?? 0;
                      const pct = ratingSummary.total ? Math.round((count / ratingSummary.total) * 100) : 0;
                      return (
                        <div key={star} className="flex items-center gap-3 text-sm">
                          <div className="w-12 text-muted-foreground">{star}★</div>
                          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                            <div className="h-full rounded-full bg-amber-400 transition-all duration-700" style={{ width: `${pct}%` }} />
                          </div>
                          <div className="w-10 text-right text-muted-foreground text-xs">{pct}%</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Review Cards */}
              <div className="grid gap-4">
                {(details?.reviews ?? []).slice(0, 5).map((r) => (
                  <div key={r.id} className="rounded-2xl border bg-card/70 p-5 pk-glass">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold text-sm">{r.userName}</div>
                        <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 font-semibold text-amber-700">
                            <Star className="h-3 w-3 fill-current" />
                            {r.rating}
                          </span>
                          <span>{r.createdAt}</span>
                          {r.verifiedPurchase && (
                            <span className="rounded-full border bg-emerald-50 px-2 py-1 font-semibold text-emerald-600 text-xs">Verified Purchase</span>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setHelpfulness(prev => ({ ...prev, [r.id]: !prev[r.id] }))}
                        className={cn(
                          'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
                          helpfulness[r.id] ? 'border-primary/30 bg-primary/10 text-primary' : 'text-muted-foreground hover:border-border'
                        )}
                      >
                        👍 Helpful {r.helpfulCount ? `(${r.helpfulCount})` : ''}
                      </button>
                    </div>
                    <div className="mt-3 font-semibold text-sm">{r.title}</div>
                    <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{r.body}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'qa' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Questions & Answers</h3>
                <button type="button" className="pk-btn pk-btn-outline h-9 px-4 text-sm">
                  <MessageCircleQuestion className="h-4 w-4" />
                  Ask a Question
                </button>
              </div>
              {(details?.qa ?? []).slice(0, 6).map((qa) => (
                <div key={qa.id} className="rounded-2xl border bg-card/70 p-5 pk-glass">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">Q</div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{qa.question}</div>
                      <div className="mt-2 flex items-start gap-2 rounded-xl bg-muted/50 p-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold">A</div>
                        <div className="text-sm text-muted-foreground">{qa.answer}</div>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Answered by {qa.answeredBy} · {qa.answeredAt}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold tracking-tight mb-6">More like this</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {relatedProducts.map((p: any) => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              className="group rounded-2xl border bg-card/70 p-3 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-primary/25 pk-glass"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-xl bg-muted mb-3">
                <img src={p.images?.[0] || p.image} alt={p.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="text-xs text-muted-foreground font-semibold mb-1">{p.category?.name || p.category}</div>
              <div className="line-clamp-2 text-sm font-semibold leading-snug group-hover:text-primary">{p.name}</div>
              <div className="mt-2 flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-semibold">{(p.averageRating || 0).toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">({p.reviewCount || 0})</span>
              </div>
              <div className="mt-2 text-base font-extrabold text-primary">{formatPriceINR(p.price)}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Image Zoom Modal */}
      {isZoomed && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm pk-fade-in" onClick={() => setIsZoomed(false)}>
          <div className="relative max-w-4xl w-full p-8" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setIsZoomed(false)}
              className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-all"
            >
              ×
            </button>
            <img src={activeImage} alt={product.name} className="w-full h-auto rounded-2xl shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  );
}