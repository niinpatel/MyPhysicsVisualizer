import type React from 'react';
import type { Body, ForceFunction } from './simulation';

export interface VisualizerConfig {
  id: string;
  name: string;
  description: string;
  forceFunction: ForceFunction;
  defaultBodies: () => Body[];
  SceneComponent: React.FC;
  ControlsComponent: React.FC;
  computePotentialEnergy: (bodies: Body[]) => number;
  softening: number;
}
