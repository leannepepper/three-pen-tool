import { useCallback } from "react";
import * as THREE from "three";

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
    path.bezierCurveTo(point.x, point.y, point.x, point.y, point.x, point.y);
  });

  const pathPoints = path.getPoints();

  const onUpdate = useCallback(
    (self) => self.setFromPoints(pathPoints),
    [pathPoints]
  );

  return (
    <line>
      <bufferGeometry attach="geometry" onUpdate={onUpdate} />
      <lineBasicMaterial
        attach="material"
        color={"#9c88ff"}
        linewidth={10}
        linecap={"round"}
        linejoin={"round"}
      />
    </line>
  );
}
