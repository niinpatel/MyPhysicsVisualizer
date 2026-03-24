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
    const length = force.length() * scale;

    if (length > 0.001) {
      _dir.copy(force).normalize();
      arrowRef.current.position.copy(body.position);
      arrowRef.current.setDirection(_dir);
      arrowRef.current.setLength(length, length * 0.2, length * 0.1);
      arrowRef.current.visible = true;
    } else {
      arrowRef.current.visible = false;
    }
  });

  return (
    <arrowHelper
      ref={arrowRef}
      args={[new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 1, color]}
    />
  );
}
