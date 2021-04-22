export default function Sun() {
  return (
    <group>
      <mesh position={[20, 0, -20]}>
        <sphereBufferGeometry args={[10, 25, 20]} />
        <meshBasicMaterial color="white" />
      </mesh>
    </group>
  );
}
