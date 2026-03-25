import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSimulationStore } from '../../store/useSimulationStore';

interface ForceArrowProps {
  bodyId: string;
  forceIndex: number;
  forces: React.MutableRefObject<THREE.Vector3[]>;
  color?: string;
  scale?: number;
}

const _dir = new THREE.Vector3();

export function ForceArrow({ bodyId, forceIndex, forces, color = '#ffff00', scale = 0.5 }: ForceArrowProps) {
  const arrowRef = useRef<THREE.ArrowHelper>(null);

  useFrame(() => {
    const body = useSimulationStore.getState().bodies.find((b) => b.id === bodyId);
    if (!body || !arrowRef.current || !forces.current[forceIndex]) return;

    const force = forces.current[forceIndex];
    const forceMag = force.length();

    if (forceMag < 1e-6) {
      arrowRef.current.visible = false;
      return;
    }

    _dir.copy(force).normalize();

    // Logarithmic scaling keeps arrows visible across the huge dynamic range
    // of inverse-square forces (linear scaling makes them invisible at moderate distances)
    const rawLength = Math.log10(1 + forceMag * 50) * scale * 2;
    const length = THREE.MathUtils.clamp(rawLength, 0.25, 4);

    // Offset arrow origin to the body's surface so it isn't hidden inside large spheres
    arrowRef.current.position.copy(body.position).addScaledVector(_dir, body.radius);
    arrowRef.current.setDirection(_dir);
    arrowRef.current.setLength(length, Math.max(length * 0.2, 0.06), Math.max(length * 0.1, 0.03));
    arrowRef.current.visible = true;
  });

  return (
    <arrowHelper
      ref={arrowRef}
      args={[new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 1, color]}
    />
  );
}
