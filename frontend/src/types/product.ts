export type Category =
  | 'Smartphone'
  | 'Gaming PC Gears'
  | 'Laptop'
  | "Men's Fashion"
  | "Women's Fashion"
  | 'Gaming Console'
  | 'Television'
  | 'PC Accessories'
  | 'Gadgets'
  | 'Glasses';

export interface Product {
  id: number;
  name: string;
  price: number;
  category: Category;
  image: string;
  description: string;
  rating: number;
  reviews: number;
  inStock: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}
