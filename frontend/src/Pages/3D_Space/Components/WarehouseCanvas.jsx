import { Grid, OrbitControls } from "@react-three/drei";
import { WarehouseContext } from "../WarehouseProvider";
import { Suspense, useContext } from "react";
import axios from "axios";
import { Canvas } from "@react-three/fiber";
import { PlacementIndicator } from "./PlacementIndicator";
import { Stock } from "./Stock";
import { Wall } from "./Wall";
import { UsableArea } from "./UsableArea";
import { NonUsableArea } from "./NonUsableArea";

export function WarehouseCanvas() {
  const {
    isPlacementActive,
    placementMode,
    newItemSize,
    warehouseItems,
    setWarehouseItems,
    placementPosition,
    setPlacementPosition,
    setIsPlacementActive,
    setPlacementMode,
    setNewItemSize,
    isLoading,
  } = useContext(WarehouseContext);
  const SCALE_FACTOR = 1 / 12; // 1 unit = 1 foot

  const handleMouseMove = (event) => {
    if (isPlacementActive && placementMode && newItemSize) {
      const intersections = event.intersections;
      if (intersections && intersections.length > 0) {
        const point = intersections[0].point;
        setPlacementPosition([
          Math.round(point.x / SCALE_FACTOR) * SCALE_FACTOR,
          (newItemSize.height * SCALE_FACTOR) / 2,
          Math.round(point.z / SCALE_FACTOR) * SCALE_FACTOR,
        ]);
      }
    }
  };

  const handlePlacement = async (event) => {
    if (isPlacementActive && placementMode && newItemSize) {
      const intersections = event.intersections;
      if (intersections && intersections.length > 0) {
        const point = intersections[0].point;
        const newItem = {
          type: placementMode,
          size: newItemSize,
          position: [point.x, point.y, point.z],
        };

        try {
          // Save the new item to the backend
          const response = await axios.post(
            `${process.env.REACT_APP_ROUTE}/warehouse/layout`,
            newItem
          );

          // Update local state with the saved item
          setWarehouseItems([...warehouseItems, response.data]);

          // Reset placement mode
          setIsPlacementActive(false);
          setPlacementMode(null);
          setNewItemSize(null);
        } catch (error) {
          console.error("Error saving warehouse item:", error);
        }
      }
    }
  };
  if (isLoading) {
    return null;
  }

  return (
    <Canvas
      camera={{ position: [30, 15, 5] }}
      onPointerMove={handleMouseMove}
      onClick={handlePlacement}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Grid
          infiniteGrid
          cellSize={1}
          sectionSize={3}
          position={[0, -0.01, 0]}
        />
        {warehouseItems.map((item, index) => {
          switch (item.type) {
            case "wall":
              return <Wall key={index} item={item} />;
            case "usableArea":
              return <UsableArea key={index} item={item} />;
            case "nonUsableArea":
              return <NonUsableArea key={index} item={item} />;
            default:
              return (
                <Stock
                  key={index}
                  material={item}
                  position={item.position.map((coord) => coord * SCALE_FACTOR)}
                />
              );
          }
        })}
        {isPlacementActive && placementMode && newItemSize && (
          <PlacementIndicator
            position={placementPosition}
            size={newItemSize}
            type={placementMode}
          />
        )}
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          maxDistance={100}
          minDistance={2}
        />
      </Suspense>
    </Canvas>
  );
}
