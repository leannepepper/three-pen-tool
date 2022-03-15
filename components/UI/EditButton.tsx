import * as React from "react";
import { Html } from "@react-three/drei";
import { EditingContext } from "../context";

export function EditButton(props: any) {
  const [isEditing, setIsEditing] = React.useContext(EditingContext);
  React.useEffect(() => {
    isEditing
      ? (document.body.style.cursor = "crosshair")
      : (document.body.style.cursor = "default");
  });
  return (
    <EditingContext.Consumer>
      {([isEditing, setIsEditing]) => (
        <Html {...props}>
          <button
            onClick={() => {
              setIsEditing(!isEditing);
            }}
            type="button"
            style={{ padding: "2px 5px" }}
          >
            {isEditing ? "Stop" : "Start"}
          </button>
        </Html>
      )}
    </EditingContext.Consumer>
  );
}
