import { useEffect, useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { productsAPI } from '../../lib/products';
import type { Product } from '../../lib/products';
import { BarChart3, Package, Users, IndianRupee } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SellerDashboard() {
  const { user } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productsAPI.getSellerProducts({ limit: 5 });
        setProducts(response.products);
      } catch (error) {
        console.error('Failed to fetch seller products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const statCards = [
    { title: 'Total Revenue', value: '₹0.00', icon: IndianRupee, change: '+0% from last month' },
    { title: 'Active Products', value: products.length.toString(), icon: Package, change: 'Lifetime total' },
    { title: 'Total Orders', value: '0', icon: BarChart3, change: 'Awaiting first order' },
    { title: 'Store Views', value: '0', icon: Users, change: 'Just started!' },
  ];

  return (
    <div className="pk-container py-12 space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Welcome back, <span className="text-primary">{user?.name}</span>
          </h1>
          <p className="text-muted-foreground">Here's what's happening with your store today.</p>
        </div>
        <Link to="/seller/products/new" className="pk-btn pk-btn-primary pk-btn-shine px-6 py-3">
          <Package className="w-5 h-5" />
          Add New Product
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="pk-glass p-6 rounded-[var(--radius)] flex flex-col justify-between pk-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="flex items-center justify-between text-muted-foreground mb-4">
              <span className="font-medium text-sm">{stat.title}</span>
              <stat.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-xs text-muted-foreground/80">{stat.change}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 pk-section p-8">
          <h2 className="text-2xl font-bold mb-6">Recent Products</h2>
          
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-muted/20 animate-pulse rounded-lg pk-glass" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="pk-glass p-4 rounded-lg flex items-center justify-between hover:bg-muted/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-md bg-muted/30 overflow-hidden relative">
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt={product.name} className="object-cover w-full h-full" />
                      ) : (
                        <Package className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground/30" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">₹{product.price.toFixed(2)} • {product.quantity} in stock</p>
                    </div>
                  </div>
                  <Link to={`/seller/products/edit/${product.id}`} className="pk-btn pk-btn-outline px-4 py-2 text-sm">
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-lg border border-dashed border-border/70 flex flex-col items-center justify-center">
              <Package className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-1">No products yet</h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-sm">
                Get started by adding your first product to your store. It only takes a few minutes!
              </p>
              <Link to="/seller/products/new" className="pk-btn pk-btn-primary px-6 py-2">
                Add Product
              </Link>
            </div>
          )}
          
          {products.length > 0 && (
            <div className="mt-8 pt-6 border-t border-border/50 text-center">
              <Link to="/seller/products" className="text-primary hover:text-brand-4 font-medium inline-flex items-center gap-2 transition-colors">
                View all products
              </Link>
            </div>
          )}
        </div>

        <div className="pk-section p-8">
          <h2 className="text-2xl font-bold mb-6">Store Setup</h2>
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[1.1rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
            {['Complete Profile', 'Add First Product', 'Set up Payments', 'Launch Store'].map((step, i) => (
              <div key={i} className="relative flex items-start gap-6">
                <div className={`w-9 h-9 mt-1 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-md ${i <= 1 ? 'bg-primary text-primary-foreground select-none' : 'bg-card border-2 border-border text-muted-foreground'}`}>
                  {i + 1}
                </div>
                <div>
                  <h4 className={`text-base font-semibold ${i <= 1 ? 'text-foreground' : 'text-muted-foreground'}`}>{step}</h4>
                  <p className="text-sm text-muted-foreground/80 mt-1 line-clamp-2">
                    {i === 0 ? 'Your store profile is set up and looking good.' : i === 1 ? 'Add inventory to start selling.' : 'Pending functionality.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
