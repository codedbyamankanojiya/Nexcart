/**
 * api.js — Configured Axios instance for NexCart API
 *
 * Features:
 *  - Base URL from environment variable with fallback to proxy path
 *  - Request interceptor: Attaches JWT from localStorage to every request
 *  - Response interceptor: Handles 401 Unauthorized by clearing auth state
 */

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second request timeout
});

// ── Request Interceptor ────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nexcart_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ───────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear auth state
      localStorage.removeItem('nexcart_token');
      localStorage.removeItem('nexcart_user');
      // Only redirect if not already on an auth page
      const isAuthPage = ['/login', '/register'].includes(window.location.pathname);
      if (!isAuthPage) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ── Typed API Helper Functions ─────────────────────────────────────────────

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  getMe:    ()     => api.get('/auth/me'),
};

export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id)    => api.get(`/products/${id}`),
  create:  (data)  => api.post('/products', data),
  update:  (id, data) => api.put(`/products/${id}`, data),
  remove:  (id)    => api.delete(`/products/${id}`),
};

export const ordersAPI = {
  create:   (data) => api.post('/orders', data),
  getMine:  ()     => api.get('/orders/mine'),
  getById:  (id)   => api.get(`/orders/${id}`),
};

export default api;
