import React, { ReactNode, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Group, MathUtils, Vector3 } from "three";
import { useLimiter } from "spacesvr";

type Props = {
  children: ReactNode;
  pos?: [number, number];
  face?: boolean;
  distance?: number;
  pinY?: boolean;
};

const SCALE = 0.0025;
const DISTANCE = 0.05;

/**
 * Tool modifier will place its children in constant view of the camera
 *
 * pos will determine relative placement on [x, y] axis
 * face will make item face the player (defaults to true)
 *
 * @param props
 * @constructor
 */
export const Tool = (props: Props) => {
  const {
    children,
    pos,
    face = true,
    pinY = false,
    distance = DISTANCE,
  } = props;

  const { camera, size } = useThree();

  const group = useRef<Group>();
  const parent = useRef<Group>();

  const { current: dummyVector } = useRef(new Vector3());
  const limiter = useLimiter(70);

  useFrame(({ clock }) => {
    if (!group.current || !limiter.isReady(clock)) return;

    if (pos !== undefined) {
      const xPos = (pos[0] * 0.00008 * size.width) / 2;
      const yPos = 0.04 * pos[1];
      dummyVector.set(xPos, yPos, -distance);
      const moveQuaternion = camera.quaternion.clone();
      if (!pinY) {
        moveQuaternion.x = 0;
        moveQuaternion.z = 0;
      }
      dummyVector.applyQuaternion(moveQuaternion);

      group.current.position.x = MathUtils.lerp(
        group.current.position.x,
        dummyVector.x,
        0.1
      );
      group.current.position.y = MathUtils.lerp(
        group.current.position.y,
        dummyVector.y,
        0.1
      );
      group.current.position.z = MathUtils.lerp(
        group.current.position.z,
        dummyVector.z,
        0.1
      );
    }

    if (face) {
      group.current.quaternion.copy(camera.quaternion);
    }
  });

  useFrame(() => {
    if (parent.current) {
      parent.current.position.copy(camera.position);
    }
  });

  return (
    <group ref={parent}>
      <group ref={group} scale={[SCALE, SCALE, SCALE]}>
        {children}
      </group>
    </group>
  );
};
