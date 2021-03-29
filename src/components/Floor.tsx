import { useLoader } from "react-three-fiber";
import * as THREE from "three";

type FloorProps = JSX.IntrinsicElements["group"];

const Floor = (props: FloorProps) => {
  const woodTex = useLoader(
    THREE.TextureLoader,
    "https://d27rt3a60hh1lx.cloudfront.net/content/aether/hardwood2_diffuse.jpg"
  );

  woodTex.wrapS = woodTex.wrapT = THREE.RepeatWrapping;
  woodTex.anisotropy = 16;
  woodTex.repeat.set(60, 60);

  return (
    <group {...props}>
      <group position-y={-0.01}>
        <mesh rotation-x={-Math.PI / 2}>
          <planeBufferGeometry args={[200, 200]} />
          <meshStandardMaterial
            roughness={0.8}
            metalness={0.4}
            color="#ff94df"
          />
        </mesh>
      </group>
    </group>
  );
};

export default Floor;
