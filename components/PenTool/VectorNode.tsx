import { useEffect, useRef, useState } from "react";

export function VectorNode({ point, ...props }: { point: THREE.Vector3 }) {
  const [hovered, setHover] = useState(false);
  const vectorNodeRef = useRef(null);

  useEffect(() => {
    vectorNodeRef.current.position.z += 0.0001;
  }, [point]);

  return (
    <group
      {...props}
      ref={vectorNodeRef}
      position={point}
      onPointerOver={() => {
        setHover(true);
      }}
      onPointerOut={() => {
        setHover(false);
      }}
    >
      <mesh>
        <circleBufferGeometry args={[0.06, 50]} />
        <meshBasicMaterial color={hovered ? "deeppink" : "orange"} />
      </mesh>
    </group>
  );
}
