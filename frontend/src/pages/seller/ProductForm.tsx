import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productsAPI } from '../../lib/products';
import type { Product } from '../../lib/products';
import { uploadAPI } from '../../lib/upload';
import { toast } from 'sonner';
import { Save, ArrowLeft, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import api from '../../lib/api';

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    comparePrice: 0,
    sku: '',
    quantity: 0,
    status: 'ACTIVE',
    images: [],
    categoryId: '',
  });

  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    // Fetch categories
    api.get('/api/categories').then(res => {
      setCategories(res.data);
      if (!isEditing && res.data.length > 0) {
        setFormData(prev => ({ ...prev, categoryId: res.data[0].id }));
      }
    }).catch(() => console.error("Categories fetch error"));

    if (isEditing && id) {
      productsAPI.getProduct(id).then(res => {
        const data = res as unknown as { product?: Product };
        setFormData((data.product || res) as Partial<Product>);
      }).catch(() => {
        toast.error('Failed to load product');
        navigate('/seller/products');
      }).finally(() => {
        setIsLoading(false);
      });
    }
  }, [id, isEditing, navigate]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await uploadAPI.uploadImage(file);
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), res.url]
      }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image. Max size is 5MB.');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.categoryId || !formData.sku) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && id) {
        await productsAPI.updateProduct(id, formData);
        toast.success('Product updated successfully');
      } else {
        await productsAPI.createProduct(formData);
        toast.success('Product created successfully');
      }
      navigate('/seller/products');
    } catch (err) {
      const error = err as { response?: { data?: { error?: Array<{ message: string }> | string } } };
      const apiError = error.response?.data?.error;
      const message = Array.isArray(apiError) ? apiError[0]?.message : apiError;
      toast.error(message || 'Failed to save product');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="py-20 text-center text-muted-foreground flex flex-col items-center"><Loader2 className="animate-spin w-8 h-8 mb-4 opacity-50 text-primary" /> Loading product details...</div>;

  return (
    <div className="pk-container py-12 max-w-5xl">
      <div className="mb-8 flex items-center gap-4">
        <button onClick={() => navigate('/seller/products')} className="p-2 -ml-2 rounded-full hover:bg-muted/50 transition-colors text-muted-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold">{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
          <p className="text-muted-foreground mt-1">{isEditing ? 'Update your product details and pricing.' : 'Create a new listing for your store.'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="pk-glass p-8 rounded-[var(--radius)] space-y-6">
            <h2 className="text-xl font-semibold mb-4 border-b border-border/50 pb-4">Basic Details</h2>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Product Name <span className="text-destructive">*</span></label>
              <input 
                type="text" 
                className="pk-input text-lg" 
                placeholder="e.g. Wireless Noise Canceling Headphones"
                value={formData.name || ''}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description <span className="text-destructive">*</span></label>
              <textarea 
                className="pk-input min-h-[160px] py-3 resize-y" 
                placeholder="Describe your product's features, benefits, and specifications..."
                value={formData.description || ''}
                onChange={e => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="pk-glass p-8 rounded-[var(--radius)] space-y-6">
            <h2 className="text-xl font-semibold mb-4 border-b border-border/50 pb-4">Product Images</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {formData.images?.map((url, i) => (
                <div key={i} className="relative aspect-square rounded-lg border border-border/50 overflow-hidden group bg-muted/10">
                  <img src={url} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <button type="button" onClick={() => removeImage(i)} className="bg-destructive/90 text-destructive-foreground p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              
              <label className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center cursor-pointer text-muted-foreground hover:text-primary min-h-[120px]">
                {uploadingImage ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : (
                  <>
                    <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                    <span className="text-sm font-medium text-center px-2">Click to Upload</span>
                  </>
                )}
                <input type="file" accept="image/jpeg, image/png, image/webp" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
              </label>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Upload high-quality images (JPEG, PNG, WebP) up to 5MB.</p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="pk-glass p-6 rounded-[var(--radius)] space-y-6">
            <h2 className="text-lg font-semibold border-b border-border/50 pb-3">Pricing & Inventory</h2>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Price (₹) <span className="text-destructive">*</span></label>
                <input type="number" min="0" step="0.01" className="pk-input font-medium" value={formData.price || ''} onChange={e => setFormData({...formData, price: parseFloat(e.target.value) || 0})} required />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-muted-foreground">Compare-at Price (₹)</label>
                <input type="number" min="0" step="0.01" className="pk-input" value={formData.comparePrice || ''} onChange={e => setFormData({...formData, comparePrice: parseFloat(e.target.value) || 0})} />
                <p className="text-xs text-muted-foreground">To show a crossed-out original price.</p>
              </div>

              <div className="border-t border-border/50 pt-4 mt-2"></div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">SKU <span className="text-destructive">*</span></label>
                <input type="text" className="pk-input font-mono text-sm uppercase" value={formData.sku || ''} onChange={e => setFormData({...formData, sku: e.target.value})} required placeholder="e.g. WH-1000XM5" />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Quantity in Stock</label>
                <input type="number" min="0" className="pk-input" value={formData.quantity || ''} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value, 10) || 0})} />
              </div>
            </div>
          </div>

          <div className="pk-glass p-6 rounded-[var(--radius)] space-y-6">
            <h2 className="text-lg font-semibold border-b border-border/50 pb-3">Organization</h2>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Category <span className="text-destructive">*</span></label>
                <select className="pk-select w-full" value={formData.categoryId || ''} onChange={e => setFormData({...formData, categoryId: e.target.value})} required>
                  <option value="" disabled>Select a category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Status</label>
                <select className="pk-select w-full" value={formData.status || 'DRAFT'} onChange={e => setFormData({...formData, status: e.target.value as 'ACTIVE' | 'DRAFT' | 'INACTIVE'})}>
                  <option value="ACTIVE">Active (Live in store)</option>
                  <option value="DRAFT">Draft (Hidden)</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="pk-btn pk-btn-primary pk-btn-shine w-full py-4 text-base relative overflow-hidden group shadow-xl shadow-primary/20"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Saving...</span>
            ) : (
              <span className="flex items-center gap-2 relative z-10"><Save className="w-5 h-5" /> {isEditing ? 'Save Changes' : 'Publish Product'}</span>
            )}
            <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300"></div>
          </button>
        </div>
      </form>
    </div>
  );
}
