import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { ForceArrow } from '../../components/three/ForceArrow';
import { useSimulationLoop } from '../../hooks/useSimulationLoop';
import { currentForce, CURRENTS_SOFTENING } from './currentForce';
import { biotSavartForce } from './biotSavartForce';
import { useSimulationStore } from '../../store/useSimulationStore';
import { useUIStore } from '../../store/useUIStore';
import { Wire3D } from './Wire3D';

export function CurrentsVisualizer() {
  const ampereForcesRef = useRef<THREE.Vector3[]>([new THREE.Vector3(), new THREE.Vector3()]);
  const bsForcesRef = useRef<THREE.Vector3[]>([new THREE.Vector3(), new THREE.Vector3()]);

  useSimulationLoop(currentForce, CURRENTS_SOFTENING);

  useFrame(() => {
    const { showForceArrows, showAmpereArrows, showBiotSavartArrows } = useUIStore.getState();
    if (!showForceArrows) return;
    const bodies = useSimulationStore.getState().bodies;
    if (bodies.length < 2) return;
    if (showAmpereArrows) ampereForcesRef.current = currentForce(bodies, CURRENTS_SOFTENING);
    if (showBiotSavartArrows) bsForcesRef.current = biotSavartForce(bodies, CURRENTS_SOFTENING);
  });

  const showForceArrows = useUIStore((s) => s.showForceArrows);
  const showAmpere = useUIStore((s) => s.showAmpereArrows);
  const showBiotSavart = useUIStore((s) => s.showBiotSavartArrows);

  return (
    <>
      <Wire3D bodyId="wire-1" />
      <Wire3D bodyId="wire-2" />
      {showForceArrows && showAmpere && (
        <>
          <ForceArrow bodyId="wire-1" forceIndex={0} forces={ampereForcesRef} color="#00ff88" scale={0.3} />
          <ForceArrow bodyId="wire-2" forceIndex={1} forces={ampereForcesRef} color="#00ff88" scale={0.3} />
        </>
      )}
      {showForceArrows && showBiotSavart && (
        <>
          <ForceArrow bodyId="wire-1" forceIndex={0} forces={bsForcesRef} color="#ff88ff" scale={0.3} />
          <ForceArrow bodyId="wire-2" forceIndex={1} forces={bsForcesRef} color="#ff88ff" scale={0.3} />
        </>
      )}
    </>
  );
}
