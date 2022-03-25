import { Canvas } from "@react-three/fiber";
import * as React from "react";
import { EditingContext } from "./context";
import { PathInEditMode } from "./PenTool/PathInEditMode";

export function Scene() {
  const [isEditing, setIsEditing] = React.useState(true);

  return (
    <Canvas>
      <color attach="background" args={["#000"]} />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <EditingContext.Provider value={[isEditing, setIsEditing]}>
        {/* <EditButton position={[-3.5, 3.5, 0]} /> */}

        <PathInEditMode />
      </EditingContext.Provider>
    </Canvas>
  );
}
