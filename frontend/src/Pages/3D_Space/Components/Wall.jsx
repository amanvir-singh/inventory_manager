export function Wall({ item }) {
  const SCALE_FACTOR = 1 / 12; // 1 unit = 1 foot
  return (
    <mesh position={item.position.map((coord) => coord)}>
      <boxGeometry
        args={[
          item.size.width * SCALE_FACTOR,
          item.size.height * SCALE_FACTOR,
          item.size.length * SCALE_FACTOR,
        ]}
      />
      <meshStandardMaterial color="gray" />
    </mesh>
  );
}
