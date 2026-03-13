import { Link } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { mockProducts } from '../data/mockProducts';
import ProductCard from '../components/products/ProductCard';
import { Heart, Sparkles, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Wishlist() {
  const wishlistIds = useCartStore((s) => s.wishlist);
  const clearWishlist = useCartStore((s) => s.clearWishlist);

  const wishlistProducts = mockProducts.filter(p => wishlistIds.includes(p.id));

  const handleClearAll = () => {
    if (wishlistProducts.length === 0) return;
    clearWishlist();
    toast.success('Wishlist cleared');
  };

  if (wishlistProducts.length === 0) {
    return (
      <div className="pk-container py-16 md:py-24">
        <div className="mx-auto max-w-md">
          <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-card/95 to-card/70 p-12 text-center shadow-2xl backdrop-blur pk-glass">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-pink-500/10 blur-3xl" />

            <div className="relative">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-pink-500/20 to-primary/20 shadow-lg">
                <Heart className="h-10 w-10 text-primary" />
              </div>
              <h2 className="mt-6 text-2xl font-bold tracking-tight">Your wishlist is empty</h2>
              <p className="mt-3 text-muted-foreground">Start adding items you love to your wishlist and they'll appear here.</p>
              <Link
                to="/"
                className="pk-btn pk-btn-primary pk-btn-shine mt-8 inline-flex h-12 px-8 text-base font-semibold shadow-xl"
              >
                <Sparkles className="h-5 w-5" />
                Start Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pk-container py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">My Wishlist</h1>
          <p className="mt-2 text-muted-foreground">
            <span className="font-semibold text-foreground">{wishlistProducts.length}</span> {wishlistProducts.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>
        <button
          onClick={handleClearAll}
          className="pk-btn pk-btn-outline h-11 px-5 text-sm font-medium shadow-sm hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
        >
          <Trash2 className="h-4 w-4" />
          Clear All
        </button>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {wishlistProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
