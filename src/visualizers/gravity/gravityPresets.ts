import * as THREE from 'three';
import type { Body } from '../../types/simulation';
import type { Preset } from '../../types/visualizer';

function makeBodies(opts: {
  m1: number; m2: number;
  sep: number;
  v1: THREE.Vector3; v2: THREE.Vector3;
  color1?: string; color2?: string;
}): Body[] {
  const r1 = Math.max(0.2, Math.cbrt(opts.m1) * 0.2);
  const r2 = Math.max(0.2, Math.cbrt(opts.m2) * 0.2);
  return [
    {
      id: 'body-1',
      position: new THREE.Vector3(-opts.sep / 2, 0, 0),
      velocity: opts.v1.clone(),
      acceleration: new THREE.Vector3(),
      mass: opts.m1,
      charge: 0,
      color: opts.color1 ?? '#ff6644',
      radius: r1,
    },
    {
      id: 'body-2',
      position: new THREE.Vector3(opts.sep / 2, 0, 0),
      velocity: opts.v2.clone(),
      acceleration: new THREE.Vector3(),
      mass: opts.m2,
      charge: 0,
      color: opts.color2 ?? '#44aaff',
      radius: r2,
    },
  ];
}

export const gravityPresets: Preset[] = [
  {
    id: 'binary-orbit',
    name: 'Binary Orbit',
    description: 'Two equal masses in a stable circular orbit',
    bodies: () => {
      const m = 10, sep = 10;
      const v = Math.sqrt(m / (2 * sep));
      return makeBodies({
        m1: m, m2: m, sep,
        v1: new THREE.Vector3(0, 0, v),
        v2: new THREE.Vector3(0, 0, -v),
      });
    },
  },
  {
    id: 'sun-planet',
    name: 'Sun & Planet',
    description: 'A heavy star with a small orbiting planet',
    bodies: () => {
      const M = 50, m = 1, sep = 12;
      // Planet orbits around nearly-stationary sun
      // v = sqrt(G * M / r) for small mass orbiting large mass
      const vPlanet = Math.sqrt(M / sep);
      const vStar = -(m / M) * vPlanet; // momentum conservation
      return makeBodies({
        m1: M, m2: m, sep,
        v1: new THREE.Vector3(0, 0, vStar),
        v2: new THREE.Vector3(0, 0, vPlanet),
        color1: '#ffcc22', color2: '#44aaff',
      });
    },
  },
  {
    id: 'elliptical',
    name: 'Elliptical Orbit',
    description: 'Eccentric elliptical orbit — watch the speed change!',
    bodies: () => {
      const m = 10, sep = 10;
      // ~60% of circular speed → elliptical orbit
      const vCirc = Math.sqrt(m / (2 * sep));
      const v = vCirc * 0.55;
      return makeBodies({
        m1: m, m2: m, sep,
        v1: new THREE.Vector3(0, 0, v),
        v2: new THREE.Vector3(0, 0, -v),
      });
    },
  },
  {
    id: 'slingshot',
    name: 'Slingshot',
    description: 'Hyperbolic flyby — one body swings around the other',
    bodies: () => {
      const M = 40, m = 2;
      return [
        {
          id: 'body-1',
          position: new THREE.Vector3(0, 0, 0),
          velocity: new THREE.Vector3(0, 0, 0),
          acceleration: new THREE.Vector3(),
          mass: M, charge: 0,
          color: '#ffcc22', radius: Math.cbrt(M) * 0.2,
        },
        {
          id: 'body-2',
          position: new THREE.Vector3(-20, 0, 3),
          velocity: new THREE.Vector3(2.5, 0, 0),
          acceleration: new THREE.Vector3(),
          mass: m, charge: 0,
          color: '#44aaff', radius: Math.max(0.2, Math.cbrt(m) * 0.2),
        },
      ];
    },
  },
  {
    id: 'head-on',
    name: 'Head-on Collision',
    description: 'Two bodies falling straight toward each other',
    bodies: () => {
      const m = 10, sep = 15;
      return makeBodies({
        m1: m, m2: m, sep,
        v1: new THREE.Vector3(0.3, 0, 0),
        v2: new THREE.Vector3(-0.3, 0, 0),
      });
    },
  },
  {
    id: 'dance-of-unequals',
    name: 'Dance of Unequals',
    description: 'Asymmetric masses — the heavy one barely moves',
    bodies: () => {
      const m1 = 25, m2 = 3, sep = 10;
      const totalM = m1 + m2;
      // Center of mass frame circular orbit
      const vCirc = Math.sqrt(totalM / sep);
      const v1 = (m2 / totalM) * vCirc;
      const v2 = -(m1 / totalM) * vCirc;
      return makeBodies({
        m1, m2, sep,
        v1: new THREE.Vector3(0, 0, v1),
        v2: new THREE.Vector3(0, 0, v2),
        color1: '#ff8844', color2: '#66ddff',
      });
    },
  },
];
