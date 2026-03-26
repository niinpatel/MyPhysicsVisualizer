import { useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useSimulationStore } from '../../store/useSimulationStore';
import { useUIStore } from '../../store/useUIStore';
import { PresetSelector, usePresetLoader } from '../../components/ui/PresetSelector';
import { ParameterSlider } from '../../components/ui/ParameterSlider';
import { setMu0, getMu0, setWireLength, getWireLength, setWireDirection, clearWireDirections, CURRENTS_SOFTENING } from './currentForce';
import { currentForce } from './currentForce';
import { biotSavartForce } from './biotSavartForce';
import { currentsPresets, presetWireDirections } from './currentsPresets';

function formatVec(v: THREE.Vector3): string {
  return `(${v.x.toFixed(2)}, ${v.y.toFixed(2)}, ${v.z.toFixed(2)})`;
}

export function CurrentsControls() {
  const { activePresetId, loadPreset } = usePresetLoader(currentsPresets, currentsPresets[0].id);
  const [current1, setCurrent1] = useState(5);
  const [current2, setCurrent2] = useState(5);
  const [separation, setSeparation] = useState(4);
  const [permeability, setPermeability] = useState(getMu0());
  const [length, setLength] = useState(getWireLength());
  const [wire2Angle, setWire2Angle] = useState(0);

  // Force readout state
  const [ampereF, setAmpereF] = useState<THREE.Vector3[]>([]);
  const [bsF, setBsF] = useState<THREE.Vector3[]>([]);

  const showAmpere = useUIStore((s) => s.showAmpereArrows);
  const setShowAmpere = useUIStore((s) => s.setShowAmpereArrows);
  const showBiotSavart = useUIStore((s) => s.showBiotSavartArrows);
  const setShowBiotSavart = useUIStore((s) => s.setShowBiotSavartArrows);

  // Recompute forces for readout
  const recomputeForces = useCallback(() => {
    requestAnimationFrame(() => {
      const bodies = useSimulationStore.getState().bodies;
      if (bodies.length >= 2) {
        setAmpereF(currentForce(bodies, CURRENTS_SOFTENING));
        setBsF(biotSavartForce(bodies, CURRENTS_SOFTENING));
      }
    });
  }, []);

  // Load first preset on mount
  useEffect(() => {
    loadPreset(currentsPresets[0].id);
  }, []);

  // Sync permeability
  useEffect(() => {
    setMu0(permeability);
  }, [permeability]);

  // Sync wire length
  useEffect(() => {
    setWireLength(length);
  }, [length]);

  // Sync wire 2 angle → direction
  useEffect(() => {
    const rad = (wire2Angle * Math.PI) / 180;
    setWireDirection('wire-2', new THREE.Vector3(Math.sin(rad), Math.cos(rad), 0));
  }, [wire2Angle]);

  // Sync when preset is loaded — read body state and wire directions
  useEffect(() => {
    const bodies = useSimulationStore.getState().bodies;
    if (bodies.length >= 2) {
      setCurrent1(bodies[0].charge);
      setCurrent2(bodies[1].charge);
      const sep = bodies[0].position.distanceTo(bodies[1].position);
      setSeparation(Math.round(sep * 10) / 10);
    }
    clearWireDirections();
    const dirs = presetWireDirections[activePresetId];
    if (dirs) {
      setWireDirection('wire-1', dirs[0]);
      setWireDirection('wire-2', dirs[1]);
      const angle = Math.atan2(dirs[1].x, dirs[1].y) * 180 / Math.PI;
      setWire2Angle(Math.round(angle));
    }
    // Recompute forces after preset loads
    recomputeForces();
  }, [activePresetId]);

  const applyParams = () => {
    const bodies = [
      {
        id: 'wire-1', mass: 1000, charge: current1,
        position: new THREE.Vector3(-separation / 2, 0, 0),
        velocity: new THREE.Vector3(),
        acceleration: new THREE.Vector3(),
        color: '#ff6644', radius: 0.15,
      },
      {
        id: 'wire-2', mass: 1000, charge: current2,
        position: new THREE.Vector3(separation / 2, 0, 0),
        velocity: new THREE.Vector3(),
        acceleration: new THREE.Vector3(),
        color: '#4488ff', radius: 0.15,
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
    // Recompute forces after applying
    recomputeForces();
  };

  const isParallel = wire2Angle === 0;

  return (
    <div className="viz-controls">
      <PresetSelector
        presets={currentsPresets}
        activePresetId={activePresetId}
        onSelect={loadPreset}
      />

      <div className="param-section">
        <ParameterSlider
          label="Current 1 (A)"
          value={current1}
          min={-20} max={20} step={0.5}
          onChange={setCurrent1}
        />
        <ParameterSlider
          label="Current 2 (A)"
          value={current2}
          min={-20} max={20} step={0.5}
          onChange={setCurrent2}
        />
        <ParameterSlider
          label="Separation"
          value={separation}
          min={0.5} max={15} step={0.5}
          onChange={setSeparation}
        />
        <ParameterSlider
          label="Wire 2 Angle (°)"
          value={wire2Angle}
          min={0} max={90} step={5}
          onChange={setWire2Angle}
        />
        <ParameterSlider
          label="Wire Length"
          value={length}
          min={4} max={24} step={1}
          onChange={setLength}
        />
        <ParameterSlider
          label="μ₀ Scale"
          value={permeability}
          min={0} max={5} step={0.1}
          onChange={setPermeability}
        />

        <button className="apply-btn" onClick={applyParams}>
          Apply & Reset
        </button>
      </div>

      <div className="param-section" style={{ marginTop: '0.5rem' }}>
        <div className="param-group-label">Force Frameworks</div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer', padding: '0.15rem 0' }}>
          <input type="checkbox" checked={showAmpere} onChange={(e) => setShowAmpere(e.target.checked)} />
          <span style={{ color: '#00ff88', fontWeight: 'bold' }}>■</span> Ampère (central)
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer', padding: '0.15rem 0' }}>
          <input type="checkbox" checked={showBiotSavart} onChange={(e) => setShowBiotSavart(e.target.checked)} />
          <span style={{ color: '#ff88ff', fontWeight: 'bold' }}>■</span> Biot-Savart / Lorentz
        </label>
      </div>

      <div className="param-section" style={{ marginTop: '0.5rem' }}>
        <div className="param-group-label">Force Readout</div>
        {isParallel ? (
          <>
            <div style={{ fontSize: '0.85rem', padding: '0.25rem 0' }}>
              Both frameworks agree (parallel wires)
            </div>
            <div style={{ fontSize: '0.8rem', padding: '0.15rem 0' }}>
              |F| on wire 1: {ampereF[0] ? ampereF[0].length().toFixed(3) : '—'}
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
              F/L = μ₀ I₁I₂ / (2πd)
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: '0.8rem', padding: '0.2rem 0', color: '#00ff88' }}>
              Ampère (wire 1): {ampereF[0] ? formatVec(ampereF[0]) : '—'}
            </div>
            <div style={{ fontSize: '0.8rem', padding: '0.2rem 0', color: '#00ff88' }}>
              Ampère (wire 2): {ampereF[1] ? formatVec(ampereF[1]) : '—'}
            </div>
            <div style={{ fontSize: '0.8rem', padding: '0.2rem 0', color: '#ff88ff' }}>
              B-S (wire 1): {bsF[0] ? formatVec(bsF[0]) : '—'}
            </div>
            <div style={{ fontSize: '0.8rem', padding: '0.2rem 0', color: '#ff88ff' }}>
              B-S (wire 2): {bsF[1] ? formatVec(bsF[1]) : '—'}
            </div>
            <div style={{ fontSize: '0.7rem', opacity: 0.6, marginTop: '0.3rem' }}>
              Biot-Savart: F₁₂ ≠ −F₂₁ (momentum in EM field)
            </div>
          </>
        )}
      </div>
    </div>
  );
}
