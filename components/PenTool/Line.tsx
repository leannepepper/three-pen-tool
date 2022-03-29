import { useEffect, useRef } from "react";
import * as THREE from "three";
import { createCurve, createPath } from "./pathUtils";

export function CustomMesh({ points }: { points: THREE.Vector3[] }) {
  // console.log("CustomMesh", points);
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
      <meshBasicMaterial color={new THREE.Color("rgb(25,25,25)")} />
    </mesh>
  );
}

export function CustomExtrudeMesh({ points }: { points: THREE.Vector3[] }) {
  const meshRef = useRef(null);
  const shape = new THREE.Shape();
  const indices = [];

  shape.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    shape.lineTo(points[i].x, points[i].y);
  }

  const extrudeSettings = {
    depth: 0,
    bevelEnabled: false,
    bevelSegments: 2,
    steps: 2,
    bevelSize: 0,
    bevelThickness: 0,
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

  if (points.length > 2) {
    for (let i = 0; i < points.length - 2; i++) {
      indices[i * 3] = i;
      indices[i * 3 + 1] = i + 1;
      indices[i * 3 + 2] = i + 2;
    }

    geometry.setIndex(indices);
  }

  useEffect(() => {
    meshRef.current.geometry = geometry;
  });

  return (
    <mesh ref={meshRef}>
      <meshBasicMaterial color={new THREE.Color("rgb(25,25,25)")} />
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
  // const path = createPath(points, isClosed);
  const path = createCurve(points, isClosed);

  const pathPoints = path.getPoints(points.length * 20);
  //const geometry = new THREE.BufferGeometry().setFromPoints();
  const geometry = new THREE.BufferGeometry().setFromPoints(pathPoints);
  // const geometry = new THREE.BufferGeometry().setFromPoints(points);
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
