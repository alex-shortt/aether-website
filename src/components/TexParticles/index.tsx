import { useTexture } from "@react-three/drei";
import { useMemo } from "react";
import {
  AdditiveBlending,
  InstancedBufferGeometry,
  PlaneGeometry,
  ShaderMaterial,
} from "three";
import { frag, vert } from "./shaders/particles";

const IMAGE_URL =
  "https://d27rt3a60hh1lx.cloudfront.net/content/aether/particle.png";

const COUNT = 100;

export default function TexParticles() {
  const tex = useTexture(IMAGE_URL);

  const geo = useMemo(() => {
    const g = new InstancedBufferGeometry();
    g.copy(new PlaneGeometry(1, 1));
    return g;
  }, []);

  const mat = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: {
          time: {
            value: 0,
          },
          particleTex: {
            value: tex,
          },
        },
        vertexShader: vert,
        fragmentShader: frag,
        transparent: true,
      }),
    [frag, vert, tex]
  );

  return (
    <group name="tex-particles" position-y={0.4}>
      <instancedMesh args={[geo, mat, COUNT]} frustumCulled={false} />
    </group>
  );
}
