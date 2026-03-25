import * as THREE from 'three';
import type { Body, ForceFunction } from '../../types/simulation';

const K_E = 1.0; // Electric (Coulomb) constant
let K_M = 0.5; // Magnetic constant (tuned for visibility, not physical μ₀/4π)

export function setMagneticConstant(value: number) {
  K_M = value;
}

export function getMagneticConstant(): number {
  return K_M;
}

// Pre-allocated temp vectors to avoid GC pressure in the hot loop
const _diff = new THREE.Vector3();
const _bField = new THREE.Vector3();
const _fMag = new THREE.Vector3();

/**
 * Lorentz force: F = q(E + v × B)
 * Electric field: Coulomb's law between charges
 * Magnetic field: Biot-Savart from moving charges
 */
export const lorentzForce: ForceFunction = (bodies, softening) => {
  const forces = bodies.map(() => new THREE.Vector3());

  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      // r_ij = pos_j - pos_i (points from i to j)
      _diff.subVectors(bodies[j].position, bodies[i].position);
      const r2 = _diff.lengthSq() + softening * softening;
      const r = Math.sqrt(r2);

      // --- ELECTRIC FORCE (Coulomb) ---
      // Like charges repel: negative sign so positive product -> force away
      const elecMag = -(K_E * bodies[i].charge * bodies[j].charge) / r2;

      const fEx = (elecMag * _diff.x) / r;
      const fEy = (elecMag * _diff.y) / r;
      const fEz = (elecMag * _diff.z) / r;

      forces[i].x += fEx;
      forces[i].y += fEy;
      forces[i].z += fEz;
      forces[j].x -= fEx;
      forces[j].y -= fEy;
      forces[j].z -= fEz;

      // --- MAGNETIC FORCE (Biot-Savart + Lorentz) ---
      // Magnetic forces do NOT obey Newton's 3rd law pairwise —
      // momentum is carried by the EM fields.

      // B field at i due to j's motion:
      // B_j = (K_M * qj / (r * r2)) * cross(vj, -r_ij)
      //     = -(K_M * qj / (r * r2)) * cross(vj, r_ij)
      const bjCoeff = -K_M * bodies[j].charge / (r * r2);
      _bField.crossVectors(bodies[j].velocity, _diff).multiplyScalar(bjCoeff);
      // Force on i: F = qi * cross(vi, B)
      _fMag.crossVectors(bodies[i].velocity, _bField).multiplyScalar(bodies[i].charge);
      forces[i].add(_fMag);

      // B field at j due to i's motion:
      // r_hat from i to j is +_diff/r
      // B_i = (K_M * qi / (r * r2)) * cross(vi, r_ij)
      const biCoeff = K_M * bodies[i].charge / (r * r2);
      _bField.crossVectors(bodies[i].velocity, _diff).multiplyScalar(biCoeff);
      // Force on j: F = qj * cross(vj, B)
      _fMag.crossVectors(bodies[j].velocity, _bField).multiplyScalar(bodies[j].charge);
      forces[j].add(_fMag);
    }
  }

  return forces;
};

/**
 * Potential energy is electric only — magnetic force has no potential.
 */
export function lorentzPotentialEnergy(bodies: Body[]): number {
  let pe = 0;
  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const r = bodies[i].position.distanceTo(bodies[j].position);
      if (r > 0) {
        pe += (K_E * bodies[i].charge * bodies[j].charge) / r;
      }
    }
  }
  return pe;
}
