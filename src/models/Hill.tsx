/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from "three";
import React, { useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";

import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACO_URL, useTrimeshCollision } from "spacesvr";
import { BufferGeometry, MeshStandardMaterial } from "three";
import { useLoader } from "react-three-fiber";

type GLTFResult = GLTF & {
  nodes: {
    Plane: THREE.Mesh;
  };
  materials: {
    dirt: THREE.MeshStandardMaterial;
  };
};

const FILE_URL =
  "https://d27rt3a60hh1lx.cloudfront.net/models/Hill-1609230601/hill.glb";

export default function Model(props: JSX.IntrinsicElements["group"]) {
  const group = useRef<THREE.Group>();
  const { nodes, materials } = useGLTF(FILE_URL, DRACO_URL) as GLTFResult;

  useTrimeshCollision(
    (nodes.Plane.geometry as BufferGeometry).clone().translate(0, -0.3, 0)
  );

  const grassTileTex = useLoader(
    THREE.TextureLoader,
    "https://d27rt3a60hh1lx.cloudfront.net/content/alto/grasstile.jpg"
  );

  grassTileTex.repeat.x = 8;
  grassTileTex.repeat.y = 8;
  grassTileTex.wrapS = grassTileTex.wrapT = THREE.RepeatWrapping;

  const mat = useMemo(() => new MeshStandardMaterial({ map: grassTileTex }), [
    grassTileTex,
  ]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene" position-y={-0.3}>
        <mesh name="Plane" material={mat} geometry={nodes.Plane.geometry} />
      </group>
    </group>
  );
}

useGLTF.preload(FILE_URL, DRACO_URL);