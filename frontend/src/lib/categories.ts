import api from './api';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  children?: Category[];
  _count?: {
    products: number;
  };
}

export const categoriesAPI = {
  getCategories: async (): Promise<{ categories: Category[] }> => {
    const response = await api.get('/api/categories');
    return response.data;
  },

  getCategoryTree: async (): Promise<{ categories: Category[] }> => {
    const response = await api.get('/api/categories/tree');
    return response.data;
  },

  getCategory: async (id: string): Promise<{ category: Category }> => {
    const response = await api.get(`/api/categories/${id}`);
    return response.data;
  },
};
