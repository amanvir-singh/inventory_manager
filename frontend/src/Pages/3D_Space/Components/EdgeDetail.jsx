export function EdgeDetail({ size, position }) {
    return (
      <mesh position={position}>
        <boxGeometry args={size} />
        <meshStandardMaterial color="#8B4513" />{" "}
        {/* Dark brown for edge banding */}
      </mesh>
    );
  }
  