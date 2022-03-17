import { Camera, useThree } from "@react-three/fiber";
import * as THREE from "three";

export function getRealMouseCoordinates(
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
