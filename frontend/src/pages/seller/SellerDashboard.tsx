import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { productsAPI } from '../../lib/products';
import {
  Package, Users, IndianRupee, TrendingUp, Eye, ShoppingCart,
  Star, ArrowUpRight, ArrowDownRight, ChevronRight, Menu, X, Bell, Settings, LogOut,
  Plus, Edit2, Trash2, ExternalLink, DollarSign, CreditCard, Clock, CheckCircle2,
  PackageCheck, Truck, BarChart2, PieChart, Activity, RefreshCw
} from 'lucide-react';
import { formatPriceINR } from '../../lib/format';
import { cn } from '../../lib/utils';

// Simple inline chart components (no external dependency)
function SimpleBarChart({ data, height = 200 }: { data: { label: string; value: number }[]; height?: number }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-2 h-full">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t-md bg-gradient-to-t from-primary to-sky-400 transition-all duration-700"
            style={{ height: `${(d.value / max) * (height - 40)}px` }}
          />
          <span className="text-[10px] text-muted-foreground truncate max-w-full">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function SimpleLineChart({ data }: { data: { label: string; value: number }[]; height?: number }) {
  const max = Math.max(...data.map(d => d.value), 1);
  const min = Math.min(...data.map(d => d.value), 0);
  const range = max - min || 1;
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d.value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');
  return (
    <div className="relative h-full">
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(217, 92%, 56%)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(217, 92%, 56%)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon
          points={`0,100 ${points} 100,100`}
          fill="url(#lineGrad)"
        />
        <polyline
          points={points}
          fill="none"
          stroke="hsl(217, 92%, 56%)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-muted-foreground">
        {data.map((d, i) => i % Math.ceil(data.length / 5) === 0 && (
          <span key={i}>{d.label}</span>
        ))}
      </div>
    </div>
  );
}

function DonutChart({ data, size = 120 }: { data: { label: string; value: number; color: string }[]; size?: number }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const strokes = data.map((d, index) => {
    const accumulated = data.slice(0, index).reduce((sum, item) => sum + item.value, 0);
    const start = (accumulated / total) * 100;
    const end = ((accumulated + d.value) / total) * 100;
    const startAngle = (start / 100) * 360;
    const endAngle = (end / 100) * 360;
    const x1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
    const y1 = 50 - 40 * Math.cos((startAngle * Math.PI) / 180);
    const x2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);
    const y2 = 50 - 40 * Math.cos((endAngle * Math.PI) / 180);
    const large = endAngle - startAngle > 180 ? 1 : 0;
    return <path key={d.label} d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${large} 1 ${x2} ${y2} Z`} fill={d.color} />;
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="12" />
        {strokes}
        <circle cx="50" cy="50" r="28" fill="hsl(var(--card))" />
      </svg>
      <div className="flex flex-wrap gap-3 justify-center">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-1.5 text-xs">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-muted-foreground">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, change, changeType, icon: Icon, color }: {
  title: string; value: string; change?: string; changeType?: 'up' | 'down'; icon: any; color: string
}) {
  return (
    <div className="pk-section p-5 pk-hover-lift transition-all">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-medium text-muted-foreground">{title}</div>
          <div className="mt-2 text-2xl font-bold">{value}</div>
          {change && (
            <div className={cn(
              'mt-1 flex items-center gap-1 text-xs font-semibold',
              changeType === 'up' ? 'text-emerald-600' : 'text-red-500'
            )}>
              {changeType === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {change}
            </div>
          )}
        </div>
        <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', color)}>
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </div>
  );
}

// Order Status Badge
function OrderStatusBadge({ status }: { status: string }) {
  const map: Record<string, { color: string; icon: any }> = {
    'pending': { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock },
    'confirmed': { color: 'bg-sky-100 text-sky-700 border-sky-200', icon: CheckCircle2 },
    'processing': { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Activity },
    'shipped': { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Truck },
    'delivered': { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: PackageCheck },
    'cancelled': { color: 'bg-red-100 text-red-700 border-red-200', icon: X },
  };
  const config = map[status.toLowerCase()] || map['pending'];
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold', config.color)}>
      <config.icon className="h-3 w-3" />
      {status}
    </span>
  );
}

export default function SellerDashboard() {
  const { user } = useAuthStore();
  const [products, setProducts] = useState<any[]>([]);
  const [, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock analytics data
  const analytics = {
    totalRevenue: 284592,
    revenueChange: 12.5,
    totalOrders: 156,
    ordersChange: 8.2,
    totalProducts: products.length || 12,
    views: 8432,
    conversionRate: 3.4,
  };

  const revenueData = [
    { label: 'Mon', value: 12000 },
    { label: 'Tue', value: 18500 },
    { label: 'Wed', value: 15200 },
    { label: 'Thu', value: 22000 },
    { label: 'Fri', value: 28000 },
    { label: 'Sat', value: 35000 },
    { label: 'Sun', value: 31000 },
  ];

  const ordersData = [
    { label: 'Jan', value: 45 },
    { label: 'Feb', value: 62 },
    { label: 'Mar', value: 58 },
    { label: 'Apr', value: 71 },
    { label: 'May', value: 83 },
    { label: 'Jun', value: 96 },
  ];

  const categoryData = [
    { label: 'Electronics', value: 45, color: 'hsl(217, 92%, 56%)' },
    { label: 'Fashion', value: 30, color: 'hsl(162, 76%, 42%)' },
    { label: 'Home', value: 15, color: 'hsl(22, 92%, 58%)' },
    { label: 'Other', value: 10, color: 'hsl(270, 70%, 60%)' },
  ];

  const recentOrders = [
    { id: 'ORD-7782', customer: 'Rahul S.', total: 4499, status: 'delivered', date: '2 hours ago', items: 2 },
    { id: 'ORD-7781', customer: 'Priya M.', total: 12999, status: 'shipped', date: '5 hours ago', items: 1 },
    { id: 'ORD-7780', customer: 'Vikram K.', total: 2199, status: 'processing', date: '1 day ago', items: 3 },
    { id: 'ORD-7779', customer: 'Anita R.', total: 899, status: 'confirmed', date: '1 day ago', items: 1 },
    { id: 'ORD-7778', customer: 'Suresh P.', total: 5499, status: 'pending', date: '2 days ago', items: 2 },
  ];

  const topProducts = [
    { name: 'Wireless Headphones Pro', sales: 234, revenue: 112698, trend: 15 },
    { name: 'Smart Watch Ultra', sales: 189, revenue: 94500, trend: 12 },
    { name: 'Mechanical Keyboard RGB', sales: 156, revenue: 78000, trend: -5 },
    { name: 'USB-C Hub 7-in-1', sales: 143, revenue: 42900, trend: 8 },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productsAPI.getSellerProducts({ limit: 20 });
        setProducts(response.products || []);
      } catch (error) {
        // use mock products
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart2 },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/20">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="pk-btn pk-btn-outline h-10 w-10 p-0 lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>
            <Link to="/" className="text-xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-sky-500 to-emerald-500 bg-clip-text text-transparent">PopKart</span>
              <span className="text-primary">.</span>
              <span className="ml-1 text-sm text-muted-foreground font-normal">Seller Hub</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className="pk-btn pk-btn-outline h-10 w-10 relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">3</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-emerald-500 text-white text-sm font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || 'S'}
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-semibold">{user?.name || 'Seller'}</div>
                <div className="text-xs text-muted-foreground">Store Owner</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto lg:h-[calc(100vh-64px)] lg:sticky lg:top-16',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}>
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between p-4 border-b lg:hidden">
              <span className="font-bold">Menu</span>
              <button type="button" onClick={() => setSidebarOpen(false)} className="pk-btn pk-btn-ghost h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all',
                    activeTab === tab.id
                      ? 'bg-primary/10 text-primary shadow-sm'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <tab.icon className="h-5 w-5" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="border-t p-4 space-y-2">
              <button type="button" className="pk-btn pk-btn-outline w-full h-10 text-sm justify-start">
                <ExternalLink className="h-4 w-4" />
                View Store
              </button>
              <button
                type="button"
                onClick={() => { /* logout */ }}
                className="pk-btn pk-btn-ghost w-full h-10 text-sm justify-start text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-400">
              {/* Welcome Banner */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-sky-600 to-emerald-500 p-6 text-white shadow-2xl">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                <div className="relative">
                  <div className="text-sm font-medium opacity-80">Seller Dashboard</div>
                  <h2 className="mt-1 text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0] || 'Seller'}! 👋</h2>
                  <p className="mt-2 text-sm opacity-80">Your store is performing well. Keep it up!</p>
                  <div className="mt-5 flex gap-3">
                    <Link to="/seller/products/new" className="flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2.5 text-sm font-semibold backdrop-blur-sm transition-all hover:bg-white/30">
                      <Plus className="h-4 w-4" />
                      Add Product
                    </Link>
                    <Link to="/seller/products" className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-white/90">
                      Manage Products
                    </Link>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <StatCard
                  title="Total Revenue"
                  value={formatPriceINR(analytics.totalRevenue)}
                  change="+12.5% vs last month"
                  changeType="up"
                  icon={IndianRupee}
                  color="bg-gradient-to-br from-primary/15 to-sky-500/15"
                />
                <StatCard
                  title="Total Orders"
                  value={analytics.totalOrders.toString()}
                  change="+8.2% vs last month"
                  changeType="up"
                  icon={ShoppingCart}
                  color="bg-gradient-to-br from-emerald-500/15 to-teal-500/15"
                />
                <StatCard
                  title="Store Views"
                  value={analytics.views.toLocaleString()}
                  change="+15.3% vs last month"
                  changeType="up"
                  icon={Eye}
                  color="bg-gradient-to-br from-purple-500/15 to-pink-500/15"
                />
                <StatCard
                  title="Conversion"
                  value={`${analytics.conversionRate}%`}
                  change="-0.2% vs last month"
                  changeType="down"
                  icon={TrendingUp}
                  color="bg-gradient-to-br from-orange-500/15 to-red-500/15"
                />
              </div>

              {/* Charts Row */}
              <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
                {/* Revenue Chart */}
                <div className="pk-section p-5">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-lg font-bold">Revenue Overview</h3>
                      <p className="text-sm text-muted-foreground">Last 7 days performance</p>
                    </div>
                    <div className="flex gap-2">
                      {['Week', 'Month', 'Year'].map((period) => (
                        <button key={period} type="button" className={cn(
                          'px-3 py-1.5 text-xs font-semibold rounded-lg transition-all',
                          period === 'Week' ? 'bg-primary text-white' : 'bg-muted/80 text-muted-foreground hover:bg-muted'
                        )}>
                          {period}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="h-[200px]">
                    <SimpleBarChart data={revenueData} />
                  </div>
                </div>

                {/* Category Distribution */}
                <div className="pk-section p-5">
                  <h3 className="text-lg font-bold mb-4">Sales by Category</h3>
                  <DonutChart data={categoryData} />
                </div>
              </div>

              {/* Recent Orders */}
              <div className="pk-section p-5">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-lg font-bold">Recent Orders</h3>
                    <p className="text-sm text-muted-foreground">Latest customer purchases</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    className="pk-btn pk-btn-ghost h-9 px-3 text-sm text-primary"
                  >
                    View All
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2 font-semibold text-muted-foreground">Order ID</th>
                        <th className="text-left py-3 px-2 font-semibold text-muted-foreground">Customer</th>
                        <th className="text-left py-3 px-2 font-semibold text-muted-foreground">Items</th>
                        <th className="text-left py-3 px-2 font-semibold text-muted-foreground">Total</th>
                        <th className="text-left py-3 px-2 font-semibold text-muted-foreground">Status</th>
                        <th className="text-left py-3 px-2 font-semibold text-muted-foreground">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-b hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-2 font-semibold text-primary">{order.id}</td>
                          <td className="py-3 px-2">{order.customer}</td>
                          <td className="py-3 px-2 text-muted-foreground">{order.items}</td>
                          <td className="py-3 px-2 font-semibold">{formatPriceINR(order.total)}</td>
                          <td className="py-3 px-2"><OrderStatusBadge status={order.status} /></td>
                          <td className="py-3 px-2 text-muted-foreground">{order.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top Products */}
              <div className="pk-section p-5">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-lg font-bold">Top Selling Products</h3>
                    <p className="text-sm text-muted-foreground">Best performers this month</p>
                  </div>
                  <Link to="/seller/products" className="pk-btn pk-btn-ghost h-9 px-3 text-sm text-primary">
                    Manage
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="space-y-4">
                  {topProducts.map((product, idx) => (
                    <div key={product.name} className="flex items-center gap-4 rounded-xl border bg-card/80 p-4 transition-all hover:border-primary/20 pk-glass">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-sky-500/15 text-lg font-bold text-primary">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate">{product.name}</div>
                        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{product.sales} sold</span>
                          <span>·</span>
                          <span className="font-semibold text-primary">{formatPriceINR(product.revenue)}</span>
                        </div>
                      </div>
                      <div className={cn(
                        'flex items-center gap-1 text-xs font-semibold',
                        product.trend > 0 ? 'text-emerald-600' : 'text-red-500'
                      )}>
                        {product.trend > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {Math.abs(product.trend)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-400">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Orders</h2>
                  <p className="text-muted-foreground">Manage and track your orders</p>
                </div>
                <div className="flex gap-2">
                  <select className="pk-select h-10 w-[160px]">
                    <option>All Status</option>
                    <option>Pending</option>
                    <option>Confirmed</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="pk-section p-5">
                <div className="grid gap-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between rounded-2xl border bg-card/80 p-5 transition-all hover:border-primary/20 pk-glass">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                          <Package className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold">{order.id}</div>
                          <div className="mt-0.5 text-sm text-muted-foreground">{order.customer} · {order.items} items</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="font-bold text-primary">{formatPriceINR(order.total)}</div>
                          <div className="text-xs text-muted-foreground">{order.date}</div>
                        </div>
                        <OrderStatusBadge status={order.status} />
                        <button type="button" className="pk-btn pk-btn-outline h-9 px-4 text-sm">
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-400">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Products</h2>
                  <p className="text-muted-foreground">Manage your product inventory</p>
                </div>
                <Link to="/seller/products/new" className="pk-btn pk-btn-primary pk-btn-shine h-11 px-5">
                  <Plus className="h-5 w-5" />
                  Add Product
                </Link>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { name: 'Wireless Headphones Pro', price: 2499, stock: 45, status: 'active', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80' },
                  { name: 'Smart Watch Ultra', price: 4999, stock: 28, status: 'active', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80' },
                  { name: 'Mechanical Keyboard RGB', price: 3999, stock: 12, status: 'low', image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=400&q=80' },
                  { name: 'USB-C Hub 7-in-1', price: 1999, stock: 0, status: 'out', image: 'https://images.unsplash.com/photo-1625723044792-44de16ccb4e2?w=400&q=80' },
                ].map((product) => (
                  <div key={product.name} className="pk-section p-4 pk-hover-lift transition-all">
                    <div className="aspect-[16/10] overflow-hidden rounded-xl bg-muted mb-4">
                      <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold line-clamp-1">{product.name}</h4>
                        <div className="mt-1 text-lg font-bold text-primary">{formatPriceINR(product.price)}</div>
                        <div className={cn(
                          'mt-1 text-xs font-semibold',
                          product.stock === 0 ? 'text-destructive' : product.stock < 15 ? 'text-orange-500' : 'text-emerald-600'
                        )}>
                          {product.stock === 0 ? 'Out of Stock' : product.stock < 15 ? `Low Stock (${product.stock})` : `In Stock (${product.stock})`}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button className="pk-btn pk-btn-outline h-8 w-8 p-0"><Edit2 className="h-3.5 w-3.5" /></button>
                        <button className="pk-btn pk-btn-outline h-8 w-8 p-0 text-destructive hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center">
                <Link to="/seller/products" className="pk-btn pk-btn-outline h-10 px-6">
                  View All Products
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-400">
              <div>
                <h2 className="text-2xl font-bold">Analytics</h2>
                <p className="text-muted-foreground">Deep dive into your store performance</p>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="pk-section p-5">
                  <h3 className="text-lg font-bold mb-4">Orders Trend</h3>
                  <div className="h-[200px]">
                    <SimpleLineChart data={ordersData} />
                  </div>
                </div>

                <div className="pk-section p-5">
                  <h3 className="text-lg font-bold mb-4">Revenue by Month</h3>
                  <div className="h-[200px]">
                    <SimpleBarChart data={ordersData.map((d) => ({ label: d.label, value: d.value * 150 }))} />
                  </div>
                </div>
              </div>

              <div className="pk-section p-5">
                <h3 className="text-lg font-bold mb-4">Performance Metrics</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { label: 'Avg Order Value', value: '₹1,824', icon: DollarSign },
                    { label: 'Return Rate', value: '2.3%', icon: RefreshCw },
                    { label: 'Customer Retention', value: '68%', icon: Users },
                    { label: 'Review Rating', value: '4.6★', icon: Star },
                    { label: 'Page Views', value: '12.4K', icon: Eye },
                    { label: 'Add to Cart Rate', value: '8.2%', icon: ShoppingCart },
                  ].map((metric) => (
                    <div key={metric.label} className="rounded-2xl border bg-card/80 p-4 text-center pk-glass">
                      <metric.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                      <div className="text-xl font-bold">{metric.value}</div>
                      <div className="text-xs text-muted-foreground mt-1">{metric.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-400">
              <div>
                <h2 className="text-2xl font-bold">Store Settings</h2>
                <p className="text-muted-foreground">Manage your store configuration</p>
              </div>

              <div className="pk-section p-5">
                <h3 className="text-lg font-bold mb-4">Store Information</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Store Name</label>
                    <input type="text" defaultValue="PopKart Store" className="pk-input" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Business Email</label>
                    <input type="email" defaultValue={user?.email || ''} className="pk-input" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Phone</label>
                    <input type="tel" defaultValue="+91 98765 43210" className="pk-input" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">GST Number</label>
                    <input type="text" placeholder="Enter GST Number" className="pk-input" />
                  </div>
                </div>
                <button className="pk-btn pk-btn-primary pk-btn-shine mt-6 h-11 px-6">
                  Save Changes
                </button>
              </div>

              <div className="pk-section p-5">
                <h3 className="text-lg font-bold mb-4">Payment Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-xl border p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <CreditCard className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold">Razorpay</div>
                        <div className="text-xs text-muted-foreground">Accept all payment methods</div>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Connected</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}