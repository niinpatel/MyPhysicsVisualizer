import { Canvas } from '@react-three/fiber';
import { AdaptiveCamera } from '../three/AdaptiveCamera';
import { GridFloor } from '../three/GridFloor';
import { SceneEnvironment } from '../three/SceneEnvironment';
import { useUIStore } from '../../store/useUIStore';
import { visualizerRegistry } from '../../visualizers/registry';
import { EnergyDisplay } from '../ui/EnergyDisplay';

export function Viewport() {
  const activeId = useUIStore((s) => s.activeVisualizer);
  const config = visualizerRegistry.find((v) => v.id === activeId);

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
      <EnergyDisplay potentialEnergyFn={config.computePotentialEnergy} />
    </div>
  );
}
