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
      point.x + 0.5,
      point.y + 0.5,
      point.x + 0.5,
      point.y + 0.5,
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
        console.log({ curve });

        let curvePoints = [
          new THREE.Vector3(curve["v0"].x, curve["v0"].y, 0),
          new THREE.Vector3(curve["v1"].x, curve["v1"].y, 0),

          // new THREE.Vector3(curve["v2"].x, curve["v2"].y, 0),
          // new THREE.Vector3(curve["v3"].x, curve["v3"].y, 0),
        ];

        return (
          <Line key={index} points={curvePoints} color="red" lineWidth={1} />
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
