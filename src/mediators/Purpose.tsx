import { useMemo } from "react";
import { SpotLight } from "three";

export default function Purpose() {
  const light = useMemo(() => new SpotLight(), []);

  const lightAttrs = {
    intensity: 2,
    penumbra: 0.6,
    color: "#d881bf",
    angle: Math.PI * 0.2,
  };

  return (
    <group>
      <group position-y={5}>
        <primitive object={light} {...lightAttrs} />
        <primitive position={[0, -1, 0]} object={light.target} />
      </group>
    </group>
  );
}
