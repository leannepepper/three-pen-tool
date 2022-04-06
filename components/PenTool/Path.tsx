import { Line } from "@react-three/drei";
import { useCallback } from "react";
import * as THREE from "three";
import { VectorNode } from "./VectorNode";

export function Path({
  points,
  isClosed,
}: {
  points: THREE.Vector3[];
  isClosed: boolean;
}) {
  const path = new THREE.Path();

  path.moveTo(points[0].x, points[0].y);
  points.forEach((point) => {
    path.bezierCurveTo(
      point.x + 1,
      point.y + 1,
      point.x + 1,
      point.y + 1,
      point.x,
      point.y
    );
  });

  const pathPoints = path.getPoints();
  // console.log({ path });
  const onUpdatePath = useCallback(
    (self) => self.setFromPoints(pathPoints),
    [pathPoints]
  );

  return (
    <>
      {path.curves.map((curve, index) => {
        // Create curve handels based off control points https://threejs.org/docs/?q=curve#api/en/extras/curves/CubicBezierCurve

        let firstControlPoint = [
          new THREE.Vector3(curve["v0"].x, curve["v0"].y, 0),
          new THREE.Vector3(curve["v1"].x, curve["v1"].y, 0),
        ];

        let secondControlPoint = [
          new THREE.Vector3(curve["v2"].x, curve["v2"].y, 0),
          new THREE.Vector3(curve["v3"].x, curve["v3"].y, 0),
        ];

        return (
          <>
            <Line
              key={index}
              points={firstControlPoint}
              color="blue"
              lineWidth={1}
            />
            <VectorNode point={firstControlPoint[1]} size={0.04} />
            <Line
              key={index}
              points={secondControlPoint}
              color="red"
              lineWidth={1}
            />
            <VectorNode point={secondControlPoint[0]} size={0.04} />
          </>
        );
      })}
      <line>
        <bufferGeometry attach="geometry" onUpdate={onUpdatePath} />
        <lineBasicMaterial
          attach="material"
          color={"#fff"}
          linewidth={10}
          linecap={"round"}
          linejoin={"round"}
        />
      </line>
    </>
  );
}
