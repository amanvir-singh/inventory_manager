import { useContext, useState } from "react";
import { WarehouseContext } from "../WarehouseProvider";

export function OptionsPanel() {
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
