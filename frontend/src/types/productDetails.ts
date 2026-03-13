export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductReview {
  id: string;
  userName: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
}

export interface ProductQuestion {
  id: string;
  question: string;
  answer: string;
  answeredBy: string;
  answeredAt: string;
}

export interface ProductDetailsData {
  productId: number;
  images: string[];
  highlights: string[];
  specs: ProductSpec[];
  boxContents: string[];
  warranty: string;
  reviews: ProductReview[];
  qa: ProductQuestion[];
}
