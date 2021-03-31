import { useMemo } from "react";
import { MathUtils, SpotLight } from "three";
import { useFrame } from "react-three-fiber";

type Props = {
  visible?: boolean;
};

export default function Purpose(props: Props) {
  const { visible = false } = props;
  const light = useMemo(() => new SpotLight(), []);

  const lightAttrs = {
    intensity: 0.1,
    penumbra: 0.6,
    color: "#d881bf",
    angle: Math.PI * 0.2,
  };

  useFrame(() => {
    light.intensity = MathUtils.lerp(light.intensity, visible ? 1 : 0.1, 0.01);
  });

  return (
    <group>
      <group position-y={5}>
        <primitive object={light} {...lightAttrs} />
        <primitive position={[0, -1, 0]} object={light.target} />
      </group>
    </group>
  );
}
