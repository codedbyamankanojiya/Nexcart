import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { ordersAPI, type CreateOrderData } from '../lib/orders';
import { mockProducts } from '../data/mockProducts';
import { formatPriceINR } from '../lib/format';
import { CheckCircle2, ChevronRight, CreditCard, MapPin, ShieldCheck, Lock, Plus, Trash2, Edit2, Tag, Truck, Check, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

import type { ElementType } from 'react';

type Step = 'cart' | 'address' | 'delivery' | 'payment' | 'review';

const STEPS: { id: Step; label: string; icon: ElementType }[] = [
  { id: 'cart', label: 'Cart', icon: Tag },
  { id: 'address', label: 'Address', icon: MapPin },
  { id: 'delivery', label: 'Delivery', icon: Truck },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'review', label: 'Review', icon: CheckCircle2 },
];

export default function Checkout() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.setQty);
  const removeItem = useCartStore((s) => s.removeFromCart);
  const clearCart = useCartStore((s) => s.clearCart);

  const [step, setStep] = useState<Step>('cart');
  const [paymentMethod, setPaymentMethod] = useState<string>('upi');
  const [isLoading, setIsLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [, setShowAddressForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(0);

  // Mock saved addresses
  const addresses = [
    { id: 1, name: 'Aman Kumar', phone: '+91 98765 43210', address: '123, Tech Plaza, Sector 62', city: 'Noida', state: 'Uttar Pradesh', pincode: '201301', isDefault: true },
    { id: 2, name: 'Aman Kumar', phone: '+91 99887 66554', address: '456, Software Hub, Tech Park', city: 'Bangalore', state: 'Karnataka', pincode: '560100', isDefault: false },
  ];

  const cartProducts = items.map((item) => ({
    ...mockProducts.find((p) => String(p.id) === item.productId)!,
    quantity: item.quantity,
  })).filter(Boolean);

  const subtotal = cartProducts.reduce((sum, item) => sum + (item?.price ?? 0) * item.quantity, 0);
  const shipping = subtotal >= 999 ? 0 : 49;
  const tax = subtotal * 0.18;
  const discount = couponApplied ? couponDiscount : 0;
  const total = subtotal + shipping + tax - discount;

  const stepIndex = STEPS.findIndex(s => s.id === step);

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'NEXCART20') {
      setCouponApplied(true);
      setCouponDiscount(subtotal * 0.2);
      toast.success('20% discount applied!');
    } else if (couponCode.toUpperCase() === 'FIRST50') {
      setCouponApplied(true);
      setCouponDiscount(50);
      toast.success('â‚¹50 discount applied!');
    } else {
      toast.error('Invalid coupon code');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    setIsLoading(true);
    try {
      // Create order with PENDING status
      const orderData = {
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: addresses.find(a => a.id === selectedAddress),
        paymentMethod,
        totalAmount: total
      };

      const response = await ordersAPI.createOrder(orderData as CreateOrderData);
      
      toast.success('Order created! Please complete payment to confirm');
      console.log('Order created:', response);
      
      // Navigate to payment page or show payment options
      clearCart();
      navigate('/orders');
    } catch (error) {
      console.error('Order creation failed:', error);
      toast.error('Failed to create order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0 && step !== 'review') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-muted/50 via-background to-muted/30 pk-aurora">
        <div className="relative overflow-hidden rounded-3xl border bg-card/90 p-12 text-center shadow-2xl max-w-md pk-glass">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="relative">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-sky-500/20 shadow-xl mb-6">
              <Tag className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Your cart is empty</h2>
            <p className="mt-3 text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
            <Link to="/" className="pk-btn pk-btn-primary pk-btn-shine mt-8 inline-flex h-12 px-8 text-base font-semibold shadow-xl">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
        <div className="pk-container flex h-16 items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-tighter">
            <span className="bg-gradient-to-r from-primary via-sky-500 to-emerald-500 bg-clip-text text-transparent">NexCart</span>
            <span className="text-primary">.</span>
          </Link>
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Lock className="h-4 w-4" />
            Secure Checkout
          </div>
        </div>
      </header>

      <div className="pk-container py-6 max-w-6xl">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 overflow-x-auto pk-no-scrollbar">
          {STEPS.map((s, idx) => {
            const isActive = s.id === step;
            const isCompleted = idx < stepIndex;
            return (
              <div key={s.id} className="flex items-center gap-2 flex-shrink-0">
                <div className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all font-bold text-sm',
                  isCompleted ? 'border-emerald-500 bg-emerald-500 text-white' :
                  isActive ? 'border-primary bg-primary/10 text-primary' :
                  'border-muted-foreground/30 text-muted-foreground/30'
                )}>
                  {isCompleted ? <Check className="h-5 w-5" /> : <s.icon className="h-4 w-4" />}
                </div>
                <span className={cn('text-sm font-medium hidden sm:block', isActive ? 'text-primary' : isCompleted ? 'text-emerald-600' : 'text-muted-foreground')}>
                  {s.label}
                </span>
                {idx < STEPS.length - 1 && (
                  <div className={cn('h-0.5 w-8 sm:w-16 mx-2 rounded-full', idx < stepIndex ? 'bg-emerald-500' : 'bg-muted')} />
                )}
              </div>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          {/* Main Content */}
          <div className="space-y-5">
            {/* Step 1: Cart Review */}
            {step === 'cart' && (
              <div className="pk-section p-5 pk-slide-up">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-bold">Your Cart ({items.length} items)</h2>
                  <Link to="/" className="text-sm font-medium text-primary hover:underline">
                    Continue Shopping
                  </Link>
                </div>

                <div className="space-y-4">
                  {cartProducts.map((item) => (
                    <div key={item.id} className="flex gap-4 rounded-2xl border bg-card/80 p-4 transition-all hover:border-primary/20 pk-glass">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover hover:scale-105 transition-transform cursor-pointer" onClick={() => navigate(`/product/${item.id}`)} />
                      </div>
                      <div className="flex flex-1 flex-col justify-between min-w-0">
                        <div>
                          <div className="text-xs text-muted-foreground font-semibold">{item.category}</div>
                          <h4 className="font-semibold line-clamp-1 cursor-pointer hover:text-primary" onClick={() => navigate(`/product/${item.id}`)}>{item.name}</h4>
                          <div className="mt-1 flex items-center gap-1 text-xs">
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 px-2 py-0.5 font-semibold text-amber-700">
                              â­ {item.rating}
                            </span>
                            <span className="text-muted-foreground">{item.reviews} reviews</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-base font-bold text-primary">{formatPriceINR(item.price * item.quantity)}</span>
                          {item.comparePrice && item.comparePrice > item.price && (
                            <span className="text-xs text-muted-foreground line-through">{formatPriceINR(item.comparePrice)}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <button type="button" onClick={() => removeItem(String(item.id))} className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all">
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <div className="flex items-center gap-1.5">
                          <button type="button" onClick={() => updateQuantity(String(item.id), item.quantity - 1)} className="pk-btn pk-btn-outline h-7 w-7 p-0 flex items-center justify-center text-xs" disabled={item.quantity <= 1}>âˆ’</button>
                          <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                          <button type="button" onClick={() => updateQuantity(String(item.id), item.quantity + 1)} className="pk-btn pk-btn-outline h-7 w-7 p-0 flex items-center justify-center text-xs" disabled={item.quantity >= 5}>+</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button onClick={() => setStep('address')} className="pk-btn pk-btn-primary pk-btn-shine mt-6 w-full h-12 text-base font-bold shadow-lg">
                  Proceed to Address
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Step 2: Address */}
            {step === 'address' && (
              <div className="pk-section p-5 pk-slide-up">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-bold">Select Delivery Address</h2>
                </div>

                <div className="grid gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddress(addr.id)}
                      className={cn(
                        'cursor-pointer rounded-2xl border-2 p-5 transition-all',
                        selectedAddress === addr.id
                          ? 'border-primary bg-primary/5 shadow-md'
                          : 'border-border/50 hover:border-primary/30'
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{addr.name}</span>
                            {addr.isDefault && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">Default</span>}
                          </div>
                          <div className="mt-1 text-sm text-muted-foreground">{addr.address}</div>
                          <div className="mt-0.5 text-sm text-muted-foreground">{addr.city}, {addr.state} - {addr.pincode}</div>
                          <div className="mt-1 text-sm font-medium">Phone: {addr.phone}</div>
                        </div>
                        <div className={cn('h-5 w-5 rounded-full border-2 flex items-center justify-center', selectedAddress === addr.id ? 'border-primary bg-primary' : 'border-muted-foreground/30')}>
                          {selectedAddress === addr.id && <Check className="h-3 w-3 text-white" />}
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => setShowAddressForm(true)}
                    className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border/50 p-5 text-sm font-medium text-muted-foreground hover:border-primary/30 hover:text-primary transition-all"
                  >
                    <Plus className="h-4 w-4" />
                    Add New Address
                  </button>
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep('cart')} className="pk-btn pk-btn-outline px-6 h-11">
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </button>
                  <button onClick={() => setStep('delivery')} className="pk-btn pk-btn-primary pk-btn-shine flex-1 h-11 font-semibold">
                    Continue to Delivery
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Delivery */}
            {step === 'delivery' && (
              <div className="pk-section p-5 pk-slide-up">
                <h2 className="text-xl font-bold mb-5">Delivery Options</h2>
                <div className="space-y-3">
                  <label className={cn(
                    'flex items-center gap-4 rounded-2xl border-2 p-5 cursor-pointer transition-all',
                    'border-primary bg-primary/5'
                  )}>
                    <input type="radio" name="delivery" defaultChecked className="h-5 w-5 accent-primary" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Truck className="h-5 w-5 text-primary" />
                        <span className="font-semibold">Standard Delivery</span>
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">2-4 business days</div>
                    </div>
                    <div className="text-sm font-semibold text-emerald-600">FREE</div>
                  </label>

                  <label className="flex items-center gap-4 rounded-2xl border-2 border-border/50 p-5 cursor-pointer transition-all hover:border-primary/30">
                    <input type="radio" name="delivery" className="h-5 w-5 accent-primary" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Truck className="h-5 w-5 text-sky-500" />
                        <span className="font-semibold">Express Delivery</span>
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">Next business day</div>
                    </div>
                    <div className="text-sm font-semibold">â‚¹99</div>
                  </label>
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep('address')} className="pk-btn pk-btn-outline px-6 h-11">
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </button>
                  <button onClick={() => setStep('payment')} className="pk-btn pk-btn-primary pk-btn-shine flex-1 h-11 font-semibold">
                    Continue to Payment
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Payment */}
            {step === 'payment' && (
              <div className="pk-section p-5 pk-slide-up">
                <h2 className="text-xl font-bold mb-5">Select Payment Method</h2>
                <div className="space-y-3">
                  {[
                    { id: 'upi', label: 'UPI', sub: 'Pay with any UPI app', icon: 'ðŸ’³', badge: 'Fastest' },
                    { id: 'card', label: 'Credit/Debit Card', sub: 'Visa, Mastercard, RuPay', icon: 'ðŸ’³', badge: null },
                    { id: 'nb', label: 'Net Banking', sub: 'All major banks supported', icon: 'ðŸ¦', badge: null },
                    { id: 'cod', label: 'Cash on Delivery', sub: 'Pay when you receive', icon: 'ðŸ’µ', badge: null },
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={cn(
                        'flex items-center gap-4 rounded-2xl border-2 p-5 cursor-pointer transition-all',
                        paymentMethod === method.id
                          ? 'border-primary bg-primary/5 shadow-md'
                          : 'border-border/50 hover:border-primary/30'
                      )}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id)}
                        className="h-5 w-5 accent-primary"
                      />
                      <div className="text-2xl">{method.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{method.label}</span>
                          {method.badge && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">{method.badge}</span>}
                        </div>
                        <div className="mt-0.5 text-sm text-muted-foreground">{method.sub}</div>
                      </div>
                      {paymentMethod === method.id && <Check className="h-5 w-5 text-primary" />}
                    </label>
                  ))}
                </div>

                {/* Coupon Section */}
                <div className="mt-6 rounded-2xl border bg-card/80 p-5 pk-glass">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold">Apply Coupon</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="pk-input flex-1 h-10 text-sm"
                      disabled={couponApplied}
                    />
                    <button
                      type="button"
                      onClick={applyCoupon}
                      disabled={couponApplied || !couponCode.trim()}
                      className="pk-btn pk-btn-primary h-10 px-4 text-sm font-semibold disabled:opacity-50"
                    >
                      {couponApplied ? 'âœ“ Applied' : 'Apply'}
                    </button>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Try: <span className="font-semibold text-primary cursor-pointer" onClick={() => setCouponCode('NEXCART20')}>NEXCART20</span> for 20% off or <span className="font-semibold text-primary cursor-pointer" onClick={() => setCouponCode('FIRST50')}>FIRST50</span> for â‚¹50 off
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep('delivery')} className="pk-btn pk-btn-outline px-6 h-11">
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </button>
                  <button onClick={() => setStep('review')} className="pk-btn pk-btn-primary pk-btn-shine flex-1 h-11 font-semibold">
                    Review Order
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Review */}
            {step === 'review' && (
              <div className="pk-section p-5 pk-slide-up space-y-5">
                <h2 className="text-xl font-bold">Review Your Order</h2>

                {/* Address Summary */}
                <div className="rounded-2xl border bg-card/80 p-4 pk-glass">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-muted-foreground">Delivering to:</span>
                    <button type="button" onClick={() => setStep('address')} className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
                      <Edit2 className="h-3 w-3" /> Change
                    </button>
                  </div>
                  <div className="font-semibold">{addresses.find(a => a.id === selectedAddress)?.name}</div>
                  <div className="text-sm text-muted-foreground mt-0.5">
                    {addresses.find(a => a.id === selectedAddress)?.address}, {addresses.find(a => a.id === selectedAddress)?.city}
                  </div>
                </div>

                {/* Items */}
                <div className="rounded-2xl border bg-card/80 p-4 pk-glass">
                  <div className="text-sm font-semibold text-muted-foreground mb-3">Items ({items.length})</div>
                  <div className="space-y-3">
                    {cartProducts.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="h-14 w-14 overflow-hidden rounded-lg bg-muted flex-shrink-0">
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold line-clamp-1">{item.name}</div>
                          <div className="text-xs text-muted-foreground">Qty: {item.quantity}</div>
                        </div>
                        <div className="text-sm font-bold text-primary">{formatPriceINR(item.price * item.quantity)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Method */}
                <div className="rounded-2xl border bg-card/80 p-4 pk-glass">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold">Payment via:</span>
                    </div>
                    <button type="button" onClick={() => setStep('payment')} className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
                      <Edit2 className="h-3 w-3" /> Change
                    </button>
                  </div>
                  <div className="mt-1 font-semibold capitalize">{paymentMethod === 'nb' ? 'Net Banking' : paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod.toUpperCase()}</div>
                </div>

                {/* Security Note */}
                <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 p-4">
                  <ShieldCheck className="h-6 w-6 text-emerald-600 shrink-0" />
                  <div className="text-sm">
                    <span className="font-semibold text-emerald-700 dark:text-emerald-500">Secure Payment Guarantee</span>
                    <p className="mt-0.5 text-xs text-muted-foreground">Your payment information is encrypted and never stored on our servers.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep('payment')} className="pk-btn pk-btn-outline px-6 h-11">
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isLoading}
                    className="pk-btn pk-btn-primary pk-btn-shine flex-1 h-12 text-base font-bold shadow-xl"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      <>
                        <Lock className="h-4 w-4" />
                        Place Order Â· {formatPriceINR(total)}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="pk-section p-5">
              <h3 className="text-lg font-bold">Order Summary</h3>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                  <span>{formatPriceINR(subtotal)}</span>
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
                <div className="h-px bg-border my-2" />
                <div className="flex justify-between text-lg font-extrabold">
                  <span>Total</span>
                  <span className="text-primary">{formatPriceINR(total)}</span>
                </div>
                {subtotal < 999 && (
                  <div className="rounded-xl bg-gradient-to-r from-primary/10 to-sky-500/10 p-3 text-xs text-center">
                    Add <span className="font-semibold text-primary">â‚¹{999 - subtotal}</span> more to get free shipping!
                  </div>
                )}
              </div>

              {couponApplied && (
                <div className="mt-4 rounded-xl bg-emerald-100/50 border border-emerald-500/20 p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                    <Check className="h-4 w-4" />
                    Coupon applied: -{formatPriceINR(discount)}
                  </div>
                  <button type="button" onClick={() => { setCouponApplied(false); setCouponDiscount(0); }} className="text-xs text-emerald-600 hover:underline">
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Secure Payment Badge */}
            <div className="pk-section p-4 flex items-center justify-center gap-3 text-xs text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>256-bit SSL Encrypted Payment</span>
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}