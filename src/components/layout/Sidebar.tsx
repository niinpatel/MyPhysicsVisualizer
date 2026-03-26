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
        <a
          href="https://github.com/niinpatel/MyPhysicsVisualizer"
          target="_blank"
          rel="noopener noreferrer"
          className="github-link"
          title="View on GitHub"
        >
          <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
        </a>
      </div>
    </div>
  );
}
