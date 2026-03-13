import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cartAPI, type Cart, type CartItem } from '../lib/cart';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  itemCount: number;
  total: number;
  
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number, variantId?: string) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      isLoading: false,
      itemCount: 0,
      total: 0,

      fetchCart: async () => {
        set({ isLoading: true });
        try {
          const response = await cartAPI.getCart();
          const { cart } = response;
          
          set({
            cart,
            itemCount: cart.itemCount,
            total: cart.total,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      addToCart: async (productId: string, quantity: number, variantId?: string) => {
        set({ isLoading: true });
        try {
          const response = await cartAPI.addToCart({
            productId,
            quantity,
            variantId,
          });
          const { cart } = response;
          
          set({
            cart,
            itemCount: cart.itemCount,
            total: cart.total,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      updateCartItem: async (itemId: string, quantity: number) => {
        set({ isLoading: true });
        try {
          const response = await cartAPI.updateCartItem(itemId, quantity);
          const { cart } = response;
          
          set({
            cart,
            itemCount: cart.itemCount,
            total: cart.total,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      removeFromCart: async (itemId: string) => {
        set({ isLoading: true });
        try {
          await cartAPI.removeFromCart(itemId);
          
          const currentCart = get().cart;
          if (currentCart) {
            const updatedItems = currentCart.items.filter(item => item.id !== itemId);
            const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
            const total = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            set({
              cart: {
                ...currentCart,
                items: updatedItems,
                itemCount,
                total,
              },
              itemCount,
              total,
              isLoading: false,
            });
          }
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      clearCart: async () => {
        set({ isLoading: true });
        try {
          await cartAPI.clearCart();
          
          set({
            cart: null,
            itemCount: 0,
            total: 0,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        itemCount: state.itemCount,
        total: state.total,
      }),
    }
  )
);
