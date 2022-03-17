import { useEffect, useRef, useState } from "react";

export function VectorNode({
  point,
  onClick,
}: {
  point: THREE.Vector3;
  onClick: (point: THREE.Vector3) => void;
}) {
  const [hovered, setHover] = useState(false);
  const vectorNodeRef = useRef(null);

  useEffect(() => {
    vectorNodeRef.current.position.z += 0.01;
  }, [point]);

  return (
    <group
      ref={vectorNodeRef}
      position={point}
      onClick={() => {
        onClick(point);
      }}
    >
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
