import { useRef, useState, useEffect } from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';
import { computeConservation } from '../../engine/conservationChecks';
import type { ConservationQuantities } from '../../types/simulation';

interface EnergyDisplayProps {
  potentialEnergyFn: (bodies: any[]) => number;
}

export function EnergyDisplay({ potentialEnergyFn }: EnergyDisplayProps) {
  const [quantities, setQuantities] = useState<ConservationQuantities | null>(null);
  const intervalRef = useRef<number>(0);

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      const bodies = useSimulationStore.getState().bodies;
      if (bodies.length > 0) {
        setQuantities(computeConservation(bodies, potentialEnergyFn));
      }
    }, 100); // Update 10x per second for UI

    return () => window.clearInterval(intervalRef.current);
  }, [potentialEnergyFn]);

  const time = useSimulationStore((s) => s.time);

  if (!quantities) return null;

  return (
    <div className="energy-display">
      <div className="energy-row">
        <span className="energy-label" data-tip="Kinetic Energy — energy of motion">KE</span>
        <span className="energy-value">{quantities.kineticEnergy.toFixed(3)}</span>
      </div>
      <div className="energy-row">
        <span className="energy-label" data-tip="Potential Energy — stored energy from position">PE</span>
        <span className="energy-value">{quantities.potentialEnergy.toFixed(3)}</span>
      </div>
      <div className="energy-row energy-total">
        <span className="energy-label" data-tip="Total Energy — KE + PE (conserved in closed systems)">Total E</span>
        <span className="energy-value">{quantities.totalEnergy.toFixed(3)}</span>
      </div>
      <div className="energy-row">
        <span className="energy-label" data-tip="Total momentum magnitude (conserved quantity)">|p|</span>
        <span className="energy-value">{quantities.totalMomentum.length().toFixed(4)}</span>
      </div>
      <div className="energy-row">
        <span className="energy-label">Time</span>
        <span className="energy-value">{time.toFixed(2)}s</span>
      </div>
    </div>
  );
}
