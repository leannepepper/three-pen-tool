import * as THREE from "three";

export function createPath(points: THREE.Vector3[], isClosed: boolean) {
  const path = new THREE.Path();
  path.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    path.lineTo(points[i].x, points[i].y);
  }

  return path;
}
