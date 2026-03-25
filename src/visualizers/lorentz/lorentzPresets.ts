import * as THREE from 'three';
import type { Preset } from '../../types/visualizer';

function chargeColor(q: number): string {
  return q >= 0 ? '#ff4444' : '#4444ff';
}

export const lorentzPresets: Preset[] = [
  {
    id: 'parallel-currents',
    name: 'Parallel Currents',
    description: 'Same-sign charges moving together — magnetic attraction fights electric repulsion',
    bodies: () => {
      const q = 10, m = 5, sep = 6;
      return [
        {
          id: 'charge-1', mass: m, charge: q,
          position: new THREE.Vector3(-sep / 2, 0, 0),
          velocity: new THREE.Vector3(0, 0, 3),
          acceleration: new THREE.Vector3(),
          color: chargeColor(q), radius: 0.5,
        },
        {
          id: 'charge-2', mass: m, charge: q,
          position: new THREE.Vector3(sep / 2, 0, 0),
          velocity: new THREE.Vector3(0, 0, 3),
          acceleration: new THREE.Vector3(),
          color: chargeColor(q), radius: 0.5,
        },
      ];
    },
  },
  {
    id: 'anti-parallel-currents',
    name: 'Anti-Parallel Currents',
    description: 'Same-sign charges moving in opposite directions — both forces repulsive',
    bodies: () => {
      const q = 10, m = 5, sep = 6;
      return [
        {
          id: 'charge-1', mass: m, charge: q,
          position: new THREE.Vector3(-sep / 2, 0, 0),
          velocity: new THREE.Vector3(0, 0, 3),
          acceleration: new THREE.Vector3(),
          color: chargeColor(q), radius: 0.5,
        },
        {
          id: 'charge-2', mass: m, charge: q,
          position: new THREE.Vector3(sep / 2, 0, 0),
          velocity: new THREE.Vector3(0, 0, -3),
          acceleration: new THREE.Vector3(),
          color: chargeColor(q), radius: 0.5,
        },
      ];
    },
  },
  {
    id: 'magnetic-orbit',
    name: 'Magnetic Orbit Correction',
    description: 'Opposite charges orbiting — magnetic force causes orbital precession',
    bodies: () => {
      const q = 8, m = 5, sep = 8;
      const v = Math.sqrt((q * q) / (m * 2 * sep));
      return [
        {
          id: 'charge-1', mass: m, charge: q,
          position: new THREE.Vector3(-sep / 2, 0, 0),
          velocity: new THREE.Vector3(0, 0, v),
          acceleration: new THREE.Vector3(),
          color: chargeColor(q), radius: 0.5,
        },
        {
          id: 'charge-2', mass: m, charge: -q,
          position: new THREE.Vector3(sep / 2, 0, 0),
          velocity: new THREE.Vector3(0, 0, -v),
          acceleration: new THREE.Vector3(),
          color: chargeColor(-q), radius: 0.5,
        },
      ];
    },
  },
  {
    id: 'high-speed-deflection',
    name: 'High-Speed Deflection',
    description: 'Fast charge scattered by heavy one — magnetic deflection at high velocity',
    bodies: () => {
      return [
        {
          id: 'charge-1', mass: 50, charge: 12,
          position: new THREE.Vector3(0, 0, 0),
          velocity: new THREE.Vector3(0, 0, 0),
          acceleration: new THREE.Vector3(),
          color: chargeColor(12), radius: 0.8,
        },
        {
          id: 'charge-2', mass: 3, charge: 6,
          position: new THREE.Vector3(-18, 0, 2.5),
          velocity: new THREE.Vector3(4, 0, 0),
          acceleration: new THREE.Vector3(),
          color: '#ffaa44', radius: 0.4,
        },
      ];
    },
  },
  {
    id: 'magnetic-spiral',
    name: 'Magnetic Spiral',
    description: 'Equal charges with perpendicular velocities — cross-products create spirals',
    bodies: () => {
      const q = 8, m = 5, sep = 5;
      return [
        {
          id: 'charge-1', mass: m, charge: q,
          position: new THREE.Vector3(-sep / 2, 0, 0),
          velocity: new THREE.Vector3(0, 2, 0),
          acceleration: new THREE.Vector3(),
          color: chargeColor(q), radius: 0.5,
        },
        {
          id: 'charge-2', mass: m, charge: q,
          position: new THREE.Vector3(sep / 2, 0, 0),
          velocity: new THREE.Vector3(0, 0, 2),
          acceleration: new THREE.Vector3(),
          color: chargeColor(q), radius: 0.5,
        },
      ];
    },
  },
];
