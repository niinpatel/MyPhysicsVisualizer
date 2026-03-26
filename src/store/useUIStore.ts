import { create } from 'zustand';

interface UIStore {
  activeVisualizer: string;
  setActiveVisualizer: (id: string) => void;
  showTrails: boolean;
  setShowTrails: (show: boolean) => void;
  showForceArrows: boolean;
  setShowForceArrows: (show: boolean) => void;
  showAmpereArrows: boolean;
  setShowAmpereArrows: (show: boolean) => void;
  showBiotSavartArrows: boolean;
  setShowBiotSavartArrows: (show: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  activeVisualizer: 'gravity',
  setActiveVisualizer: (activeVisualizer) => set({ activeVisualizer }),
  showTrails: true,
  setShowTrails: (showTrails) => set({ showTrails }),
  showForceArrows: true,
  setShowForceArrows: (showForceArrows) => set({ showForceArrows }),
  showAmpereArrows: true,
  setShowAmpereArrows: (showAmpereArrows) => set({ showAmpereArrows }),
  showBiotSavartArrows: true,
  setShowBiotSavartArrows: (showBiotSavartArrows) => set({ showBiotSavartArrows }),
}));
