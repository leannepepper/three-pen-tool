import * as React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { EditButton } from "./UI/EditButton";

export function Scene() {
  return (
    <Canvas>
      <color attach="background" args={["#000"]} />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls />
      <EditButton position={[-3.5, 3.5, 0]} />
    </Canvas>
  );
}
