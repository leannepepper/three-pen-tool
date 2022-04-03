import * as THREE from "three";

export function createShape(points: THREE.Vector3[], isClosed: boolean) {
  const shape = new THREE.Shape();
  shape.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    // shape.lineTo(points[i].x, points[i].y);
    shape.bezierCurveTo(
      points[i].x,
      points[i].y,
      points[i].x,
      points[i].y,
      points[i].x,
      points[i].y
    );
  }

  shape.closePath();
  return shape;
}
