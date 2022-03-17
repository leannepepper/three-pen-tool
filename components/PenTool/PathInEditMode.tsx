import { useThree } from "@react-three/fiber";
import { useContext, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { EditingContext } from "../context";
import { createPath } from "./pathUtils";
import { getRealMouseCoordinates } from "./utils";
import { VectorNode } from "./VectorNode";

function Line({ points }: { points: THREE.Vector3[] }) {
  const lineRef = useRef(null);
  const path = createPath(points);
  const pathPoints = path.getPoints();
  const geometry = new THREE.BufferGeometry().setFromPoints(pathPoints);

  useEffect(() => {
    lineRef.current.geometry = geometry;
  }, [points]);

  return (
    <line ref={lineRef}>
      <bufferGeometry />
      <lineBasicMaterial color="deeppink" />
    </line>
  );
}

export function PathInEditMode() {
  const { camera } = useThree();
  const [isEditing] = useContext(EditingContext);
  const [path, setPath] = useState<THREE.Path>();
  const [points, setPoints] = useState<THREE.Vector3[]>([]);

  function handleMouseDown(e: MouseEvent) {
    e.preventDefault();
    const mouseCoordinates = getRealMouseCoordinates(e, camera);

    if (isEditing) {
      setPoints([
        ...points,
        new THREE.Vector3(mouseCoordinates.x, mouseCoordinates.y, 0),
      ]);
    }
  }

  function maybeClosePath(point: THREE.Vector3) {
    if (point === points[0]) {
      setPoints([...points, new THREE.Vector3(point.x, point.y, 0)]);
    }
  }

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseDown);
    return () => {
      window.removeEventListener("mouseup", handleMouseDown);
    };
  }, [points, isEditing]);

  return (
    <group>
      {points.map((point, index) => (
        <VectorNode key={index} point={point} onClick={maybeClosePath} />
      ))}
      {points.length > 1 && <Line points={points} />}
    </group>
  );
}
