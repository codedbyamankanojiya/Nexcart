import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { formatPriceINR } from '../../lib/format';
import { cn } from '../../lib/utils';
import { cartTotal, useCartStore } from '../../stores/cartStore';
import Sheet from '../overlays/Sheet';
import type { SyntheticEvent } from 'react';
import { categoryImages } from '../../data/mockProducts';
import type { Category } from '../../types/product';
import { scrollToId } from '../../lib/scroll';

export default function CartDrawer({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const items = useCartStore((s) => s.items);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const setQty = useCartStore((s) => s.setQty);
  const clearCart = useCartStore((s) => s.clearCart);

  const subtotal = cartTotal(items);
  const shipping = subtotal > 999 ? 0 : subtotal > 0 ? 49 : 0;
  const tax = subtotal > 0 ? Math.round(subtotal * 0.18) : 0;
  const total = subtotal + shipping + tax;
  const freeShipTarget = 999;
  const freeShipRemaining = Math.max(0, freeShipTarget - subtotal);
  const freeShipProgress = Math.min(1, subtotal / freeShipTarget);

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
    <Sheet open={open} onOpenChange={onOpenChange} title="Your cart" description="Review items and checkout.">
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border bg-card/70 p-8 text-center pk-glass">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/70">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <div className="text-base font-semibold">Your cart is empty</div>
          <div className="text-sm text-muted-foreground">Add products to see them here.</div>
          <button
            type="button"
            onClick={goToShop}
            className="pk-btn pk-btn-primary pk-btn-shine mt-2 h-10 px-4 text-sm"
          >
            Continue shopping
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          <div className="rounded-2xl border bg-card/70 p-4 pk-glass">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">Order summary</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {shipping === 0 ? (
                    <span className="font-medium text-foreground">Free shipping unlocked</span>
                  ) : (
                    <span>
                      Add <span className="font-semibold text-foreground">{formatPriceINR(freeShipRemaining)}</span> more for free shipping
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                className="pk-btn pk-btn-outline h-9 px-3 text-sm text-destructive"
                onClick={() => {
                  clearCart();
                  toast('Cart cleared');
                }}
              >
                Clear
              </button>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary via-sky-500 to-emerald-500"
                style={{ width: `${Math.round(freeShipProgress * 100)}%` }}
              />
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
                          <div className="mt-1 inline-flex rounded-full bg-primary/10 px-2 py-1 text-sm font-semibold text-primary">
                            {formatPriceINR(item.price)}
                          </div>
                        </div>
                        <button
                          type="button"
                          className="pk-btn pk-btn-outline h-9 w-9 text-destructive"
                          onClick={() => {
                            removeFromCart(item.id);
                            toast('Removed from cart');
                          }}
                          aria-label="Remove from cart"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                        <div className="inline-flex items-center rounded-xl border bg-background/70">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            className="inline-flex h-9 w-9 items-center justify-center transition hover:bg-accent/70 disabled:pointer-events-none"
                            onClick={() => setQty(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className={cn('h-4 w-4', item.quantity <= 1 && 'opacity-40')} />
                          </button>
                          <input
                            value={item.quantity}
                            inputMode="numeric"
                            className="h-9 w-12 bg-transparent text-center text-sm font-semibold outline-none"
                            aria-label="Quantity"
                            onChange={(e) => {
                              const next = Number(e.target.value);
                              if (Number.isNaN(next)) return;
                              setQty(item.id, next);
                            }}
                          />
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            className="inline-flex h-9 w-9 items-center justify-center transition hover:bg-accent/70"
                            onClick={() => setQty(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="text-sm font-semibold">
                          {formatPriceINR(item.price * item.quantity)}
                          <span className="ml-1 text-xs font-medium text-muted-foreground">total</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sticky bottom-0 -mx-4 mt-2 border-t bg-background/85 px-4 pb-4 pt-3 backdrop-blur">
            <div className="rounded-2xl border bg-card/70 p-4 pk-glass">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">{formatPriceINR(subtotal)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-semibold">{shipping === 0 ? 'Free' : formatPriceINR(shipping)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Estimated tax</span>
                <span className="font-semibold">{formatPriceINR(tax)}</span>
              </div>

              <div className="mt-3 flex items-center justify-between border-t pt-3">
                <span className="text-sm font-semibold">Total</span>
                <span className="text-base font-semibold">{formatPriceINR(total)}</span>
              </div>

              <button
                type="button"
                className="pk-btn pk-btn-primary pk-btn-shine mt-4 h-11 w-full text-sm"
                onClick={() => {
                  toast('Checkout is a mock flow for now');
                }}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </Sheet>
  );
}
