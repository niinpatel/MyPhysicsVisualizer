import { Grid } from '@react-three/drei';
import * as THREE from 'three';

const side = THREE.DoubleSide;

export function GridFloor() {
  return (
    <Grid
      position={[0, -0.01, 0]}
      args={[100, 100]}
      cellSize={1}
      cellThickness={0.5}
      cellColor="#444466"
      sectionSize={5}
      sectionThickness={1}
      sectionColor="#6666aa"
      fadeDistance={80}
      fadeStrength={1}
      followCamera={false}
      infiniteGrid
      side={side}
      renderOrder={-1}
      material-depthWrite={false}
    />
  );
}
