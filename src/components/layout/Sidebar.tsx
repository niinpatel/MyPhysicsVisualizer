import { VisualizerSelector } from '../ui/VisualizerSelector';
import { PlayPauseButton } from '../ui/PlayPauseButton';
import { ResetButton } from '../ui/ResetButton';
import { useUIStore } from '../../store/useUIStore';
import { visualizerRegistry } from '../../visualizers/registry';

export function Sidebar() {
  const activeId = useUIStore((s) => s.activeVisualizer);
  const showTrails = useUIStore((s) => s.showTrails);
  const setShowTrails = useUIStore((s) => s.setShowTrails);
  const showForceArrows = useUIStore((s) => s.showForceArrows);
  const setShowForceArrows = useUIStore((s) => s.setShowForceArrows);
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);

  const config = visualizerRegistry.find((v) => v.id === activeId);
  if (!config) return null;

  const ControlsComponent = config.ControlsComponent;

  return (
    <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h1>Physics Visualizer</h1>
        <p className="sidebar-tagline">Explore fundamental forces in an interactive 3D sandbox</p>
      </div>

      <VisualizerSelector />

      <div className="controls-host">
        <ControlsComponent />
      </div>

      <div className="sidebar-section">
        <div className="section-label">Display</div>
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={showTrails}
            onChange={(e) => setShowTrails(e.target.checked)}
          />
          Show Trails
        </label>
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={showForceArrows}
            onChange={(e) => setShowForceArrows(e.target.checked)}
          />
          Show Force Arrows
        </label>
      </div>

      <div className="sidebar-section transport-controls">
        <div className="section-label">Playback</div>
        <div className="transport-buttons">
          <PlayPauseButton />
          <ResetButton />
        </div>
      </div>

      <div className="sidebar-footer">
        <span className="shortcut-hint">Drag to orbit · Scroll to zoom</span>
      </div>
    </div>
  );
}
