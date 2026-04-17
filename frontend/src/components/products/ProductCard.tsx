import { useState, type SyntheticEvent, memo, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Eye, Sparkles, Zap, TrendingUp, BadgeCheck, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { formatPriceINR } from '../../lib/format';
import { cn } from '../../lib/utils';
import { useCartStore } from '../../stores/cartStore';
import { categoryImages } from '../../data/mockProducts';

import type { Product } from '../../lib/products';

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore((s) => s.addProductToCart);
  const wishlist = useCartStore((s) => s.wishlist);
  const toggleWishlist = useCartStore((s) => s.toggleWishlist);

  const [isImgLoaded, setIsImgLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [addAnimation, setAddAnimation] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const isWishlisted = wishlist.includes(String(product.id));
  const isOutOfStock = (product.quantity || 0) === 0;
  const discountPct = product.comparePrice && product.comparePrice > product.price
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : null;

  // Badge logic — single badge priority
  const badge = (() => {
    if (isOutOfStock) return { text: 'Out of Stock', col: 'from-zinc-600 to-zinc-700', icon: null };
    if ((product.averageRating || 0) >= 4.8 && (product.reviewCount || 0) >= 500)
      return { text: 'Best Seller', col: 'from-amber-500 to-orange-500', icon: <Sparkles className="h-3 w-3" /> };
    if ((product.averageRating || 0) >= 4.5 && (product.reviewCount || 0) >= 100)
      return { text: 'Top Rated', col: 'from-emerald-500 to-teal-500', icon: <Star className="h-3 w-3" /> };
    if (discountPct) return { text: `−${discountPct}%`, col: 'from-rose-500 to-pink-600', icon: <Zap className="h-3 w-3" /> };
    if (product.featured) return { text: 'Trending', col: 'from-violet-500 to-purple-600', icon: <TrendingUp className="h-3 w-3" /> };
    return null;
  })();

  const stockLow = !isOutOfStock && (product.quantity || 0) < 10;

  const handleImageError = (e: SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    const catName = typeof product.category === 'object' ? product.category?.name : product.category;
    const fb = (categoryImages as Record<string, string>)[catName || '']
      || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=800&q=80';
    target.srcset = '';
    target.src = fb;
  };

  const withWidth = (url: string, w: number) => {
    try {
      const u = new URL(url);
      u.searchParams.set('w', String(w));
      return u.toString();
    } catch {
      const j = url.includes('?') ? '&' : '?';
      return `${url}${j}w=${w}`;
    }
  };

  const imgUrl = product.images?.[0] || product.image || '';
  const srcSet = imgUrl ? `${withWidth(imgUrl, 400)} 400w, ${withWidth(imgUrl, 800)} 800w` : '';
  const sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw';

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product);
    setAddAnimation(true);
    toast.success(`${product.name} added to cart!`);
    setTimeout(() => setAddAnimation(false), 700);
  }, [product, addToCart, isOutOfStock]);

  const handleToggleWishlist = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    toggleWishlist(String(product.id));
    toast(isWishlisted ? 'Removed from wishlist' : '❤️ Added to wishlist');
  }, [product.id, isWishlisted, toggleWishlist]);

  const handleQuickView = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setIsQuickViewOpen(true);
  }, []);

  const ratingInt = Math.round(product.averageRating || 0);

  return (
    <>
      {/* ── CARD ─────────────────────────────────────────────── */}
      <div
        ref={cardRef}
        className="pk-card group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Animated gradient border — fires on hover */}
        <div className={cn('pk-card-ring', isHovered && 'pk-card-ring--active')} />

        {/* ── IMAGE ZONE ──────────────────────────────────────── */}
        <Link
          to={`/product/${product.id}`}
          aria-label={`View ${product.name}`}
          className="relative block overflow-hidden bg-muted/30"
          style={{ aspectRatio: '1 / 1' }}
        >
          {/* Cinematic gradient overlays */}
          <div className="pk-card-img-overlay" />
          <div className="pk-card-img-sides" />

          {/* Image */}
          {!isImgLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-muted via-muted/60 to-muted animate-pulse" />
          )}
          <img
            src={imgUrl}
            srcSet={srcSet}
            sizes={sizes}
            alt={product.name}
            loading="lazy"
            decoding="async"
            onError={handleImageError}
            onLoad={() => setIsImgLoaded(true)}
            className={cn(
              'absolute inset-0 h-full w-full object-cover transition-all duration-700 will-change-transform',
              isHovered ? 'scale-[1.07] saturate-[1.15] brightness-[1.03]' : 'scale-100',
              !isImgLoaded && 'opacity-0'
            )}
          />

          {/* Badge — top-left */}
          {badge && (
            <span className={cn(
              'absolute left-2.5 top-2.5 z-20 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold text-white',
              'bg-gradient-to-r shadow-lg ring-1 ring-white/20 backdrop-blur-md',
              badge.col
            )}>
              {badge.icon}{badge.text}
            </span>
          )}

          {/* Low stock pulse — bottom-left */}
          {stockLow && (
            <span className="absolute bottom-3 left-3 z-20 inline-flex items-center gap-1.5 rounded-full bg-orange-500/90 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm shadow-md">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              Only {product.quantity} left
            </span>
          )}

          {/* Price tag — bottom-right on image */}
          <div className={cn(
            'absolute bottom-3 right-3 z-20 transition-all duration-400',
            isHovered ? 'translate-y-0 opacity-0' : 'translate-y-0 opacity-100'
          )}>
            <div className="rounded-xl bg-black/55 backdrop-blur-md px-2.5 py-1.5 text-center ring-1 ring-white/15">
              <div className="text-[13px] font-black text-white leading-tight">
                {formatPriceINR(product.price)}
              </div>
              {discountPct && (
                <div className="text-[9px] font-bold text-rose-300 leading-tight">
                  was {formatPriceINR(product.comparePrice!)}
                </div>
              )}
            </div>
          </div>

          {/* Hover action buttons */}
          <div className={cn(
            'absolute inset-0 z-20 flex items-end justify-center gap-2 p-4 transition-all duration-300',
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
          )}>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={cn(
                'flex flex-1 h-10 items-center justify-center gap-1.5 rounded-2xl text-sm font-bold text-white shadow-xl',
                'ring-1 ring-white/25 transition-all duration-200 hover:scale-[1.03] active:scale-95 backdrop-blur-md',
                addAnimation
                  ? 'bg-emerald-500/95 shadow-emerald-500/40'
                  : 'bg-primary/90 hover:bg-primary shadow-primary/30',
                isOutOfStock && 'bg-zinc-600/80 cursor-not-allowed opacity-70'
              )}
            >
              {addAnimation ? (
                <><BadgeCheck className="h-4 w-4" /> Added!</>
              ) : (
                <><ShoppingCart className="h-4 w-4" /> {isOutOfStock ? 'Sold Out' : 'Add'}</>
              )}
            </button>
            <button
              type="button"
              onClick={handleQuickView}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md ring-1 ring-white/30 text-white transition-all duration-200 hover:scale-[1.07] hover:bg-white/30 active:scale-95"
              aria-label="Quick view"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
        </Link>

        {/* Wishlist — floated top-right */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          className={cn(
            'absolute right-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300',
            'hover:scale-110 active:scale-90',
            isWishlisted
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40 ring-1 ring-rose-400/40'
              : 'bg-black/35 text-white/80 backdrop-blur-sm ring-1 ring-white/20 hover:bg-rose-500/75 hover:text-white hover:shadow-rose-500/30'
          )}
        >
          <Heart className={cn('h-4 w-4 transition-all', isWishlisted && 'fill-current')} />
        </button>

        {/* ── INFO ZONE ───────────────────────────────────────── */}
        <div className="pk-card-info">
          {/* Inset separator */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

          {/* Category row */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-black tracking-[0.16em] uppercase text-primary/80">
              {typeof product.category === 'object' ? product.category?.name : product.category || 'Product'}
            </span>
            {(product.averageRating || 0) >= 4.5 && (
              <BadgeCheck className="h-3.5 w-3.5 text-sky-500 flex-shrink-0 drop-shadow-sm" />
            )}
          </div>

          {/* Name */}
          <Link
            to={`/product/${product.id}`}
            className="block line-clamp-2 text-[13px] sm:text-sm font-bold leading-snug text-foreground hover:text-primary transition-colors mb-2"
          >
            {product.name}
          </Link>

          {/* Star rating row */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={cn(
                    'h-2.5 w-2.5 sm:h-3 sm:w-3',
                    s <= ratingInt
                      ? 'fill-amber-500 text-amber-500'
                      : 'fill-muted text-muted-foreground/20'
                  )}
                />
              ))}
            </div>
            <span className="text-[10px] sm:text-xs font-black text-foreground/80">
              {(product.averageRating || 0).toFixed(1)}
            </span>
            {(product.reviewCount || 0) > 0 && (
              <span className="text-[10px] text-muted-foreground/60">
                ({product.reviewCount?.toLocaleString()})
              </span>
            )}
          </div>

          {/* Price + CTA row */}
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex flex-col leading-tight min-w-0">
              <span className="text-base font-black text-primary sm:text-lg font-display tracking-tight truncate">
                {formatPriceINR(product.price)}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-[10px] text-muted-foreground line-through leading-none mt-0.5">
                  {formatPriceINR(product.comparePrice)}
                </span>
              )}
            </div>

            {/* Desktop CTA — compact */}
            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className={cn(
                'hidden sm:flex h-9 w-9 items-center justify-center rounded-2xl flex-shrink-0',
                'transition-all duration-300 hover:scale-110 active:scale-90',
                'ring-1 shadow-md',
                addAnimation
                  ? 'bg-emerald-500 text-white shadow-emerald-500/40 ring-emerald-400/40 scale-110'
                  : isOutOfStock
                  ? 'bg-muted text-muted-foreground ring-border cursor-not-allowed'
                  : 'bg-primary text-white shadow-primary/30 ring-primary/30 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/40'
              )}
              aria-label="Add to cart"
            >
              {addAnimation
                ? <BadgeCheck className="h-4 w-4" />
                : <Plus className="h-4 w-4" />}
            </button>

            {/* Mobile CTA */}
            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className={cn(
                'sm:hidden flex h-8 items-center gap-1.5 px-3 rounded-lg text-[10px] font-black flex-shrink-0',
                'transition-all duration-300 shadow-md active:scale-95',
                addAnimation
                  ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                  : isOutOfStock
                  ? 'bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600'
                  : 'pk-btn-premium text-white'
              )}
            >
              {isOutOfStock ? (
                'Sold Out'
              ) : addAnimation ? (
                <BadgeCheck className="h-3.5 w-3.5" />
              ) : (
                <>
                  <Plus className="h-3 w-3" />
                  Add
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── QUICK VIEW MODAL ──────────────────────────────────── */}
      {isQuickViewOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4"
          onClick={() => setIsQuickViewOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/75 backdrop-blur-lg pk-fade-in" />

          {/* Sheet */}
          <div
            className="relative w-full max-w-2xl overflow-hidden rounded-t-3xl sm:rounded-3xl pk-scale-in"
            style={{
              background: 'hsl(var(--card) / 0.7)',
              backdropFilter: 'blur(32px) saturate(1.6)',
              border: '1px solid hsl(var(--border) / 0.3)',
              boxShadow: '0 32px 80px -16px hsl(0 0% 0% / 0.5), 0 0 0 1px hsl(var(--primary) / 0.08)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              type="button"
              onClick={() => setIsQuickViewOpen(false)}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 text-white hover:bg-white/20 transition-all text-lg font-bold"
            >
              ×
            </button>

            <div className="grid sm:grid-cols-2">
              {/* Image side */}
              <div className="relative aspect-square sm:aspect-auto overflow-hidden">
                <img
                  src={imgUrl}
                  alt={product.name}
                  className="h-full w-full object-cover sm:min-h-[360px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {badge && (
                  <span className={cn(
                    'absolute left-4 top-4 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold text-white',
                    'bg-gradient-to-r ring-1 ring-white/20 shadow-lg',
                    badge.col
                  )}>
                    {badge.icon}{badge.text}
                  </span>
                )}
                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <div className="text-2xl font-black text-white drop-shadow-md">{formatPriceINR(product.price)}</div>
                  {discountPct && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-white/60 line-through">{formatPriceINR(product.comparePrice!)}</span>
                      <span className="text-xs font-bold bg-emerald-500/90 text-white px-2 py-0.5 rounded-full">Save {discountPct}%</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Info side */}
              <div className="flex flex-col gap-5 p-6">
                <div>
                  <div className="text-[10px] font-extrabold tracking-[0.15em] uppercase text-primary/70 mb-1">
                    {typeof product.category === 'object' ? product.category?.name : product.category}
                  </div>
                  <h3 className="text-xl font-black leading-tight">{product.name}</h3>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} className={cn('h-4 w-4', s <= ratingInt ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/20')} />
                    ))}
                  </div>
                  <span className="text-sm font-bold">{(product.averageRating || 0).toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">· {(product.reviewCount || 0).toLocaleString()} reviews</span>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                  {product.description || 'Premium quality product crafted for the discerning customer. Excellent features, durable build, and a design that stands out.'}
                </p>

                {stockLow && (
                  <div className="flex items-center gap-2 rounded-2xl bg-orange-500/10 border border-orange-500/20 px-4 py-2.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
                    </span>
                    <span className="text-xs font-bold text-orange-500">Only {product.quantity} left in stock — order soon!</span>
                  </div>
                )}

                <div className="flex gap-3 mt-auto">
                  <button
                    type="button"
                    onClick={(e) => { handleAddToCart(e); setIsQuickViewOpen(false); }}
                    disabled={isOutOfStock}
                    className="pk-btn pk-btn-primary pk-btn-shine flex-1 h-12 text-sm font-bold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                  <Link
                    to={`/product/${product.id}`}
                    onClick={() => setIsQuickViewOpen(false)}
                    className="pk-btn pk-btn-outline flex-1 h-12 text-sm font-semibold rounded-2xl flex items-center justify-center gap-2"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default memo(ProductCard);