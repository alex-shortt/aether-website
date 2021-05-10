import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { useMemo } from "react";
import { MeshStandardMaterial } from "three";
// @ts-ignore
import glsl from "glslify";

type FloorProps = JSX.IntrinsicElements["group"];

const GRASS_TEX =
  "https://d27rt3a60hh1lx.cloudfront.net/content/aether/grasstile-blue.jpg";

const uniforms = `
    uniform float time;
    
    varying vec3 vPos;
`;

const vert = glsl`
    #include <worldpos_vertex>
    // float theta = sin( time + position.x / 255.0 * 3.14 * 2.0 / 4.0 ) / 3.0;
    gl_Position.y += 0.05 * sin(time * 0.9 + gl_Position.y);
    gl_Position.x += 0.05 * sin(time * 0.9 + gl_Position.x);
`;

const Floor = (props: FloorProps) => {
  const tex = useLoader(THREE.TextureLoader, GRASS_TEX);

  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 16;
  tex.repeat.set(90, 90);

  const mat = useMemo(() => {
    const m = new MeshStandardMaterial();

    m.onBeforeCompile = function (shader) {
      shader.uniforms.time = { value: 0 };
      shader.vertexShader = uniforms + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        "#include <worldpos_vertex>",
        vert
      );

      m.userData.shader = shader;
    };

    m.map = tex;
    m.needsUpdate = true;

    return m;
  }, [tex, vert]);

  useFrame(({ clock }) => {
    if (mat.userData.shader) {
      mat.userData.shader.uniforms.time.value = clock.getElapsedTime();
    }
  });

  return (
    <group {...props}>
      <group position-y={-0.01}>
        <mesh rotation-x={-Math.PI / 2} material={mat}>
          <planeBufferGeometry args={[200, 200, 400, 400]} />
        </mesh>
      </group>
    </group>
  );
};

export default Floor;
