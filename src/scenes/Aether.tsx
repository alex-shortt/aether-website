import { StandardEnvironment, Fog, HDRI } from "spacesvr";
import { Color, Vector3 } from "three";
import Floor from "components/Floor";
import { StageProvider } from "../contexts/Stage";
import { SceneProvider } from "../contexts/Scene";
import Welcome from "./stages/Welcome";
import AmbientParticles from "components/AmbientParticles";
import Purpose from "mediators/Purpose";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import Effects from "../components/Effects";
import GradientSky from "../components/GradientSky";
import { COLORS } from "../utils/colors";
import Sun from "../components/Sun";
import Nature from "../components/Nature";
import TexParticles from "../components/TexParticles";

export default function Aether() {
  const shape = (r: number, a: number, h: number) => {
    const vec = new Vector3().setFromSphericalCoords(
      0.7 + r * 3.5,
      Math.PI / 2 + 0.125 * r,
      a * Math.PI * 2
    );
    return vec;
  };

  return (
    <StandardEnvironment
      playerProps={{ pos: [0, 1, 15], rot: 0, speed: 1.3 }}
      canvasProps={{ dpr: 1.5 }}
    >
      <StageProvider>
        <SceneProvider>
          <ambientLight intensity={0.3} color="#ffffff" />
          <group name="stages">
            <Welcome />
          </group>
          <AmbientParticles position-y={3} />
          {/*<Fog color={new Color("black")} near={0} far={50} />*/}
          <HDRI
            src="https://d27rt3a60hh1lx.cloudfront.net/content/aether/gradient-dark.hdr"
            disableBackground
          />
          <Floor />
          <GradientSky stops={COLORS} radius={100} />
          {/*<Tool pos={[-0.7, -0.7]}>*/}
          {/*  <Suspense fallback={null}>*/}
          {/*    <Book />*/}
          {/*  </Suspense>*/}
          {/*</Tool>*/}
          {/*<Perf />*/}
          <TexParticles />
          <Effects />
          <Sun />
          <Nature density={1000} shape={shape} />
        </SceneProvider>
      </StageProvider>
    </StandardEnvironment>
  );
}
