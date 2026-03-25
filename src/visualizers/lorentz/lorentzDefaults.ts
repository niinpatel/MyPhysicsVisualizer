import * as THREE from 'three';
import type { Body } from '../../types/simulation';

/** Default: Magnetic Orbit — opposite charges orbiting with magnetic precession */
export function lorentzDefaultBodies(): Body[] {
  const q = 8, m = 5, sep = 8;
  const v = Math.sqrt((q * q) / (m * 2 * sep));
  return [
    {
      id: 'charge-1', mass: m, charge: q,
      position: new THREE.Vector3(-sep / 2, 0, 0),
      velocity: new THREE.Vector3(0, 0, v),
      acceleration: new THREE.Vector3(),
      color: '#ff4444', radius: 0.5,
    },
    {
      id: 'charge-2', mass: m, charge: -q,
      position: new THREE.Vector3(sep / 2, 0, 0),
      velocity: new THREE.Vector3(0, 0, -v),
      acceleration: new THREE.Vector3(),
      color: '#4444ff', radius: 0.5,
    },
  ];
}
