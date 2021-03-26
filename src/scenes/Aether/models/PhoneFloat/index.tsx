import { GroupProps, useFrame, useLoader } from "react-three-fiber";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";
import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";
import { BufferGeometry, Points, ShaderMaterial } from "three";
import { frag, vert } from "./shaders/points";

const FILE_URL =
  "https://d27rt3a60hh1lx.cloudfront.net/content/aether/phone-float.ply";

const Index = (props: GroupProps) => {
  const model = useLoader(PLYLoader, FILE_URL);

  const cloud = useRef<Points>();

  const mat = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: {
          time: {
            value: 0,
          },
        },
        vertexShader: vert,
        vertexColors: true,
        fragmentShader: frag,
        transparent: true,
        side: THREE.DoubleSide,
      }),
    []
  );

  useEffect(() => {
    if (model) {
      const numVertices = model.attributes.position.count;
      var alphas = new Float32Array(numVertices * 1); // 1 values per vertex

      for (var i = 0; i < numVertices; i++) {
        // set alpha randomly
        alphas[i] = Math.random();
      }

      model.setAttribute("alpha", new THREE.BufferAttribute(alphas, 1));
    }
  }, [model]);

  useFrame(({ clock }) => {
    if (!mat || !cloud.current) return;
    const alphas = (cloud.current.geometry as BufferGeometry).attributes.alpha;

    for (let i = 0; i < alphas.count; i++) {
      // @ts-ignore
      alphas.array[i] *= 0.95;
      if (alphas.array[i] < 0.01) {
        // @ts-ignore
        alphas.array[i] = 1.0;
      }
    }

    alphas.needsUpdate = true; // important!

    mat.uniforms.time.value = clock.getElapsedTime();
  });

  return (
    <group {...props}>
      <points position-y={-0.5} ref={cloud} material={mat}>
        <primitive object={model} attach="geometry" />
      </points>
    </group>
  );
};

export default Index;
