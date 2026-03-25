import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSimulationStore } from '../../store/useSimulationStore';

interface TrailLineProps {
  bodyId: string;
  color: string;
  maxPoints?: number;
}

export function TrailLine({ bodyId, color, maxPoints = 300 }: TrailLineProps) {
  const points = useRef<THREE.Vector3[]>([]);
  const frameCount = useRef(0);
  const geometryRef = useRef<THREE.BufferGeometry>(null);

  useFrame(() => {
    const body = useSimulationStore.getState().bodies.find((b) => b.id === bodyId);
    if (!body) return;

    frameCount.current++;
    if (frameCount.current % 2 === 0) {
      points.current.push(body.position.clone());
      if (points.current.length > maxPoints) {
        points.current.shift();
      }
    }

    if (geometryRef.current && points.current.length >= 2) {
      const positions = new Float32Array(points.current.length * 3);
      for (let i = 0; i < points.current.length; i++) {
        positions[i * 3] = points.current[i].x;
        positions[i * 3 + 1] = points.current[i].y;
        positions[i * 3 + 2] = points.current[i].z;
      }
      geometryRef.current.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometryRef.current.setDrawRange(0, points.current.length);
      geometryRef.current.attributes.position.needsUpdate = true;
    }
  });

  return (
    <line>
      <bufferGeometry ref={geometryRef} />
      <lineBasicMaterial color={color} opacity={0.6} transparent />
    </line>
  );
}

export function resetTrails() {
  // Trails reset by re-mounting
}
