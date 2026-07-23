import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // SKU or unique ID
  name: string;
  size: string;
  price: number;
  qty: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  toggleCart: () => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (item) => set((state) => {
        const existing = state.items.find((i) => i.id === item.id);
        if (existing) {
          return {
            items: state.items.map((i) => 
              i.id === item.id ? { ...i, qty: i.qty + item.qty } : i
            )
          };
        }
        return { items: [...state.items, item], isOpen: true }; // open cart on add
      }),
      
      removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id)
      })),
      
      updateQty: (id, qty) => set((state) => ({
        items: state.items.map((i) => 
          i.id === id ? { ...i, qty: Math.max(1, qty) } : i
        )
      })),
      
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      
      clearCart: () => set({ items: [] }),
      
      getCartTotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.qty), 0);
      }
    }),
    {
      name: 'dr-well-cart-storage',
    }
  )
);
