import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Suspense } from "react";

const Effects = () => {
  return (
    <Suspense fallback={null}>
      <EffectComposer multisampling={0}>
        <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.9} height={300} />
      </EffectComposer>
    </Suspense>
  );
};

export default Effects;
