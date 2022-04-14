import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { getRealMouseCoordinates } from "./utils";

export function ControlPoint({
  point,
  size = 0.06,
  ...props
}: {
  point: THREE.Vector3;
  size?: number;
}) {
  const [hovered, setHover] = useState(false);
  const vectorNodeRef = useRef(null);
  const [isMoving, setIsMoving] = useState(false);
  const [currentPoint, setCurrentPoint] = useState<THREE.Vector3>(point);
  const { camera } = useThree();

  useEffect(() => {
    vectorNodeRef.current.position.z += 0.0001;
  }, [currentPoint]);

  function handlePointerDown(e: PointerEvent) {
    e.preventDefault();
    const mouseCoordinates = getRealMouseCoordinates(e, camera);
    const newPoint = new THREE.Vector3(
      mouseCoordinates.x,
      mouseCoordinates.y,
      0
    );

    if (currentPoint.distanceTo(newPoint) < 0.051) {
      setIsMoving(true);
    }
  }

  function handlePointerUp(e: PointerEvent) {
    e.preventDefault();
    setIsMoving(false);
  }

  function handlePointerMove(e: PointerEvent) {
    e.preventDefault();
    if (isMoving) {
      const mouseCoordinates = getRealMouseCoordinates(e, camera);
      const newPoint = new THREE.Vector3(
        mouseCoordinates.x,
        mouseCoordinates.y,
        0
      );
      setCurrentPoint(newPoint);
    }
  }

  useEffect(() => {
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointermove", handlePointerMove);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [isMoving, currentPoint]);

  return (
    <group
      {...props}
      ref={vectorNodeRef}
      position={currentPoint}
      onPointerOver={() => {
        setHover(true);
      }}
      onPointerLeave={() => {
        setHover(false);
      }}
    >
      <mesh>
        <circleBufferGeometry args={[size, 10]} />
        <meshBasicMaterial color={hovered ? "lightpink" : "green"} />
      </mesh>
    </group>
  );
}
