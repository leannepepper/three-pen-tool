import * as THREE from "three";

export function createShape(points: THREE.Vector3[], isClosed: boolean) {
  const xandYPoints = points.map(
    (point) => new THREE.Vector2(point.x, point.y)
  );
  const shape = new THREE.Shape();

  shape.moveTo(xandYPoints[0].x, xandYPoints[0].y);
  for (let i = 0; i < points.length; i++) {
    shape.lineTo(points[i].x, points[i].y);
  }

  shape.closePath();
  return shape;
}
