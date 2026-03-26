import * as THREE from 'three';
import type { Body, ForceFunction } from '../../types/simulation';

// Permeability scaling constant — analogous to μ₀/(2π),
// tuned so forces are visible at simulation scales.
let mu0 = 1.0;

export function setMu0(value: number) {
  mu0 = value;
}

export function getMu0(): number {
  return mu0;
}

// Wire length — determines total force (F = F/L × L)
let wireLength = 12;

export function setWireLength(value: number) {
  wireLength = value;
}

export function getWireLength(): number {
  return wireLength;
}

// Wire direction per body (unit vector). Default: Y-axis.
const _defaultDir = new THREE.Vector3(0, 1, 0);
const wireDirections = new Map<string, THREE.Vector3>();

export function setWireDirection(bodyId: string, dir: THREE.Vector3) {
  wireDirections.set(bodyId, dir.clone().normalize());
}

export function clearWireDirections() {
  wireDirections.clear();
}

export function getWireDirection(bodyId: string): THREE.Vector3 {
  return wireDirections.get(bodyId) ?? _defaultDir;
}

export const CURRENTS_SOFTENING = 0.2;

// Number of discrete segments for Ampère element summation
export const N_SEGMENTS = 20;

const _r = new THREE.Vector3();
const _rHat = new THREE.Vector3();
const _segPosI = new THREE.Vector3();
const _segPosJ = new THREE.Vector3();

/**
 * Ampère's original force law between current elements (action-at-a-distance).
 *
 * For each pair of wire segments:
 *   d²F = -(μ₀ I₁ I₂)/(4π r²) · [2(dl̂₁·dl̂₂) - 3(r̂·dl̂₁)(r̂·dl̂₂)] · dl₁·dl₂ · r̂
 *
 * Key property: forces are always CENTRAL (along r̂), so Newton's 3rd law
 * holds for every element pair. This differs from Biot-Savart/Lorentz which
 * gives non-central forces for non-parallel geometries.
 *
 * For parallel wires this reduces to F/L = μ₀I₁I₂/(2πd).
 * For perpendicular wires the predictions diverge from Maxwell/Biot-Savart.
 */
const _forces: THREE.Vector3[] = [];

export const currentForce: ForceFunction = (bodies, softening) => {
  while (_forces.length < bodies.length) _forces.push(new THREE.Vector3());
  for (let i = 0; i < bodies.length; i++) _forces[i].set(0, 0, 0);
  const segLen = wireLength / N_SEGMENTS;

  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const dirI = getWireDirection(bodies[i].id);
      const dirJ = getWireDirection(bodies[j].id);
      const I1 = bodies[i].charge;
      const I2 = bodies[j].charge;

      // Precompute direction dot products (constant across segments)
      const dlDotDl = dirI.dot(dirJ);

      let fx = 0, fy = 0, fz = 0;

      // Sum over all segment pairs
      for (let si = 0; si < N_SEGMENTS; si++) {
        const tI = (si + 0.5) / N_SEGMENTS - 0.5;
        _segPosI.copy(dirI).multiplyScalar(tI * wireLength).add(bodies[i].position);

        for (let sj = 0; sj < N_SEGMENTS; sj++) {
          const tJ = (sj + 0.5) / N_SEGMENTS - 0.5;
          _segPosJ.copy(dirJ).multiplyScalar(tJ * wireLength).add(bodies[j].position);

          _r.subVectors(_segPosJ, _segPosI);
          const r2 = _r.lengthSq() + softening * softening;
          const rMag = Math.sqrt(r2);
          _rHat.copy(_r).divideScalar(rMag);

          const rDotDlI = _rHat.dot(dirI);
          const rDotDlJ = _rHat.dot(dirJ);

          const bracket = 2 * dlDotDl - 3 * rDotDlI * rDotDlJ;
          const coeff = -(mu0 * I1 * I2 * segLen * segLen) / (4 * Math.PI * r2) * bracket;

          fx += coeff * _rHat.x;
          fy += coeff * _rHat.y;
          fz += coeff * _rHat.z;
        }
      }

      _forces[j].x += fx;
      _forces[j].y += fy;
      _forces[j].z += fz;
      _forces[i].x -= fx;
      _forces[i].y -= fy;
      _forces[i].z -= fz;
    }
  }

  return _forces;
};

/**
 * Potential energy — not physically meaningful for this static demo.
 */
export function currentPotentialEnergy(_bodies: Body[]): number {
  return 0;
}
