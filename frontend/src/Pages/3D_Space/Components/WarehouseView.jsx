import React, { useContext, useEffect } from "react";

import { AuthContext } from "../../../Components/AuthContext";
import axios from "axios";
import { WarehouseContext } from "../WarehouseProvider";
import { WarehouseCanvas } from "./WarehouseCanvas";
import { OptionsPanel } from "./OptionsPanel";
import { ViewCube } from "./ViewCube";
import "../../../css/3D_Space/WarehouseView.scss";

const offsetSpace = 4;

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

export function WarehouseView() {
  const { user } = useContext(AuthContext);
  const {
    setWarehouseItems,
    isLoading,
    setIsLoading,
    setIsPlacementActive,
    setPlacementMode,
    setNewItemSize,
    setCurrentPosition,
    setCameraLocked,
    setShowConfirmation,
    isPlacementActive,
    newItemSize,
    setPlacementPosition,
    showConfirmation,
    placementMode,
    placementPosition,
  } = useContext(WarehouseContext);
  const isEditor = user.role === "Editor" || user.role === "Manager";
  const fetchWarehouseLayout = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_ROUTE}/warehouse/layout`
      );
      setWarehouseItems(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching warehouse layout:", error);
      setIsLoading(false);
    }
  };

  const handleRotate = (event) => {
    if (event && event.type === "click") {
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
          prevPosition[2],
        ]);
      }
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
      size: { ...newItemSize }, // Use the spread operator to create a new object
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

  useEffect(() => {
    fetchWarehouseLayout();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  } else {
    return (
      <div style={{ width: "100%", height: "80vh", position: "relative" }}>
        <WarehouseCanvas />
        <OptionsPanel />
        <ViewCube />
        {showConfirmation && (
          <ConfirmationPopup
            onConfirm={handleSave}
            onCancel={handleConfirmCancel}
          />
        )}
        {isPlacementActive && (
          <div className="button-container-rotate-cancel">
            <button className="rotate-button" onClick={handleRotate}>
              Rotate
            </button>
            <button className="cancel-button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        )}
      </div>
    );
  }
}
