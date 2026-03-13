import { create } from 'zustand';

export type SortBy = 'relevance' | 'price-low' | 'price-high' | 'rating' | 'name';

interface CatalogState {
  currentCategory: string;
  searchTerm: string;
  sortBy: SortBy;
  setCurrentCategory: (category: string) => void;
  setSearchTerm: (term: string) => void;
  setSortBy: (sortBy: SortBy) => void;
}

export const useCatalogStore = create<CatalogState>((set) => ({
  currentCategory: 'All',
  searchTerm: '',
  sortBy: 'relevance',
  setCurrentCategory: (category) => set({ currentCategory: category }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setSortBy: (sortBy) => set({ sortBy }),
}));
