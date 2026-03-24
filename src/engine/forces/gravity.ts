import * as THREE from 'three';
import type { Body, ForceFunction } from '../../types/simulation';

const G = 1.0; // gravitational constant (simulation units)
const _diff = new THREE.Vector3();

export const gravitationalForce: ForceFunction = (bodies, softening) => {
  const forces = bodies.map(() => new THREE.Vector3());

  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      _diff.subVectors(bodies[j].position, bodies[i].position);
      const r2 = _diff.lengthSq() + softening * softening;
      const r = Math.sqrt(r2);
      const magnitude = (G * bodies[i].mass * bodies[j].mass) / r2;

      const fx = (magnitude * _diff.x) / r;
      const fy = (magnitude * _diff.y) / r;
      const fz = (magnitude * _diff.z) / r;

      forces[i].x += fx;
      forces[i].y += fy;
      forces[i].z += fz;
      forces[j].x -= fx;
      forces[j].y -= fy;
      forces[j].z -= fz;
    }
  }

  return forces;
};

export function gravitationalPotentialEnergy(bodies: Body[]): number {
  let pe = 0;
  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const r = bodies[i].position.distanceTo(bodies[j].position);
      if (r > 0) {
        pe -= (G * bodies[i].mass * bodies[j].mass) / r;
      }
    }
  }
  return pe;
}
