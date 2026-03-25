import { useState } from 'react';
import type { Preset } from '../../types/visualizer';
import { useSimulationStore } from '../../store/useSimulationStore';

interface PresetSelectorProps {
  presets: Preset[];
  activePresetId: string;
  onSelect: (presetId: string) => void;
}

export function PresetSelector({ presets, activePresetId, onSelect }: PresetSelectorProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="preset-selector">
      <div className="preset-section-label">Presets</div>
      <div className="preset-grid">
        {presets.map((preset) => (
          <button
            key={preset.id}
            className={`preset-card ${activePresetId === preset.id ? 'active' : ''}`}
            onClick={() => onSelect(preset.id)}
            onMouseEnter={() => setHoveredId(preset.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <span className="preset-name">{preset.name}</span>
          </button>
        ))}
      </div>
      <div className="preset-description">
        {(hoveredId ? presets.find(p => p.id === hoveredId)?.description : presets.find(p => p.id === activePresetId)?.description) ?? ''}
      </div>
    </div>
  );
}

export function usePresetLoader(presets: Preset[], defaultPresetId: string) {
  const [activePresetId, setActivePresetId] = useState(defaultPresetId);

  const loadPreset = (presetId: string) => {
    const preset = presets.find(p => p.id === presetId);
    if (!preset) return;

    setActivePresetId(presetId);
    const bodies = preset.bodies();
    const store = useSimulationStore.getState();
    store.setInitialBodies(bodies);
    store.engine.reset();
    store.setBodies(preset.bodies());
    useSimulationStore.setState((s) => ({ time: 0, isPlaying: false, trailResetKey: s.trailResetKey + 1 }));
  };

  return { activePresetId, loadPreset };
}
