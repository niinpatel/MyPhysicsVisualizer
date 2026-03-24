import { useRef } from 'react';
import { CameraControls } from '@react-three/drei';
import { useAdaptiveCamera } from '../../hooks/useAdaptiveCamera';

export function AdaptiveCamera() {
  const controlsRef = useRef(null);
  useAdaptiveCamera(controlsRef);

  return (
    <CameraControls
      ref={controlsRef}
      makeDefault
      minDistance={3}
      maxDistance={300}
      dollySpeed={0.5}
      truckSpeed={1}
    />
  );
}
