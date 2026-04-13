import { useEffect, useState } from 'react';
import { productsAPI } from '../../lib/products';
import type { Product } from '../../lib/products';
import { Package, Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function SellerProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await productsAPI.getSellerProducts({ limit: 50 });
      setProducts(response.products);
    } catch (error) {
      console.error('Failed to fetch seller products:', error);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await productsAPI.deleteProduct(id);
      toast.success('Product deleted successfully');
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const filteredProducts = products.filter(p => 
    (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.sku || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pk-container py-12 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Products</h1>
          <p className="text-muted-foreground mt-1">Manage your store's inventory and listings.</p>
        </div>
        <Link to="/seller/products/new" className="pk-btn pk-btn-primary pk-btn-shine px-6 py-3">
          <Plus className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      <div className="pk-glass rounded-[var(--radius)] overflow-hidden">
        <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row gap-4 justify-between bg-card/40">
          <div className="relative max-w-sm w-full">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              className="pk-input w-full pl-10 bg-background/50 border-border/60" 
              placeholder="Search products by name or SKU..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="text-sm text-muted-foreground flex items-center px-2">
            Showing {filteredProducts.length} product(s)
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/40 text-sm font-medium text-muted-foreground bg-muted/10">
                <th className="p-4 pl-6">Product</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">Loading products...</td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-muted-foreground">
                    <Package className="w-12 h-12 mx-auto mb-4 opacity-40" />
                    <span className="block text-lg font-medium text-foreground mb-1">No products found</span>
                    <span className="text-sm">Try adjusting your search or add a new product</span>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-border/20 hover:bg-muted/5 transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-muted/20 overflow-hidden flex-shrink-0">
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground/30"><Package size={20} /></div>
                          )}
                        </div>
                        <div className="font-medium max-w-[200px] truncate">{product.name}</div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{product.sku}</td>
                    <td className="p-4 font-medium">₹{product.price.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${(product.quantity || 0) > 10 ? 'bg-emerald-500/10 text-emerald-500' : (product.quantity || 0) > 0 ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'}`}>
                        {product.quantity || 0} in stock
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.status === 'ACTIVE' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link to={`/seller/products/edit/${product.id}`} className="p-2 text-muted-foreground hover:text-primary transition-colors hover:bg-primary/10 rounded-md">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(String(product.id))} className="p-2 text-muted-foreground hover:text-destructive transition-colors hover:bg-destructive/10 rounded-md">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
