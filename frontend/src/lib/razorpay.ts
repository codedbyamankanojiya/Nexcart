declare global {
  interface Window {
    Razorpay: any;
  }
}

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

export const openRazorpayModal = (options: RazorpayOptions) => {
  const razorpay = new (window as any).Razorpay({
    key_id: import.meta.env.VITE_RAZORPAY_KEY_ID,
  });

  razorpay.open(options);
};
