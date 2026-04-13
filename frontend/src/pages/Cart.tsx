import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { formatPriceINR } from '../lib/format';
import { ShoppingCart, Sparkles, Trash2, Minus, Plus, Tag, Truck, ChevronRight, Heart, ShieldCheck, Lock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

export default function Cart() {
    const navigate = useNavigate();
    const items = useCartStore((s) => s.items);
    const removeFromCart = useCartStore((s) => s.removeFromCart);
    const setQty = useCartStore((s) => s.setQty);
    const clearCart = useCartStore((s) => s.clearCart);
    const toggleWishlist = useCartStore((s) => s.toggleWishlist);
    const wishlist = useCartStore((s) => s.wishlist);

    const [couponCode, setCouponCode] = useState('');
    const [couponApplied, setCouponApplied] = useState(false);
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set(items.map(i => i.productId)));

    const cartProducts = items.map((item) => ({
        ...item.product,
        ...item,
        id: item.productId, // Use productId for consistency
        cartItemId: item.id,
    })).filter(Boolean);

    const toggleSelect = (productId: string) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(productId)) {
            newSelected.delete(productId);
        } else {
            newSelected.add(productId);
        }
        setSelectedItems(newSelected);
    };

    const selectAll = () => {
        if (selectedItems.size === cartProducts.length) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set(cartProducts.map(p => String(p.id))));
        }
    };

    const selectedProducts = cartProducts.filter(p => selectedItems.has(String(p.id)));
    const subtotal = selectedProducts.reduce((sum: number, item) => sum + (item?.price ?? 0) * item.quantity, 0);
    const shipping = selectedProducts.length > 0 ? (subtotal >= 999 ? 0 : 49) : 0;
    const tax = subtotal * 0.18;
    const discount = couponApplied ? couponDiscount : 0;
    const total = subtotal + shipping + tax - discount;

    const handleApplyCoupon = () => {
        if (couponCode.toUpperCase() === 'POPKART20') {
            setCouponApplied(true);
            setCouponDiscount(subtotal * 0.2);
            toast.success('20% discount applied!');
        } else if (couponCode.toUpperCase() === 'FIRST50') {
            setCouponApplied(true);
            setCouponDiscount(50);
            toast.success('₹50 discount applied!');
        } else {
            toast.error('Invalid coupon code');
        }
    };

    const handleRemoveItem = (cartItemId: string, name: string) => {
        removeFromCart(cartItemId);
        // We need to find which productId this cartItemId belongs to, to remove from selectedItems
        const item = items.find(i => i.id === cartItemId);
        if (item) {
            selectedItems.delete(item.productId);
            setSelectedItems(new Set(selectedItems));
        }
        toast.success(`${name} removed from cart`);
    };

    const handleUpdateQuantity = (cartItemId: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        setQty(cartItemId, newQuantity);
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-muted/50 via-background to-muted/30 pk-aurora">
                <div className="relative overflow-hidden rounded-3xl border bg-card/90 p-16 text-center shadow-2xl max-w-lg pk-glass">
                    <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
                    <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />
                    <div className="relative">
                        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-sky-500/20 shadow-xl mb-8 animate-bounce-in">
                            <ShoppingCart className="h-12 w-12 text-primary" />
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight">Your cart is empty</h2>
                        <p className="mt-4 text-muted-foreground max-w-sm mx-auto">
                            Looks like you haven't added anything to your cart yet. Start exploring our products!
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
                        <ShoppingCart className="h-8 w-8 text-primary" />
                        Shopping Cart
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        <span className="font-semibold text-foreground">{items.length}</span> {items.length === 1 ? 'item' : 'items'} in your cart
                        {selectedItems.size > 0 && ` · ${selectedItems.size} selected`}
                    </p>
                </div>
                <div className="flex gap-2">
                    {selectedItems.size > 0 && selectedItems.size < cartProducts.length && (
                        <button onClick={selectAll} className="pk-btn pk-btn-outline h-11 px-5 text-sm font-medium">
                            Select All
                        </button>
                    )}
                    {selectedItems.size === cartProducts.length && (
                        <button onClick={selectAll} className="pk-btn pk-btn-outline h-11 px-5 text-sm font-medium">
                            Deselect All
                        </button>
                    )}
                    <button
                        onClick={() => { clearCart(); setSelectedItems(new Set()); toast.success('Cart cleared'); }}
                        className="pk-btn pk-btn-outline h-11 px-5 text-sm font-medium shadow-sm hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
                    >
                        <Trash2 className="h-4 w-4" />
                        Clear Cart
                    </button>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
                {/* Cart Items */}
                <div className="space-y-4">
                    {cartProducts.map((product, idx) => {
                        const isSelected = selectedItems.has(String(product.id));
                        return (
                            <div
                                key={product.id}
                                style={{ animationDelay: `${idx * 80}ms` }}
                                className={cn(
                                    'pk-section p-5 pk-slide-up transition-all duration-300',
                                    isSelected ? 'border-primary/30 shadow-primary/10' : ''
                                )}
                            >
                                <div className="flex gap-5">
                                    {/* Checkbox */}
                                    <div className="flex items-start pt-1">
                                        <button
                                            onClick={() => toggleSelect(String(product.id))}
                                            className={cn(
                                                'flex h-6 w-6 items-center justify-center rounded-lg border-2 transition-all',
                                                isSelected
                                                    ? 'bg-primary border-primary'
                                                    : 'border-muted-foreground/30 hover:border-primary/50'
                                            )}
                                        >
                                            {isSelected && <span className="text-white text-xs">✓</span>}
                                        </button>
                                    </div>

                                    {/* Product Image */}
                                    <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-muted group">
                                        <img
                                            src={(product as any).images?.[0] || (product as any).image}
                                            alt={product.name}
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-110 cursor-pointer"
                                            onClick={() => navigate(`/product/${product.id}`)}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                                        <div>
                                            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                                {(product.category as any)?.name || String(product.category)}
                                            </div>
                                            <Link
                                                to={`/product/${product.id}`}
                                                className="line-clamp-2 text-base font-bold leading-snug mt-1 transition-colors hover:text-primary"
                                            >
                                                {product.name}
                                            </Link>
                                            <div className="mt-1.5 flex items-center gap-2">
                                                <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                                                    ⭐ {((product as any).averageRating || (product as any).rating || 0).toFixed(1)}
                                                </span>
                                                <span className="text-xs text-muted-foreground">{(product as any).reviewCount || (product as any).reviews || 0} reviews</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-3">
                                            {/* Price */}
                                            <div className="flex flex-col">
                                                <span className="text-xl font-extrabold text-primary">
                                                    {formatPriceINR(product.price)}
                                                </span>
                                                {product.comparePrice && product.comparePrice > product.price && (
                                                    <span className="text-sm text-muted-foreground line-through">
                                                        {formatPriceINR(product.comparePrice)}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1.5 rounded-xl border-2 bg-card/50 p-1">
                                                    <button
                                                        onClick={() => handleUpdateQuantity(String(product.cartItemId), product.quantity - 1)}
                                                        disabled={product.quantity <= 1}
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg transition hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
                                                        aria-label="Decrease quantity"
                                                    >
                                                        <Minus className="h-3.5 w-3.5" />
                                                    </button>
                                                    <span className="w-10 text-center text-sm font-bold">{product.quantity}</span>
                                                    <button
                                                        onClick={() => handleUpdateQuantity(String(product.cartItemId), product.quantity + 1)}
                                                        disabled={product.quantity >= 5}
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg transition hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
                                                        aria-label="Increase quantity"
                                                    >
                                                        <Plus className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>

                                                <span className="text-lg font-bold text-muted-foreground">
                                                    = {formatPriceINR(product.price * product.quantity)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-2 items-end">
                                        <button
                                            onClick={() => handleRemoveItem(String(product.cartItemId), product.name)}
                                            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
                                            aria-label="Remove item"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                toggleWishlist(String(product.id));
                                                toast(wishlist.includes(String(product.id)) ? 'Removed from wishlist' : 'Added to wishlist');
                                            }}
                                            className={cn(
                                                'flex h-9 w-9 items-center justify-center rounded-full transition-all',
                                                wishlist.includes(String(product.id))
                                                    ? 'bg-red-50 text-red-500 border border-red-200'
                                                    : 'text-muted-foreground hover:bg-pink-50 hover:text-pink-500 hover:border border-pink-200'
                                            )}
                                            aria-label="Move to wishlist"
                                        >
                                            <Heart className={cn('h-4 w-4', wishlist.includes(String(product.id)) && 'fill-current')} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Continue Shopping */}
                    <Link
                        to="/"
                        className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border/60 p-4 text-sm font-medium text-muted-foreground hover:border-primary/40 hover:text-primary transition-all"
                    >
                        <Sparkles className="h-4 w-4" />
                        Continue Shopping
                    </Link>
                </div>

                {/* Order Summary */}
                <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
                    {/* Coupon Section */}
                    <div className="pk-section p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <Tag className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-bold">Apply Coupon</h3>
                        </div>
                        <div className="flex gap-2">
                            <input
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                placeholder="Enter coupon code"
                                className="pk-input flex-1 h-11 text-sm"
                                disabled={couponApplied}
                            />
                            <button
                                type="button"
                                onClick={handleApplyCoupon}
                                disabled={couponApplied || !couponCode.trim()}
                                className="pk-btn pk-btn-primary h-11 px-5 text-sm font-semibold disabled:opacity-50"
                            >
                                {couponApplied ? '✓ Applied' : 'Apply'}
                            </button>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                            <span className="text-xs text-muted-foreground">Try:</span>
                            <button onClick={() => setCouponCode('POPKART20')} className="text-xs font-semibold text-primary hover:underline">POPKART20</button>
                            <span className="text-xs text-muted-foreground">·</span>
                            <button onClick={() => setCouponCode('FIRST50')} className="text-xs font-semibold text-primary hover:underline">FIRST50</button>
                        </div>
                    </div>

                    {/* Order Summary Card */}
                    <div className="pk-section p-6">
                        <h3 className="text-lg font-bold">Order Summary</h3>

                        <div className="mt-5 space-y-3.5 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Subtotal ({selectedProducts.length} items)
                                </span>
                                <span className="font-semibold">{formatPriceINR(subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Shipping</span>
                                <span className={shipping === 0 ? 'text-emerald-600 font-semibold' : ''}>
                                    {shipping === 0 ? 'FREE' : formatPriceINR(shipping)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Tax (GST 18%)</span>
                                <span>{formatPriceINR(tax)}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-emerald-600">
                                    <span>Coupon Discount</span>
                                    <span className="font-semibold">-{formatPriceINR(discount)}</span>
                                </div>
                            )}
                            <div className="h-px bg-border my-3" />
                            <div className="flex justify-between text-xl font-extrabold">
                                <span>Total</span>
                                <span className="text-primary">{formatPriceINR(total)}</span>
                            </div>
                        </div>

                        {subtotal > 0 && subtotal < 999 && (
                            <div className="mt-4 rounded-xl bg-gradient-to-r from-primary/10 to-sky-500/10 p-4 text-center">
                                <div className="flex items-center justify-center gap-2 text-sm">
                                    <AlertCircle className="h-4 w-4 text-primary" />
                                    <span>Add</span>
                                    <span className="font-bold text-primary">₹{999 - subtotal}</span>
                                    <span>more for FREE shipping!</span>
                                </div>
                                <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-primary to-sky-500 transition-all" style={{ width: `${Math.min((subtotal / 999) * 100, 100)}%` }} />
                                </div>
                            </div>
                        )}

                        {couponApplied && (
                            <div className="mt-4 rounded-xl bg-emerald-100/50 border border-emerald-500/20 p-3 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                                    <span>✓</span>
                                    Coupon applied: -{formatPriceINR(discount)}
                                </div>
                                <button type="button" onClick={() => { setCouponApplied(false); setCouponDiscount(0); }} className="text-xs text-emerald-600 hover:underline">
                                    Remove
                                </button>
                            </div>
                        )}

                        <button
                            onClick={() => selectedProducts.length > 0 && navigate('/checkout')}
                            disabled={selectedProducts.length === 0}
                            className="pk-btn pk-btn-primary pk-btn-shine mt-6 h-14 w-full text-base font-bold shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Lock className="h-4 w-4" />
                            Proceed to Checkout
                            <ChevronRight className="h-4 w-4" />
                        </button>

                        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                            <span>Secure 256-bit SSL encrypted payment</span>
                        </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { icon: Truck, title: 'Free Shipping', sub: 'Orders ₹999+' },
                            { icon: ShieldCheck, title: 'Easy Returns', sub: '7 day policy' },
                        ].map(({ icon: Icon, title, sub }) => (
                            <div key={title} className="flex items-center gap-3 rounded-xl border bg-card/80 p-4 pk-glass">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                    <Icon className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <div className="text-xs font-semibold">{title}</div>
                                    <div className="text-[10px] text-muted-foreground">{sub}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}