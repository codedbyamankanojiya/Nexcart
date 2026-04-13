import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cartAPI, type Cart, type CartItem } from '../lib/cart';
import type { Product } from '../lib/products';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  itemCount: number;
  total: number;
  // Local cart & wishlist (for non-authenticated users)
  localItems: CartItem[];
  wishlist: string[];

  // Getters for component compatibility
  items: CartItem[];

  fetchCart: () => Promise<void>;
  addToCart: (product: Product, quantity: number, variantId?: string) => Promise<void>;
  addProductToCart: (product: Product, quantity?: number) => Promise<void>;
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
      localItems: [],
      wishlist: [],

      // Getter for items (compatibility)
      get items() {
        const token = localStorage.getItem('token');
        if (token) {
          return get().cart?.items || [];
        }
        return get().localItems;
      },

      fetchCart: async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

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

      addToCart: async (product: Product, quantity: number, variantId?: string) => {
        const token = localStorage.getItem('token');

        if (!token) {
          // Local cart logic
          const currentLocal = get().localItems;
          const existingIdx = currentLocal.findIndex(i => i.productId === product.id && i.variantId === variantId);

          let updatedLocal: CartItem[];
          if (existingIdx > -1) {
            updatedLocal = [...currentLocal];
            updatedLocal[existingIdx].quantity += quantity;
          } else {
            const newItem: CartItem = {
              id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              cartId: 'local',
              productId: String(product.id),
              variantId,
              quantity,
              price: (product && typeof product.price === 'number') ? product.price : 0,
              product: product || {}
            };
            updatedLocal = [...currentLocal, newItem];
          }

          const itemCount = updatedLocal.reduce((sum, i) => sum + i.quantity, 0);
          const total = updatedLocal.reduce((sum, i) => sum + (i.price * i.quantity), 0);

          set({ localItems: updatedLocal, itemCount, total });
          return;
        }

        set({ isLoading: true });
        try {
          const response = await cartAPI.addToCart({
            productId: String(product.id),
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

      addProductToCart: async (product: Product, quantity = 1) => {
        return get().addToCart(product, quantity);
      },

      updateCartItem: async (itemId: string, quantity: number) => {
        const token = localStorage.getItem('token');

        if (!token) {
          // Local update
          const updatedLocal = get().localItems.map(item =>
            item.id === itemId ? { ...item, quantity } : item
          );
          const itemCount = updatedLocal.reduce((sum, i) => sum + i.quantity, 0);
          const total = updatedLocal.reduce((sum, i) => sum + (i.price * i.quantity), 0);
          set({ localItems: updatedLocal, itemCount, total });
          return;
        }

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
        const token = localStorage.getItem('token');

        if (!token) {
          // Local remove
          const updatedLocal = get().localItems.filter(item => item.id !== itemId);
          const itemCount = updatedLocal.reduce((sum, i) => sum + i.quantity, 0);
          const total = updatedLocal.reduce((sum, i) => sum + (i.price * i.quantity), 0);
          set({ localItems: updatedLocal, itemCount, total });
          return;
        }

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
        const token = localStorage.getItem('token');

        if (!token) {
          set({ localItems: [], itemCount: 0, total: 0 });
          return;
        }

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
        localItems: state.localItems,
      }),
    }
  )
);
