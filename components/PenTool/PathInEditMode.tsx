import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Line } from "@react-three/drei";
import { useEffect, useState } from "react";

export function PathInEditMode({}) {
  const { mouse } = useThree();
  const [points, setPoints] = useState([]);

  const lineGeometry = new THREE.BufferGeometry();

  function handleMouseDown(e) {
    e.preventDefault();

    setPoints([...points, mouse]);
    //lineGeometry.attributes.position.needsUpdate = true;
    lineGeometry.setFromPoints(points);

    console.log(points);
  }

  useEffect(() => {
    window.addEventListener("mousedown", handleMouseDown);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, [points]);
  return null;
  return (
    <group>
      {points.length > 0 && <Line points={points} color={0xffffff} />}
    </group>
  );
}
