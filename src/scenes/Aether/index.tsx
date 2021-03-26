import { StandardEnvironment, Fog, Background } from "spacesvr";
import { Color, Vector3 } from "three";
import FollowsPlayer from "./modifiers/FollowsPlayer";
import Hill from "./models/Hill";

import { useRef } from "react";
import * as THREE from "three";
import { Radiance } from "./components/Radiance";
import Floor from "./components/Floor";
import Particles from "./components/InstancedParticles";
import { Perf } from "r3f-perf";
import Effects from "./components/Effects";
import WaterFloor from "./components/WaterFloor";
import PhoneFloat from "./models/PhoneFloat";

const Starter = () => {
  const INITIAL_POSITION = new Vector3(5, 1, 10);

  const spotlight = useRef<THREE.SpotLight>();
  const PINK = "#ff94df";

  return (
    <StandardEnvironment player={{ pos: INITIAL_POSITION, speed: 1.3 }}>
      <ambientLight intensity={0.5} color="#ffffff" />
      <Particles />
      <FollowsPlayer>
        <group position-y={5}>
          <spotLight
            ref={spotlight}
            intensity={0.9}
            penumbra={0.8}
            color={"#d881bf"}
          />
          {spotlight.current && (
            <primitive
              position={[0, -1, 0]}
              object={spotlight.current.target}
            />
          )}
        </group>
      </FollowsPlayer>
      <WaterFloor />
      {/*<Background color={"black"} />*/}
      <Fog color={new Color("black")} near={0} far={10} />
      {/*<Refraction />*/}
      <Radiance src="https://d27rt3a60hh1lx.cloudfront.net/content/aether/gradient-dark.hdr" />
      <Floor />
      {/*<Effects />*/}
      {/*<Hill />*/}
      <PhoneFloat />
      {/*<Perf />*/}
    </StandardEnvironment>
  );
};

export default Starter;
