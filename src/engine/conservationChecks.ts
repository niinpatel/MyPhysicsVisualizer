import * as THREE from 'three';
import type { Body, ConservationQuantities } from '../types/simulation';

export function computeKineticEnergy(bodies: Body[]): number {
  let ke = 0;
  for (const body of bodies) {
    ke += 0.5 * body.mass * body.velocity.lengthSq();
  }
  return ke;
}

export function computeTotalMomentum(bodies: Body[]): THREE.Vector3 {
  const p = new THREE.Vector3();
  for (const body of bodies) {
    p.x += body.mass * body.velocity.x;
    p.y += body.mass * body.velocity.y;
    p.z += body.mass * body.velocity.z;
  }
  return p;
}

export function computeConservation(
  bodies: Body[],
  potentialEnergyFn: (bodies: Body[]) => number,
): ConservationQuantities {
  const kineticEnergy = computeKineticEnergy(bodies);
  const potentialEnergy = potentialEnergyFn(bodies);
  return {
    kineticEnergy,
    potentialEnergy,
    totalEnergy: kineticEnergy + potentialEnergy,
    totalMomentum: computeTotalMomentum(bodies),
  };
}
