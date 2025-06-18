import React, { createContext, useContext } from "react";
import { RadarContextType } from "../types";

export const RadarContext = createContext<RadarContextType | null>(null);

export const useRadarContext = () => {
  const context = useContext(RadarContext);
  if (!context) {
    throw new Error("useRadarContext must be used within RadarProvider");
  }
  return context;
};
