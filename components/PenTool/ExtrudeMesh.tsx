import { useEffect, useRef } from "react";
import * as THREE from "three";
import { createShape } from "./shapeUtils";
import { Extrude } from "@react-three/drei";

export function ExtrudeMesh({
  points,
  isClosed,
}: {
  points: THREE.Vector3[];
  isClosed: boolean;
}) {
  const extrudeGeometryRef = useRef<THREE.ExtrudeGeometry>();

  const shape = createShape(points, isClosed);

  const extrudeSettings = {
    depth: 1,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 9,
    bevelSize: 0,
    bevelThickness: 0,
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  const extrudeMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color("rgb(25,25,25)"),
    opacity: 0.3,
    transparent: true,
  });

  useEffect(() => {
    extrudeGeometryRef.current = geometry;
  }, [points]);

  return (
    <Extrude geometry={extrudeGeometryRef.current} material={extrudeMaterial} />
  );
}
