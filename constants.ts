export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Starters' | 'Main Course' | 'Desserts' | 'Beverages';
  image: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export type OrderStatus = 'idle' | 'preparing' | 'delivering' | 'delivered' | 'late';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  startTime: number;
  status: OrderStatus;
  penaltyAwarded: boolean;
}
