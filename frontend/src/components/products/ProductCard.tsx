import { useState, type SyntheticEvent, memo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { toast } from 'sonner';
import { formatPriceINR } from '../../lib/format';
import { cn } from '../../lib/utils';
import { useCartStore } from '../../stores/cartStore';
import type { Product } from '../../types/product';
import { categoryImages } from '../../data/mockProducts';

function ProductCard({ product }: { product: Product }) {
  const addToCart = useCartStore((s) => s.addToCart);
  const wishlist = useCartStore((s) => s.wishlist);
  const toggleWishlist = useCartStore((s) => s.toggleWishlist);

  const [isImgLoaded, setIsImgLoaded] = useState(false);

  const isWishlisted = wishlist.includes(product.id);

  const badge = (() => {
    if (!product.inStock) return { text: 'Out of Stock', className: 'bg-destructive/90 text-destructive-foreground shadow-lg' };
    if (product.rating >= 4.8 && product.reviews >= 500)
      return { text: 'Best Seller', className: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg' };
    if (product.rating >= 4.7 && product.reviews >= 100)
      return { text: 'New', className: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg' };
    return null;
  })();

  const handleImgError = (e: SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    const fallbacks = [
      categoryImages[product.category],
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=800&q=80',
      'https://via.placeholder.com/800x600/111827/ffffff?text=Product+Image',
    ];

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

  const srcSet = `${withWidth(product.image, 400)} 400w, ${withWidth(product.image, 800)} 800w, ${withWidth(product.image, 1200)} 1200w`;
  const sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card/90 shadow-md backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/30 active:translate-y-0 focus-within:border-primary/40 pk-glass">
      <Link
        to={`/product/${product.id}`}
        aria-label={`View details for ${product.name}`}
        className="relative block aspect-[4/3] w-full overflow-hidden bg-muted"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 transition duration-300 group-hover:opacity-100" />
        {!isImgLoaded && (
          <div className="absolute inset-0 pk-shimmer">
            <div className="absolute inset-0 bg-gradient-to-br from-muted via-muted/50 to-muted animate-pulse" />
          </div>
        )}
        {badge && (
          <div className="absolute left-3 top-3 z-10 animate-in fade-in slide-in-from-top-2 duration-500">
            <span className={cn('inline-flex items-center rounded-full px-3 py-1.5 text-xs font-bold backdrop-blur-sm', badge.className)}>
              {badge.text}
            </span>
          </div>
        )}
        <img
          src={product.image}
          srcSet={srcSet}
          sizes={sizes}
          alt={product.name}
          loading="lazy"
          decoding="async"
          onError={handleImgError}
          onLoad={() => setIsImgLoaded(true)}
          className={cn(
            'h-full w-full object-cover transition-all duration-500 group-hover:scale-110',
            !isImgLoaded && 'opacity-0',
            isImgLoaded && 'opacity-100'
          )}
        />
      </Link>

      <button
        type="button"
        onClick={() => {
          toggleWishlist(product.id);
          toast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
        }}
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        className={cn(
          'pk-btn pk-btn-outline pk-btn-shine absolute right-3 top-3 h-10 w-10 rounded-full bg-background/95 backdrop-blur-md shadow-lg transition-all duration-300',
          isWishlisted && 'border-primary/60 bg-primary/10 text-primary scale-110'
        )}
      >
        <Heart className={cn('h-4 w-4 transition-all', isWishlisted && 'fill-current scale-110')} />
      </button>

      <div className="flex flex-col gap-2 p-3 sm:gap-3 sm:p-5">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div className="min-w-0 flex-1">
            <Link
              to={`/product/${product.id}`}
              className="line-clamp-2 text-sm font-bold leading-tight transition-colors hover:text-primary sm:text-base"
              aria-label={`Open ${product.name}`}
            >
              {product.name}
            </Link>
            <div className="mt-1 text-xs font-semibold text-foreground/70 sm:mt-2 sm:text-sm">{product.category}</div>
          </div>
          <div className="shrink-0 rounded-lg bg-gradient-to-br from-primary/30 to-primary/20 px-2 py-1 text-sm font-extrabold text-primary shadow-md sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-lg">
            {formatPriceINR(product.price)}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1 rounded-full bg-muted/80 px-2 py-1 text-[10px] font-medium text-muted-foreground shadow-sm sm:gap-1.5 sm:px-2.5 sm:py-1.5 sm:text-xs">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400 sm:h-3.5 sm:w-3.5" />
            <span className="font-bold text-foreground">{product.rating.toFixed(1)}</span>
            <span className="text-muted-foreground">({product.reviews})</span>
          </div>
          {!product.inStock && (
            <span className="rounded-full bg-destructive/15 px-2 py-0.5 text-[10px] font-bold text-destructive sm:px-2.5 sm:py-1 sm:text-xs">Out of stock</span>
          )}
        </div>

        <button
          type="button"
          disabled={!product.inStock}
          onClick={() => {
            if (!product.inStock) return;
            addToCart(product);
            toast.success('Added to cart');
          }}
          className={cn(
            'pk-btn pk-btn-primary pk-btn-shine h-9 w-full px-0 text-xs font-semibold shadow-lg transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 sm:h-11 sm:px-4 sm:text-sm',
            product.inStock && 'hover:shadow-xl hover:shadow-primary/30'
          )}
        >
          <ShoppingCart className="h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
          <span className="ml-1 sm:ml-0">Add</span>
          <span className="hidden sm:inline-block sm:ml-1">to cart</span>
        </button>
      </div>
    </div>
  );
}

export default memo(ProductCard);
