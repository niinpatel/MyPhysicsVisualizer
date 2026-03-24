import { useSimulationStore } from '../../store/useSimulationStore';

export function PlayPauseButton() {
  const isPlaying = useSimulationStore((s) => s.isPlaying);
  const toggle = useSimulationStore((s) => s.togglePlaying);

  return (
    <button className="control-btn" onClick={toggle}>
      {isPlaying ? '⏸ Pause' : '▶ Play'}
    </button>
  );
}
