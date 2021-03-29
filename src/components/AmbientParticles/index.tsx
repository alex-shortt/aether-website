import { useParticleMaterial } from "./shaders/particles";
import { useEffect, useMemo, useRef } from "react";
import {
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  InstancedMesh,
  Object3D,
} from "three";
import { useFrame } from "react-three-fiber";

const COUNT = 500;
const XZ_RANGE = 20;
const XZ_POW = 1.8;
const Y_RANGE = 20;
const Y_POW = 2;

export default function AmbientParticles() {
  const mesh = useRef<InstancedMesh>();

  const particleMaterial = useParticleMaterial();

  const dummy = useMemo(() => new Object3D(), []);

  useEffect(() => {
    if (!mesh.current) return;

    const seeds = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      const rx = Math.pow(Math.random(), XZ_POW);
      const ry = Math.pow(Math.random(), Y_POW);
      const rz = Math.pow(Math.random(), XZ_POW);

      const x = rx * XZ_RANGE * (Math.random() > 0.5 ? -1 : 1);
      const z = rz * XZ_RANGE * (Math.random() > 0.5 ? -1 : 1);
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
    if (particleMaterial) {
      particleMaterial.uniforms.time.value = clock.getElapsedTime();
    }
  });

  return (
    <group name="ambient-particles">
      {/* @ts-ignore */}
      <instancedMesh
        ref={mesh}
        args={[null, null, COUNT]}
        material={particleMaterial}
      >
        <sphereBufferGeometry args={[0.015, 12, 8]} />
      </instancedMesh>
    </group>
  );
}
