import { useParticleMaterial } from "./shaders/particles";
import { useEffect, useMemo, useRef } from "react";
import {
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  InstancedMesh,
  Object3D,
} from "three";
import { GroupProps, useFrame } from "@react-three/fiber";
import { useLimiter } from "spacesvr";

const COUNT = 400;
const X_RANGE = 20;
const Z_RANGE = 20;
const XZ_POW = 1.2;
const Y_RANGE = 5;
const Y_POW = 2;
const SCALE = 700;

export default function AmbientParticles(props: GroupProps) {
  const mesh = useRef<InstancedMesh>();

  const particleMaterial = useParticleMaterial();
  const limiter = useLimiter(40);

  const dummy = useMemo(() => new Object3D(), []);

  useEffect(() => {
    if (!mesh.current) return;

    const seeds = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      const rx = Math.pow(Math.random(), XZ_POW);
      const ry = Math.pow(Math.random(), Y_POW);
      const rz = Math.pow(Math.random(), XZ_POW);

      const x = ((rx * X_RANGE) / 2) * (Math.random() > 0.5 ? -1 : 1);
      const z = ((rz * Z_RANGE) / 2) * (Math.random() > 0.5 ? -1 : 1);
      const y = ry * Y_RANGE;
      dummy.position.fromArray([x, y, z]);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
      seeds[i] = Math.random();
    }
    mesh.current.instanceMatrix.needsUpdate = true;

    (mesh.current.geometry as InstancedBufferGeometry).setAttribute(
      "seed",
      new InstancedBufferAttribute(seeds, 1)
    );
  }, [COUNT, mesh]);

  useFrame(({ clock }) => {
    if (particleMaterial && limiter.isReady(clock)) {
      particleMaterial.uniforms.time.value = clock.getElapsedTime();
    }
  });

  return (
    <group name="ambient-particles" {...props}>
      {/* @ts-ignore */}
      <instancedMesh
        ref={mesh}
        // @ts-ignore
        args={[null, null, COUNT]}
        material={particleMaterial}
      >
        <sphereBufferGeometry args={[0.015 * SCALE, 8, 5]} />
      </instancedMesh>
    </group>
  );
}
