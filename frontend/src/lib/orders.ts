import api from './api';

export interface CreateOrderData {
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: Record<string, unknown>;
  paymentMethod: string;
  totalAmount: number;
}

export interface Order {
  id: string;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  items: Array<Record<string, unknown>>;
  shippingAddress: Record<string, unknown>;
  paymentMethod: string;
  totalAmount: number;
  createdAt: string;
}

export const ordersAPI = {
  createOrder: async (data: CreateOrderData): Promise<Order> => {
    const response = await api.post('/api/orders', data);
    return response.data;
  },

  getOrders: async (): Promise<Order[]> => {
    const response = await api.get('/api/orders');
    return response.data;
  },

  getOrder: async (id: string): Promise<Order> => {
    const response = await api.get(`/api/orders/${id}`);
    return response.data;
  },

  confirmMockPayment: async (orderId: string): Promise<Order> => {
    const response = await api.post(`/api/orders/${orderId}/confirm-mock-payment`);
    return response.data;
  }
};
