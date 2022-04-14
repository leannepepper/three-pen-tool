import { useCallback } from "react";
import * as THREE from "three";
import { ControlPoint } from "./ControlPoint";

type ControlPointObj = {
  curve: THREE.Curve<THREE.Vector2>;
  firstControlPoint: THREE.Vector3[];
  secondControlPoint: THREE.Vector3[];
  index: number;
};

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
      point.x - 0.9,
      point.y - 0.9,
      point.x,
      point.y
    );
  });

  const pathPoints = path.getPoints();

  const controlPointObjs: ControlPointObj[] = path.curves.map(
    (curve, index) => {
      const firstControlPoint = [
        new THREE.Vector3(curve["v0"].x, curve["v0"].y, 0),
        new THREE.Vector3(curve["v1"].x, curve["v1"].y, 0),
      ];

      const secondControlPoint = [
        new THREE.Vector3(curve["v2"].x, curve["v2"].y, 0),
        new THREE.Vector3(curve["v3"].x, curve["v3"].y, 0),
      ];
      return { curve, firstControlPoint, secondControlPoint, index };
    }
  );

  const onUpdatePath = useCallback(
    (self) => self.setFromPoints(pathPoints),
    [pathPoints]
  );

  return (
    <>
      {controlPointObjs.map((obj, index) => (
        <>
          <ControlPoint
            key={index + 1}
            point={new THREE.Vector3(obj.curve["v1"].x, obj.curve["v1"].y, 0)}
            size={0.04}
          />
          <ControlPoint
            key={index + 2}
            point={new THREE.Vector3(obj.curve["v2"].x, obj.curve["v2"].y, 0)}
            size={0.04}
          />
        </>
      ))}
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
