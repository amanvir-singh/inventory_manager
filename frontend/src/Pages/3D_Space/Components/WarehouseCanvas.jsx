import React, {
  useContext,
  useRef,
  Suspense,
  useEffect,
  useCallback,
} from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import { WarehouseContext } from "../WarehouseProvider";
import { Wall } from "./Wall";
import { UsableArea } from "./UsableArea";
import { NonUsableArea } from "./NonUsableArea";
import { Stock } from "./Stock";
import { PlacementIndicator } from "./PlacementIndicator";
import * as THREE from "three";
import { deleteItem } from "./WarehouseView";

const SCALE_FACTOR = 1 / 12;
const GRID_SIZE = 1 * SCALE_FACTOR;

function WarehouseContent() {
  const { camera } = useThree();
  const {
    isPlacementActive,
    placementMode,
    newItemSize,
    warehouseItems,
    setWarehouseItems,
    placementPosition,
    setPlacementPosition,
    setShowConfirmation,
    cameraLocked,
    setCameraLocked,
    currentPosition,
    setCurrentPosition,
    deleteMode,
    setDeleteMode,
  } = useContext(WarehouseContext);

  const meshRef = useRef();

  const handleCameraPosition = useCallback(() => {
    if (cameraLocked && camera) {
      camera.position.set(currentPosition[0], 50, currentPosition[2] + 20);
      camera.lookAt(currentPosition[0], 0, currentPosition[2]);
    }
  }, [cameraLocked, camera, currentPosition]);

  const handleItemClick = useCallback(
    (item, setWarehouseItems, setDeleteMode) => {
      console.log("This is Delete");
      if (deleteMode) {
        // Call a function to delete the item
        deleteItem(item, setWarehouseItems, setDeleteMode);
      }
    },
    [deleteMode]
  );

  useEffect(() => {
    if (isPlacementActive) {
      setCameraLocked(true);
    } else {
      setCameraLocked(false);
    }
  }, [isPlacementActive]);

  useEffect(() => {
    handleCameraPosition();
  }, [cameraLocked, handleCameraPosition]);

  useFrame(() => {
    if (cameraLocked && camera) {
      camera.position.lerp(
        new THREE.Vector3(currentPosition[0], 50, currentPosition[2] + 20),
        0.1
      );
      camera.lookAt(currentPosition[0], 0, currentPosition[2]);
    }
  });

  const handleMove = (axis, amount) => {
    setCurrentPosition((prevPosition) => {
      const newPosition = [...prevPosition];
      newPosition[axis] =
        Math.round((prevPosition[axis] + amount) / GRID_SIZE) * GRID_SIZE;

      if (meshRef.current) {
        meshRef.current.position[axis === 0 ? "x" : "z"] = newPosition[axis];
      }

      if (camera) {
        const cameraOffset = new THREE.Vector3(0, 0, 0);
        const newCameraPosition = new THREE.Vector3(
          newPosition[0],
          0,
          newPosition[2]
        ).add(cameraOffset);
        camera.position.copy(newCameraPosition);
        camera.lookAt(newPosition[0], 0, newPosition[2]);
      }

      return newPosition;
    });

    setPlacementPosition((prevPosition) => {
      const newPosition = [...prevPosition];
      newPosition[axis] =
        Math.round((prevPosition[axis] + amount) / GRID_SIZE) * GRID_SIZE;
      newPosition[1] = (newItemSize?.height * SCALE_FACTOR) / 2 || 0;
      return newPosition;
    });
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isPlacementActive) {
        switch (event.key) {
          case "ArrowLeft":
            handleMove(0, -GRID_SIZE);
            break;
          case "ArrowRight":
            handleMove(0, GRID_SIZE);
            break;
          case "ArrowUp":
            handleMove(2, -GRID_SIZE);
            break;
          case "ArrowDown":
            handleMove(2, GRID_SIZE);
            break;
          case "Enter":
            setShowConfirmation(true);
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlacementActive]);

  useEffect(() => {
    console.log(deleteMode);
  }, [deleteMode]);

  return (
    <>
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
            return (
              <Wall
                key={index}
                item={item}
                onClick={() =>
                  handleItemClick(item, setWarehouseItems, setDeleteMode)
                }
              />
            );
          case "usableArea":
            return (
              <UsableArea
                key={index}
                item={item}
                onClick={() =>
                  handleItemClick(item, setWarehouseItems, setDeleteMode)
                }
              />
            );
          case "nonUsableArea":
            return (
              <NonUsableArea
                key={index}
                item={item}
                onClick={() =>
                  handleItemClick(item, setWarehouseItems, setDeleteMode)
                }
              />
            );
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
      {isPlacementActive &&
        placementMode &&
        newItemSize &&
        placementPosition && (
          <PlacementIndicator
            position={placementPosition}
            size={newItemSize}
            type={placementMode}
          />
        )}
      <OrbitControls
        enableZoom={!cameraLocked}
        enablePan={!cameraLocked}
        enableRotate={!cameraLocked}
        maxDistance={cameraLocked ? 60 : 100}
        minDistance={cameraLocked ? 40 : 2}
      />
      {isPlacementActive && (
        <mesh
          position={[0, 0, 0]}
          //onClick={() => setShowConfirmation(true)}
          ref={meshRef}
        >
          <planeGeometry args={[1000, 1000]} />
          <meshBasicMaterial visible={false} />
        </mesh>
      )}
    </>
  );
}

export function WarehouseCanvas() {
  const { isLoading, cameraPosition } = useContext(WarehouseContext);
  useEffect(() => {
    console.log("Position Changed: ", cameraPosition);
  }, [cameraPosition]);

  if (isLoading) return null;

  return (
    <Canvas
      key={cameraPosition.join(",")}
      camera={{ position: cameraPosition }}
    >
      <Suspense fallback={null}>
        <WarehouseContent />
      </Suspense>
    </Canvas>
  );
}
