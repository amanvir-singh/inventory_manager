import React, { useContext, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, TransformControls, useTexture } from '@react-three/drei';
import { AuthContext } from '../Components/AuthContext';

const SCALE_FACTOR = 1 / 12; // 1 unit = 1 foot
const offsetSpace = 4;

function WoodenLog({ position }) {
  const size = [2 * SCALE_FACTOR, 2 * SCALE_FACTOR, 61 * SCALE_FACTOR]; // Standard log size

  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#deb887" />
    </mesh>
  );
}

function EdgeDetail({ size, position }) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#8B4513" /> {/* Dark brown for edge banding */}
    </mesh>
  );
}

function Stock({ material, position, onUpdate }) {
  const group = useRef();
  const { user } = useContext(AuthContext);
  const isEditor = user.role === "Editor" || user.role === "Manager";
  const woodTexture = useTexture('/WoodTexture.png');

  const stockWidth = material.width * SCALE_FACTOR;
  const stockLength = material.length * SCALE_FACTOR;
  const stockHeight = 1 * SCALE_FACTOR; // Assuming 1 inch thickness
  const logWidth = 2 * SCALE_FACTOR;
  const logSpacing = material.width * SCALE_FACTOR / 4;
  const stackOffset = 0.1 * SCALE_FACTOR; // Small offset between stacked items

  // Calculate the starting position for the logs to center them
  const startX = -(stockWidth / 2) + (logWidth / 2) + logSpacing;

  const quantity = material.quantity[0] || 1; // Default to 1 if quantity is not provided

  return (
    <group ref={group} position={position}>
      {/* Wooden logs (only under the first stock item) */}
      <WoodenLog position={[startX, -2 * SCALE_FACTOR, 0]} />
      <WoodenLog position={[startX + logSpacing, -2 * SCALE_FACTOR, 0]} />
      <WoodenLog position={[startX + 2 * logSpacing, -2 * SCALE_FACTOR, 0]} />

      {/* Stack of stock items */}
      {[...Array(quantity)].map((_, index) => (
        <group key={index} position={[0, index * (stockHeight + stackOffset), 0]}>
          {/* Main sheet */}
          <mesh userData={{ id: `${material._id}-${index}` }}>
            <boxGeometry args={[stockWidth, stockHeight, stockLength]} />
            <meshStandardMaterial map={woodTexture} />
          </mesh>
          
          {/* Edge details */}
          <EdgeDetail size={[stockWidth, stockHeight, 0.005 * SCALE_FACTOR]} position={[0, 0, stockLength/2]} />
          <EdgeDetail size={[stockWidth, stockHeight, 0.005 * SCALE_FACTOR]} position={[0, 0, -stockLength/2]} />
          <EdgeDetail size={[0.005 * SCALE_FACTOR, stockHeight, stockLength]} position={[stockWidth/2, 0, 0]} />
          <EdgeDetail size={[0.005 * SCALE_FACTOR, stockHeight, stockLength]} position={[-stockWidth/2, 0, 0]} />
        </group>
      ))}

      {isEditor && (
        <TransformControls 
          object={group.current} 
          mode="translate"
          onObjectChange={(e) => {
            if (onUpdate) {
              onUpdate({
                position: group.current.position.toArray(),
                materialId: material._id
              });
            }
          }}
        />
      )}
    </group>
  );
}

export function WarehouseView() {
  const { user } = useContext(AuthContext);
  const isEditor = user.role === "Editor" || user.role === "Manager";

  // Example data for materials
  const exampleMaterials = [
    { _id: 'm1', width: 109, length: 61, location: [[0, 2 * SCALE_FACTOR, 61+offsetSpace ]], quantity: [18] },
    { _id: 'm2', width: 97, length: 61, location: [[0, 2 * SCALE_FACTOR, 0]], quantity: [5] },
    { _id: 'm3', width: 97, length: 49, location: [[0, 2 * SCALE_FACTOR, 61 * 2 + offsetSpace * 2]], quantity: [3] },
    { _id: 'm3', width: 109, length: 61, location: [[109 + offsetSpace, 2 * SCALE_FACTOR, 61 * 2 + offsetSpace * 2]], quantity: [10] },
    { _id: 'm3', width: 109, length: 61, location: [[109+offsetSpace, 2 * SCALE_FACTOR, 61+offsetSpace]], quantity: [10] }
  ];

  const onUpdatePosition = (updatedItem) => {
    console.log('Item updated:', updatedItem);
    // In a real scenario, you would update your state or send this to a server
  };

  return (
    <div style={{ width: '100%', height: '80vh' }}>
      <Canvas camera={{ position: [5, 5, 5] }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          
          <Grid infiniteGrid cellSize={1} sectionSize={3} position={[0, -0.01, 0]}/>

          {exampleMaterials.map((material) => (
            <Stock 
              key={material._id}
              material={material}
              position={material.location[0].map(coord => coord * SCALE_FACTOR)}
              onUpdate={isEditor ? onUpdatePosition : null}
            />
          ))}

          <OrbitControls 
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            maxDistance={20}
            minDistance={2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
