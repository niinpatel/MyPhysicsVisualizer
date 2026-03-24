import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSimulationStore } from '../../store/useSimulationStore';

interface Body3DProps {
  bodyId: string;
  trailRef?: React.MutableRefObject<THREE.Vector3[]>;
}

export function Body3D({ bodyId, trailRef }: Body3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const frameCount = useRef(0);

  useFrame(() => {
    const body = useSimulationStore.getState().bodies.find((b) => b.id === bodyId);
    if (!body || !meshRef.current) return;

    meshRef.current.position.copy(body.position);

    // Update trail every 3 frames
    if (trailRef) {
      frameCount.current++;
      if (frameCount.current % 3 === 0) {
        trailRef.current.push(body.position.clone());
        if (trailRef.current.length > 200) {
          trailRef.current.shift();
        }
      }
    }
  });

  const body = useSimulationStore((s) => s.bodies.find((b) => b.id === bodyId));
  if (!body) return null;

  return (
    <mesh ref={meshRef} position={body.position}>
      <sphereGeometry args={[body.radius, 32, 32]} />
      <meshStandardMaterial color={body.color} roughness={0.3} metalness={0.5} />
    </mesh>
  );
}
