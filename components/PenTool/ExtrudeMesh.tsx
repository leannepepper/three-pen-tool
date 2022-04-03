import { useEffect, useRef } from "react";
import * as THREE from "three";
import { createShape } from "./shapeUtils";
import { Extrude } from "@react-three/drei";
import { LineSegments } from "three";

// export function ExtrudeMesh({
//   points,
//   isClosed,
// }: {
//   points: THREE.Vector3[];
//   isClosed: boolean;
// }) {
//   const extrudeGeometryRef = useRef<THREE.ExtrudeGeometry>();
//   const extrudeSettings = {
//     depth: 0,
//     bevelEnabled: false,
//     bevelSegments: 2,
//     steps: 10,
//     bevelSize: 0,
//     bevelThickness: 1,
//   };

//   const extrudeMaterial = new THREE.MeshBasicMaterial({
//     color: new THREE.Color("rgb(25,25,25)"),
//     opacity: 0.3,
//     transparent: true,
//   });

//   const shape = createShape(points, isClosed);
//   const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

//   useEffect(() => {
//     extrudeGeometryRef.current = geometry;
//   }, [points]);

//   return (
//     <Extrude geometry={extrudeGeometryRef.current} material={extrudeMaterial} />
//   );
// }

export function ExtrudeMesh({
  points,
  isClosed,
}: {
  points: THREE.Vector3[];
  isClosed: boolean;
}) {
  const bufferGeometryRef = useRef<THREE.BufferGeometry>();
  const indices = [];
  const positions = [];
  const colors = [];

  const iteration_count = 4;

  let y = 0;
  let next_positions_index = 0;

  const extrudeMaterial = new THREE.LineBasicMaterial({
    color: new THREE.Color("rgb(25,25,25)"),
    opacity: 0.9,
    transparent: true,
  });

  const geometry = new THREE.BufferGeometry();

  function add_vertex(v) {
    if (next_positions_index == 0xffff) console.error("Too many points.");

    positions.push(v.x, v.y, v.z);
    colors.push(Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5, 1);

    return next_positions_index++;
  }

  // simple Koch curve

  function snowflake_iteration(p0, p4, depth) {
    if (--depth < 0) {
      const i = next_positions_index - 1; // p0 already there
      add_vertex(p4);
      indices.push(i, i + 1);

      return;
    }
  }

  function snowflake(points, loop, x_offset) {
    for (let iteration = 0; iteration != iteration_count; iteration++) {
      add_vertex(points[0]);

      for (
        let p_index = 0, p_count = points.length - 1;
        p_index != p_count;
        p_index++
      ) {
        snowflake_iteration(points[p_index], points[p_index + 1], iteration);
      }

      for (
        let p_index = 0, p_count = points.length;
        p_index != p_count;
        p_index++
      ) {
        points[p_index].x += x_offset;
      }
    }
  }

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeBoundingSphere();

  useEffect(() => {
    snowflake(points, false, 0);

    geometry.setIndex(indices);
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    bufferGeometryRef.current = geometry;
  }, [points]);

  return (
    <lineSegments
      geometry={bufferGeometryRef.current}
      material={extrudeMaterial}
    />
  );
}
