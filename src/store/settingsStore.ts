import { create } from 'zustand';
import { Settings, ProductOption } from '../types';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface SettingsStore {
  settings: Settings | null;
  loading: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
  updateMaxOrdersPerSlot: (value: number) => Promise<void>;
  toggleBlockedDate: (date: string) => Promise<void>;
  addProductOption: (option: Omit<ProductOption, 'id'>) => Promise<void>;
  updateProductOption: (option: ProductOption) => Promise<void>;
  deleteProductOption: (optionId: string) => Promise<void>;
}

const SETTINGS_DOC_ID = 'global';

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: null,
  loading: false,
  error: null,

  fetchSettings: async () => {
    set({ loading: true, error: null });
    try {
      const settingsDoc = await getDoc(doc(db, 'settings', SETTINGS_DOC_ID));
      if (settingsDoc.exists()) {
        set({ settings: settingsDoc.data() as Settings });
      } else {
        const defaultSettings: Settings = {
          maxOrdersPerSlot: 3,
          blockedDates: [],
          productOptions: []
        };
        await setDoc(doc(db, 'settings', SETTINGS_DOC_ID), defaultSettings);
        set({ settings: defaultSettings });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      set({ error: 'Failed to fetch settings' });
    } finally {
      set({ loading: false });
    }
  },

  updateMaxOrdersPerSlot: async (value: number) => {
    set({ loading: true, error: null });
    try {
      const { settings } = get();
      if (!settings) return;

      const updatedSettings = {
        ...settings,
        maxOrdersPerSlot: value
      };

      await setDoc(doc(db, 'settings', SETTINGS_DOC_ID), updatedSettings);
      set({ settings: updatedSettings });
    } catch (error) {
      console.error('Error updating max orders:', error);
      set({ error: 'Failed to update max orders per slot' });
    } finally {
      set({ loading: false });
    }
  },

  toggleBlockedDate: async (date: string) => {
    set({ loading: true, error: null });
    try {
      const { settings } = get();
      if (!settings) return;

      const blockedDates = settings.blockedDates.includes(date)
        ? settings.blockedDates.filter(d => d !== date)
        : [...settings.blockedDates, date];

      const updatedSettings = {
        ...settings,
        blockedDates
      };

      await setDoc(doc(db, 'settings', SETTINGS_DOC_ID), updatedSettings);
      set({ settings: updatedSettings });
    } catch (error) {
      console.error('Error toggling blocked date:', error);
      set({ error: 'Failed to update blocked dates' });
    } finally {
      set({ loading: false });
    }
  },

  addProductOption: async (option: Omit<ProductOption, 'id'>) => {
    set({ loading: true, error: null });
    try {
      const { settings } = get();
      if (!settings) return;

      const newOption: ProductOption = {
        ...option,
        id: crypto.randomUUID()
      };

      const updatedSettings = {
        ...settings,
        productOptions: [...(settings.productOptions || []), newOption]
      };

      await setDoc(doc(db, 'settings', SETTINGS_DOC_ID), updatedSettings);
      set({ settings: updatedSettings });
    } catch (error) {
      console.error('Error adding product option:', error);
      set({ error: 'Failed to add product option' });
    } finally {
      set({ loading: false });
    }
  },

  updateProductOption: async (option: ProductOption) => {
    set({ loading: true, error: null });
    try {
      const { settings } = get();
      if (!settings) return;

      const updatedSettings = {
        ...settings,
        productOptions: (settings.productOptions || []).map(opt =>
          opt.id === option.id ? option : opt
        )
      };

      await setDoc(doc(db, 'settings', SETTINGS_DOC_ID), updatedSettings);
      set({ settings: updatedSettings });
    } catch (error) {
      console.error('Error updating product option:', error);
      set({ error: 'Failed to update product option' });
    } finally {
      set({ loading: false });
    }
  },

  deleteProductOption: async (optionId: string) => {
    set({ loading: true, error: null });
    try {
      const { settings } = get();
      if (!settings) return;

      const updatedSettings = {
        ...settings,
        productOptions: (settings.productOptions || []).filter(opt => opt.id !== optionId)
      };

      await setDoc(doc(db, 'settings', SETTINGS_DOC_ID), updatedSettings);
      set({ settings: updatedSettings });
    } catch (error) {
      console.error('Error deleting product option:', error);
      set({ error: 'Failed to delete product option' });
    } finally {
      set({ loading: false });
    }
  }
}));