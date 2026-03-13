import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { mockProducts } from '../data/mockProducts';
import { formatPriceINR } from '../lib/format';
import { ShoppingCart, Sparkles, Trash2, Minus, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

export default function Cart() {
    const navigate = useNavigate();
    const items = useCartStore((s) => s.items);
    const removeFromCart = useCartStore((s) => s.removeFromCart);
    const setQty = useCartStore((s) => s.setQty);
    const clearCart = useCartStore((s) => s.clearCart);

    const cartProducts = items.map((item) => ({
        ...mockProducts.find((p) => p.id === item.id)!,
        quantity: item.quantity,
    }));

    const subtotal = cartProducts.reduce((sum: number, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + tax;

    const handleClearCart = () => {
        if (items.length === 0) return;
        clearCart();
        toast.success('Cart cleared');
    };

    const handleRemoveItem = (id: number, name: string) => {
        removeFromCart(id);
        toast.success(`${name} removed from cart`);
    };

    const handleUpdateQuantity = (id: number, newQuantity: number) => {
        if (newQuantity < 1) return;
        setQty(id, newQuantity);
    };

    if (items.length === 0) {
        return (
            <div className="pk-container py-16 md:py-24">
                <div className="mx-auto max-w-md">
                    <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-card/95 to-card/70 p-12 text-center shadow-2xl backdrop-blur pk-glass">
                        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
                        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />

                        <div className="relative">
                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-primary/20 shadow-lg">
                                <ShoppingCart className="h-10 w-10 text-primary" />
                            </div>
                            <h2 className="mt-6 text-2xl font-bold tracking-tight">Your cart is empty</h2>
                            <p className="mt-3 text-muted-foreground">Add some amazing products to your cart and they'll appear here.</p>
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
                    <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Shopping Cart</h1>
                    <p className="mt-2 text-muted-foreground">
                        <span className="font-semibold text-foreground">{items.length}</span> {items.length === 1 ? 'item' : 'items'} in your cart
                    </p>
                </div>
                <button
                    onClick={handleClearCart}
                    className="pk-btn pk-btn-outline h-11 px-5 text-sm font-medium shadow-sm hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
                >
                    <Trash2 className="h-4 w-4" />
                    Clear Cart
                </button>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
                {/* Cart Items */}
                <div className="space-y-4">
                    {cartProducts.map((product, idx) => (
                        <div
                            key={product.id}
                            style={{ animationDelay: `${idx * 100}ms` }}
                            className="pk-slide-up group relative overflow-hidden rounded-2xl border bg-card/70 p-4 shadow-sm backdrop-blur transition hover:shadow-md pk-glass"
                        >
                            <div className="flex gap-4">
                                {/* Product Image */}
                                <Link
                                    to={`/product/${product.id}`}
                                    className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted"
                                >
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                    />
                                </Link>

                                {/* Product Details */}
                                <div className="flex min-w-0 flex-1 flex-col justify-between">
                                    <div>
                                        <Link
                                            to={`/product/${product.id}`}
                                            className="line-clamp-2 text-base font-bold leading-snug transition-colors hover:text-primary"
                                        >
                                            {product.name}
                                        </Link>
                                        <div className="mt-1 text-sm font-medium text-muted-foreground">{product.category}</div>
                                    </div>

                                    <div className="mt-2 flex items-center gap-3">
                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-2 rounded-lg border bg-background/50 p-1">
                                            <button
                                                onClick={() => handleUpdateQuantity(product.id, product.quantity - 1)}
                                                disabled={product.quantity <= 1}
                                                className="flex h-7 w-7 items-center justify-center rounded-md transition hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                                                aria-label="Decrease quantity"
                                            >
                                                <Minus className="h-3 w-3" />
                                            </button>
                                            <span className="w-8 text-center text-sm font-semibold">{product.quantity}</span>
                                            <button
                                                onClick={() => handleUpdateQuantity(product.id, product.quantity + 1)}
                                                className="flex h-7 w-7 items-center justify-center rounded-md transition hover:bg-accent"
                                                aria-label="Increase quantity"
                                            >
                                                <Plus className="h-3 w-3" />
                                            </button>
                                        </div>

                                        {/* Price */}
                                        <div className="text-lg font-extrabold text-primary">
                                            {formatPriceINR(product.price * product.quantity)}
                                        </div>
                                    </div>
                                </div>

                                {/* Remove Button */}
                                <button
                                    onClick={() => handleRemoveItem(product.id, product.name)}
                                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-muted-foreground backdrop-blur transition hover:bg-destructive/10 hover:text-destructive"
                                    aria-label="Remove item"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:sticky lg:top-24 lg:self-start">
                    <div className="rounded-2xl border bg-card/70 p-6 shadow-lg backdrop-blur pk-glass">
                        <h2 className="text-xl font-bold">Order Summary</h2>

                        <div className="mt-6 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="font-semibold">{formatPriceINR(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Tax (GST 18%)</span>
                                <span className="font-semibold">{formatPriceINR(tax)}</span>
                            </div>
                            <div className="h-px bg-border" />
                            <div className="flex justify-between text-lg">
                                <span className="font-bold">Order Total</span>
                                <span className="font-extrabold text-primary">{formatPriceINR(total)}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/checkout')}
                            className="pk-btn pk-btn-primary pk-btn-shine mt-6 h-12 w-full text-base font-bold shadow-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 border-yellow-500"
                        >
                            Proceed to Buy
                        </button>

                        <Link
                            to="/"
                            className="pk-btn pk-btn-outline mt-3 h-11 w-full text-sm font-medium"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
