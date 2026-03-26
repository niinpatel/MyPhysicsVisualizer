import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { useSimulationStore } from '../../store/useSimulationStore';
import { PresetSelector, usePresetLoader } from '../../components/ui/PresetSelector';
import { ParameterSlider } from '../../components/ui/ParameterSlider';
import { gravityPresets } from './gravityPresets';

export function GravityControls() {
  const { activePresetId, loadPreset } = usePresetLoader(gravityPresets, gravityPresets[0].id);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [timeScale, setTimeScale] = useState(1);

  // Advanced params
  const [mass1, setMass1] = useState(10);
  const [mass2, setMass2] = useState(10);
  const [sep, setSep] = useState(10);
  const [velX1, setVelX1] = useState(0);
  const [velZ1, setVelZ1] = useState(0.707);
  const [velX2, setVelX2] = useState(0);
  const [velZ2, setVelZ2] = useState(-0.707);

  // Load first preset on mount
  useEffect(() => {
    loadPreset(gravityPresets[0].id);
  }, []);

  // Time scale
  useEffect(() => {
    useSimulationStore.getState().setTimeScale(timeScale);
  }, [timeScale]);

  const applyCustom = () => {
    const r1 = Math.max(0.2, Math.cbrt(mass1) * 0.2);
    const r2 = Math.max(0.2, Math.cbrt(mass2) * 0.2);
    const bodies = [
      {
        id: 'body-1',
        position: new THREE.Vector3(-sep / 2, 0, 0),
        velocity: new THREE.Vector3(velX1, 0, velZ1),
        acceleration: new THREE.Vector3(),
        mass: mass1, charge: 0,
        color: '#ff6644', radius: r1,
      },
      {
        id: 'body-2',
        position: new THREE.Vector3(sep / 2, 0, 0),
        velocity: new THREE.Vector3(velX2, 0, velZ2),
        acceleration: new THREE.Vector3(),
        mass: mass2, charge: 0,
        color: '#44aaff', radius: r2,
      },
    ];
    const store = useSimulationStore.getState();
    store.setInitialBodies(bodies);
    store.engine.reset();
    // Create fresh copy for active bodies
    const activeBodies = bodies.map(b => ({
      ...b,
      position: b.position.clone(),
      velocity: b.velocity.clone(),
      acceleration: b.acceleration.clone(),
    }));
    store.setBodies(activeBodies);
    useSimulationStore.setState({ time: 0, isPlaying: false });
  };

  return (
    <div className="viz-controls">
      <PresetSelector
        presets={gravityPresets}
        activePresetId={activePresetId}
        onSelect={loadPreset}
      />

      <div className="param-section">
        <ParameterSlider
          label="Time Scale"
          tooltip="Speed multiplier for the simulation"
          value={timeScale}
          min={0.1} max={5} step={0.1}
          onChange={setTimeScale}
        />
      </div>

      <div className="advanced-section">
        <button
          className="advanced-toggle"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? '▾' : '▸'} Custom Parameters
        </button>

        {showAdvanced && (
          <div className="advanced-params">
            <div className="param-group-label">Body 1</div>
            <ParameterSlider label="Mass" value={mass1} min={0.1} max={100} step={0.1} onChange={setMass1} />
            <ParameterSlider label="Vel X" value={velX1} min={-5} max={5} step={0.01} onChange={setVelX1} />
            <ParameterSlider label="Vel Z" value={velZ1} min={-5} max={5} step={0.01} onChange={setVelZ1} />

            <div className="param-group-label">Body 2</div>
            <ParameterSlider label="Mass" value={mass2} min={0.1} max={100} step={0.1} onChange={setMass2} />
            <ParameterSlider label="Vel X" value={velX2} min={-5} max={5} step={0.01} onChange={setVelX2} />
            <ParameterSlider label="Vel Z" value={velZ2} min={-5} max={5} step={0.01} onChange={setVelZ2} />

            <div className="param-group-label">Setup</div>
            <ParameterSlider label="Separation" tooltip="Initial distance between bodies" value={sep} min={2} max={30} step={0.5} onChange={setSep} />

            <button className="apply-btn" onClick={applyCustom}>
              Apply & Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
