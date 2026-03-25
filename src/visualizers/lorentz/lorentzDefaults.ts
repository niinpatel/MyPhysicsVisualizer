import * as THREE from 'three';
import type { Body } from '../../types/simulation';

/** Default: Parallel Currents — immediately shows the magnetic effect */
export function lorentzDefaultBodies(): Body[] {
  const q = 10, m = 5, sep = 6;
  return [
    {
      id: 'charge-1', mass: m, charge: q,
      position: new THREE.Vector3(-sep / 2, 0, 0),
      velocity: new THREE.Vector3(0, 0, 3),
      acceleration: new THREE.Vector3(),
      color: '#ff4444', radius: 0.5,
    },
    {
      id: 'charge-2', mass: m, charge: q,
      position: new THREE.Vector3(sep / 2, 0, 0),
      velocity: new THREE.Vector3(0, 0, 3),
      acceleration: new THREE.Vector3(),
      color: '#ff4444', radius: 0.5,
    },
  ];
}
