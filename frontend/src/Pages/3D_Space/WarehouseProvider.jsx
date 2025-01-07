import axios from "axios";
import { createContext, useState } from "react";

// Create a new context
export const WarehouseContext = createContext();

// WarehouseProvider component
export function WarehouseProvider({ children }) {
  const [isPlacementActive, setIsPlacementActive] = useState(false);
  const [placementMode, setPlacementMode] = useState(null);
  const [newItemSize, setNewItemSize] = useState(null);
  const [warehouseItems, setWarehouseItems] = useState([]);
  const [placementPosition, setPlacementPosition] = useState([0, 0, 0]);
  const [isLoading, setIsLoading] = useState(true);
  const [cameraPosition, setCameraPosition] = useState([30, 15, 5]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [cameraLocked, setCameraLocked] = useState(false);
  const [currentPosition, setCurrentPosition] = useState([0, 0, 0]);
  const [deleteMode, setDeleteMode] = useState(false);

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
    setIsLoading,
    cameraPosition,
    setCameraPosition,
    showConfirmation,
    setShowConfirmation,
    cameraLocked,
    setCameraLocked,
    currentPosition,
    setCurrentPosition,
    deleteMode,
    setDeleteMode,
  };

  return (
    <WarehouseContext.Provider value={value}>
      {children}
    </WarehouseContext.Provider>
  );
}
