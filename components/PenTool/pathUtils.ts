import * as THREE from "three";
import { CurvePath } from "three";

export function createPath(points: THREE.Vector3[], isClosed: boolean) {
  const path = new THREE.Path();
  // const path = new THREE.CurvePath();
  path.moveTo(points[0].x, points[0].y);

  for (let i = 0; i < points.length; i++) {
    path.lineTo(points[i].x, points[i].y);
    // path.quadraticCurveTo(0, 1, points[i].x, points[i].y);
  }

  path.closePath();
  return path;
}

export function createCurve(points: THREE.Vector3[], isClosed: boolean) {
  const curvePoints = [];
  for (let i = 0; i < points.length; i++) {
    curvePoints.push(new THREE.Vector2(points[i].x, points[i].y));
  }
  const curve = new THREE.SplineCurve(curvePoints);
  return curve;
}
