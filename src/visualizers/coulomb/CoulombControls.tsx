import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { useSimulationStore } from '../../store/useSimulationStore';
import { PresetSelector, usePresetLoader } from '../../components/ui/PresetSelector';
import { ParameterSlider } from '../../components/ui/ParameterSlider';
import { coulombPresets } from './coulombPresets';

function chargeColor(q: number): string {
  return q >= 0 ? '#ff4444' : '#4444ff';
}

export function CoulombControls() {
  const { activePresetId, loadPreset } = usePresetLoader(coulombPresets, coulombPresets[0].id);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [timeScale, setTimeScale] = useState(1);

  // Advanced params
  const [charge1, setCharge1] = useState(8);
  const [charge2, setCharge2] = useState(-8);
  const [mass1, setMass1] = useState(5);
  const [mass2, setMass2] = useState(5);
  const [sep, setSep] = useState(8);

  // Load first preset on mount
  useEffect(() => {
    loadPreset(coulombPresets[0].id);
  }, []);

  // Time scale
  useEffect(() => {
    useSimulationStore.getState().setTimeScale(timeScale);
  }, [timeScale]);

  const applyCustom = () => {
    // Compute orbital velocity for opposite charges, or give a small kick for like charges
    const attractive = charge1 * charge2 < 0;
    let v1z: number, v2z: number;
    if (attractive && Math.abs(charge1) > 0 && Math.abs(charge2) > 0) {
      const speed = Math.sqrt(Math.abs(charge1 * charge2) / (mass1 * 2 * (sep / 2)));
      v1z = speed;
      v2z = -speed;
    } else {
      v1z = 0.5;
      v2z = -0.5;
    }

    const bodies = [
      {
        id: 'charge-1',
        position: new THREE.Vector3(-sep / 2, 0, 0),
        velocity: new THREE.Vector3(0, 0, v1z),
        acceleration: new THREE.Vector3(),
        mass: mass1, charge: charge1,
        color: chargeColor(charge1), radius: 0.5,
      },
      {
        id: 'charge-2',
        position: new THREE.Vector3(sep / 2, 0, 0),
        velocity: new THREE.Vector3(0, 0, v2z),
        acceleration: new THREE.Vector3(),
        mass: mass2, charge: charge2,
        color: chargeColor(charge2), radius: 0.5,
      },
    ];
    const store = useSimulationStore.getState();
    store.setInitialBodies(bodies);
    store.engine.reset();
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
        presets={coulombPresets}
        activePresetId={activePresetId}
        onSelect={loadPreset}
      />

      <div className="param-section">
        <ParameterSlider
          label="Time Scale"
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
            <div className="param-group-label">Particle 1</div>
            <ParameterSlider label="Charge" value={charge1} min={-20} max={20} step={0.1} onChange={setCharge1} />
            <ParameterSlider label="Mass" value={mass1} min={0.1} max={50} step={0.1} onChange={setMass1} />

            <div className="param-group-label">Particle 2</div>
            <ParameterSlider label="Charge" value={charge2} min={-20} max={20} step={0.1} onChange={setCharge2} />
            <ParameterSlider label="Mass" value={mass2} min={0.1} max={50} step={0.1} onChange={setMass2} />

            <div className="param-group-label">Setup</div>
            <ParameterSlider label="Separation" value={sep} min={2} max={20} step={0.5} onChange={setSep} />

            <button className="apply-btn" onClick={applyCustom}>
              Apply & Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
