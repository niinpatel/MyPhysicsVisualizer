export function SceneEnvironment() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 20, 10]} intensity={1} />
      <directionalLight position={[-10, -5, -10]} intensity={0.3} />
      <color attach="background" args={['#0a0a1a']} />
      <fog attach="fog" args={['#0a0a1a', 60, 200]} />
    </>
  );
}
