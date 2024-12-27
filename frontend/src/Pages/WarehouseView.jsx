import React, {
  useContext,
  useRef,
  Suspense,
  useState,
  useEffect,
  createContext,
} from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Grid,
  TransformControls,
  useTexture,
} from "@react-three/drei";
import { AuthContext } from "../Components/AuthContext";
import axios from "axios";

const SCALE_FACTOR = 1 / 12; // 1 unit = 1 foot
const offsetSpace = 4;

// Create a new context
const WarehouseContext = createContext();

// WarehouseProvider component
export function WarehouseProvider({ children }) {
  const [isPlacementActive, setIsPlacementActive] = useState(false);
  const [placementMode, setPlacementMode] = useState(null);
  const [newItemSize, setNewItemSize] = useState(null);
  const [warehouseItems, setWarehouseItems] = useState([]);
  const [placementPosition, setPlacementPosition] = useState([0, 0, 0]);
  const [isLoading, setIsLoading] = useState(false);

  const value = {
    isPlacementActive,
    setIsPlacementActive,
    placementMode,
    setPlacementMode,
    newItemSize,
    setNewItemSize,
    warehouseItems,
    setWarehouseItems,
    placementPosition,
    setPlacementPosition,
    isLoading,
    setIsLoading
  };

  return (
    <WarehouseContext.Provider value={value}>
      {children}
    </WarehouseContext.Provider>
  );
}

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
      <meshStandardMaterial color="#8B4513" />{" "}
      {/* Dark brown for edge banding */}
    </mesh>
  );
}

function Stock({ material, position, onUpdate }) {
  const group = useRef();
  const { user } = useContext(AuthContext);
  const isEditor = user.role === "Editor" || user.role === "Manager";
  const woodTexture = useTexture("/WoodTexture.png");

  const stockWidth = material.width * SCALE_FACTOR;
  const stockLength = material.length * SCALE_FACTOR;
  const stockHeight = 1 * SCALE_FACTOR; // Assuming 1 inch thickness
  const logWidth = 2 * SCALE_FACTOR;
  const logSpacing = (material.width * SCALE_FACTOR) / 4;
  const stackOffset = 0.1 * SCALE_FACTOR; // Small offset between stacked items

  // Calculate the starting position for the logs to center them
  const startX = -(stockWidth / 2) + logWidth / 2 + logSpacing;

  const quantity = material.quantity[0] || 1; // Default to 1 if quantity is not provided

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

function PlacementIndicator({ position, size, type }) {
  const color =
    type === "wall" ? "gray" : type === "usableArea" ? "green" : "red";

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

function OptionsPanel() {
  const { setIsPlacementActive, setPlacementMode, setNewItemSize } =
    useContext(WarehouseContext);
  const [selectedOption, setSelectedOption] = useState(null);
  const [size, setSize] = useState({ width: 0, length: 0, height: 0 });

  const handleAddItem = () => {
    setPlacementMode(selectedOption);
    setNewItemSize(size);
    setIsPlacementActive(true);
    setSelectedOption(null);
    setSize({ width: 0, length: 0, height: 0 });
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: 10,
        left: 10,
        background: "white",
        padding: 10,
      }}
    >
      <button onClick={() => setSelectedOption("wall")}>Add Wall</button>
      <button onClick={() => setSelectedOption("usableArea")}>
        Add Usable Area
      </button>
      <button onClick={() => setSelectedOption("nonUsableArea")}>
        Add Non-Usable Area
      </button>
      {selectedOption && (
        <div>
          <input
            type="number"
            placeholder="Width"
            value={size.width}
            onChange={(e) =>
              setSize({ ...size, width: parseFloat(e.target.value) })
            }
          />
          <input
            type="number"
            placeholder="Length"
            value={size.length}
            onChange={(e) =>
              setSize({ ...size, length: parseFloat(e.target.value) })
            }
          />
          <input
            type="number"
            placeholder="Height"
            value={size.height}
            onChange={(e) =>
              setSize({ ...size, height: parseFloat(e.target.value) })
            }
          />
          <button onClick={handleAddItem}>Add</button>
        </div>
      )}
    </div>
  );
}

function WarehouseCanvas() {
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
    setIsLoading
  } = useContext(WarehouseContext);

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
  useEffect(() => {
    console.log("isLoading in WarehouseView:", isLoading);
  }, [isLoading]);
  if (isLoading) {
    console.log("Outside")
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
        {console.log("Inside Here: ",warehouseItems)}
        {warehouseItems.map((item, index) => (
          <Stock
            key={index}
            material={item}
            position={item.position.map((coord) => coord * SCALE_FACTOR)}
          />
        ))}

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

export function WarehouseView() {
  const { user } = useContext(AuthContext);
  const { setWarehouseItems, warehouseItems, isLoading, setIsLoading } = useContext(WarehouseContext);
  const isEditor = user.role === "Editor" || user.role === "Manager";

  useEffect(() => {
    const fetchWarehouseLayout = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_ROUTE}/warehouse/layout`);
        setWarehouseItems(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching warehouse layout:", error);
        setIsLoading(false);
      }
    };
    fetchWarehouseLayout();
  }, []);
  useEffect(()=>{console.log("Set Loading", isLoading)},[isLoading])

  return (
    <WarehouseProvider>
    <div style={{ width: "100%", height: "80vh", position: "relative" }}>
    <WarehouseCanvas />

          <OptionsPanel />
    </div>
  </WarehouseProvider>
  );
}
