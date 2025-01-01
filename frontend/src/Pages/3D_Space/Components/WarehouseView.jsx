import React, { useContext, useEffect } from "react";

import { AuthContext } from "../../../Components/AuthContext";
import axios from "axios";
import { WarehouseContext } from "../WarehouseProvider";
import { WarehouseCanvas } from "./WarehouseCanvas";
import { OptionsPanel } from "./OptionsPanel";
import { ViewCube } from "./ViewCube";

const offsetSpace = 4;

export function WarehouseView() {
  const { user } = useContext(AuthContext);
  const { setWarehouseItems, isLoading, setIsLoading } =
    useContext(WarehouseContext);
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
        <ViewCube/>
      </div>
    );
  }
}
