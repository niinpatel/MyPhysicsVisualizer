import { useSimulationStore } from '../../store/useSimulationStore';

export function ResetButton() {
  const reset = useSimulationStore((s) => s.reset);

  return (
    <button className="control-btn" onClick={reset}>
      ↺ Reset
      <kbd className="shortcut-badge">R</kbd>
    </button>
  );
}
