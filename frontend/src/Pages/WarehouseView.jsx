import React, { useContext, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, TransformControls } from '@react-three/drei';
import { AuthContext } from '../Components/AuthContext';

function Shelf({ position, size, onUpdate }) {
  const mesh = useRef();
  const { user } = useContext(AuthContext);
  const isEditor = user.role === "Editor" || user.role === "Manager";

  return (
    <mesh ref={mesh} position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#8b4513" />
      {isEditor && (
        <TransformControls 
          object={mesh.current} 
          mode="translate"
          onObjectChange={(e) => {
            if (onUpdate) {
              onUpdate({
                position: mesh.current.position.toArray(),
                id: mesh.current.userData.id
              });
            }
          }}
        />
      )}
    </mesh>
  );
}

function Stock({ material, position, onUpdate }) {
  const mesh = useRef();
  const { user } = useContext(AuthContext);
  const isEditor = user.role === "Editor" || user.role === "Manager";

  return (
    <mesh 
      ref={mesh} 
      position={position}
      userData={{ id: material._id }}
    >
      <boxGeometry args={[
        material.width / 100, 
        material.length / 100, 
        0.2
      ]} />
      <meshStandardMaterial color="#a0522d" />
      {isEditor && (
        <TransformControls 
          object={mesh.current} 
          mode="translate"
          onObjectChange={(e) => {
            if (onUpdate) {
              onUpdate({
                position: mesh.current.position.toArray(),
                materialId: material._id
              });
            }
          }}
        />
      )}
    </mesh>
  );
}

export function WarehouseView() {
  const { user } = useContext(AuthContext);
  const isEditor = user.role === "Editor" || user.role === "Manager";

  // Example data for shelves
  const exampleShelves = [
    { id: 1, position: [0, 0, 0], size: [109/20, 19/20, 61/20] },
    { id: 2, position: [3, 0, 0], size: [2, 1, 1] },
    { id: 3, position: [0, 0, 3], size: [2, 1, 1] },
  ];

  // Example data for materials
  const exampleMaterials = [
    { _id: 'm1', width: 50, length: 50, location: [[1, 1, 0]] },
    { _id: 'm2', width: 75, length: 75, location: [[3.5, 1, 0],[5,10,10]] },
    { _id: 'm3', width: 60, length: 60, location: [[0.5, 1, 3]] },
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

        {exampleShelves.map((shelf) => (
          <Shelf 
            key={shelf.id}
            position={shelf.position}
            size={shelf.size}
            onUpdate={isEditor ? onUpdatePosition : null}
          />
        ))}

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
