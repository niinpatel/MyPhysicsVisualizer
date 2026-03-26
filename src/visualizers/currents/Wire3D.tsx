import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useSimulationStore } from '../../store/useSimulationStore';
import { getWireLength, getWireDirection } from './currentForce';

const CARRIER_COUNT = 10;
const CARRIER_RADIUS = 0.12;
const CARRIER_SPEED = 3;

const _up = new THREE.Vector3(0, 1, 0);
const _quat = new THREE.Quaternion();

interface Wire3DProps {
  bodyId: string;
}

export function Wire3D({ bodyId }: Wire3DProps) {
  const wireRef = useRef<THREE.Mesh>(null);
  const carrierRefs = useRef<(THREE.Mesh | null)[]>([]);
  const carrierOffsets = useRef<number[]>(
    Array.from({ length: CARRIER_COUNT }, (_, i) => (i / CARRIER_COUNT) - 0.5)
  );

  const carrierMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#ffdd44', emissive: '#ffaa00', emissiveIntensity: 0.6 }),
    []
  );

  useFrame((_, delta) => {
    const body = useSimulationStore.getState().bodies.find((b) => b.id === bodyId);
    if (!body) return;

    const length = getWireLength();
    const current = body.charge; // charge encodes current
    const wireDir = getWireDirection(bodyId);

    // Orient and position wire mesh
    if (wireRef.current) {
      wireRef.current.position.copy(body.position);
      wireRef.current.scale.set(1, length, 1);
      _quat.setFromUnitVectors(_up, wireDir);
      wireRef.current.quaternion.copy(_quat);
    }

    // Animate charge carriers along wire direction
    const speed = CARRIER_SPEED * Math.sign(current) * Math.min(Math.abs(current), 20) / 5;
    const offsets = carrierOffsets.current;

    for (let i = 0; i < CARRIER_COUNT; i++) {
      offsets[i] += speed * delta / length;
      // Wrap around
      if (offsets[i] > 0.5) offsets[i] -= 1;
      if (offsets[i] < -0.5) offsets[i] += 1;

      const mesh = carrierRefs.current[i];
      if (mesh) {
        mesh.position.copy(body.position).addScaledVector(wireDir, offsets[i] * length);
        mesh.visible = Math.abs(current) > 0.01;
      }
    }
  });

  return (
    <>
      <mesh ref={wireRef}>
        <cylinderGeometry args={[0.08, 0.08, 1, 16]} />
        <meshStandardMaterial color="#888888" metalness={0.7} roughness={0.3} />
      </mesh>

      {Array.from({ length: CARRIER_COUNT }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => { carrierRefs.current[i] = el; }}
        >
          <sphereGeometry args={[CARRIER_RADIUS, 8, 8]} />
          <primitive object={carrierMaterial} attach="material" />
        </mesh>
      ))}
    </>
  );
}
