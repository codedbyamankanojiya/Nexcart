import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { mockProducts } from '../data/mockProducts';

import { Heart, Sparkles, Trash2, ShoppingCart, Share2, Bell, MoveRight } from 'lucide-react';
import { toast } from 'sonner';

import ProductCard from '../components/products/ProductCard';
import { useState, useMemo } from 'react';

export default function Wishlist() {
  const navigate = useNavigate();
  const wishlistIds = useCartStore((s) => s.wishlist);
  const clearWishlist = useCartStore((s) => s.clearWishlist);
  const addToCart = useCartStore((s) => s.addProductToCart);
  const [sortBy, setSortBy] = useState<'recent' | 'price-low' | 'price-high' | 'name'>('recent');

  const wishlistProducts = useMemo(() => {
    let products = mockProducts.filter(p => wishlistIds.includes(String(p.id)));
    switch (sortBy) {
      case 'price-low': return [...products].sort((a, b) => a.price - b.price);
      case 'price-high': return [...products].sort((a, b) => b.price - a.price);
      case 'name': return [...products].sort((a, b) => a.name.localeCompare(b.name));
      default: return products;
    }
  }, [wishlistIds, sortBy]);

  const handleClearAll = () => {
    if (wishlistProducts.length === 0) return;
    clearWishlist();
    toast.success('Wishlist cleared');
  };

  const handleAddAllToCart = () => {
    wishlistProducts.forEach(p => addToCart(p));
    toast.success(`Added ${wishlistProducts.length} items to cart!`);
    navigate('/cart');
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: 'My Wishlist', url });
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Wishlist link copied!');
    }
  };

  if (wishlistProducts.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-muted/50 via-background to-muted/30 pk-aurora">
        <div className="relative overflow-hidden rounded-3xl border bg-card/90 p-16 text-center shadow-2xl max-w-lg pk-glass">
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-pink-500/10 blur-3xl" />
          <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl" />
          <div className="relative">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-pink-500/20 to-red-500/20 shadow-xl mb-8 animate-bounce-in">
              <Heart className="h-12 w-12 text-pink-500" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Your wishlist is empty</h2>
            <p className="mt-4 text-muted-foreground max-w-sm mx-auto">
              Start adding items you love to your wishlist and save them for later.
            </p>
            <Link
              to="/"
              className="pk-btn pk-btn-primary pk-btn-shine mt-8 inline-flex h-14 px-10 text-base font-bold shadow-xl"
            >
              <Sparkles className="h-5 w-5" />
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pk-container py-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl flex items-center gap-3">
            <Heart className="h-8 w-8 text-pink-500" />
            My Wishlist
          </h1>
          <p className="mt-2 text-muted-foreground">
            <span className="font-semibold text-foreground">{wishlistProducts.length}</span> {wishlistProducts.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="pk-select h-11 w-[180px]"
          >
            <option value="recent">Recently Added</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name A-Z</option>
          </select>
          <button onClick={handleShare} className="pk-btn pk-btn-outline h-11 px-4 text-sm font-medium shadow-sm">
            <Share2 className="h-4 w-4" />
            Share
          </button>
          <button
            onClick={handleAddAllToCart}
            className="pk-btn pk-btn-primary pk-btn-shine h-11 px-5 text-sm font-medium shadow-sm"
          >
            <ShoppingCart className="h-4 w-4" />
            Add All to Cart
          </button>
          <button
            onClick={handleClearAll}
            className="pk-btn pk-btn-outline h-11 px-5 text-sm font-medium shadow-sm hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
          >
            <Trash2 className="h-4 w-4" />
            Clear All
          </button>
        </div>
      </div>

      {/* Price Drop Alert Banner */}
      <div className="mb-6 rounded-2xl border border-amber-200/50 bg-gradient-to-r from-amber-50 to-orange-50 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
            <Bell className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <div className="text-sm font-semibold">Price drop alert!</div>
            <div className="text-xs text-muted-foreground">3 items in your wishlist have dropped in price</div>
          </div>
        </div>
        <button className="pk-btn pk-btn-outline h-9 px-4 text-sm font-medium">
          View Drops
        </button>
      </div>

      {/* Wishlist Grid */}
      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {wishlistProducts.map((product) => (
          <div key={product.id} className="pk-slide-up">
            <ProductCard product={{
              ...product,
              quantity: product.inStock ? 100 : 0,
              averageRating: product.rating,
              reviewCount: product.reviews,
              images: [product.image],
              category: { id: product.category, name: product.category }
            }} />
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="mt-12 rounded-3xl border bg-gradient-to-br from-primary/5 via-sky-500/5 to-emerald-500/5 p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-sky-500/20 shadow-lg mb-4">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold">You might also like</h3>
        <p className="mt-2 text-muted-foreground">Based on your wishlist, we think these products would be perfect for you</p>
        <Link
          to="/"
          className="pk-btn pk-btn-primary pk-btn-shine mt-6 inline-flex h-12 px-8 text-base font-semibold shadow-lg"
        >
          Explore More
          <MoveRight className="h-5 w-5 ml-2" />
        </Link>
      </div>
    </div>
  );
}