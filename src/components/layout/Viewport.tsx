import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveCamera } from '../three/AdaptiveCamera';
import { GridFloor } from '../three/GridFloor';
import { SceneEnvironment } from '../three/SceneEnvironment';
import { useUIStore } from '../../store/useUIStore';
import { useSimulationStore } from '../../store/useSimulationStore';
import { visualizerRegistry } from '../../visualizers/registry';
import { EnergyDisplay } from '../ui/EnergyDisplay';

export function Viewport() {
  const activeId = useUIStore((s) => s.activeVisualizer);
  const hasInteracted = useUIStore((s) => s.hasInteracted);
  const isPlaying = useSimulationStore((s) => s.isPlaying);
  const config = visualizerRegistry.find((v) => v.id === activeId);

  useEffect(() => {
    if (isPlaying && !hasInteracted) {
      useUIStore.getState().setHasInteracted();
    }
  }, [isPlaying, hasInteracted]);

  if (!config) return null;

  const SceneComponent = config.SceneComponent;

  return (
    <div className="viewport">
      <Canvas camera={{ position: [0, 15, 30], fov: 50 }}>
        <SceneEnvironment />
        <AdaptiveCamera />
        <GridFloor />
        <SceneComponent />
      </Canvas>
      {!hasInteracted && !isPlaying && (
        <div className="viewport-hint">
          Pick a preset, then press <kbd className="desktop-only">Space</kbd><span className="mobile-only">Play</span> to start
        </div>
      )}
      <div className="viewport-camera-hint desktop-only">Drag to orbit · Scroll to zoom</div>
      <div className="viewport-camera-hint mobile-only">Pinch to zoom · Drag to orbit</div>
      <EnergyDisplay potentialEnergyFn={config.computePotentialEnergy} />
    </div>
  );
}
