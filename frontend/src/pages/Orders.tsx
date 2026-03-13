import { Link } from 'react-router-dom';
import { Check, Clock, Package, ShoppingBag, X } from 'lucide-react';
import { formatPriceINR } from '../lib/format';

// Mock data for orders
const mockOrders = [
    {
        id: 'ORD-7782-3421',
        date: 'Oct 24, 2023',
        status: 'Delivered',
        total: 4499,
        items: [
            { name: 'Wireless Noise Cancelling Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80' },
            { name: 'Smart Fitness Band 5', image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=800&q=80' },
        ]
    },
    {
        id: 'ORD-9921-1102',
        date: 'Sep 12, 2023',
        status: 'Delivered',
        total: 12999,
        items: [
            { name: 'Mechanic Mechanical Keyboard', image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80' },
        ]
    },
    {
        id: 'ORD-1102-4432',
        date: 'Aug 05, 2023',
        status: 'Cancelled',
        total: 899,
        items: [
            { name: 'Minimalist Water Bottle', image: 'https://images.unsplash.com/photo-1602143407151-a111efd40bac?auto=format&fit=crop&w=800&q=80' },
        ]
    }
];

export default function Orders() {
    return (
        <div className="pk-container py-12">
            <div className="flex items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight md:text-4xl">My Orders</h1>
                    <p className="mt-2 text-muted-foreground">Track and manage your recent orders.</p>
                </div>
            </div>

            <div className="mt-8 grid gap-6">
                {mockOrders.length === 0 ? (
                    <div className="mx-auto max-w-md">
                        <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-card/95 to-card/70 p-12 text-center shadow-2xl backdrop-blur pk-glass">
                            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
                            <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl" />

                            <div className="relative">
                                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-primary/20 shadow-lg">
                                    <ShoppingBag className="h-10 w-10 text-primary" />
                                </div>
                                <h2 className="mt-6 text-2xl font-bold tracking-tight">No orders yet</h2>
                                <p className="mt-3 text-muted-foreground">When you place an order, it will appear here.</p>
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
                    mockOrders.map((order) => (
                        <div key={order.id} className="overflow-hidden rounded-2xl border border-border/50 bg-card/90 shadow-lg backdrop-blur transition-all duration-300 hover:shadow-xl pk-glass">
                            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/50 bg-gradient-to-r from-muted/60 to-muted/40 p-5 text-sm">
                                <div className="flex flex-wrap gap-x-8 gap-y-3">
                                    <div>
                                        <span className="block text-xs font-medium text-muted-foreground">Order ID</span>
                                        <div className="mt-1 font-bold">{order.id}</div>
                                    </div>
                                    <div>
                                        <span className="block text-xs font-medium text-muted-foreground">Date Placed</span>
                                        <div className="mt-1 font-bold">{order.date}</div>
                                    </div>
                                    <div>
                                        <span className="block text-xs font-medium text-muted-foreground">Total Amount</span>
                                        <div className="mt-1 font-bold text-primary">{formatPriceINR(order.total)}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Link to={`/orders/${order.id}`} className="pk-btn pk-btn-outline h-9 px-4 text-xs font-medium shadow-sm">
                                        View Invoice
                                    </Link>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="mb-5 flex items-center gap-2 text-sm font-bold">
                                    {order.status === 'Delivered' ? (
                                        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-4 py-2 text-emerald-600 shadow-sm">
                                            <Check className="h-4 w-4" />
                                            Delivered on {order.date}
                                        </span>
                                    ) : order.status === 'Cancelled' ? (
                                        <span className="inline-flex items-center gap-2 rounded-full bg-destructive/15 px-4 py-2 text-destructive shadow-sm">
                                            <X className="h-4 w-4" />
                                            Cancelled
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-2 rounded-full bg-sky-500/15 px-4 py-2 text-sky-600 shadow-sm">
                                            <Clock className="h-4 w-4" />
                                            In Transit
                                        </span>
                                    )}
                                </div>

                                <div className="grid gap-4">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4 rounded-xl border border-border/30 bg-muted/30 p-4 transition-colors hover:bg-muted/50">
                                            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-border/50 bg-muted shadow-sm">
                                                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="font-semibold">{item.name}</div>
                                                <div className="mt-1.5 text-sm text-muted-foreground">Qty: 1</div>
                                            </div>
                                            <Link to={`/product/1`} className="pk-btn pk-btn-ghost text-xs font-medium text-primary hover:underline">
                                                Write a review
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
