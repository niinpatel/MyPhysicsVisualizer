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
  hasInteracted: boolean;
  setHasInteracted: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
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
  hasInteracted: false,
  setHasInteracted: () => set({ hasInteracted: true }),
  sidebarOpen: false,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));
