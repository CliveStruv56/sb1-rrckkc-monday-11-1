export type Category = 'Coffees' | 'Teas' | 'Cakes' | 'Hot Chocolate';

export interface ProductOption {
  id: string;
  title: string;
  price: number;
  isDefault?: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  availableOptions?: string[];
  defaultOption?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOption?: string;
}

export interface Settings {
  maxOrdersPerSlot: number;
  blockedDates: string[];
  productOptions: ProductOption[];
}

export interface OrderDetails {
  id?: string;
  items: Array<{
    product: {
      name: string;
      price: number;
    };
    quantity: number;
    selectedOption?: string | null;
  }>;
  total: number;
  pickupDate: string;
  pickupTime: string;
  userId: string;
  userEmail: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  status: 'new' | 'processing' | 'ready' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}