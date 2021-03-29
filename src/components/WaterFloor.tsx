import { useFrame, useThree } from "react-three-fiber";
import { useRef, useState } from "react";
import WaterComp from "./WaterComp";
import { Group } from "three";

type Tile = {
  id: string;
  pos: [number, number, number];
};

const TILE_SIZE = 20;
const DIST = TILE_SIZE;

const DEFAULT_TILES: Tile[] = [
  { id: "a", pos: [0, 0, 0] },
  { id: "b", pos: [0, 0, 0] },
  { id: "c", pos: [0, 0, 0] },
  { id: "d", pos: [0, 0, 0] },
];

const WaterFloor = () => {
  const { camera } = useThree();

  const { current: tiles } = useRef<Tile[]>(DEFAULT_TILES);
  const [, forceRender] = useState(0);
  const water1 = useRef<Group>();
  const water2 = useRef<Group>();
  const water3 = useRef<Group>();
  const water4 = useRef<Group>();

  useFrame(() => {
    if (
      !water1.current ||
      !water2.current ||
      !water3.current ||
      !water4.current
    ) {
      return;
    }

    const tilex = Math.floor(camera.position.x / TILE_SIZE);
    const tilez = Math.floor(camera.position.z / TILE_SIZE);

    const newTiles: Tile[] = []; // tiles that need a new home
    const safeTiles = []; // tiles that don't need to be moved

    for (let x = tilex - 1; x <= tilex + 1; x++) {
      for (let z = tilez - 1; z <= tilez + 1; z++) {
        const xPos = x * TILE_SIZE;
        const zPos = z * TILE_SIZE;
        const inDistX = Math.abs(xPos - camera.position.x) < DIST;
        const inDistZ = Math.abs(zPos - camera.position.z) < DIST;

        if (inDistX && inDistZ) {
          const id = `${x}-${z}`;
          if (tiles.find((tile) => tile.id === id)) {
            safeTiles.push(id);
          } else {
            newTiles.push({ id, pos: [xPos, 0, zPos] });
          }
        }
      }
    }

    let currInd = 0;
    for (let i = 0; i < Math.min(newTiles.length, 4); i++) {
      while (safeTiles.includes(tiles[currInd].id)) {
        currInd++;
      }
      tiles[currInd] = newTiles[i];
    }

    if (currInd > 0) {
      tiles[0] && water1.current.position.fromArray(tiles[0].pos);
      tiles[1] && water2.current.position.fromArray(tiles[1].pos);
      tiles[2] && water3.current.position.fromArray(tiles[2].pos);
      tiles[3] && water4.current.position.fromArray(tiles[3].pos);
    }
  });

  return (
    <group>
      <group ref={water1}>{tiles[0] && <WaterComp />}</group>
      <group ref={water2}>{tiles[1] && <WaterComp />}</group>
      <group ref={water3}>{tiles[2] && <WaterComp />}</group>
      <group ref={water4}>{tiles[3] && <WaterComp />}</group>
    </group>
  );
};

export default WaterFloor;
