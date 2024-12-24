import React from "react";
import { WarehouseProvider, WarehouseView } from "./WarehouseView";

export function WarehouseViewWithProvider() {
  return (
    <WarehouseProvider>
      <WarehouseView />
    </WarehouseProvider>
  );
}
