import { useUIStore } from '../../store/useUIStore';
import { visualizerRegistry } from '../../visualizers/registry';

export function VisualizerSelector() {
  const active = useUIStore((s) => s.activeVisualizer);
  const setActive = useUIStore((s) => s.setActiveVisualizer);

  return (
    <div className="visualizer-selector">
      {visualizerRegistry.map((v) => (
        <button
          key={v.id}
          className={`viz-btn ${active === v.id ? 'active' : ''}`}
          onClick={() => setActive(v.id)}
          title={v.description}
        >
          {v.name}
        </button>
      ))}
    </div>
  );
}
