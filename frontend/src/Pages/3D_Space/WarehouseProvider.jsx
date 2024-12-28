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
    };
  
    return (
      <WarehouseContext.Provider value={value}>
        {children}
      </WarehouseContext.Provider>
    );
  }