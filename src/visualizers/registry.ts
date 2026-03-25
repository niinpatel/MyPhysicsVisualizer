import type { VisualizerConfig } from '../types/visualizer';
import { gravitationalForce, gravitationalPotentialEnergy } from '../engine/forces/gravity';
import { coulombForce, coulombPotentialEnergy } from '../engine/forces/coulomb';
import { GravityVisualizer } from './gravity/GravityVisualizer';
import { GravityControls } from './gravity/GravityControls';
import { gravityDefaultBodies } from './gravity/gravityDefaults';
import { gravityPresets } from './gravity/gravityPresets';
import { CoulombVisualizer } from './coulomb/CoulombVisualizer';
import { CoulombControls } from './coulomb/CoulombControls';
import { coulombDefaultBodies } from './coulomb/coulombDefaults';
import { coulombPresets } from './coulomb/coulombPresets';
import { lorentzForce, lorentzPotentialEnergy } from '../engine/forces/lorentz';
import { LorentzVisualizer } from './lorentz/LorentzVisualizer';
import { LorentzControls } from './lorentz/LorentzControls';
import { lorentzDefaultBodies } from './lorentz/lorentzDefaults';
import { lorentzPresets } from './lorentz/lorentzPresets';

export const visualizerRegistry: VisualizerConfig[] = [
  {
    id: 'gravity',
    name: 'Newtonian Gravity',
    description: 'Two masses interacting via gravitational attraction (F = Gm₁m₂/r²)',
    forceFunction: gravitationalForce,
    defaultBodies: gravityDefaultBodies,
    presets: gravityPresets,
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
    presets: coulombPresets,
    SceneComponent: CoulombVisualizer,
    ControlsComponent: CoulombControls,
    computePotentialEnergy: coulombPotentialEnergy,
    softening: 0.3,
  },
  {
    id: 'lorentz',
    name: 'Lorentz Force',
    description: 'Charged particles with electric & magnetic forces (F = q(E + v×B))',
    forceFunction: lorentzForce,
    defaultBodies: lorentzDefaultBodies,
    presets: lorentzPresets,
    SceneComponent: LorentzVisualizer,
    ControlsComponent: LorentzControls,
    computePotentialEnergy: lorentzPotentialEnergy,
    softening: 0.3,
  },
];
