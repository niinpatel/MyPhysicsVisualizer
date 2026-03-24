import * as THREE from 'three';
import type { Body } from '../../types/simulation';

/**
 * Two opposite charges in orbit.
 * Coulomb attraction: F = k*|q1|*|q2|/r² (same as gravity form with charges instead of masses)
 * For circular orbit: v = sqrt(k*|q1*q2| / (m * 2 * r)) for equal mass particles
 */
export function coulombDefaultBodies(): Body[] {
  const separation = 8;
  const charge = 8;
  const mass = 5;
  // v = sqrt(k * q^2 / (m * 2 * r_half)) for circular orbit
  const orbitalSpeed = Math.sqrt((charge * charge) / (mass * 2 * (separation / 2)));

  return [
    {
      id: 'charge-1',
      position: new THREE.Vector3(-separation / 2, 0, 0),
      velocity: new THREE.Vector3(0, 0, orbitalSpeed),
      acceleration: new THREE.Vector3(0, 0, 0),
      mass,
      charge: charge,
      color: '#ff4444',
      radius: 0.5,
    },
    {
      id: 'charge-2',
      position: new THREE.Vector3(separation / 2, 0, 0),
      velocity: new THREE.Vector3(0, 0, -orbitalSpeed),
      acceleration: new THREE.Vector3(0, 0, 0),
      mass,
      charge: -charge,
      color: '#4444ff',
      radius: 0.5,
    },
  ];
}
