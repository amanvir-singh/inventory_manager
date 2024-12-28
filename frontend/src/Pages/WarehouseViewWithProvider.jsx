import { WarehouseView } from "./3D_Space/Components/WarehouseView";
import { WarehouseProvider } from "./3D_Space/WarehouseProvider";

export function WarehouseViewWithProvider() {
  return (
    <WarehouseProvider>
      <WarehouseView />
    </WarehouseProvider>
  );
}
