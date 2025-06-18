import React from 'react';
import { Lock, Unlock } from 'lucide-react';
import { useRadarContext } from '../context/RadarContext';

const CenterLockToggle: React.FC = () => {
  const { centerLocked, setCenterLocked } = useRadarContext();

  return (
    <div className="absolute top-4 left-4 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-2">
      <button
        onClick={() => setCenterLocked(!centerLocked)}
        className={`p-2 rounded transition-colors ${
          centerLocked
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-gray-700 text-gray-200 hover:bg-gray-600"
        }`}
        aria-label={centerLocked ? "Center locked" : "Center unlocked"}
      >
        {centerLocked ? <Lock size={20} /> : <Unlock size={20} />}
      </button>
    </div>
  );
};

export default CenterLockToggle;
