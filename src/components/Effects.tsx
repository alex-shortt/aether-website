import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Suspense } from "react";

const Effects = () => {
  return (
    <Suspense fallback={null}>
      <EffectComposer multisampling={0}>
        <Bloom
          intensity={0.93}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.6}
          height={300}
        />
      </EffectComposer>
    </Suspense>
  );
};

export default Effects;
