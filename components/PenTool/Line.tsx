import { useEffect, useRef } from "react";
import * as THREE from "three";
import { createPath } from "./pathUtils";

export function CustomMesh({ points }: { points: THREE.Vector3[] }) {
  const meshRef = useRef(null);
  const geometry = new THREE.BufferGeometry();

  const positions = new Float32Array(points.length * 3);
  const indices = [];

  for (let i = 0; i < points.length; i++) {
    positions[i * 3] = points[i].x;
    positions[i * 3 + 1] = points[i].y;
    positions[i * 3 + 2] = points[i].z;
  }

  if (points.length > 2) {
    for (let i = 0; i < points.length - 2; i++) {
      indices[i * 3] = 0;
      indices[i * 3 + 1] = i + 1;
      indices[i * 3 + 2] = i + 2;
    }

    geometry.setIndex(indices);
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  useEffect(() => {
    meshRef.current.geometry = geometry;
  });

  return (
    <mesh ref={meshRef}>
      <meshBasicMaterial color="deeppink" />
    </mesh>
  );
}

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
