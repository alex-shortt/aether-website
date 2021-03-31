import { ReactNode, useRef, useState } from "react";
import { Group } from "three";
import { useFrame } from "react-three-fiber";
// @ts-ignore
import { animated, useSpring } from "react-spring/three";
import { config } from "react-spring";

type Props = {
  dist?: number;
  children: ReactNode | ReactNode[];
};

export default function FaceWhenNear(props: Props) {
  const { dist = 5, children } = props;
  const group = useRef<Group>();

  const [near, setNear] = useState(false);

  const { y, rotX } = useSpring({
    y: near ? 0.7 : 0,
    rotX: near ? -0.6 : -Math.PI / 2,
    config: config.molasses,
  });

  useFrame(({ camera }) => {
    if (!group.current) return;

    if (!near && camera.position.distanceTo(group.current.position) < dist) {
      setNear(true);
    } else if (
      near &&
      camera.position.distanceTo(group.current.position) > dist
    ) {
      setNear(false);
    }
  });

  return (
    <group ref={group}>
      <animated.group position-y={y} rotation-x={rotX}>
        {children}
      </animated.group>
    </group>
  );
}
