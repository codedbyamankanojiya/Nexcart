import Razorpay from 'razorpay';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const razorpay = new Razorpay({
  key_id: import.meta.env.VITE_RAZORPAY_KEY_ID,
  key_secret: import.meta.env.VITE_RAZORPAY_KEY_SECRET,
});

export interface RazorpayOptions {
  amount: number;
  currency: string;
  receipt?: string;
  notes?: Record<string, any>;
  customer?: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal: {
    backdropclose: boolean;
    escape: boolean;
    handleback: boolean;
  };
  prefill: {
    contact: string;
    email: string;
    name: string;
  };
  readonly: {
    contact: boolean;
    email: boolean;
    name: boolean;
    };
  image?: string;
  image_style?: string;
  description?: string;
  handler?: string;
  callback_url?: string;
  redirect: boolean;
}

export const createRazorpayOrder = async (order: any, user: any): Promise<{ orderId: string; options: RazorpayOptions }> => {
  const options: RazorpayOptions = {
    amount: Math.round(order.total * 100), // Convert to paise
    currency: 'INR',
    receipt: `receipt_${order.id}`,
    notes: {
      order_id: order.id,
      user_id: user.id,
      user_email: user.email,
    },
    customer: {
      name: user.name,
      email: user.email,
      contact: user.phone || '',
    },
    theme: {
      color: '#3399cc'
    },
    modal: {
      backdropclose: true,
      escape: false,
      handleback: true,
    },
    prefill: {
      contact: user.phone || '',
      email: user.email,
      name: user.name,
    },
    readonly: {
      contact: true,
      email: true,
      name: true,
    },
    handler: 'popkart',
    callback_url: `${process.env.VITE_FRONTEND_URL}/orders/${order.id}/payment-success`,
    redirect: true,
  };

  const razorpayOrder = await razorpay.orders.create(options);

  return {
    orderId: razorpayOrder.id,
    options,
  };
};

export const openRazorpayModal = (options: RazorpayOptions) => {
  const razorpay = new Razorpay({
    key_id: process.env.VITE_RAZORPAY_KEY_ID,
    key_secret: process.env.VITE_RAZORPAY_KEY_SECRET,
  });

  razorpay.open(options);
};
