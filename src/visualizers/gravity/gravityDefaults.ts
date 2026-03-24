import * as THREE from 'three';
import type { Body } from '../../types/simulation';

/**
 * Two masses in a near-circular orbit.
 * For circular orbit: v = sqrt(G*M/r) where r is distance from center of mass.
 * With G=1, m1=m2=10, separation=10 → r=5 from center, v=sqrt(10/5)=sqrt(2)≈1.414
 */
export function gravityDefaultBodies(): Body[] {
  const separation = 10;
  const mass = 10;
  // For equal masses, each orbits at half the separation
  // v = sqrt(G * m_other / (4 * r_half)) for circular orbit of equal masses
  // v = sqrt(1 * 10 / (4 * 5)) = sqrt(0.5) ≈ 0.707
  const orbitalSpeed = Math.sqrt(mass / (2 * separation));

  return [
    {
      id: 'body-1',
      position: new THREE.Vector3(-separation / 2, 0, 0),
      velocity: new THREE.Vector3(0, 0, orbitalSpeed),
      acceleration: new THREE.Vector3(0, 0, 0),
      mass,
      charge: 0,
      color: '#ff6644',
      radius: 0.6,
    },
    {
      id: 'body-2',
      position: new THREE.Vector3(separation / 2, 0, 0),
      velocity: new THREE.Vector3(0, 0, -orbitalSpeed),
      acceleration: new THREE.Vector3(0, 0, 0),
      mass,
      charge: 0,
      color: '#44aaff',
      radius: 0.6,
    },
  ];
}
