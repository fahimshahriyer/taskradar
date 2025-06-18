"use client";

import { Plus, Minus } from "lucide-react";
import { useRadar } from "../context/radar-context";

export function ZoomControls() {
  const { state, setZoom } = useRadar();

  const handleZoomIn = () => {
    setZoom(state.zoom + 0.1);
  };

  const handleZoomOut = () => {
    setZoom(state.zoom - 0.1);
  };

  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2 bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-lg shadow-xl p-2 z-50">
      <button
        onClick={handleZoomIn}
        disabled={state.zoom >= 3}
        className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Zoom in"
      >
        <Plus size={20} />
      </button>
      <div className="text-xs text-center text-gray-400 px-2 py-1 bg-gray-700/50 rounded font-mono">
        {Math.round(state.zoom * 100)}%
      </div>
      <button
        onClick={handleZoomOut}
        disabled={state.zoom <= 0.5}
        className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Zoom out"
      >
        <Minus size={20} />
      </button>
    </div>
  );
}
