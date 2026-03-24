import * as THREE from 'three';

export interface Body {
  id: string;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  acceleration: THREE.Vector3;
  mass: number;
  charge: number;
  color: string;
  radius: number;
}

export type ForceFunction = (bodies: Body[], softening: number) => THREE.Vector3[];

export interface SimulationState {
  bodies: Body[];
  time: number;
  isPlaying: boolean;
  timeScale: number;
}

export interface ConservationQuantities {
  kineticEnergy: number;
  potentialEnergy: number;
  totalEnergy: number;
  totalMomentum: THREE.Vector3;
}

export function cloneBody(b: Body): Body {
  return {
    id: b.id,
    position: b.position.clone(),
    velocity: b.velocity.clone(),
    acceleration: b.acceleration.clone(),
    mass: b.mass,
    charge: b.charge,
    color: b.color,
    radius: b.radius,
  };
}
