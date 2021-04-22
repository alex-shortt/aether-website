import { ReactNode, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Group } from "three";

type FollowsPlayerProps = {
  children: ReactNode;
};

const FollowsPlayer = (props: FollowsPlayerProps) => {
  const { children } = props;
  const { camera } = useThree();
  const group = useRef<Group>();

  useFrame(() => {
    if (group.current) {
      group.current.position.copy(camera.position);
      group.current.position.y = 0;
    }
  });

  return <group ref={group}>{children}</group>;
};

export default FollowsPlayer;
