import { create } from 'zustand';

interface DemoModeStore {
  isDemoMode: boolean;
  toggleDemoMode: () => void;
}

export const useDemoModeStore = create<DemoModeStore>((set) => ({
  isDemoMode: true, // Start in demo mode by default
  toggleDemoMode: () => set((state) => ({ isDemoMode: !state.isDemoMode })),
}));