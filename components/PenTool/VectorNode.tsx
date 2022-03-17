import { useState } from "react";

export function VectorNode({ point }: { point: THREE.Vector3 }) {
  const [hovered, setHover] = useState(false);

  return (
    <group position={point}>
      <mesh
        onPointerOver={(event) => setHover(true)}
        onPointerOut={(event) => setHover(false)}
      >
        <circleBufferGeometry args={[0.05, 50]} />
        <meshBasicMaterial color={hovered ? "deeppink" : "orange"} />
      </mesh>
    </group>
  );
}
