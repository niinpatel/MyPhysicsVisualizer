import { useEffect } from 'react';
import { useControls, folder } from 'leva';
import { useSimulationStore } from '../../store/useSimulationStore';
import { coulombDefaultBodies } from './coulombDefaults';

export function CoulombControls() {
  const setBodies = useSimulationStore((s) => s.setBodies);
  const setInitialBodies = useSimulationStore((s) => s.setInitialBodies);

  useEffect(() => {
    const bodies = coulombDefaultBodies();
    setInitialBodies(bodies);
    setBodies(coulombDefaultBodies());
  }, []);

  const values = useControls({
    'Particle 1': folder({
      'Charge 1': { value: 8, min: -20, max: 20, step: 0.1 },
      'Mass 1': { value: 5, min: 0.1, max: 50, step: 0.1 },
    }),
    'Particle 2': folder({
      'Charge 2': { value: -8, min: -20, max: 20, step: 0.1 },
      'Mass 2': { value: 5, min: 0.1, max: 50, step: 0.1 },
    }),
    'Time Scale': { value: 1, min: 0.1, max: 5, step: 0.1 },
  });

  useEffect(() => {
    const bodies = coulombDefaultBodies();
    bodies[0].charge = values['Charge 1'];
    bodies[0].mass = values['Mass 1'];
    bodies[0].color = values['Charge 1'] >= 0 ? '#ff4444' : '#4444ff';
    bodies[0].radius = 0.5;
    bodies[1].charge = values['Charge 2'];
    bodies[1].mass = values['Mass 2'];
    bodies[1].color = values['Charge 2'] >= 0 ? '#ff4444' : '#4444ff';
    bodies[1].radius = 0.5;

    // Recompute orbital speed for new parameters
    const sep = 8;
    const q1 = Math.abs(values['Charge 1']);
    const q2 = Math.abs(values['Charge 2']);
    const sameSign = values['Charge 1'] * values['Charge 2'] > 0;

    if (!sameSign && q1 > 0 && q2 > 0) {
      const speed = Math.sqrt((q1 * q2) / (values['Mass 1'] * 2 * (sep / 2)));
      bodies[0].velocity.set(0, 0, speed);
      bodies[1].velocity.set(0, 0, -speed);
    } else {
      bodies[0].velocity.set(0, 0, 0.5);
      bodies[1].velocity.set(0, 0, -0.5);
    }

    setInitialBodies(bodies);
    useSimulationStore.getState().engine.reset();
    const freshBodies = coulombDefaultBodies();
    freshBodies.forEach((b, i) => {
      b.charge = bodies[i].charge;
      b.mass = bodies[i].mass;
      b.color = bodies[i].color;
      b.radius = bodies[i].radius;
      b.velocity.copy(bodies[i].velocity);
    });
    setBodies(freshBodies);
    useSimulationStore.setState({ time: 0 });
  }, [values['Charge 1'], values['Charge 2'], values['Mass 1'], values['Mass 2']]);

  useEffect(() => {
    useSimulationStore.getState().setTimeScale(values['Time Scale']);
  }, [values['Time Scale']]);

  return null;
}
