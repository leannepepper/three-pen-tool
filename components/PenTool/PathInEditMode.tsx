import { useThree } from "@react-three/fiber";
import { useContext, useEffect, useReducer, useRef, useState } from "react";
import * as THREE from "three";
import { EditingContext } from "../context";
import { CustomExtrudeMesh, CustomMesh, Line } from "./Line";
import { getRealMouseCoordinates } from "./utils";
import { VectorNode } from "./VectorNode";
import { OrbitControls } from "@react-three/drei";

export type CursorType = "default" | "pointer" | "move" | "crosshair" | "grab";

function cursorReducer(state: CursorType, action: { type: CursorType }) {
  return action.type;
}

export function PathInEditMode() {
  const { camera } = useThree();
  const [isEditing] = useContext(EditingContext);

  const [points, setPoints] = useState<THREE.Vector3[]>([]);
  const [isClosed, setClosed] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [pointIndexToMove, setPointIndexToMove] = useState<number | null>(null);
  const [cursor, dispatchCursor] = useReducer(cursorReducer, "default");
  const controlsRef = useRef(null);

  function handlePointerDown(e: PointerEvent) {
    e.preventDefault();
    const mouseCoordinates = getRealMouseCoordinates(e, camera);
    const newPoint = new THREE.Vector3(
      mouseCoordinates.x,
      mouseCoordinates.y,
      0
    );

    points.forEach((point, index) => {
      if (point.distanceTo(newPoint) < 0.051) {
        dispatchCursor({ type: "move" });
        setIsMoving(true);
        setPointIndexToMove(index);
        return;
      }
    });

    if (
      points.filter((point) => point.distanceTo(newPoint) < 0.051).length === 0
    ) {
      setPoints([...points, newPoint]);
    }
  }

  function handlePointerUp(e: PointerEvent) {
    e.preventDefault();
    dispatchCursor({ type: "default" });
    setIsMoving(false);
    setPointIndexToMove(null);
  }

  function handlePointerMove(e: PointerEvent) {
    e.preventDefault();
    if (isMoving) {
      const mouseCoordinates = getRealMouseCoordinates(e, camera);
      const newPoint = new THREE.Vector3(
        mouseCoordinates.x,
        mouseCoordinates.y,
        0
      );
      updateVectorNode(newPoint, pointIndexToMove);
    }
  }

  function updateVectorNode(point: THREE.Vector3, index: number) {
    setPoints([...points.slice(0, index), point, ...points.slice(index + 1)]);
  }

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.enabled = !isMoving;
    }
  }, [isMoving]);

  useEffect(() => {
    document.body.style.cursor = cursor;
  }, [cursor]);

  useEffect(() => {
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointermove", handlePointerMove);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [points, isMoving]);

  return (
    <>
      <OrbitControls ref={controlsRef} />
      <group>
        {points.map((point, index) => (
          <VectorNode key={index} point={point} />
        ))}
        {/* {points.length > 1 && <CustomMesh points={points} />} */}
        {/* {points.length > 1 && <CustomExtrudeMesh points={points} />} */}
        {points.length > 1 && <Line points={points} isClosed />}
      </group>
    </>
  );
}
