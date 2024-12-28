export function WoodenLog({ position }) {
    const SCALE_FACTOR = 1 / 12; // 1 unit = 1 foot
    const size = [2 * SCALE_FACTOR, 2 * SCALE_FACTOR, 61 * SCALE_FACTOR]; // Standard log size
  
    return (
      <mesh position={position}>
        <boxGeometry args={size} />
        <meshStandardMaterial color="#deb887" />
      </mesh>
    );
  }