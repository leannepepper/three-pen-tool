import { Camera, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useState, useRef, useContext } from "react";
import { EditingContext } from "../context";
import { VectorNode } from "./VectorNode";

function Line({ points }: { points: THREE.Vector3[] }) {
  const lineRef = useRef(null);
  const geometry = createPath(points);

  useEffect(() => {
    lineRef.current.geometry = geometry;
  }, [points]);

  return (
    <line ref={lineRef}>
      <bufferGeometry />
      <lineBasicMaterial color="deeppink" />
    </line>
  );
}

function closePath(points: THREE.Vector3[]) {
  const lastPoint = points[points.length - 1];
  const firstPoint = points[0];
  if (lastPoint.distanceTo(firstPoint) > 0.1) {
    points.push(firstPoint);
  }
  return firstPoint;
}

function createPath(points: THREE.Vector3[]) {
  const path = new THREE.Path();
  path.moveTo(points[0].x, points[0].y);

  const lastPoint = points[points.length - 1];
  for (let i = 1; i < points.length; i++) {
    path.lineTo(points[i].x, points[i].y);

    if (points[i] === lastPoint) {
      path.lineTo(points[0].x, points[0].y);
    }
  }

  const pathPoints = path.getPoints();
  const geometry = new THREE.BufferGeometry().setFromPoints(pathPoints);
  return geometry;
}

function getRealMouseCoordinates(
  event: { clientX: number; clientY: number },
  camera: (Camera & { manual?: boolean }) | THREE.Camera
): THREE.Vector3 {
  const vec = new THREE.Vector3();
  const pos = new THREE.Vector3();

  vec.set(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1,
    0.5
  );

  vec.unproject(camera);

  vec.sub(camera.position).normalize();

  const distance = -camera.position.z / vec.z;

  pos.copy(camera.position).add(vec.multiplyScalar(distance));
  return pos;
}

export function PathInEditMode() {
  const { camera } = useThree();
  const [isEditing] = useContext(EditingContext);
  const [points, setPoints] = useState<THREE.Vector3[]>([]);

  function handleMouseDown(e) {
    e.preventDefault();
    const mouseCoordinates = getRealMouseCoordinates(e, camera);

    if (isEditing) {
      setPoints([
        ...points,
        new THREE.Vector3(mouseCoordinates.x, mouseCoordinates.y, 0),
      ]);
    }
  }

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseDown);
    return () => {
      window.removeEventListener("mouseup", handleMouseDown);
    };
  }, [points, isEditing]);

  return (
    <group>
      {points.map((point, index) => (
        <VectorNode key={index} point={point} />
      ))}
      {points.length > 1 && <Line points={points} />}
    </group>
  );
}
