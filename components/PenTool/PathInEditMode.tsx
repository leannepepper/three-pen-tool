import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useState, useRef, useContext } from "react";
import { EditingContext } from "../context";

function Line({ points }: { points: THREE.Vector3[] }) {
  const lineRef = useRef(null);

  useEffect(() => {
    lineRef.current.geometry.setFromPoints(points);
  }, [points]);

  return (
    <line ref={lineRef}>
      <bufferGeometry />
      <lineBasicMaterial color="deeppink" />
    </line>
  );
}

function getRealMouseCoordinates(event, camera): THREE.Vector3 {
  var vec = new THREE.Vector3(); // create once and reuse
  var pos = new THREE.Vector3(); // create once and reuse

  vec.set(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1,
    0.5
  );

  vec.unproject(camera);

  vec.sub(camera.position).normalize();

  var distance = -camera.position.z / vec.z;

  pos.copy(camera.position).add(vec.multiplyScalar(distance));
  return pos;
}

export function PathInEditMode() {
  const { mouse, camera } = useThree();
  const [isEditing] = useContext(EditingContext);
  const [points, setPoints] = useState<THREE.Vector3[]>([]);

  function handleMouseDown(e) {
    e.preventDefault();
    const mouseCoordinates = getRealMouseCoordinates(e, camera);
    console.log(isEditing);
    if (isEditing) {
      setPoints([
        ...points,
        new THREE.Vector3(mouseCoordinates.x, mouseCoordinates.y, 0),
      ]);
    }
  }

  useEffect(() => {
    window.addEventListener("mousedown", handleMouseDown);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, [points, isEditing]);

  return <group>{points.length > 1 && <Line points={points} />}</group>;
}
