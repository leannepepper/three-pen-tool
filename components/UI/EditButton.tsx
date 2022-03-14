import * as React from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Html } from "@react-three/drei";

export function EditButton(props: any) {
  const [isEditing, setIsEditing] = React.useState(false);

  React.useEffect(() => {
    isEditing
      ? (document.body.style.cursor = "crosshair")
      : (document.body.style.cursor = "default");
  }, [isEditing]);

  return (
    <Html {...props}>
      <button
        onClick={() => setIsEditing(!isEditing)}
        type="button"
        style={{ padding: "2px 5px" }}
      >
        {isEditing ? "Stop" : "Start"}
      </button>
    </Html>
  );
}
