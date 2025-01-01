import React, {
  useContext,
  useRef,
  Suspense,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid, Html } from "@react-three/drei";
import { WarehouseContext } from "../WarehouseProvider";
import { Wall } from "./Wall";
import { UsableArea } from "./UsableArea";
import { NonUsableArea } from "./NonUsableArea";
import { Stock } from "./Stock";
import { PlacementIndicator } from "./PlacementIndicator";
import axios from "axios";
import * as THREE from "three";
import "../../../css/3D_Space/WarehouseCanvas.scss";

const SCALE_FACTOR = 1 / 12;
const GRID_SIZE = 1 * SCALE_FACTOR;

function ConfirmationPopup({ onConfirm, onCancel }) {

  
  return (
    <div className="confirmation-popup">
      <p>Are you sure you want to save this position?</p>
      <div className="button-container">
        <button onClick={onConfirm}>Yes</button>
        <button onClick={onCancel}>No</button>
      </div>
    </div>
  );
}

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
    setIsPlacementActive,
    setPlacementMode,
    setNewItemSize,
  } = useContext(WarehouseContext);

  const [currentPosition, setCurrentPosition] = useState([0, 0, 0]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [cameraLocked, setCameraLocked] = useState(false);
  const meshRef = useRef();

  const handleRotate = (event) => {

    if (event && event.type === 'click') {
      event.stopPropagation();
      if (newItemSize) {
        setNewItemSize((prevSize) => ({
          ...prevSize,
          width: prevSize.length,
          length: prevSize.width,
        }));
        setPlacementPosition((prevPosition) => [
          prevPosition[0],
          prevPosition[1],
          prevPosition[2]
        ]);
      }
    }
  };
 

  const handleCameraPosition = useCallback(() => {
    if (cameraLocked && camera) {
      camera.position.set(currentPosition[0], 50, currentPosition[2] + 20);
      camera.lookAt(currentPosition[0], 0, currentPosition[2]);
    }
  }, [cameraLocked, camera, currentPosition]);

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

  const handleSave = async () => {
    if (
      !isPlacementActive ||
      !placementMode ||
      !newItemSize ||
      !placementPosition
    )
      return;

      const newItem = {
        type: placementMode,
        size: {...newItemSize}, // Use the spread operator to create a new object
        position: placementPosition,
      };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_ROUTE}/warehouse/layout`,
        newItem
      );
      setWarehouseItems((prevItems) => [...prevItems, response.data]);
      setIsPlacementActive(false);
      setPlacementMode(null);
      setNewItemSize(null);
      setCurrentPosition([0, 0, 0]);
      setShowConfirmation(false);
      setCameraLocked(false);
    } catch (error) {
      console.error("Error saving warehouse item:", error);
    }
  };

  const handleCancel = () => {
    setIsPlacementActive(false);
    setPlacementMode(null);
    setNewItemSize(null);
    setCurrentPosition([0, 0, 0]);
    setCameraLocked(false);
    setShowConfirmation(false);
  };

  const handleConfirmCancel = () => {
    setShowConfirmation(false);
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
      {showConfirmation && (
        <Html center>
          <ConfirmationPopup
            onConfirm={handleSave}
            onCancel={handleConfirmCancel}
          />
        </Html>
      )}
      {isPlacementActive && (
        <Html center>
          <div className="button-container">
            <button className="rotate-button" onClick={handleRotate}>
              Rotate
            </button>
            <button className="cancel-button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </Html>
      )}
    </>
  );
}

export function WarehouseCanvas() {
  const { isLoading } = useContext(WarehouseContext);

  if (isLoading) return null;

  return (
    <Canvas camera={{ position: [30, 15, 5] }}>
      <Suspense fallback={null}>
        <WarehouseContent />
      </Suspense>
    </Canvas>
  );
}
