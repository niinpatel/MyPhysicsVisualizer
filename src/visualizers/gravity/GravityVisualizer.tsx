import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Body3D } from '../../components/three/Body3D';
import { TrailLine } from '../../components/three/TrailLine';
import { ForceArrow } from '../../components/three/ForceArrow';
import { useSimulationLoop } from '../../hooks/useSimulationLoop';
import { gravitationalForce } from '../../engine/forces/gravity';
import { useSimulationStore } from '../../store/useSimulationStore';
import { useUIStore } from '../../store/useUIStore';

const SOFTENING = 0.5;

export function GravityVisualizer() {
  const forcesRef = useRef<THREE.Vector3[]>([new THREE.Vector3(), new THREE.Vector3()]);

  useSimulationLoop(gravitationalForce, SOFTENING);

  // Update forces for arrows
  useFrame(() => {
    const bodies = useSimulationStore.getState().bodies;
    if (bodies.length >= 2) {
      const forces = gravitationalForce(bodies, SOFTENING);
      forcesRef.current = forces;
    }
  });

  const showTrails = useUIStore((s) => s.showTrails);
  const showForceArrows = useUIStore((s) => s.showForceArrows);
  const trailResetKey = useSimulationStore((s) => s.trailResetKey);

  return (
    <>
      <Body3D bodyId="body-1" />
      <Body3D bodyId="body-2" />
      {showTrails && (
        <>
          <TrailLine key={`body-1-${trailResetKey}`} bodyId="body-1" color="#ff6644" />
          <TrailLine key={`body-2-${trailResetKey}`} bodyId="body-2" color="#44aaff" />
        </>
      )}
      {showForceArrows && (
        <>
          <ForceArrow bodyId="body-1" forceIndex={0} forces={forcesRef} color="#ffff00" scale={0.3} />
          <ForceArrow bodyId="body-2" forceIndex={1} forces={forcesRef} color="#ffff00" scale={0.3} />
        </>
      )}
    </>
  );
}
