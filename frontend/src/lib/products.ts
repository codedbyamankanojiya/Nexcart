import api from './api';

export interface Product {
  id: string | number;
  name: string;
  slug?: string;
  description?: string;
  price: number;
  comparePrice?: number;
  sku?: string;
  trackQuantity?: boolean;
  quantity?: number;
  inStock?: boolean;
  image?: string;
  images?: string[];
  status?: 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  featured?: boolean;
  tags?: string[];
  categoryId?: string | number;
  sellerId?: string | number;
  createdAt?: string;
  updatedAt?: string;
  category?: {
    id?: string;
    name: string;
    slug?: string;
  };
  seller?: {
    id: string;
    storeName: string;
    user: {
      name: string;
    };
  };
  averageRating?: number;
  reviewCount?: number;
  rating?: number;
  reviews?: number;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  productId: string;
  title: string;
  options: Record<string, unknown>;
  price: number;
  sku: string;
  quantity: number;
  image?: string;
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const productsAPI = {
  getProducts: async (filters: ProductFilters = {}): Promise<ProductsResponse> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/api/products?${params.toString()}`);
    return response.data;
  },

  getProduct: async (id: string): Promise<{ product: Product }> => {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  },

  createProduct: async (data: Partial<Product>): Promise<{ message: string; product: Product }> => {
    const response = await api.post('/api/products', data);
    return response.data;
  },

  updateProduct: async (id: string, data: Partial<Product>): Promise<{ message: string; product: Product }> => {
    const response = await api.put(`/api/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/api/products/${id}`);
    return response.data;
  },

  getSellerProducts: async (filters: ProductFilters = {}): Promise<ProductsResponse> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/api/products/seller/my-products?${params.toString()}`);
    return response.data;
  },
};
