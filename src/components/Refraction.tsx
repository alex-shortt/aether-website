import { Refractor } from "three/examples/jsm/objects/Refractor";
import { useMemo, useState } from "react";
import { Material, PlaneBufferGeometry, ShaderMaterial } from "three";
import { WaterRefractionShader } from "three/examples/jsm/shaders/WaterRefractionShader";
import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";

type RefractionProps = JSX.IntrinsicElements["group"];

const Refraction = (props: RefractionProps) => {
  const [refractor] = useState(() => {
    const geo = new PlaneBufferGeometry(10, 10);
    return new Refractor(geo, {
      color: new THREE.Color(0x999999),
      textureWidth: 512,
      textureHeight: 512,
      shader: WaterRefractionShader,
    });
  });

  const dudvMap = useLoader(
    THREE.TextureLoader,
    "https://d27rt3a60hh1lx.cloudfront.net/content/aether/waterdudv.jpg"
  );
  dudvMap.wrapS = dudvMap.wrapT = THREE.RepeatWrapping;
  if (refractor) {
    (refractor.material as ShaderMaterial).uniforms["tDudv"].value = dudvMap;
  }

  useFrame((_, delta) => {
    (refractor.material as ShaderMaterial).uniforms["time"].value += delta;
  });

  return (
    <group {...props}>
      <group rotation-x={-Math.PI / 2} position-y={0.001}>
        <primitive object={refractor}></primitive>
      </group>
    </group>
  );
};

export default Refraction;
