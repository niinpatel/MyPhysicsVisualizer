import * as THREE from 'three';
import type { Body } from '../../types/simulation';

/** Default: Parallel currents (attraction) — two wires separated along X */
export function currentsDefaultBodies(): Body[] {
  return [
    {
      id: 'wire-1',
      position: new THREE.Vector3(-2, 0, 0),
      velocity: new THREE.Vector3(),
      acceleration: new THREE.Vector3(),
      mass: 1000,
      charge: 5,       // current = 5A in +Z direction
      color: '#ff6644',
      radius: 0.15,
    },
    {
      id: 'wire-2',
      position: new THREE.Vector3(2, 0, 0),
      velocity: new THREE.Vector3(),
      acceleration: new THREE.Vector3(),
      mass: 1000,
      charge: 5,        // same direction = parallel = attractive
      color: '#4488ff',
      radius: 0.15,
    },
  ];
}
