import React, { useContext, useState } from "react";
import { WarehouseContext } from "../WarehouseProvider";
import "../../../css/3D_Space/OptionsPanel.scss";

export function OptionsPanel() {
  const { setIsPlacementActive, setPlacementMode, setNewItemSize } =
    useContext(WarehouseContext);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [size, setSize] = useState({ width: 0, length: 0, height: 0 });

  const handleAddItem = () => {
    setPlacementMode(selectedOption);
    setNewItemSize(size);
    setIsPlacementActive(true);
    resetAndClose();
  };

  const resetAndClose = () => {
    setSelectedOption(null);
    setSize({ width: 0, length: 0, height: 0 });
    setIsExpanded(false);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (selectedOption) {
      setSelectedOption(null);
    }
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className={`options-panel ${isExpanded ? "expanded" : ""}`}>
      <button className="expand-button" onClick={toggleExpand}>
        {isExpanded? "x" : "+"}
      </button>
      {isExpanded && (
        <div className="options-menu">
          <button onClick={() => handleOptionClick("wall")}>Wall</button>
          <button onClick={() => handleOptionClick("usableArea")}>
            Usable Area
          </button>
          <button onClick={() => handleOptionClick("nonUsableArea")}>
            Non-Usable Area
          </button>
        </div>
      )}
      {selectedOption && (
        <div className="size-input">
          <h3>
            {selectedOption === "wall"
              ? "Add Wall"
              : selectedOption === "usableArea"
              ? "Add Usable Area"
              : "Add Non-Usable Area"}
          </h3>
          <label>
            Width:
            <input
              type="number"
              value={size.width}
              onChange={(e) =>
                setSize({ ...size, width: parseFloat(e.target.value) })
              }
            />
          </label>
          <label>
            Length:
            <input
              type="number"
              value={size.length}
              onChange={(e) =>
                setSize({ ...size, length: parseFloat(e.target.value) })
              }
            />
          </label>
          <label>
            Height:
            <input
              type="number"
              value={size.height}
              onChange={(e) =>
                setSize({ ...size, height: parseFloat(e.target.value) })
              }
            />
          </label>
          <div className="button-group">
            <button onClick={resetAndClose}>Cancel</button>
            <button onClick={handleAddItem}>Add</button>
          </div>
        </div>
      )}
    </div>
  );
}
