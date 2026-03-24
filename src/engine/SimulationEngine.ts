import type { Body, ForceFunction } from '../types/simulation';
import { velocityVerletStep } from './integrators';

const FIXED_DT = 0.001; // 1ms physics timestep
const MAX_FRAME_DT = 0.05; // 50ms max to prevent spiral-of-death
const MAX_STEPS_PER_FRAME = 16;

export class SimulationEngine {
  private accumulator = 0;

  reset(): void {
    this.accumulator = 0;
  }

  step(
    bodies: Body[],
    forceFunction: ForceFunction,
    frameDelta: number,
    timeScale: number,
    softening: number,
  ): number {
    const dt = Math.min(frameDelta, MAX_FRAME_DT) * timeScale;
    this.accumulator += dt;

    let steps = 0;
    while (this.accumulator >= FIXED_DT && steps < MAX_STEPS_PER_FRAME) {
      velocityVerletStep(bodies, forceFunction, FIXED_DT, softening);
      this.accumulator -= FIXED_DT;
      steps++;
    }

    return steps * FIXED_DT;
  }
}
