import { useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { getRealMouseCoordinates } from "./utils";

export function VectorNode({
  point,
  ...props
}: {
  point: THREE.Vector3;
  index: number;
  updateVectorNode: (point: THREE.Vector3, index: number) => void;
}) {
  const [hovered, setHover] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const vectorNodeRef = useRef(null);
  const { camera } = useThree();

  function handleMouseMove(e: MouseEvent) {
    if (isMoving) {
      const mouseCoordinates = getRealMouseCoordinates(e, camera);
      vectorNodeRef.current.position.x = mouseCoordinates.x;
      vectorNodeRef.current.position.y = mouseCoordinates.y;

      props.updateVectorNode(vectorNodeRef.current.position, props.index);
    }
  }

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", () => setIsMoving(false));

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", () => setIsMoving(false));
    };
  }, [point, isMoving]);

  useEffect(() => {
    vectorNodeRef.current.position.z += 0.0001;
  }, [point]);

  return (
    <group
      {...props}
      ref={vectorNodeRef}
      position={point}
      onPointerDown={() => {
        setIsMoving(true);
      }}
    >
      <mesh
        onPointerOver={() => {
          setHover(true);
        }}
        onPointerOut={() => {
          setHover(false);
        }}
      >
        <circleBufferGeometry args={[0.06, 50]} />
        <meshBasicMaterial color={hovered ? "deeppink" : "orange"} />
      </mesh>
    </group>
  );
}
