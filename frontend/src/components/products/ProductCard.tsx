import { useState, type SyntheticEvent, memo, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Eye, Sparkles, Zap, TrendingUp } from 'lucide-react';
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

  // Badge logic
  const badge = (() => {
    if ((product.quantity || 0) === 0) return { text: 'Out of Stock', className: 'bg-destructive/90 text-destructive-foreground', icon: null };
    if ((product.averageRating || 0) >= 4.8 && (product.reviewCount || 0) >= 500)
      return { text: 'Best Seller', className: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white', icon: <Sparkles className="h-3 w-3" /> };
    if ((product.averageRating || 0) >= 4.5 && (product.reviewCount || 0) >= 100)
      return { text: 'Top Rated', className: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white', icon: <Star className="h-3 w-3" /> };
    if (product.comparePrice !== undefined && product.comparePrice > product.price)
      return { text: `${Math.round((1 - product.price / product.comparePrice) * 100)}% OFF`, className: 'bg-gradient-to-r from-red-500 to-pink-500 text-white', icon: <Zap className="h-3 w-3" /> };
    return null;
  })();

  // Stock level
  const stockLevel = (() => {
    if (!product.quantity || product.quantity === 0) return { label: 'Out of Stock', color: 'text-destructive', bg: 'bg-destructive/10' };
    if (product.quantity < 10) return { label: `Only ${product.quantity} left!`, color: 'text-orange-500', bg: 'bg-orange-500/10' };
    if (product.quantity < 20) return { label: 'Low stock', color: 'text-amber-500', bg: 'bg-amber-500/10' };
    return null;
  })();

  const handleImageError = (e: SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    const catName = typeof product.category === 'object' ? product.category?.name : product.category;
    const fallbacks = [
      (categoryImages as Record<string, string>)[catName || ''],
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

  const withWidth = (url: string, w: number) => {
    try {
      const u = new URL(url);
      u.searchParams.set('w', String(w));
      return u.toString();
    } catch {
      const hasW = /([?&])w=\d+/i.test(url);
      if (hasW) return url.replace(/([?&])w=\d+/i, `$1w=${w}`);
      const joiner = url.includes('?') ? '&' : '?';
      return `${url}${joiner}w=${w}`;
    }
  };

  const imgUrl = product.images?.[0] || product.image || '';
  const srcSet = imgUrl ? `${withWidth(imgUrl, 400)} 400w, ${withWidth(imgUrl, 800)} 800w, ${withWidth(imgUrl, 1200)} 1200w` : '';
  const sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.quantity === 0) return;
    addToCart(product);
    setAddAnimation(true);
    toast.success(`${product.name} added to cart!`);
    setTimeout(() => setAddAnimation(false), 600);
  }, [product, addToCart]);

  const handleToggleWishlist = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(String(product.id));
    toast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  }, [product.id, isWishlisted, toggleWishlist]);

  const handleQuickView = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  }, []);

  return (
    <>
      <div
        ref={cardRef}
        className={cn(
          'group relative overflow-hidden rounded-3xl shadow-md',
          'border border-white/10 bg-card/50 backdrop-blur-md',
          'transition-all duration-500 ease-out',
          'hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/15 hover:border-primary/30 hover:bg-card/65',
          'active:translate-y-0',
          isHovered && 'border-primary/25 shadow-primary/20'
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <Link
          to={`/product/${product.id}`}
          aria-label={`View details for ${product.name}`}
          className="relative block aspect-[4/3] w-full overflow-hidden bg-muted"
        >
          {/* Gradient overlay on hover */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition duration-400 group-hover:opacity-100 z-10" />

          {/* Loading skeleton */}
          {!isImgLoaded && (
            <div className="absolute inset-0 bg-muted">
              <div className="absolute inset-0 bg-gradient-to-br from-muted via-muted/50 to-muted animate-pulse" />
            </div>
          )}

          {/* Main Image */}
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
              'h-full w-full object-cover transition-all duration-700',
              'group-hover:scale-110',
              !isImgLoaded && 'opacity-0',
              isImgLoaded && 'opacity-100'
            )}
          />

          {/* Badge */}
          {badge && (
            <div className="absolute left-3 top-3 z-20 animate-in fade-in slide-in-from-top-2 duration-400">
              <span className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold backdrop-blur-sm',
                badge.className
              )}>
                {badge.icon}
                {badge.text}
              </span>
            </div>
          )}

          {/* Stock Level Indicator */}
          {stockLevel && (
            <div className={cn(
              'absolute left-3 top-3 z-20 mt-10',
              'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold backdrop-blur-sm',
              stockLevel.bg, stockLevel.color
            )}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
              </span>
              {stockLevel.label}
            </div>
          )}

          {/* Hover Actions Overlay */}
          <div className={cn(
            'absolute inset-0 z-20 hidden sm:flex items-center justify-center gap-3',
            'opacity-0 translate-y-4 transition-all duration-300 bg-black/20',
            isHovered && 'opacity-100 translate-y-0'
          )}>
            <button
              type="button"
              onClick={handleQuickView}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 backdrop-blur-md shadow-lg transition-all hover:scale-110 hover:bg-white active:scale-95"
              aria-label="Quick view"
            >
              <Eye className="h-5 w-5 text-foreground" />
            </button>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={(product.quantity || 0) === 0}
              className="flex h-11 items-center justify-center gap-2 rounded-full bg-primary/95 backdrop-blur-md px-5 shadow-lg transition-all hover:scale-110 hover:bg-primary active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShoppingCart className="h-5 w-5 text-white" />
              <span className="text-sm font-semibold text-white mr-1">Add</span>
            </button>
          </div>

          {/* Rating Badge (bottom left) removed to avoid duplication */}

          {/* Trending Badge */}
          {product.featured && (
            <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
              <TrendingUp className="h-3 w-3" />
              Trending
            </div>
          )}
        </Link>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={cn(
            'absolute right-3 top-3 z-30 flex h-10 w-10 items-center justify-center rounded-full',
            'bg-white/95 backdrop-blur-md shadow-lg transition-all duration-300',
            'hover:scale-110 active:scale-95',
            isWishlisted
              ? 'border-2 border-red-500 bg-red-50 text-red-500'
              : 'border border-border text-muted-foreground hover:text-red-500 hover:border-red-500'
          )}
        >
          <Heart className={cn('h-4 w-4 transition-all', isWishlisted && 'fill-current scale-110')} />
        </button>

        {/* Product Info */}
        <div className="flex flex-col gap-2 p-4 sm:gap-3 sm:p-5 bg-gradient-to-t from-card/80 to-transparent backdrop-blur-sm">
          {/* Category */}
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {typeof product.category === 'object' ? product.category?.name : product.category || 'Uncategorized'}
          </div>

          {/* Name */}
          <Link
            to={`/product/${product.id}`}
            className="line-clamp-2 text-sm font-bold leading-snug transition-colors hover:text-primary sm:text-base"
          >
            {product.name}
          </Link>

          {/* Price Row */}
          <div className="flex items-end justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-lg font-extrabold text-primary sm:text-xl">
                {formatPriceINR(product.price)}
              </span>
              {(product.comparePrice !== undefined && product.comparePrice > product.price) && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPriceINR(product.comparePrice)}
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 rounded-full bg-muted/60 px-2.5 py-1.5 text-xs">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="font-bold text-foreground">{(product.averageRating || 0).toFixed(1)}</span>
            </div>
          </div>

          {/* Stock Status */}
          {stockLevel && (
            <div className={cn('text-xs font-semibold', stockLevel.color)}>
              {stockLevel.label}
            </div>
          )}

          {/* Add to Cart Button (Mobile visible) */}
          <button
            type="button"
            disabled={(product.quantity || 0) === 0}
            onClick={handleAddToCart}
            className={cn(
              'pk-btn pk-btn-primary pk-btn-shine h-10 w-full text-xs font-semibold shadow-md transition-all duration-300',
              addAnimation ? 'scale-105 bg-emerald-500' : '',
              (product.quantity || 0) > 0 && 'hover:shadow-xl hover:shadow-primary/25',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 sm:hidden'
            )}
          >
            <ShoppingCart className="h-4 w-4 sm:mr-2" />
            {(product.quantity || 0) === 0 ? 'Out of Stock' : addAnimation ? '✓ Added!' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Quick View Modal */}
      {isQuickViewOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={() => setIsQuickViewOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pk-fade-in" />
          <div
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-background shadow-2xl pk-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsQuickViewOpen(false)}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-muted/80 backdrop-blur-sm hover:bg-muted transition-all"
            >
              ×
            </button>

            <div className="grid gap-0 sm:grid-cols-2">
              {/* Image */}
              <div className="aspect-square bg-muted sm:aspect-[4/3]">
                <img
                  src={imgUrl || product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex flex-col gap-4 p-6">
                <div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {typeof product.category === 'object' ? product.category?.name : product.category}
                  </div>
                  <h3 className="mt-2 text-xl font-bold leading-tight">{product.name}</h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 rounded-full bg-muted/80 px-3 py-1.5 text-sm">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold">{(product.averageRating || 0).toFixed(1)}</span>
                    <span className="text-muted-foreground">({product.reviewCount || 0})</span>
                  </div>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-extrabold text-primary">{formatPriceINR(product.price)}</span>
                  {(product.comparePrice !== undefined && product.comparePrice > product.price) && (
                    <span className="text-sm text-muted-foreground line-through">{formatPriceINR(product.comparePrice)}</span>
                  )}
                </div>

                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {product.description || 'Premium quality product with excellent features and design.'}
                </p>

                <div className="flex gap-3 mt-auto">
                  <button
                    type="button"
                    onClick={(e) => { handleAddToCart(e); setIsQuickViewOpen(false); }}
                    disabled={product.quantity === 0}
                    className="pk-btn pk-btn-primary pk-btn-shine flex-1 h-12 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsQuickViewOpen(false); window.location.href = `/product/${product.id}`; }}
                    className="pk-btn pk-btn-outline flex-1 h-12 text-sm font-semibold"
                  >
                    View Details
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

export default memo(ProductCard);