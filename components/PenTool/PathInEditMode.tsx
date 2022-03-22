import { useThree } from "@react-three/fiber";
import { useContext, useEffect, useState } from "react";
import * as THREE from "three";
import { EditingContext } from "../context";
import { Line } from "./Line";
import { getRealMouseCoordinates } from "./utils";
import { VectorNode } from "./VectorNode";

export function PathInEditMode() {
  const { camera } = useThree();
  const [isEditing] = useContext(EditingContext);

  const [points, setPoints] = useState<THREE.Vector3[]>([]);
  const [isClosed, setClosed] = useState(false);

  function handleClick(e: MouseEvent) {
    e.preventDefault();
    const mouseCoordinates = getRealMouseCoordinates(e, camera);
    const newPoint = new THREE.Vector3(
      mouseCoordinates.x,
      mouseCoordinates.y,
      0
    );
    if (points.length > 1 && newPoint.distanceTo(points[0]) < 0.051) {
      setClosed(true);
    } else if (isEditing && !isClosed) {
      setPoints([...points, newPoint]);
    }
  }

  function updateVectorNode(point: THREE.Vector3, index: number) {
    setPoints([...points.slice(0, index), point, ...points.slice(index + 1)]);
  }

  useEffect(() => {
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [points, isEditing, isClosed]);

  return (
    <group>
      {points.map((point, index) => (
        <VectorNode
          key={index}
          index={index}
          point={point}
          updateVectorNode={updateVectorNode}
        />
      ))}
      {points.length > 1 && !isClosed && (
        <Line points={points} isClosed={isClosed} />
      )}
      {points.length > 1 && isClosed && (
        <Line points={points} isClosed={isClosed} />
      )}
    </group>
  );
}
