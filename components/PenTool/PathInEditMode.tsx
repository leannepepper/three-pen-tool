import { Camera, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useState, useRef, useContext } from "react";
import { EditingContext } from "../context";
import { VectorNode } from "./VectorNode";

function Line({ points }: { points: THREE.Vector3[] }) {
  const lineRef = useRef(null);
  const geometry = createBufferGeometry({ points });

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

function createBufferGeometry({ points }: { points: THREE.Vector3[] }) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(points.length * 3);
  const indices = new Uint16Array(points.length);

  for (let i = 0; i < points.length; i++) {
    positions[i * 3] = points[i].x;
    positions[i * 3 + 1] = points[i].y;
    positions[i * 3 + 2] = points[i].z;
    indices[i] = i;
  }

  // geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
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
