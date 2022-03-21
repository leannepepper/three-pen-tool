import { useEffect, useRef, useState } from "react";

export function VectorNode({
  point,
  ...props
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
      {...props}
      ref={vectorNodeRef}
      position={point}
      onClick={() => {
        props.onClick(point);
      }}
      onPointerOver={() => {
        setHover(true);
      }}
      onPointerOut={() => {
        setHover(false);
      }}
    >
      <mesh>
        <circleBufferGeometry args={[0.05, 50]} />
        <meshBasicMaterial color={hovered ? "deeppink" : "orange"} />
      </mesh>
    </group>
  );
}
