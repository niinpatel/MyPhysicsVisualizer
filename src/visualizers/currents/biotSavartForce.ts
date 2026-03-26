import * as THREE from 'three';
import type { ForceFunction } from '../../types/simulation';
import { getMu0, getWireLength, getWireDirection, N_SEGMENTS } from './currentForce';

const _r = new THREE.Vector3();
const _rHat = new THREE.Vector3();
const _segPosI = new THREE.Vector3();
const _segPosJ = new THREE.Vector3();

/**
 * Biot-Savart/Lorentz (Grassmann) force law between current elements.
 *
 * For each pair of wire segments:
 *   d²F_on_j = +(μ₀ I₁ I₂)/(4π r²) · dl_j × (dl_i × r̂)
 *
 * Using BAC-CAB: dl_j × (dl_i × r̂) = dl_i·(dl_j · r̂) - r̂·(dl_j · dl_i)
 *
 * Key property: forces are NON-CENTRAL for non-parallel geometries.
 * Newton's 3rd law is "violated" at the element level — the missing
 * momentum is carried by the electromagnetic field.
 *
 * For parallel wires this gives the same result as Ampère's formula.
 * For perpendicular wires the force directions diverge.
 */
const _forces: THREE.Vector3[] = [];

export const biotSavartForce: ForceFunction = (bodies, softening) => {
  while (_forces.length < bodies.length) _forces.push(new THREE.Vector3());
  for (let i = 0; i < bodies.length; i++) _forces[i].set(0, 0, 0);
  const mu0 = getMu0();
  const wireLength = getWireLength();
  const segLen = wireLength / N_SEGMENTS;

  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const dirI = getWireDirection(bodies[i].id);
      const dirJ = getWireDirection(bodies[j].id);
      const I1 = bodies[i].charge;
      const I2 = bodies[j].charge;

      // Precompute dl vectors (direction × segment length)
      const dlIx = dirI.x * segLen, dlIy = dirI.y * segLen, dlIz = dirI.z * segLen;
      const dlJx = dirJ.x * segLen, dlJy = dirJ.y * segLen, dlJz = dirJ.z * segLen;

      // Accumulate force on j from i, and force on i from j, SEPARATELY
      let fjx = 0, fjy = 0, fjz = 0;
      let fix = 0, fiy = 0, fiz = 0;

      for (let si = 0; si < N_SEGMENTS; si++) {
        const tI = (si + 0.5) / N_SEGMENTS - 0.5;
        _segPosI.copy(dirI).multiplyScalar(tI * wireLength).add(bodies[i].position);

        for (let sj = 0; sj < N_SEGMENTS; sj++) {
          const tJ = (sj + 0.5) / N_SEGMENTS - 0.5;
          _segPosJ.copy(dirJ).multiplyScalar(tJ * wireLength).add(bodies[j].position);

          // r from segment i to segment j
          _r.subVectors(_segPosJ, _segPosI);
          const r2 = _r.lengthSq() + softening * softening;
          const rMag = Math.sqrt(r2);
          _rHat.copy(_r).divideScalar(rMag);

          const coeff = (mu0 * I1 * I2) / (4 * Math.PI * r2);

          // --- Force on wire j from wire i's field ---
          // Grassmann: dl_j × (dl_i × r̂)
          // BAC-CAB: dl_i * (dl_j · r̂) - r̂ * (dl_j · dl_i)
          const dlJdotR = dlJx * _rHat.x + dlJy * _rHat.y + dlJz * _rHat.z;
          const dlJdotDlI = dlJx * dlIx + dlJy * dlIy + dlJz * dlIz;

          fjx += coeff * (dlIx * dlJdotR - _rHat.x * dlJdotDlI);
          fjy += coeff * (dlIy * dlJdotR - _rHat.y * dlJdotDlI);
          fjz += coeff * (dlIz * dlJdotR - _rHat.z * dlJdotDlI);

          // --- Force on wire i from wire j's field ---
          // B at i from j uses r̂' = -r̂, giving an overall sign flip:
          // d²F_i = -(μ₀ I₁ I₂)/(4π r²) · dl_i × (dl_j × r̂)
          // BAC-CAB: dl_j * (dl_i · r̂) - r̂ * (dl_i · dl_j), then negate.
          const dlIdotR = dlIx * _rHat.x + dlIy * _rHat.y + dlIz * _rHat.z;

          fix -= coeff * (dlJx * dlIdotR - _rHat.x * dlJdotDlI);
          fiy -= coeff * (dlJy * dlIdotR - _rHat.y * dlJdotDlI);
          fiz -= coeff * (dlJz * dlIdotR - _rHat.z * dlJdotDlI);
        }
      }

      _forces[j].x += fjx;
      _forces[j].y += fjy;
      _forces[j].z += fjz;
      _forces[i].x += fix;
      _forces[i].y += fiy;
      _forces[i].z += fiz;
    }
  }

  return _forces;
};
