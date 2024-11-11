import { create } from 'zustand';
import { CartItem } from '../types';
import { useSettingsStore } from './settingsStore';

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, selectedOption?: string) => void;
  updateQuantity: (productId: string, selectedOption: string | undefined, quantity: number) => void;
  clearCart: () => void;
  collectionTime: { date: Date; time: string } | null;
  setCollectionTime: (date: Date, time: string) => void;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  collectionTime: null,

  addItem: (item) => {
    set((state) => {
      const existingItem = state.items.find(
        (i) => i.product.id === item.product.id &&
        i.selectedOption === item.selectedOption
      );

      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.product.id === item.product.id &&
            i.selectedOption === item.selectedOption
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }

      return { items: [...state.items, item] };
    });
  },

  removeItem: (productId, selectedOption) => {
    set((state) => ({
      items: state.items.filter(
        (item) => !(item.product.id === productId && item.selectedOption === selectedOption)
      ),
    }));
  },

  updateQuantity: (productId, selectedOption, quantity) => {
    set((state) => ({
      items: quantity > 0
        ? state.items.map((item) =>
            item.product.id === productId &&
            item.selectedOption === selectedOption
              ? { ...item, quantity }
              : item
          )
        : state.items.filter(
            (item) => !(item.product.id === productId &&
                      item.selectedOption === selectedOption)
          ),
    }));
  },

  clearCart: () => set({ items: [], collectionTime: null }),

  setCollectionTime: (date, time) => set({ collectionTime: { date, time } }),

  getTotal: () => {
    const { items } = get();
    const { settings } = useSettingsStore.getState();

    if (!settings) return 0;

    return items.reduce((sum, item) => {
      const basePrice = item.product.price * item.quantity;
      const optionPrice = item.selectedOption
        ? (settings.productOptions.find(opt => opt.id === item.selectedOption)?.price || 0) * item.quantity
        : 0;
      return sum + basePrice + optionPrice;
    }, 0);
  },
}));