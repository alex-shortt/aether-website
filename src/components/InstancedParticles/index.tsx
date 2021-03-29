import { useEffect, useMemo, useRef } from "react";
import MoverCore from "./classes/MoverCore";
import PhysicsRenderer from "./classes/PhysicsRenderer";
import { useFrame, useLoader, useThree } from "react-three-fiber";
import * as THREE from "three";

import {
  vert as vsa,
  frag as fsa,
} from "./shaders/physicsRendererAcceleration";
import { vert as vsv, frag as fsv } from "./shaders/physicsRendererVelocity";

const COUNT = 2000;
const HEIGHT_SEGMENTS = 1;

const NOISE_TEX =
  "https://ykob.github.io/sketch-threejs/img/sketch/flow_field/noise.jpg";

const InstancedParticles = () => {
  const { gl, scene } = useThree();
  const { current: physicsRenderers } = useRef<PhysicsRenderer[]>([]);
  const { current: multiTime } = useRef(
    new THREE.Vector2(Math.random() * 2 - 1, Math.random() * 2 - 1)
  );
  const { current: core } = useRef(new MoverCore(COUNT));

  const noiseTex = useLoader(THREE.TextureLoader, NOISE_TEX);

  useEffect(() => {
    if (!noiseTex) return;

    // Define PhysicsRenderer
    const aArrayBase = [];
    const vArrayBase = [];
    const aFirstArray = [];
    const vFirstArray = [];
    const delayArray = [];
    const massArray = [];

    for (var i = 0; i < COUNT * 3; i += 3) {
      const radian = Math.PI * 2;
      const radiusA = 5;
      const radiusV = 30;

      aArrayBase[i + 0] = 3;
      aArrayBase[i + 1] = Math.cos(radian) * radiusA;
      aArrayBase[i + 2] = Math.sin(radian) * radiusA;

      vArrayBase[i + 0] = -499.99;
      vArrayBase[i + 1] = Math.cos(radian) * radiusV;
      vArrayBase[i + 2] = Math.sin(radian) * radiusV;

      aFirstArray[i + 0] = aArrayBase[i + 0];
      aFirstArray[i + 1] = aArrayBase[i + 1];
      aFirstArray[i + 2] = aArrayBase[i + 2];

      vFirstArray[i + 0] = vArrayBase[i + 0];
      vFirstArray[i + 1] = vArrayBase[i + 1];
      vFirstArray[i + 2] = vArrayBase[i + 2];

      delayArray[i + 0] = Math.random() * 5;
      delayArray[i + 1] = 0;
      delayArray[i + 2] = 0;

      massArray[i + 0] = Math.random();
      massArray[i + 1] = 0;
      massArray[i + 2] = 0;
    }

    for (let i = 0; i < 1; i++) {
      physicsRenderers[i] = new PhysicsRenderer(vsa, fsa, vsv, fsv);
      physicsRenderers[i].start(gl, aArrayBase, vArrayBase, null, null);
      physicsRenderers[i].mergeAUniforms({
        noiseTex: {
          value: noiseTex,
        },
        accelerationFirst: {
          value: physicsRenderers[i].createDataTexture(aFirstArray),
        },
        delay: {
          value: physicsRenderers[i].createDataTexture(delayArray),
        },
        mass: {
          value: physicsRenderers[i].createDataTexture(massArray),
        },
        multiTime: {
          value: multiTime,
        },
      });
      physicsRenderers[i].mergeVUniforms({
        delay: {
          value: physicsRenderers[i].createDataTexture(delayArray),
        },
        velocityFirst: {
          value: physicsRenderers[i].createDataTexture(vFirstArray),
        },
      });
    }

    core.start(physicsRenderers[0]);
  }, [noiseTex]);

  useFrame(({ clock }, delta) => {
    if (!noiseTex || !core || !physicsRenderers[0]) return;

    const delt = delta * 0.4;

    for (let i = 0; i < physicsRenderers.length; i++) {
      const fr = physicsRenderers[i];
      fr.update(gl, delt);
    }
    core.update(physicsRenderers[0], delt);
    gl.setRenderTarget(null);
    // trail.update(physicsRenderers, time);
  });

  return (
    <group scale={[0.1, 0.1, 0.1]} position-y={2}>
      {core && <primitive object={core} />}
    </group>
  );
};

export default InstancedParticles;
