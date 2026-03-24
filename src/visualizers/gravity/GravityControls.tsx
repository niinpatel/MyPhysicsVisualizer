import { useEffect } from 'react';
import { useControls, folder } from 'leva';
import { useSimulationStore } from '../../store/useSimulationStore';
import { gravityDefaultBodies } from './gravityDefaults';

export function GravityControls() {
  const setBodies = useSimulationStore((s) => s.setBodies);
  const setInitialBodies = useSimulationStore((s) => s.setInitialBodies);

  // Initialize bodies on mount
  useEffect(() => {
    const bodies = gravityDefaultBodies();
    setInitialBodies(bodies);
    setBodies(gravityDefaultBodies());
  }, []);

  const values = useControls({
    'Body 1': folder({
      'Mass 1': { value: 10, min: 0.1, max: 100, step: 0.1 },
      'Vel X₁': { value: 0, min: -5, max: 5, step: 0.01 },
      'Vel Z₁': { value: 0.707, min: -5, max: 5, step: 0.01 },
    }),
    'Body 2': folder({
      'Mass 2': { value: 10, min: 0.1, max: 100, step: 0.1 },
      'Vel X₂': { value: 0, min: -5, max: 5, step: 0.01 },
      'Vel Z₂': { value: -0.707, min: -5, max: 5, step: 0.01 },
    }),
    'Time Scale': { value: 1, min: 0.1, max: 5, step: 0.1 },
    ' ': { value: 'Apply & Reset', type: 'BUTTON' as any },
  });

  // Apply button handler
  useEffect(() => {
    const bodies = gravityDefaultBodies();
    bodies[0].mass = values['Mass 1'];
    bodies[0].velocity.x = values['Vel X₁'];
    bodies[0].velocity.z = values['Vel Z₁'];
    bodies[0].radius = Math.max(0.2, Math.cbrt(values['Mass 1']) * 0.2);
    bodies[1].mass = values['Mass 2'];
    bodies[1].velocity.x = values['Vel X₂'];
    bodies[1].velocity.z = values['Vel Z₂'];
    bodies[1].radius = Math.max(0.2, Math.cbrt(values['Mass 2']) * 0.2);

    setInitialBodies(bodies);
    useSimulationStore.getState().engine.reset();
    setBodies(gravityDefaultBodies().map((b, i) => {
      b.mass = bodies[i].mass;
      b.velocity.copy(bodies[i].velocity);
      b.radius = bodies[i].radius;
      return b;
    }));
    useSimulationStore.setState({ time: 0 });
  }, [values['Mass 1'], values['Mass 2'], values['Vel X₁'], values['Vel Z₁'], values['Vel X₂'], values['Vel Z₂']]);

  useEffect(() => {
    useSimulationStore.getState().setTimeScale(values['Time Scale']);
  }, [values['Time Scale']]);

  return null;
}
