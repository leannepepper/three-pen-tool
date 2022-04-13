import { Line } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useCallback, useEffect, useState } from "react";
import * as THREE from "three";
import { getRealMouseCoordinates } from "./utils";
import { VectorNode } from "./VectorNode";

type ControlPointObj = {
  curve: THREE.Curve<THREE.Vector2>;
  firstControlPoint: THREE.Vector3[];
  secondControlPoint: THREE.Vector3[];
  index: number;
};

export function Path({
  points,
  isClosed,
}: {
  points: THREE.Vector3[];
  isClosed: boolean;
}) {
  const path = new THREE.Path();
  const [isMoving, setIsMoving] = useState(false);
  // const [controlPointObjs, setControlPoints] =
  //   useState<ControlPointObj[]>(null);
  const [pointIndexToMove, setPointIndexToMove] = useState<number | null>(null);
  const { camera } = useThree();

  path.moveTo(points[0].x, points[0].y);

  points.forEach((point) => {
    path.bezierCurveTo(
      point.x + 1,
      point.y + 1,
      point.x + 1,
      point.y + 1,
      point.x,
      point.y
    );
  });

  const pathPoints = path.getPoints();

  const controlPointObjs: ControlPointObj[] = path.curves.map(
    (curve, index) => {
      const firstControlPoint = [
        new THREE.Vector3(curve["v0"].x, curve["v0"].y, 0),
        new THREE.Vector3(curve["v1"].x, curve["v1"].y, 0),
      ];

      const secondControlPoint = [
        new THREE.Vector3(curve["v2"].x, curve["v2"].y, 0),
        new THREE.Vector3(curve["v3"].x, curve["v3"].y, 0),
      ];
      return { curve, firstControlPoint, secondControlPoint, index };
    }
  );

  console.log(controlPointObjs);

  const onUpdatePath = useCallback(
    (self) => self.setFromPoints(pathPoints),
    [pathPoints]
  );

  function handlePointerDown(e: PointerEvent) {
    e.preventDefault();
    const mouseCoordinates = getRealMouseCoordinates(e, camera);
    const newPoint = new THREE.Vector3(
      mouseCoordinates.x,
      mouseCoordinates.y,
      0
    );

    // controlPointObjs.forEach((point, index) => {
    //   if (point.distanceTo(newPoint) < 0.051) {
    //     setIsMoving(true);
    //     setPointIndexToMove(index);
    //     return;
    //   }
    // });

    // if (
    //   controlPointObjs.filter((point) => point.distanceTo(newPoint) < 0.051)
    //     .length === 0
    // ) {
    //   setControlPoints([...controlPointObjs, newPoint]);
    // }
  }

  function handlePointerUp(e: PointerEvent) {
    e.preventDefault();
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
    // setControlPoints([
    //   ...points.slice(0, index),
    //   point,
    //   ...points.slice(index + 1),
    // ]);
  }

  useEffect(() => {
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointermove", handlePointerMove);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [controlPointObjs, isMoving]);

  return (
    <>
      {path.curves.map((curve, index) => {
        // Create curve handels based off control points https://threejs.org/docs/?q=curve#api/en/extras/curves/CubicBezierCurve
        let firstControlPoint = [
          new THREE.Vector3(curve["v0"].x, curve["v0"].y, 0),
          new THREE.Vector3(curve["v1"].x, curve["v1"].y, 0),
        ];

        let secondControlPoint = [
          new THREE.Vector3(curve["v2"].x, curve["v2"].y, 0),
          new THREE.Vector3(curve["v3"].x, curve["v3"].y, 0),
        ];

        return (
          <>
            <Line
              key={index + 1}
              points={firstControlPoint}
              color="blue"
              lineWidth={1}
            />
            <VectorNode
              key={index + 2}
              point={firstControlPoint[1]}
              size={0.04}
            />
            <Line
              key={index + 3}
              points={secondControlPoint}
              color="red"
              lineWidth={1}
            />
            <VectorNode
              key={index + 4}
              point={secondControlPoint[0]}
              size={0.04}
            />
          </>
        );
      })}
      <line>
        <bufferGeometry attach="geometry" onUpdate={onUpdatePath} />
        <lineBasicMaterial
          attach="material"
          color={"#fff"}
          linewidth={10}
          linecap={"round"}
          linejoin={"round"}
        />
      </line>
    </>
  );
}
