import type { Body, ForceFunction } from '../types/simulation';

export function velocityVerletStep(
  bodies: Body[],
  forceFunction: ForceFunction,
  dt: number,
  softening: number,
): void {
  // Step 1: x(t+dt) = x(t) + v(t)*dt + 0.5*a(t)*dt²
  for (const body of bodies) {
    body.position.x += body.velocity.x * dt + 0.5 * body.acceleration.x * dt * dt;
    body.position.y += body.velocity.y * dt + 0.5 * body.acceleration.y * dt * dt;
    body.position.z += body.velocity.z * dt + 0.5 * body.acceleration.z * dt * dt;
  }

  // Step 2: Compute new forces at updated positions
  const newForces = forceFunction(bodies, softening);

  // Step 3: v(t+dt) = v(t) + 0.5*(a(t) + a(t+dt))*dt
  for (let i = 0; i < bodies.length; i++) {
    const f = newForces[i];
    const newAccX = f.x / bodies[i].mass;
    const newAccY = f.y / bodies[i].mass;
    const newAccZ = f.z / bodies[i].mass;

    bodies[i].velocity.x += 0.5 * (bodies[i].acceleration.x + newAccX) * dt;
    bodies[i].velocity.y += 0.5 * (bodies[i].acceleration.y + newAccY) * dt;
    bodies[i].velocity.z += 0.5 * (bodies[i].acceleration.z + newAccZ) * dt;

    bodies[i].acceleration.set(newAccX, newAccY, newAccZ);
  }
}
