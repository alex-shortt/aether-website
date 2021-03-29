import { StandardEnvironment, Fog, HDRI } from "spacesvr";
import { Color, Vector3 } from "three";
import Floor from "components/Floor";
import Renderer from "components/Renderer";
import { StageProvider } from "../contexts/Stage";
import Welcome from "./stages/Welcome";
import AmbientParticles from "components/AmbientParticles";
import Purpose from "mediators/Purpose";

export default function Aether() {
  const INITIAL_POSITION = new Vector3(5, 1, 10);

  return (
    <StandardEnvironment player={{ pos: INITIAL_POSITION, speed: 2.7 }}>
      <StageProvider>
        <ambientLight intensity={0.3} color="#ffffff" />
        <Purpose />
        <group name="stages">
          <Welcome />
        </group>
        <AmbientParticles />
        <Fog color={new Color("black")} near={0} far={50} />
        <HDRI
          src="https://d27rt3a60hh1lx.cloudfront.net/content/aether/gradient-dark.hdr"
          hideBackground={true}
        />
        <Floor />
        <Renderer />
        <Purpose />
        {/*<Tool pos={[-0.7, -0.7]}>*/}
        {/*  <Suspense fallback={null}>*/}
        {/*    <Book />*/}
        {/*  </Suspense>*/}
        {/*</Tool>*/}
        {/*<Perf />*/}
      </StageProvider>
    </StandardEnvironment>
  );
}
