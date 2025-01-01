import React, { useContext } from 'react';
import { WarehouseContext } from '../WarehouseProvider';
import '../../../css/3D_Space/ViewCube.scss';

export function ViewCube() {
  const { setCameraPosition } = useContext(WarehouseContext);

  const handleViewChange = (view) => {
    switch (view) {
      case "Front":
        setCameraPosition([0, 0, 100]);
        break;
      case "Back":
        setCameraPosition([0, 0, -100]);
        break;
      case "Left":
        setCameraPosition([-30, 0, 0]);
        break;
      case "Right":
        setCameraPosition([30, 0, 0]);
        break;
      case "Top":
        setCameraPosition([0, 30, 0]);
        break;
      case "SW":
        setCameraPosition([-20, 20, 20]);
        break;
      case "SE":
        setCameraPosition([20, 20, 20]);
        break;
      default:
        break;
    }
  };

  return (
    <div className="view-cube">
      <button onClick={() => handleViewChange("Front")}>Front</button>
      <button onClick={() => handleViewChange("Back")}>Back</button>
      <button onClick={() => handleViewChange("Left")}>Left</button>
      <button onClick={() => handleViewChange("Right")}>Right</button>
      <button onClick={() => handleViewChange("Top")}>Top</button>
      <button onClick={() => handleViewChange("SW")}>SW</button>
      <button onClick={() => handleViewChange("SE")}>SE</button>
    </div>
  );
}
