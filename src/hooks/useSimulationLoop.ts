import { useFrame } from '@react-three/fiber';
import { useSimulationStore } from '../store/useSimulationStore';
import type { ForceFunction } from '../types/simulation';

export function useSimulationLoop(forceFunction: ForceFunction, softening: number) {
  useFrame((_, delta) => {
    const state = useSimulationStore.getState();
    if (!state.isPlaying || state.bodies.length === 0) return;

    const elapsed = state.engine.step(
      state.bodies,
      forceFunction,
      delta,
      state.timeScale,
      softening,
    );

    if (elapsed > 0) {
      useSimulationStore.setState({ time: state.time + elapsed });
    }
  });
}
