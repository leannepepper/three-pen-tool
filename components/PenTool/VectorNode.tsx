export function VectorNode({ point }: { point: THREE.Vector3 }) {
  return (
    <group position={point}>
      <mesh>
        <circleBufferGeometry args={[0.03, 50]} />
        <meshBasicMaterial color="deeppink" />
      </mesh>
    </group>
  );
}
