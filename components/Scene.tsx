import * as React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { EditButton } from "./UI/EditButton";
import { PathInEditMode } from "./PenTool/PathInEditMode";
import { useEffect } from "react";
import { EditingContext } from "./context";

export function Scene() {
  const [isEditing, setIsEditing] = React.useState(false);
  return (
    <Canvas>
      <color attach="background" args={["#000"]} />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls />
      <EditingContext.Provider value={[isEditing, setIsEditing]}>
        <EditButton position={[-3.5, 3.5, 0]} />
        <PathInEditMode />
      </EditingContext.Provider>
    </Canvas>
  );
}
