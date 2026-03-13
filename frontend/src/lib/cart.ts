import api from './api';
import type { Product } from './products';

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  product: Product;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export const cartAPI = {
  getCart: async (): Promise<{ cart: Cart }> => {
    const response = await api.get('/api/cart');
    return response.data;
  },

  addToCart: async (data: {
    productId: string;
    variantId?: string;
    quantity: number;
  }): Promise<{ message: string; cart: Cart }> => {
    const response = await api.post('/api/cart/add', data);
    return response.data;
  },

  updateCartItem: async (
    itemId: string,
    quantity: number
  ): Promise<{ message: string; cart: Cart }> => {
    const response = await api.put(`/api/cart/items/${itemId}`, { quantity });
    return response.data;
  },

  removeFromCart: async (itemId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/api/cart/items/${itemId}`);
    return response.data;
  },

  clearCart: async (): Promise<{ message: string }> => {
    const response = await api.delete('/api/cart/clear');
    return response.data;
  },
};
