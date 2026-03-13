import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { mockProducts } from '../data/mockProducts';
import { formatPriceINR } from '../lib/format';
import { CheckCircle2, ChevronRight, CreditCard, MapPin, ShieldCheck, Lock } from 'lucide-react';
import { toast } from 'sonner';

type Step = 'address' | 'payment' | 'review';

export default function Checkout() {
    const navigate = useNavigate();
    const items = useCartStore((s) => s.items);
    const clearCart = useCartStore((s) => s.clearCart);

    const [step, setStep] = useState<Step>('address');
    const [paymentMethod, setPaymentMethod] = useState('upi');
    const [isLoading, setIsLoading] = useState(false);

    const cartProducts = items.map((item) => ({
        ...mockProducts.find((p) => p.id === item.id)!,
        quantity: item.quantity,
    }));

    const subtotal = cartProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.18;
    const total = subtotal + tax;

    const handlePlaceOrder = () => {
        setIsLoading(true);
        setTimeout(() => {
            clearCart();
            setIsLoading(false);
            toast.success('Order placed successfully!');
            navigate('/orders'); // Assuming orders page exists, or back to home
        }, 2000);
    };

    const steps = [
        { id: 'address', label: 'Address', icon: MapPin },
        { id: 'payment', label: 'Payment', icon: CreditCard },
        { id: 'review', label: 'Review', icon: CheckCircle2 },
    ];

    if (items.length === 0) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold">Your cart is empty</h2>
                <Link to="/" className="text-primary hover:underline">Go back to shopping</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30 pb-20">
            {/* Checkout Header */}
            <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
                <div className="pk-container flex h-16 items-center justify-between">
                    <Link to="/" className="text-xl font-bold tracking-tighter">
                        PopKart<span className="text-primary">.</span>
                    </Link>
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Lock className="h-4 w-4" />
                        Secure Checkout
                    </div>
                </div>
            </header>

            <div className="pk-container py-8">
                <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

                    {/* Main Content */}
                    <div className="space-y-6">

                        {/* Steps Indicator */}
                        <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
                            {steps.map((s, idx) => {
                                const isActive = s.id === step;
                                const isCompleted = steps.findIndex(x => x.id === step) > idx;

                                return (
                                    <div key={s.id} className={`flex items-center gap-2 ${isActive ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-muted-foreground'}`}>
                                        <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${isActive ? 'border-primary bg-primary/10' : isCompleted ? 'border-green-600 bg-green-50' : 'border-current'}`}>
                                            {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
                                        </div>
                                        <span className="hidden text-sm font-semibold sm:inline">{s.label}</span>
                                        {idx < steps.length - 1 && <ChevronRight className="h-4 w-4 text-muted-foreground/50 ml-2 sm:ml-4" />}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Step 1: Address */}
                        {step === 'address' && (
                            <div className="pk-slide-up rounded-xl border bg-card p-6 shadow-sm">
                                <h2 className="text-xl font-bold">Select Delivery Address</h2>
                                <div className="mt-6 grid gap-4">
                                    <div className="rounded-lg border-2 border-primary bg-primary/5 p-4 shadow-sm">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="font-bold">Aman Kumar</p>
                                                <p className="text-sm text-foreground/80">123, Tech Plaza, Sector 62</p>
                                                <p className="text-sm text-foreground/80">Noida, Uttar Pradesh 201301</p>
                                                <p className="mt-1 text-sm font-medium">Phone: +91 98765 43210</p>
                                            </div>
                                            <input type="radio" checked readOnly className="h-5 w-5 accent-primary" />
                                        </div>
                                        <button onClick={() => setStep('payment')} className="pk-btn pk-btn-primary mt-4 w-full sm:w-auto px-8">
                                            Deliver to this address
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-center rounded-lg border border-dashed p-6 text-sm text-muted-foreground hover:bg-muted/50 cursor-pointer">
                                        + Add a new address
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Payment */}
                        {step === 'payment' && (
                            <div className="pk-slide-up rounded-xl border bg-card p-6 shadow-sm">
                                <h2 className="text-xl font-bold">Select Payment Method</h2>
                                <div className="mt-6 space-y-3">
                                    {['upi', 'card', 'cod'].map((method) => (
                                        <label key={method} className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-all ${paymentMethod === method ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:bg-muted/50'}`}>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    checked={paymentMethod === method}
                                                    onChange={() => setPaymentMethod(method)}
                                                    className="h-5 w-5 accent-primary"
                                                />
                                                <span className="font-medium capitalize">{method === 'cod' ? 'Cash on Delivery' : method.toUpperCase()}</span>
                                            </div>
                                            {method === 'upi' && <span className="text-xs font-medium text-green-600">Fastest</span>}
                                        </label>
                                    ))}
                                </div>
                                <div className="mt-6 flex gap-3">
                                    <button onClick={() => setStep('address')} className="pk-btn pk-btn-outline px-6">Back</button>
                                    <button onClick={() => setStep('review')} className="pk-btn pk-btn-primary px-8">Continue to Review</button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Review */}
                        {step === 'review' && (
                            <div className="pk-slide-up space-y-6">
                                <div className="rounded-xl border bg-card p-6 shadow-sm">
                                    <h2 className="text-xl font-bold mb-4">Review Items</h2>
                                    <div className="space-y-4">
                                        {cartProducts.map((item) => (
                                            <div key={item.id} className="flex gap-4 border-b pb-4 last:border-0 last:pb-0">
                                                <img src={item.image} alt={item.name} className="h-20 w-20 rounded-md object-cover bg-muted" />
                                                <div>
                                                    <h3 className="font-semibold line-clamp-1">{item.name}</h3>
                                                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                                    <p className="font-bold text-primary mt-1">{formatPriceINR(item.price * item.quantity)}</p>
                                                    <p className="text-xs text-green-600 mt-1">Estimated delivery by Tomorrow</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-xl border bg-yellow-50/50 p-4 text-sm text-yellow-800 border-yellow-200">
                                    <ShieldCheck className="h-4 w-4 inline-block mr-2" />
                                    Ordering with secure payment protection.
                                </div>

                                <div className="flex gap-3">
                                    <button onClick={() => setStep('payment')} className="pk-btn pk-btn-outline px-6">Back</button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="h-fit space-y-4 lg:sticky lg:top-24">
                        <div className="rounded-xl border bg-card p-6 shadow-sm">
                            <h3 className="text-lg font-bold">Order Summary</h3>
                            <div className="mt-4 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Items ({items.length}):</span>
                                    <span>{formatPriceINR(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Delivery:</span>
                                    <span className="text-green-600">FREE</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Tax:</span>
                                    <span>{formatPriceINR(tax)}</span>
                                </div>
                                <div className="my-2 h-px bg-border" />
                                <div className="flex justify-between text-lg font-bold text-primary">
                                    <span>Order Total:</span>
                                    <span>{formatPriceINR(total)}</span>
                                </div>
                            </div>

                            {step === 'review' ? (
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={isLoading}
                                    className="pk-btn pk-btn-primary pk-btn-shine mt-6 w-full text-base font-bold shadow-lg h-12"
                                >
                                    {isLoading ? 'Processing...' : 'Place Your Order'}
                                </button>
                            ) : (
                                <div className="mt-6 rounded-lg bg-muted/50 p-3 text-xs text-center text-muted-foreground">
                                    Complete steps to place order
                                </div>
                            )}
                        </div>

                        <div className="rounded-xl border bg-card p-4 text-xs text-muted-foreground text-center">
                            <p>Returns Policy • Privacy Policy</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
