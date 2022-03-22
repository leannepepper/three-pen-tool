import { useEffect, useRef } from "react";
import * as THREE from "three";
import { createPath } from "./pathUtils";

export function Line({
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
