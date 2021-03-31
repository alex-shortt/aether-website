import { useRef } from "react";
import { Group, MathUtils } from "three";
import { GroupProps, useFrame } from "react-three-fiber";
import { Text } from "@react-three/drei";
import FacePlayer from "modifiers/FacePlayer";
import Distort from "../modifiers/Distort";
import { FONTS } from "../utils/constants";
import { Floating } from "spacesvr";

type NarratorProps = {
  message: string;
  follow?: boolean;
  dist?: number;
  show?: boolean;
} & GroupProps;

export default function Narrator(props: NarratorProps) {
  const { message, follow, dist: DIST = 1, show = true, ...restProps } = props;

  const group = useRef<Group>();

  useFrame(({ camera }) => {
    if (!group.current) return;

    if (follow) {
      const dir = group.current.position.clone().sub(camera.position);
      const length = dir.length();

      if (length > DIST) {
        dir.multiplyScalar(((length - DIST) / length) * -1);
        group.current.position.x = MathUtils.lerp(
          group.current.position.x,
          group.current.position.x + dir.x,
          0.1
        );
        group.current.position.y = MathUtils.lerp(
          group.current.position.y,
          group.current.position.y + dir.y,
          0.1
        );
        group.current.position.z = MathUtils.lerp(
          group.current.position.z,
          group.current.position.z + dir.z,
          0.1
        );
      }
    }
  });

  return (
    <group {...restProps}>
      <group ref={group}>
        <FacePlayer>
          <Floating height={0.025}>
            <Distort fade={show ? 0.5 : 0}>
              {/* @ts-ignore */}
              <Text font={FONTS.SACRE_BLEU}>{message}</Text>
            </Distort>
          </Floating>
        </FacePlayer>
      </group>
    </group>
  );
}
