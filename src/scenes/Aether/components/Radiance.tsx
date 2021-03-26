import { useEffect } from "react";

import { useThree } from "react-three-fiber";
import { PMREMGenerator, UnsignedByteType } from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

type RadianceProps = {
  src: string;
};

export const Radiance = (props: RadianceProps) => {
  const { src } = props;
  const { gl, scene } = useThree();

  // pmrem generator for hdri loading
  const pmremGenerator = new PMREMGenerator(gl);
  pmremGenerator.compileEquirectangularShader();

  // actual file loader
  const loader = new RGBELoader();
  loader.setDataType(UnsignedByteType);

  useEffect(() => {
    loader.load(src, (texture) => {
      const envMap = pmremGenerator.fromEquirectangular(texture).texture;

      // sent envmap onto scene env and background
      scene.environment = envMap;
      gl.toneMappingExposure = 0.5;
      // scene.background = envMap;

      texture.dispose();
      pmremGenerator.dispose();
    });
  }, [scene, loader, pmremGenerator]);

  return null;
};
