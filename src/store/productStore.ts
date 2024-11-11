import { create } from 'zustand';
import { Product } from '../types';
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc,
  enableNetwork,
  disableNetwork
} from 'firebase/firestore';
import { db } from '../lib/firebase';

interface ProductStore {
  products: Product[];
  loading: boolean;
  error: string | null;
  isOffline: boolean;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleNetwork: () => Promise<void>;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  loading: false,
  error: null,
  isOffline: false,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const productsRef = collection(db, 'products');
      const q = query(productsRef, orderBy('category'));
      const snapshot = await getDocs(q);
      
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];

      set({ products, loading: false, error: null });
    } catch (error) {
      console.error('Error fetching products:', error);
      // Still set products from cache if available
      set(state => ({ 
        products: state.products,
        loading: false,
        error: 'Network error - using cached data',
        isOffline: true
      }));
    }
  },

  addProduct: async (product) => {
    set({ loading: true, error: null });
    try {
      const productData = {
        ...product,
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'products'), productData);
      const newProduct = { id: docRef.id, ...productData };
      
      set(state => ({ 
        products: [...state.products, newProduct],
        loading: false,
        error: null
      }));
    } catch (error) {
      console.error('Error adding product:', error);
      set({ error: 'Failed to add product - please check your connection', loading: false });
      throw error;
    }
  },

  updateProduct: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString()
      };

      await updateDoc(doc(db, 'products', id), updateData);
      
      set(state => ({
        products: state.products.map(p => 
          p.id === id ? { ...p, ...updateData } : p
        ),
        loading: false,
        error: null
      }));
    } catch (error) {
      console.error('Error updating product:', error);
      set({ error: 'Failed to update product - please check your connection', loading: false });
      throw error;
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteDoc(doc(db, 'products', id));
      set(state => ({
        products: state.products.filter(p => p.id !== id),
        loading: false,
        error: null
      }));
    } catch (error) {
      console.error('Error deleting product:', error);
      set({ error: 'Failed to delete product - please check your connection', loading: false });
      throw error;
    }
  },

  toggleNetwork: async () => {
    const { isOffline } = get();
    try {
      if (isOffline) {
        await enableNetwork(db);
        set({ isOffline: false, error: null });
      } else {
        await disableNetwork(db);
        set({ isOffline: true, error: null });
      }
    } catch (error) {
      console.error('Error toggling network:', error);
      set({ error: 'Failed to toggle network mode' });
    }
  }
}));