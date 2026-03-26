import * as THREE from 'three';
import type { Preset } from '../../types/visualizer';

export const currentsPresets: Preset[] = [
  {
    id: 'parallel-attraction',
    name: 'Parallel Currents (Attraction)',
    description: 'Same-direction currents attract — the classic Ampère demonstration',
    bodies: () => [
      {
        id: 'wire-1', mass: 1000, charge: 5,
        position: new THREE.Vector3(-2, 0, 0),
        velocity: new THREE.Vector3(),
        acceleration: new THREE.Vector3(),
        color: '#ff6644', radius: 0.15,
      },
      {
        id: 'wire-2', mass: 1000, charge: 5,
        position: new THREE.Vector3(2, 0, 0),
        velocity: new THREE.Vector3(),
        acceleration: new THREE.Vector3(),
        color: '#4488ff', radius: 0.15,
      },
    ],
  },
  {
    id: 'antiparallel-repulsion',
    name: 'Anti-Parallel Currents (Repulsion)',
    description: 'Opposite-direction currents repel each other',
    bodies: () => [
      {
        id: 'wire-1', mass: 1000, charge: 5,
        position: new THREE.Vector3(-2, 0, 0),
        velocity: new THREE.Vector3(),
        acceleration: new THREE.Vector3(),
        color: '#ff6644', radius: 0.15,
      },
      {
        id: 'wire-2', mass: 1000, charge: -5,
        position: new THREE.Vector3(2, 0, 0),
        velocity: new THREE.Vector3(),
        acceleration: new THREE.Vector3(),
        color: '#4488ff', radius: 0.15,
      },
    ],
  },
  {
    id: 'unequal-currents',
    name: 'Unequal Currents',
    description: 'Different current magnitudes — force scales with I₁ × I₂',
    bodies: () => [
      {
        id: 'wire-1', mass: 1000, charge: 10,
        position: new THREE.Vector3(-3, 0, 0),
        velocity: new THREE.Vector3(),
        acceleration: new THREE.Vector3(),
        color: '#ff6644', radius: 0.15,
      },
      {
        id: 'wire-2', mass: 1000, charge: 2,
        position: new THREE.Vector3(3, 0, 0),
        velocity: new THREE.Vector3(),
        acceleration: new THREE.Vector3(),
        color: '#4488ff', radius: 0.15,
      },
    ],
  },
  {
    id: 'perpendicular',
    name: 'Perpendicular Wires ★',
    description: 'Compare green (Ampère) vs magenta (Biot-Savart) arrows — forces differ!',
    bodies: () => [
      {
        id: 'wire-1', mass: 1000, charge: 5,
        position: new THREE.Vector3(-2, 0, 0),
        velocity: new THREE.Vector3(),
        acceleration: new THREE.Vector3(),
        color: '#ff6644', radius: 0.15,
      },
      {
        id: 'wire-2', mass: 1000, charge: 5,
        position: new THREE.Vector3(2, 0, 0),
        velocity: new THREE.Vector3(),
        acceleration: new THREE.Vector3(),
        color: '#4488ff', radius: 0.15,
      },
    ],
  },
];

/**
 * Wire directions per preset. Wire 1 direction, Wire 2 direction.
 * Default is Y-axis for both. The "perpendicular" preset has wire 2 along X.
 */
export const presetWireDirections: Record<string, [THREE.Vector3, THREE.Vector3]> = {
  'parallel-attraction': [new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 1, 0)],
  'antiparallel-repulsion': [new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 1, 0)],
  'unequal-currents': [new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 1, 0)],
  'perpendicular': [new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 0, 0)],
};
