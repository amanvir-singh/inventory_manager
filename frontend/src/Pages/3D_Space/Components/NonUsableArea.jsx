export function NonUsableArea({ item }) {
  const SCALE_FACTOR = 1 / 12; // 1 unit = 1 foot
  return (
    <mesh position={item.position.map((coord) => coord * SCALE_FACTOR)}>
      <boxGeometry
        args={[
          item.size.width * SCALE_FACTOR,
          item.size.height * SCALE_FACTOR,
          item.size.length * SCALE_FACTOR,
        ]}
      />
      <meshStandardMaterial color="red" transparent opacity={0.5} />
    </mesh>
  );
}
