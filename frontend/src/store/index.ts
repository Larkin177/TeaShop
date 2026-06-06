import { create } from 'zustand';
import type { User, CartItem } from '../types';
import * as api from '../api';

// User Store
interface UserState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  fetchProfile: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isLoggedIn: !!localStorage.getItem('token'),
  login: (user: User, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token, isLoggedIn: true });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isLoggedIn: false });
  },
  setUser: (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },
  fetchProfile: async () => {
    try {
      const res: any = await api.getProfile();
      const user = res.data;
      localStorage.setItem('user', JSON.stringify(user));
      set({ user });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  },
}));

// Cart Store
interface CartState {
  items: CartItem[];
  totalPrice: number;
  totalCount: number;
  fetchCart: () => Promise<void>;
  addItem: (item: Omit<CartItem, 'id'>) => Promise<void>;
  updateQuantity: (id: number, quantity: number) => Promise<void>;
  removeItem: (id: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  totalPrice: 0,
  totalCount: 0,

  fetchCart: async () => {
    try {
      const res: any = await api.getCart();
      const items = res.data || [];
      const totalPrice = items.reduce(
        (sum: number, item: CartItem) => sum + item.unit_price * item.quantity,
        0
      );
      const totalCount = items.reduce(
        (sum: number, item: CartItem) => sum + item.quantity,
        0
      );
      set({ items, totalPrice, totalCount });
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  },

  addItem: async (item) => {
    try {
      await api.addToCart(item);
      await get().fetchCart();
    } catch (error) {
      console.error('Failed to add item:', error);
      throw error;
    }
  },

  updateQuantity: async (id: number, quantity: number) => {
    try {
      if (quantity <= 0) {
        await api.removeCartItem(id);
      } else {
        await api.updateCartItem(id, quantity);
      }
      await get().fetchCart();
    } catch (error) {
      console.error('Failed to update quantity:', error);
      throw error;
    }
  },

  removeItem: async (id: number) => {
    try {
      await api.removeCartItem(id);
      await get().fetchCart();
    } catch (error) {
      console.error('Failed to remove item:', error);
      throw error;
    }
  },

  clearCart: async () => {
    try {
      await api.clearCart();
      set({ items: [], totalPrice: 0, totalCount: 0 });
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  },
}));

// Tab Store
type TabType = 'home' | 'menu' | 'orders' | 'mine';

interface TabState {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const useTabStore = create<TabState>((set) => ({
  activeTab: 'home',
  setActiveTab: (tab: TabType) => set({ activeTab: tab }),
}));

// Store Selection Store
interface StoreSelectionState {
  selectedStoreId: number | null;
  selectedStoreName: string;
  setStore: (id: number, name: string) => void;
  loadStore: () => void;
}

export const useStoreSelectionStore = create<StoreSelectionState>((set) => ({
  selectedStoreId: null,
  selectedStoreName: '',
  setStore: (id: number, name: string) => {
    localStorage.setItem('selectedStoreId', String(id));
    localStorage.setItem('selectedStoreName', name);
    set({ selectedStoreId: id, selectedStoreName: name });
  },
  loadStore: () => {
    const id = localStorage.getItem('selectedStoreId');
    const name = localStorage.getItem('selectedStoreName') || '';
    set({ selectedStoreId: id ? Number(id) : null, selectedStoreName: name });
  },
}));
