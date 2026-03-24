import * as THREE from 'three';
import type { Body, ForceFunction } from '../../types/simulation';

const K = 1.0; // Coulomb constant (simulation units)
const _diff = new THREE.Vector3();

export const coulombForce: ForceFunction = (bodies, softening) => {
  const forces = bodies.map(() => new THREE.Vector3());

  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      _diff.subVectors(bodies[j].position, bodies[i].position);
      const r2 = _diff.lengthSq() + softening * softening;
      const r = Math.sqrt(r2);
      // Coulomb: like charges repel (positive force away), unlike attract
      // Force on i due to j: F = k*q1*q2/r^2 * r_hat (from i to j)
      // If q1*q2 > 0 (like charges), force is along (j-i) direction → repulsion
      // Wait, that's wrong. If like charges, force should push i AWAY from j.
      // F_on_i = -k*q1*q2/r^2 * r_hat(i->j) for like charges to repel
      const magnitude = -(K * bodies[i].charge * bodies[j].charge) / r2;

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

export function coulombPotentialEnergy(bodies: Body[]): number {
  let pe = 0;
  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const r = bodies[i].position.distanceTo(bodies[j].position);
      if (r > 0) {
        pe += (K * bodies[i].charge * bodies[j].charge) / r;
      }
    }
  }
  return pe;
}
