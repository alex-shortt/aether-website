import FollowsPlayer from "../modifiers/FollowsPlayer";
import { useEffect, useRef } from "react";
import { Group, Vector3 } from "three";
import { useFrame } from "react-three-fiber";
import { Text } from "@react-three/drei";
import FacePlayer from "modifiers/FacePlayer";
import Distort from "../modifiers/Distort";
import { useSpring } from "react-spring";
import { useSpeech } from "../utils/speech";

const DIST = 2.5;

type NarratorProps = {
  message: string;
  speed?: number;
};

export default function Narrator(props: NarratorProps) {
  const { message, speed = 0.1 } = props;

  const group = useRef<Group>();
  const curMessage = useSpeech(message, speed);

  const [spring, setSpring] = useSpring(() => ({
    xyz: [0, 0, 0],
    precision: 0.00001,
  }));

  useFrame(({ camera }) => {
    if (!group.current) return;

    const dir = group.current.position.clone().sub(camera.position);
    const dist = dir.length();

    if (dist > DIST) {
      dir.multiplyScalar(0.1 / dist);
      group.current.position.sub(dir);

      // dir.multiplyScalar(0.1 / dist);
      // const newPos = group.current.position.clone().sub(dir);
      // setSpring({ xyz: newPos.toArray() });
      //
      // group.current.position.copy(
      //   new Vector3().fromArray(getSpringValues(spring))
      // );
    }
  });

  return (
    <group ref={group}>
      <FacePlayer>
        <Distort>
          {/* @ts-ignore */}
          <Text>{curMessage}</Text>
        </Distort>
      </FacePlayer>
    </group>
  );
}
