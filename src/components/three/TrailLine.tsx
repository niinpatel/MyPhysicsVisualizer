import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Line } from '@react-three/drei';
import { useSimulationStore } from '../../store/useSimulationStore';

interface TrailLineProps {
  bodyId: string;
  color: string;
  maxPoints?: number;
}

export function TrailLine({ bodyId, color, maxPoints = 300 }: TrailLineProps) {
  const points = useRef<THREE.Vector3[]>([new THREE.Vector3(), new THREE.Vector3()]);
  const frameCount = useRef(0);
  const lineRef = useRef<any>(null);

  // We need at least 2 points for Line
  const initialPoints = useMemo(
    () => [new THREE.Vector3(), new THREE.Vector3()],
    [],
  );

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

    // Update the line geometry
    if (lineRef.current && points.current.length >= 2) {
      const geom = lineRef.current.geometry;
      const positions = new Float32Array(points.current.length * 3);
      for (let i = 0; i < points.current.length; i++) {
        positions[i * 3] = points.current[i].x;
        positions[i * 3 + 1] = points.current[i].y;
        positions[i * 3 + 2] = points.current[i].z;
      }
      geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geom.setDrawRange(0, points.current.length);
      geom.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Line
      ref={lineRef}
      points={initialPoints}
      color={color}
      lineWidth={1.5}
      opacity={0.6}
      transparent
    />
  );
}

export function resetTrails() {
  // Trails reset by re-mounting
}
