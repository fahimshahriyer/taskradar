import React from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { useRadarContext } from '../context/RadarContext';

const ZoomControls: React.FC = () => {
  const { zoom, setZoom } = useRadarContext();

  const handleZoomIn = () => setZoom(Math.min(zoom * 1.2, 3));
  const handleZoomOut = () => setZoom(Math.max(zoom / 1.2, 0.5));

  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-2">
      <button
        onClick={handleZoomIn}
        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        aria-label="Zoom in"
      >
        <ZoomIn size={20} />
      </button>
      <button
        onClick={handleZoomOut}
        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        aria-label="Zoom out"
      >
        <ZoomOut size={20} />
      </button>
    </div>
  );
};

export default ZoomControls;
