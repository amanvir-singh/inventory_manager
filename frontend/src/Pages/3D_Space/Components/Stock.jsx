import { useContext, useRef } from "react";
import { AuthContext } from "../../../Components/AuthContext";
import { TransformControls, useTexture } from "@react-three/drei";
import { WoodenLog } from "./WoodenLog";
import { EdgeDetail } from "./EdgeDetail";

export function Stock({ material, position, onUpdate }) {
    const group = useRef();
    const { user } = useContext(AuthContext);
    const isEditor = user.role === "Editor" || user.role === "Manager";
    const woodTexture = useTexture("/WoodTexture.png");
    const SCALE_FACTOR = 1 / 12; // 1 unit = 1 foot
  
    const stockWidth = material.width * SCALE_FACTOR;
    const stockLength = material.length * SCALE_FACTOR;
    const stockHeight = 1 * SCALE_FACTOR; // Assuming 1 inch thickness
    const logWidth = 2 * SCALE_FACTOR;
    const logSpacing = (material.width * SCALE_FACTOR) / 4;
    const stackOffset = 0.1 * SCALE_FACTOR; // Small offset between stacked items
  
    // Calculate the starting position for the logs to center them
    const startX = -(stockWidth / 2) + logWidth / 2 + logSpacing;
  
    const quantity = material.quantity[0] || 1; // Default to 1 if quantity is not provided
    if (isNaN(stockWidth) || isNaN(stockLength) || isNaN(stockHeight) ||
    stockWidth === 0 || stockLength === 0 || stockHeight === 0) {
  console.error('Invalid stock dimensions:', material);
  return null; // Don't render if dimensions are invalid
  }
    return (
      <group ref={group} position={position}>
        {/* Wooden logs (only under the first stock item) */}
        <WoodenLog position={[startX, -2 * SCALE_FACTOR, 0]} />
        <WoodenLog position={[startX + logSpacing, -2 * SCALE_FACTOR, 0]} />
        <WoodenLog position={[startX + 2 * logSpacing, -2 * SCALE_FACTOR, 0]} />
  
        {/* Stack of stock items */}
        {[...Array(quantity)].map((_, index) => (
          <group
            key={index}
            position={[0, index * (stockHeight + stackOffset), 0]}
          >
            {/* Main sheet */}
            <mesh userData={{ id: `${material._id}-${index}` }}>
              <boxGeometry args={[stockWidth, stockHeight, stockLength]} />
              <meshStandardMaterial map={woodTexture} />
            </mesh>
  
            {/* Edge details */}
            <EdgeDetail
              size={[stockWidth, stockHeight, 0.005 * SCALE_FACTOR]}
              position={[0, 0, stockLength / 2]}
            />
            <EdgeDetail
              size={[stockWidth, stockHeight, 0.005 * SCALE_FACTOR]}
              position={[0, 0, -stockLength / 2]}
            />
            <EdgeDetail
              size={[0.005 * SCALE_FACTOR, stockHeight, stockLength]}
              position={[stockWidth / 2, 0, 0]}
            />
            <EdgeDetail
              size={[0.005 * SCALE_FACTOR, stockHeight, stockLength]}
              position={[-stockWidth / 2, 0, 0]}
            />
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
                  materialId: material._id,
                });
              }
            }}
          />
        )}
      </group>
    );
  }
  