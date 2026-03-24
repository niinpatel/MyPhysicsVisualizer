import { create } from 'zustand';
import type { Body } from '../types/simulation';
import { cloneBody } from '../types/simulation';
import { SimulationEngine } from '../engine/SimulationEngine';

interface SimulationStore {
  bodies: Body[];
  initialBodies: Body[];
  isPlaying: boolean;
  time: number;
  timeScale: number;
  engine: SimulationEngine;

  setBodies: (bodies: Body[]) => void;
  setInitialBodies: (bodies: Body[]) => void;
  setPlaying: (playing: boolean) => void;
  togglePlaying: () => void;
  setTimeScale: (scale: number) => void;
  advanceTime: (dt: number) => void;
  reset: () => void;
  updateBodyParam: (id: string, updates: Partial<Pick<Body, 'mass' | 'charge' | 'color' | 'radius'>>) => void;
}

export const useSimulationStore = create<SimulationStore>((set, get) => ({
  bodies: [],
  initialBodies: [],
  isPlaying: false,
  time: 0,
  timeScale: 1,
  engine: new SimulationEngine(),

  setBodies: (bodies) => set({ bodies }),
  setInitialBodies: (bodies) => set({ initialBodies: bodies }),

  setPlaying: (isPlaying) => set({ isPlaying }),
  togglePlaying: () => set((s) => ({ isPlaying: !s.isPlaying })),

  setTimeScale: (timeScale) => set({ timeScale }),

  advanceTime: (dt) => set((s) => ({ time: s.time + dt })),

  reset: () => {
    const { initialBodies, engine } = get();
    engine.reset();
    const freshBodies = initialBodies.map(cloneBody);
    // Initialize accelerations to zero
    for (const b of freshBodies) {
      b.acceleration.set(0, 0, 0);
    }
    set({ bodies: freshBodies, time: 0, isPlaying: false });
  },

  updateBodyParam: (id, updates) => {
    const { bodies } = get();
    const body = bodies.find((b) => b.id === id);
    if (body) {
      Object.assign(body, updates);
    }
  },
}));
