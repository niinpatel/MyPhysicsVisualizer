import { useEffect, useCallback } from 'react';
import { Sidebar } from './Sidebar';
import { Viewport } from './Viewport';
import { useSimulationStore } from '../../store/useSimulationStore';
import { useUIStore } from '../../store/useUIStore';
import { visualizerRegistry } from '../../visualizers/registry';

export function AppShell() {
  const togglePlaying = useSimulationStore((s) => s.togglePlaying);
  const reset = useSimulationStore((s) => s.reset);
  const activeId = useUIStore((s) => s.activeVisualizer);

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlaying();
      } else if (e.code === 'KeyR' && !e.metaKey && !e.ctrlKey) {
        reset();
      }
    },
    [togglePlaying, reset],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Reset simulation when switching visualizers
  useEffect(() => {
    const config = visualizerRegistry.find((v) => v.id === activeId);
    if (config) {
      const bodies = config.defaultBodies();
      useSimulationStore.getState().setInitialBodies(bodies);
      useSimulationStore.getState().setBodies(config.defaultBodies());
      useSimulationStore.getState().engine.reset();
      useSimulationStore.setState({ time: 0, isPlaying: false });
    }
  }, [activeId]);

  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);

  return (
    <div className="app-shell">
      <button className="mobile-menu-btn" onClick={toggleSidebar} aria-label="Toggle menu">
        <span className={`hamburger ${sidebarOpen ? 'open' : ''}`} />
      </button>
      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}
      <Sidebar />
      <Viewport />
    </div>
  );
}
