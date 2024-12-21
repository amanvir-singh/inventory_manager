import React, { useContext, useRef } from 'react';
import { Canvas} from '@react-three/fiber';
import { OrbitControls, Grid, TransformControls, useTexture } from '@react-three/drei';

import { AuthContext } from '../Components/AuthContext';

function WoodenLog({ position }) {
  const size = [2/20, 2/20, 61/20]; // Standard log size

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

  const stockWidth = material.width / 20;
  const stockLength = material.length / 20;
  const stockHeight = 1/20;
  const logWidth = 2/20;
  const logSpacing = material.width/80;
  const stackOffset = 0.01; // Small offset between stacked items

  // Calculate the starting position for the logs to center them
  const startX = -(stockWidth / 2) + (logWidth / 2) + logSpacing;

  const quantity = material.quantity[0] || 1; // Default to 1 if quantity is not provided



  return (
    <group ref={group} position={position}>
      {/* Wooden logs (only under the first stock item) */}
      <WoodenLog position={[startX, -2/20, 0]} />
      <WoodenLog position={[startX + logSpacing, -2/20, 0]} />
      <WoodenLog position={[startX + 2 * logSpacing, -2/20, 0]} />

      {/* Stack of stock items */}
      {[...Array(quantity)].map((_, index) => (
        <group key={index} position={[0, index * (stockHeight + stackOffset), 0]}>
          {/* Main sheet */}
          <mesh userData={{ id: `${material._id}-${index}` }}>
            <boxGeometry args={[stockWidth, stockHeight, stockLength]} />
            <meshStandardMaterial map={woodTexture} />
          </mesh>
          
          {/* Edge details */}
          <EdgeDetail size={[stockWidth, stockHeight, 0.005]} position={[0, 0, stockLength/2]} />
          <EdgeDetail size={[stockWidth, stockHeight, 0.005]} position={[0, 0, -stockLength/2]} />
          <EdgeDetail size={[0.005, stockHeight, stockLength]} position={[stockWidth/2, 0, 0]} />
          <EdgeDetail size={[0.005, stockHeight, stockLength]} position={[-stockWidth/2, 0, 0]} />
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
    { _id: 'm1', width: 109, length: 61, location: [[1, 1, 2/20]], quantity: [18] },
    { _id: 'm2', width: 97, length: 61, location: [[10, 1, 2/20]], quantity: [5] },
    { _id: 'm3', width: 97, length: 49, location: [[20, 1, 2/20]], quantity: [3] },
  ];

  const onUpdatePosition = (updatedItem) => {
    console.log('Item updated:', updatedItem);
    // In a real scenario, you would update your state or send this to a server
  };

  return (
    <div style={{ width: '100%', height: '80vh' }}>
      <Canvas camera={{ position: [10, 10, 10] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        <Grid infiniteGrid />

        {exampleMaterials.map((material) => (
          <Stock 
            key={material._id}
            material={material}
            position={material.location[0]}
            onUpdate={isEditor ? onUpdatePosition : null}
          />
        ))}

        <OrbitControls 
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          maxDistance={50}
          minDistance={2}
        />
      </Canvas>
    </div>
  );
}
