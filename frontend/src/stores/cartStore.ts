import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cartAPI, type Cart, type CartItem } from '../lib/cart';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  itemCount: number;
  total: number;
  // Local wishlist (for non-authenticated users)
  wishlist: string[];

  // Getters for component compatibility
  items: CartItem[];

  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number, variantId?: string) => Promise<void>;
  addProductToCart: (product: { id: string | number; [key: string]: any }, quantity?: number) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  // Compatibility methods
  setQty: (itemId: string, quantity: number) => Promise<void>;
  // Wishlist methods
  toggleWishlist: (productId: string) => void;
  clearWishlist: () => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      isLoading: false,
      itemCount: 0,
      total: 0,
      wishlist: [],

      // Getter for items (compatibility)
      get items() {
        return get().cart?.items || [];
      },

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

      addProductToCart: async (product: { id: string | number; [key: string]: any }, quantity = 1) => {
        return get().addToCart(String(product.id), quantity);
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

      setQty: async (itemId: string, quantity: number) => {
        return get().updateCartItem(itemId, quantity);
      },

      toggleWishlist: (productId: string) => {
        const current = get().wishlist;
        const exists = current.includes(productId);
        const updated = exists
          ? current.filter(id => id !== productId)
          : [...current, productId];
        set({ wishlist: updated });
      },

      removeFromWishlist: (productId: string) => {
        set({ wishlist: get().wishlist.filter(id => id !== productId) });
      },

      clearWishlist: () => {
        set({ wishlist: [] });
      },

      isInWishlist: (productId: string) => {
        return get().wishlist.includes(productId);
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
        wishlist: state.wishlist,
      }),
    }
  )
);
