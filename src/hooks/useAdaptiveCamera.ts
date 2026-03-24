import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSimulationStore } from '../store/useSimulationStore';

const MIN_DISTANCE = 5;
const MAX_DISTANCE = 200;
const PADDING_FACTOR = 2.5;
const LERP_FACTOR = 0.03;

const _centroid = new THREE.Vector3();
const _currentTarget = new THREE.Vector3();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useAdaptiveCamera(controlsRef: React.RefObject<any>) {
  const desiredDistance = useRef(30);

  useFrame(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const bodies = useSimulationStore.getState().bodies;
    if (bodies.length === 0) return;

    // Compute centroid
    _centroid.set(0, 0, 0);
    for (const body of bodies) {
      _centroid.add(body.position);
    }
    _centroid.divideScalar(bodies.length);

    // Compute bounding sphere radius
    let maxDist = 0;
    for (const body of bodies) {
      const d = body.position.distanceTo(_centroid);
      if (d > maxDist) maxDist = d;
    }

    const targetDist = Math.max(MIN_DISTANCE, Math.min(MAX_DISTANCE, maxDist * PADDING_FACTOR + 5));
    desiredDistance.current += (targetDist - desiredDistance.current) * LERP_FACTOR;

    // Smoothly move camera target
    controls.getTarget(_currentTarget);
    _currentTarget.lerp(_centroid, LERP_FACTOR);
    controls.setTarget(_currentTarget.x, _currentTarget.y, _currentTarget.z, false);
    controls.dollyTo(desiredDistance.current, false);
  });
}
