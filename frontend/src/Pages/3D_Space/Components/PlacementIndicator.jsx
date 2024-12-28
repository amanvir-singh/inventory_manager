export function PlacementIndicator({ position, size, type }) {
  const color =
    type === "wall" ? "gray" : type === "usableArea" ? "green" : "red";
  const SCALE_FACTOR = 1 / 12; // 1 unit = 1 foot

  return (
    <mesh position={position}>
      <boxGeometry
        args={[
          size.width * SCALE_FACTOR,
          size.height * SCALE_FACTOR,
          size.length * SCALE_FACTOR,
        ]}
      />
      <meshStandardMaterial color={color} transparent opacity={0.5} />
    </mesh>
  );
}
