import { useState } from "react";
//@ts-ignore
import { Water } from "three/examples/jsm/objects/Water2";
import * as THREE from "three";
import { Color } from "three";
import { GroupProps, useLoader } from "@react-three/fiber";

const WaterComp = (props: GroupProps) => {
  const normal0 = useLoader(
    THREE.TextureLoader,
    "https://d27rt3a60hh1lx.cloudfront.net/content/aether/Water_1_M_Normal.jpg"
  );
  const normal1 = useLoader(
    THREE.TextureLoader,
    "https://d27rt3a60hh1lx.cloudfront.net/content/aether/Water_2_M_Normal.jpg"
  );

  const [water] = useState(() => {
    const waterGeometry = new THREE.PlaneBufferGeometry(20, 20);

    const locwater = new Water(waterGeometry, {
      color: new Color("#ffffff"),
      scale: 8,
      flowDirection: new THREE.Vector2(1, 1),
      textureWidth: 1024,
      textureHeight: 1024,
      normalMap0: normal0,
      normalMap1: normal1,
    });

    locwater.rotation.x = -Math.PI / 2;
    locwater.position.y = 0;
    return locwater;
  });

  return (
    <group {...props}>
      <group scale={[0.999999, 1, 0.999999]}>
        <primitive object={water} dispose={undefined} />
      </group>
    </group>
  );
};

export default WaterComp;
