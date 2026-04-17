import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Clock, Package, ShoppingBag, X, ChevronRight, MapPin, Truck, PackageCheck, Copy, FileText, RefreshCw, Star, Search } from 'lucide-react';
import { formatPriceINR } from '../lib/format';
import { cn } from '../lib/utils';
import { ordersAPI, type Order as OrderType } from '../lib/orders';
import { motion } from 'framer-motion';
import CinematicProductBackground from '../components/products/CinematicProductBackground';

interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  qty: number;
}

interface Order extends OrderType {
  date: string;
  total: number;
  deliveryAddress: string;
  trackingNumber: string | null;
}

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const ordersData = await ordersAPI.getOrders();
      // Transform API data to match our interface
      const transformedOrders = ordersData.map((order: any) => ({
        ...order,
        date: new Date(order.createdAt).toLocaleDateString(),
        total: order.totalAmount,
        deliveryAddress: String(order.shippingAddress || ''),
        trackingNumber: order.status === 'SHIPPED' ? 'TRK' + order.id.slice(-8) : null,
        items: order.items.map((item: any) => ({
          id: String(item.id || ''),
          name: String(item.name || ''),
          image: String(item.image || ''),
          price: Number(item.price || 0),
          qty: Number(item.quantity || 1)
        }))
      }));
      setOrders(transformedOrders);
    } catch (error) {
      console.error('Failed to load orders:', error);
      // Don't show error toast, just set empty orders
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pk-container py-6">
      <CinematicProductBackground category="default" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Header */}
        <motion.div
          className="pk-section p-6 mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
            <p className="text-muted-foreground">Track and manage your orders</p>
          </div>
        </motion.div>

        {/* Orders List */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="pk-section p-12 text-center">
              <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
              <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
              <Link to="/" className="pk-btn pk-btn-primary">
                Start Shopping
              </Link>
            </div>
          ) : (
            orders.map((order) => (
              <motion.div
                key={order.id}
                className="pk-section p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">Order {order.id}</h3>
                    <p className="text-sm text-muted-foreground">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <div className={cn(
                      'inline-flex px-3 py-1 rounded-full text-xs font-medium',
                      order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' :
                      order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    )}>
                      {order.status}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{formatPriceINR(order.total)}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg object-cover" />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">Qty: {item.qty} × {formatPriceINR(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {order.trackingNumber && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">Tracking: {order.trackingNumber}</p>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
