import { useRef, useCallback } from 'react';
import type { ConservationQuantities } from '../types/simulation';
import { computeConservation } from '../engine/conservationChecks';
import { useSimulationStore } from '../store/useSimulationStore';

export function useConservationMonitor(potentialEnergyFn: (bodies: any[]) => number) {
  const quantities = useRef<ConservationQuantities>({
    kineticEnergy: 0,
    potentialEnergy: 0,
    totalEnergy: 0,
    totalMomentum: { x: 0, y: 0, z: 0 } as any,
  });

  const update = useCallback(() => {
    const bodies = useSimulationStore.getState().bodies;
    if (bodies.length > 0) {
      quantities.current = computeConservation(bodies, potentialEnergyFn);
    }
    return quantities.current;
  }, [potentialEnergyFn]);

  return { quantities, update };
}
