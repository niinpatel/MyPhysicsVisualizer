import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Body3D } from '../../components/three/Body3D';
import { TrailLine } from '../../components/three/TrailLine';
import { ForceArrow } from '../../components/three/ForceArrow';
import { useSimulationLoop } from '../../hooks/useSimulationLoop';
import { coulombForce } from '../../engine/forces/coulomb';
import { useSimulationStore } from '../../store/useSimulationStore';
import { useUIStore } from '../../store/useUIStore';

const SOFTENING = 0.3;

export function CoulombVisualizer() {
  const forcesRef = useRef<THREE.Vector3[]>([new THREE.Vector3(), new THREE.Vector3()]);

  useSimulationLoop(coulombForce, SOFTENING);

  useFrame(() => {
    const bodies = useSimulationStore.getState().bodies;
    if (bodies.length >= 2) {
      const forces = coulombForce(bodies, SOFTENING);
      forcesRef.current = forces;
    }
  });

  const showTrails = useUIStore((s) => s.showTrails);
  const showForceArrows = useUIStore((s) => s.showForceArrows);

  return (
    <>
      <Body3D bodyId="charge-1" />
      <Body3D bodyId="charge-2" />
      {showTrails && (
        <>
          <TrailLine bodyId="charge-1" color="#ff4444" />
          <TrailLine bodyId="charge-2" color="#4444ff" />
        </>
      )}
      {showForceArrows && (
        <>
          <ForceArrow bodyId="charge-1" forceIndex={0} forces={forcesRef} color="#00ff88" scale={0.2} />
          <ForceArrow bodyId="charge-2" forceIndex={1} forces={forcesRef} color="#00ff88" scale={0.2} />
        </>
      )}
    </>
  );
}
