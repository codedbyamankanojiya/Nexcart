import { HeartOff, ShoppingCart, Sparkles, Trash2 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { mockProducts } from '../../data/mockProducts';
import { formatPriceINR } from '../../lib/format';
import { useCartStore } from '../../stores/cartStore';
import Sheet from '../overlays/Sheet';
import type { SyntheticEvent } from 'react';
import { categoryImages } from '../../data/mockProducts';
import type { Category } from '../../types/product';
import { scrollToId } from '../../lib/scroll';

export default function WishlistDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const wishlist = useCartStore((s) => s.wishlist);
  const removeFromWishlist = useCartStore((s) => s.removeFromWishlist);
  const clearWishlist = useCartStore((s) => s.clearWishlist);
  const addToCart = useCartStore((s) => s.addToCart);

  const items = mockProducts.filter((p) => wishlist.includes(p.id));

  const isCategory = (v: unknown): v is Category => {
    return typeof v === 'string' && v in categoryImages;
  };

  const handleImgError = (e: SyntheticEvent<HTMLImageElement>, category?: string) => {
    const img = e.currentTarget;
    const fallback = isCategory(category) ? categoryImages[category] : categoryImages.Gadgets;
    img.src = fallback;
  };

  const goToShop = () => {
    onOpenChange(false);
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: 'shop' } });
      return;
    }
    scrollToId('shop');
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange} title="Wishlist" description="Save items for later.">
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border bg-card/70 p-8 text-center shadow-sm pk-glass">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/70">
            <HeartOff className="h-6 w-6" />
          </div>
          <div className="text-base font-semibold">Your wishlist is empty</div>
          <div className="text-sm text-muted-foreground">Tap the heart icon on a product to save it.</div>
          <button
            type="button"
            onClick={goToShop}
            className="pk-btn pk-btn-primary pk-btn-shine mt-2 h-10 px-4 text-sm"
          >
            Browse products
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          <div className="rounded-2xl border bg-card/70 p-4 pk-glass">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">Saved for later</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Keep track of items. Move what you need to cart when you’re ready.
                </div>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs font-semibold">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                {items.length} saved
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                className="pk-btn pk-btn-primary pk-btn-shine h-10 flex-1 px-4 text-sm"
                onClick={() => {
                  const moveable = items.filter((i) => i.inStock);
                  moveable.forEach((i) => addToCart(i));
                  toast(moveable.length > 0 ? 'Moved available items to cart' : 'No in-stock items to move');
                }}
              >
                <ShoppingCart className="h-4 w-4" />
                Move all to cart
              </button>
              <button
                type="button"
                className="pk-btn pk-btn-outline h-10 px-4 text-sm text-destructive"
                onClick={() => {
                  clearWishlist();
                  toast('Wishlist cleared');
                }}
              >
                <Trash2 className="h-4 w-4" />
                Clear
              </button>
            </div>
          </div>

          <div className="pk-section p-3 sm:p-4">
            <div className="grid gap-3">
              {items.map((item) => (
                <div key={item.id} className="rounded-2xl border bg-card/70 p-3 pk-glass">
                  <div className="flex gap-3">
                    <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-muted">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => handleImgError(e, item.category)}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="line-clamp-2 text-sm font-semibold">{item.name}</div>
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <div className="inline-flex rounded-full bg-primary/10 px-2 py-1 text-sm font-semibold text-primary">
                              {formatPriceINR(item.price)}
                            </div>
                            {!item.inStock ? (
                              <span className="rounded-full bg-destructive/10 px-2 py-1 text-[11px] font-semibold text-destructive">
                                Out of stock
                              </span>
                            ) : (
                              <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[11px] font-semibold text-emerald-600">
                                In stock
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          className="pk-btn pk-btn-outline h-9 w-9 text-destructive"
                          onClick={() => {
                            removeFromWishlist(item.id);
                            toast('Removed from wishlist');
                          }}
                          aria-label="Remove from wishlist"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          disabled={!item.inStock}
                          className="pk-btn pk-btn-primary pk-btn-shine h-9 px-3 text-sm disabled:opacity-60"
                          onClick={() => {
                            if (!item.inStock) return;
                            addToCart(item);
                            removeFromWishlist(item.id);
                            toast('Moved to cart');
                          }}
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Move to cart
                        </button>
                        <button
                          type="button"
                          className="pk-btn pk-btn-outline h-9 px-3 text-sm"
                          onClick={() => {
                            removeFromWishlist(item.id);
                            toast('Removed from wishlist');
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Sheet>
  );
}
