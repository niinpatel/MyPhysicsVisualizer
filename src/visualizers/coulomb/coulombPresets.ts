import * as THREE from 'three';
import type { Preset } from '../../types/visualizer';

function chargeColor(q: number): string {
  return q >= 0 ? '#ff4444' : '#4444ff';
}

export const coulombPresets: Preset[] = [
  {
    id: 'opposite-orbit',
    name: 'Opposite Charges Orbit',
    description: 'Classic attraction — opposite charges in a stable orbit',
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
    id: 'like-repulsion',
    name: 'Like Charges Repel',
    description: 'Same-sign charges push each other apart',
    bodies: () => {
      const q = 10, m = 5, sep = 6;
      return [
        {
          id: 'charge-1', mass: m, charge: q,
          position: new THREE.Vector3(-sep / 2, 0, 0),
          velocity: new THREE.Vector3(0, 0, 0.3),
          acceleration: new THREE.Vector3(),
          color: chargeColor(q), radius: 0.5,
        },
        {
          id: 'charge-2', mass: m, charge: q,
          position: new THREE.Vector3(sep / 2, 0, 0),
          velocity: new THREE.Vector3(0, 0, -0.3),
          acceleration: new THREE.Vector3(),
          color: chargeColor(q), radius: 0.5,
        },
      ];
    },
  },
  {
    id: 'proton-electron',
    name: 'Proton & Electron',
    description: 'Heavy positive nucleus with a light orbiting negative particle',
    bodies: () => {
      const qP = 15, qE = -5, mP = 40, mE = 1, sep = 10;
      // Light particle orbits the heavy one
      const v = Math.sqrt(Math.abs(qP * qE) / (mE * sep));
      const vHeavy = -(mE / mP) * v;
      return [
        {
          id: 'charge-1', mass: mP, charge: qP,
          position: new THREE.Vector3(-sep / 2, 0, 0),
          velocity: new THREE.Vector3(0, 0, vHeavy),
          acceleration: new THREE.Vector3(),
          color: chargeColor(qP), radius: 0.8,
        },
        {
          id: 'charge-2', mass: mE, charge: qE,
          position: new THREE.Vector3(sep / 2, 0, 0),
          velocity: new THREE.Vector3(0, 0, v),
          acceleration: new THREE.Vector3(),
          color: chargeColor(qE), radius: 0.3,
        },
      ];
    },
  },
  {
    id: 'deflection',
    name: 'Coulomb Scattering',
    description: 'A charged particle deflected by a fixed charge — Rutherford style',
    bodies: () => {
      const Q = 12, m = 3;
      return [
        {
          id: 'charge-1', mass: 50, charge: Q,
          position: new THREE.Vector3(0, 0, 0),
          velocity: new THREE.Vector3(0, 0, 0),
          acceleration: new THREE.Vector3(),
          color: chargeColor(Q), radius: 0.8,
        },
        {
          id: 'charge-2', mass: m, charge: Q * 0.5,
          position: new THREE.Vector3(-18, 0, 2.5),
          velocity: new THREE.Vector3(2.0, 0, 0),
          acceleration: new THREE.Vector3(),
          color: '#ffaa44', radius: 0.4,
        },
      ];
    },
  },
  {
    id: 'dipole-dance',
    name: 'Dipole Dance',
    description: 'Asymmetric charges create a complex orbital dance',
    bodies: () => {
      const q1 = 12, q2 = -6, m = 5, sep = 8;
      const v = Math.sqrt(Math.abs(q1 * q2) / (m * 2 * sep));
      return [
        {
          id: 'charge-1', mass: m, charge: q1,
          position: new THREE.Vector3(-sep / 2, 0, 0),
          velocity: new THREE.Vector3(0, 0, v * 0.8),
          acceleration: new THREE.Vector3(),
          color: chargeColor(q1), radius: 0.6,
        },
        {
          id: 'charge-2', mass: m, charge: q2,
          position: new THREE.Vector3(sep / 2, 0, 0),
          velocity: new THREE.Vector3(0, 0, -v * 0.8),
          acceleration: new THREE.Vector3(),
          color: chargeColor(q2), radius: 0.4,
        },
      ];
    },
  },
];
