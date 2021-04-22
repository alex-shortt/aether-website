import InstancedModel from "./components/InstancedModel";
import { Object3D, Vector3 } from "three";

type ImplicitFunc = (x: number, y: number, z: number) => Vector3;

type NatureProps = {
  density: number;
  shape: ImplicitFunc;
};

const PINK_FLOWER_URL =
  "https://d27rt3a60hh1lx.cloudfront.net/models/PinkFlower-1619086549/pink_flower_01.glb.gz";

type Piece = {
  model: string;
  clustering: ImplicitFunc;
  count: number;
  transform: Object3D;
};

export default function Nature(props: NatureProps) {
  const { density, shape } = props;

  const pinkObj = new Object3D();
  pinkObj.scale.multiplyScalar(0.02);
  pinkObj.position.y = 0.2;
  pinkObj.updateMatrix();

  const pieces: Piece[] = [
    {
      model: PINK_FLOWER_URL,
      clustering: shape,
      count: density / 10,
      transform: pinkObj,
    },
  ];

  return (
    <group name="nature">
      {pieces.map((piece) => (
        <InstancedModel
          key={piece.model}
          model={piece.model}
          count={piece.count}
          generation={piece.clustering}
          transform={piece.transform}
        />
      ))}
    </group>
  );
}
