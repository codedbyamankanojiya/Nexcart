import { create } from 'zustand';

interface UiState {
  isCartOpen: boolean;
  isWishlistOpen: boolean;
  isAuthOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  openWishlist: () => void;
  closeWishlist: () => void;
  openAuth: () => void;
  closeAuth: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  isCartOpen: false,
  isWishlistOpen: false,
  isAuthOpen: false,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  openWishlist: () => set({ isWishlistOpen: true }),
  closeWishlist: () => set({ isWishlistOpen: false }),
  openAuth: () => set({ isAuthOpen: true }),
  closeAuth: () => set({ isAuthOpen: false }),
}));
