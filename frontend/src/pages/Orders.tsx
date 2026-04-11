import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Clock, Package, ShoppingBag, X, ChevronRight, MapPin, Truck, PackageCheck, Copy, FileText, RefreshCw, Star, Search } from 'lucide-react';
import { formatPriceINR } from '../lib/format';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

// Mock orders data
const mockOrders = [
    {
        id: 'ORD-7782-3421',
        date: 'Oct 24, 2026',
        status: 'Delivered',
        paymentStatus: 'Paid',
        total: 4499,
        items: [
            { name: 'Wireless Noise Cancelling Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', price: 3999, qty: 1 },
            { name: 'Smart Fitness Band 5', image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=800&q=80', price: 500, qty: 1 },
        ],
        deliveryAddress: '123, Tech Plaza, Sector 62, Noida, UP - 201301',
        trackingNumber: 'TRK18273645',
    },
    {
        id: 'ORD-9921-1102',
        date: 'Sep 15, 2026',
        status: 'Shipped',
        paymentStatus: 'Paid',
        total: 12999,
        items: [
            { name: 'Mechanic Mechanical Keyboard', image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80', price: 12999, qty: 1 },
        ],
        deliveryAddress: '456, Software Hub, Tech Park, Bangalore - 560100',
        trackingNumber: 'TRK99382746',
    },
    {
        id: 'ORD-1102-4432',
        date: 'Aug 05, 2026',
        status: 'Cancelled',
        paymentStatus: 'Refunded',
        total: 899,
        items: [
            { name: 'Minimalist Water Bottle', image: 'https://images.unsplash.com/photo-1602143407151-a111efd40bac?auto=format&fit=crop&w=800&q=80', price: 899, qty: 1 },
        ],
        deliveryAddress: '123, Tech Plaza, Sector 62, Noida, UP - 201301',
        trackingNumber: null,
    },
    {
        id: 'ORD-1103-5521',
        date: 'Nov 02, 2026',
        status: 'Processing',
        paymentStatus: 'Paid',
        total: 2599,
        items: [
            { name: 'Premium Leather Wallet', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80', price: 1599, qty: 1 },
            { name: 'Smart LED Bulb Pack', image: 'https://images.unsplash.com/photo-1587912878453-08e3e7a3c1fa?auto=format&fit=crop&w=800&q=80', price: 1000, qty: 1 },
        ],
        deliveryAddress: '123, Tech Plaza, Sector 62, Noida, UP - 201301',
        trackingNumber: null,
    },
];

function OrderTimeline({ status }: { status: string }) {
    const steps = ['Ordered', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];
    const statusFlow: Record<string, number> = {
        'pending': 0, 'confirmed': 1, 'processing': 2, 'shipped': 3, 'delivered': 4, 'cancelled': -1
    };
    const currentStep = statusFlow[status.toLowerCase()] ?? 0;

    return (
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pk-no-scrollbar">
            {steps.map((step, idx) => {
                const isCompleted = idx <= currentStep;
                const isCurrent = idx === currentStep;
                return (
                    <div key={step} className="flex items-center gap-2 flex-shrink-0">
                        <div className="flex flex-col items-center">
                            <div className={cn(
                                'flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all',
                                isCompleted ? 'border-emerald-500 bg-emerald-500 text-white' :
                                isCurrent ? 'border-primary bg-primary/10 text-primary' :
                                'border-muted-foreground/30 text-muted-foreground/30'
                            )}>
                                {isCompleted ? <Check className="h-4 w-4" /> : idx + 1}
                            </div>
                            <span className={cn('text-[10px] mt-1 font-medium', isCompleted ? 'text-emerald-600' : isCurrent ? 'text-primary' : 'text-muted-foreground')}>
                                {step}
                            </span>
                        </div>
                        {idx < steps.length - 1 && (
                            <div className={cn('h-0.5 w-6 rounded-full', idx < currentStep ? 'bg-emerald-500' : 'bg-muted')} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const map: Record<string, { label: string; className: string; icon: any }> = {
        'delivered': { label: 'Delivered', className: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: PackageCheck },
        'shipped': { label: 'Shipped', className: 'bg-blue-100 text-blue-700 border-blue-200', icon: Truck },
        'processing': { label: 'Processing', className: 'bg-purple-100 text-purple-700 border-purple-200', icon: Package },
        'confirmed': { label: 'Confirmed', className: 'bg-sky-100 text-sky-700 border-sky-200', icon: Check },
        'pending': { label: 'Pending', className: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock },
        'cancelled': { label: 'Cancelled', className: 'bg-red-100 text-red-700 border-red-200', icon: X },
    };
    const config = map[status.toLowerCase()] || map['pending'];
    return (
        <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold', config.className)}>
            <config.icon className="h-3.5 w-3.5" />
            {config.label}
        </span>
    );
}

export default function Orders() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('all');
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredOrders = mockOrders.filter(order => {
        if (filter !== 'all' && order.status.toLowerCase() !== filter) return false;
        if (searchQuery && !order.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const copyOrderId = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success('Order ID copied!');
    };

    return (
        <div className="pk-container py-10">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight md:text-4xl flex items-center gap-3">
                        <Package className="h-8 w-8 text-primary" />
                        My Orders
                    </h1>
                    <p className="mt-2 text-muted-foreground">Track and manage all your orders</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between mb-6 rounded-2xl border bg-card/80 p-4 pk-glass">
                <div className="flex gap-2 overflow-x-auto pk-no-scrollbar">
                    {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={cn(
                                'px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all capitalize',
                                filter === status
                                    ? 'bg-primary text-white shadow-md'
                                    : 'bg-muted/80 text-muted-foreground hover:bg-muted'
                            )}
                        >
                            {status}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search orders..."
                            className="pk-input h-10 w-[200px] pl-10 text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <div className="mx-auto max-w-md">
                    <div className="relative overflow-hidden rounded-3xl border bg-card/90 p-12 text-center shadow-2xl pk-glass">
                        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
                        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl" />
                        <div className="relative">
                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-primary/20 shadow-lg mb-6">
                                <ShoppingBag className="h-10 w-10 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight">No orders found</h2>
                            <p className="mt-3 text-muted-foreground">
                                {filter !== 'all' ? `You don't have any ${filter} orders.` : "When you place an order, it will appear here."}
                            </p>
                            <Link
                                to="/"
                                className="pk-btn pk-btn-primary pk-btn-shine mt-8 inline-flex h-12 px-8 text-base font-semibold shadow-xl"
                            >
                                <Package className="h-5 w-5" />
                                Start Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map((order, idx) => (
                        <div
                            key={order.id}
                            style={{ animationDelay: `${idx * 80}ms` }}
                            className="pk-section overflow-hidden pk-slide-up"
                        >
                            {/* Order Header */}
                            <div
                                className="flex flex-wrap items-center justify-between gap-4 border-b border-border/50 bg-gradient-to-r from-muted/60 to-muted/40 p-5 cursor-pointer hover:bg-muted/70 transition-colors"
                                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                            >
                                <div className="flex flex-wrap gap-x-8 gap-y-3">
                                    <div>
                                        <span className="block text-xs font-medium text-muted-foreground">Order ID</span>
                                        <div className="mt-0.5 flex items-center gap-2 font-bold">
                                            <span className="text-primary">{order.id}</span>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); copyOrderId(order.id); }}
                                                className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                                            >
                                                <Copy className="h-3 w-3" />
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="block text-xs font-medium text-muted-foreground">Date Placed</span>
                                        <div className="mt-0.5 font-semibold">{order.date}</div>
                                    </div>
                                    <div>
                                        <span className="block text-xs font-medium text-muted-foreground">Total Amount</span>
                                        <div className="mt-0.5 font-bold text-primary text-lg">{formatPriceINR(order.total)}</div>
                                    </div>
                                    <div>
                                        <span className="block text-xs font-medium text-muted-foreground">Status</span>
                                        <div className="mt-1">
                                            <StatusBadge status={order.status} />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button className="pk-btn pk-btn-outline h-9 px-4 text-sm font-medium shadow-sm flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        Invoice
                                    </button>
                                    {order.status !== 'Cancelled' && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); toast.info('Reorder feature coming soon!'); }}
                                            className="pk-btn pk-btn-outline h-9 px-4 text-sm font-medium shadow-sm flex items-center gap-2"
                                        >
                                            <RefreshCw className="h-4 w-4" />
                                            Reorder
                                        </button>
                                    )}
                                    <ChevronRight className={cn('h-5 w-5 text-muted-foreground transition-transform', expandedOrder === order.id && 'rotate-90')} />
                                </div>
                            </div>

                            {/* Expanded Content */}
                            {expandedOrder === order.id && (
                                <div className="p-5 space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                                    {/* Timeline for non-cancelled orders */}
                                    {order.status !== 'Cancelled' && order.status !== 'Cancelled' && (
                                        <OrderTimeline status={order.status} />
                                    )}

                                    {/* Order Items */}
                                    <div>
                                        <h4 className="text-sm font-semibold text-muted-foreground mb-3">Items in this order</h4>
                                        <div className="space-y-3">
                                            {order.items.map((item, itemIdx) => (
                                                <div key={itemIdx} className="flex items-center gap-4 rounded-xl border bg-card/50 p-4 transition-all hover:bg-card/80">
                                                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
                                                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-semibold line-clamp-1">{item.name}</div>
                                                        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                                                            <span>Qty: {item.qty}</span>
                                                            <span>·</span>
                                                            <span className="font-semibold text-foreground">{formatPriceINR(item.price)}</span>
                                                        </div>
                                                    </div>
                                                    {order.status === 'Delivered' && (
                                                        <button
                                                            onClick={() => { navigate(`/product/1`); }}
                                                            className="pk-btn pk-btn-outline h-9 px-4 text-xs font-medium flex items-center gap-1.5"
                                                        >
                                                            <Star className="h-3.5 w-3.5" />
                                                            Write Review
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Delivery Info */}
                                    <div className="rounded-xl border bg-card/50 p-4 grid gap-4 sm:grid-cols-2">
                                        <div className="flex items-start gap-3">
                                            <MapPin className="h-5 w-5 text-primary mt-0.5" />
                                            <div>
                                                <div className="text-sm font-semibold">Delivery Address</div>
                                                <div className="mt-1 text-sm text-muted-foreground">{order.deliveryAddress}</div>
                                            </div>
                                        </div>
                                        {order.trackingNumber && (
                                            <div className="flex items-start gap-3">
                                                <Truck className="h-5 w-5 text-primary mt-0.5" />
                                                <div>
                                                    <div className="text-sm font-semibold">Tracking ID</div>
                                                    <div className="mt-1 flex items-center gap-2">
                                                        <span className="text-sm font-mono text-primary">{order.trackingNumber}</span>
                                                        <button
                                                            onClick={() => { navigator.clipboard.writeText(order.trackingNumber!); toast.success('Tracking ID copied!'); }}
                                                            className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-muted transition-all"
                                                        >
                                                            <Copy className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Payment Status */}
                                    <div className="flex items-center justify-between rounded-xl border bg-gradient-to-r from-emerald-500/5 to-teal-500/5 p-4">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                'flex h-10 w-10 items-center justify-center rounded-full',
                                                order.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                                            )}>
                                                {order.paymentStatus === 'Paid' ? <Check className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold">Payment Status</div>
                                                <div className="text-xs text-muted-foreground">{order.paymentStatus === 'Paid' ? 'Payment received' : 'Payment pending'}</div>
                                            </div>
                                        </div>
                                        <div className="text-sm font-semibold text-muted-foreground">
                                            Paid via Card ****4242
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-wrap gap-3">
                                        {order.status === 'Delivered' && (
                                            <button
                                                className="pk-btn pk-btn-outline h-10 px-5 text-sm font-medium"
                                                onClick={() => toast.info('Return request feature coming soon!')}
                                            >
                                                <RefreshCw className="h-4 w-4" />
                                                Request Return/Exchange
                                            </button>
                                        )}
                                        <button
                                            className="pk-btn pk-btn-ghost h-10 px-5 text-sm font-medium text-muted-foreground"
                                            onClick={() => toast.info('Help center coming soon!')}
                                        >
                                            Need Help?
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}