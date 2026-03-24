import type { VisualizerConfig } from '../types/visualizer';
import { gravitationalForce, gravitationalPotentialEnergy } from '../engine/forces/gravity';
import { coulombForce, coulombPotentialEnergy } from '../engine/forces/coulomb';
import { GravityVisualizer } from './gravity/GravityVisualizer';
import { GravityControls } from './gravity/GravityControls';
import { gravityDefaultBodies } from './gravity/gravityDefaults';
import { CoulombVisualizer } from './coulomb/CoulombVisualizer';
import { CoulombControls } from './coulomb/CoulombControls';
import { coulombDefaultBodies } from './coulomb/coulombDefaults';

export const visualizerRegistry: VisualizerConfig[] = [
  {
    id: 'gravity',
    name: 'Newtonian Gravity',
    description: 'Two masses interacting via gravitational attraction (F = Gm₁m₂/r²)',
    forceFunction: gravitationalForce,
    defaultBodies: gravityDefaultBodies,
    SceneComponent: GravityVisualizer,
    ControlsComponent: GravityControls,
    computePotentialEnergy: gravitationalPotentialEnergy,
    softening: 0.5,
  },
  {
    id: 'coulomb',
    name: "Coulomb's Force",
    description: 'Two charged particles interacting via electrostatic force (F = kq₁q₂/r²)',
    forceFunction: coulombForce,
    defaultBodies: coulombDefaultBodies,
    SceneComponent: CoulombVisualizer,
    ControlsComponent: CoulombControls,
    computePotentialEnergy: coulombPotentialEnergy,
    softening: 0.3,
  },
];
