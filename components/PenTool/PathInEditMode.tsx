import { useThree } from "@react-three/fiber";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { EditingContext } from "../context";
import { createPath } from "./pathUtils";
import { getRealMouseCoordinates } from "./utils";
import { VectorNode } from "./VectorNode";

function Line({
  points,
  isClosed,
}: {
  points: THREE.Vector3[];
  isClosed: boolean;
}) {
  const lineRef = useRef(null);
  const path = createPath(points, isClosed);

  if (isClosed) path.closePath();

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

  const [isClosed, setClosed] = useState(false);
  const [points, setPoints] = useState<THREE.Vector3[]>([]);

  function handleClick(e: MouseEvent) {
    e.preventDefault();
    const mouseCoordinates = getRealMouseCoordinates(e, camera);
    const newPoint = new THREE.Vector3(
      mouseCoordinates.x,
      mouseCoordinates.y,
      0
    );
    if (points.length > 1 && newPoint.distanceTo(points[0]) < 0.051) {
      setClosed(true);
    } else if (isEditing && !isClosed) {
      setPoints([...points, newPoint]);
    }
  }

  useEffect(() => {
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [points, isEditing, isClosed]);

  return (
    <group>
      {points.map((point, index) => (
        <VectorNode key={index} point={point} onClick={(point) => {}} />
      ))}
      {points.length > 1 && !isClosed && (
        <Line points={points} isClosed={isClosed} />
      )}
      {points.length > 1 && isClosed && (
        <Line points={points} isClosed={isClosed} />
      )}
    </group>
  );
}
