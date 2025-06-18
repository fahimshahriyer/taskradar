"use client";

import { Lock, Unlock } from "lucide-react";
import { useRadar } from "../context/radar-context";

export function CenterLockToggle() {
  const { state, toggleCenterLock } = useRadar();

  return (
    <div className="absolute top-4 left-4 bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-lg shadow-xl p-2 z-50">
      <button
        onClick={toggleCenterLock}
        className={`flex items-center gap-2 px-3 py-2 rounded transition-colors ${
          state.centerLocked
            ? "bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30"
            : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600/30"
        }`}
        aria-label={
          state.centerLocked
            ? "Unlock center (enable panning)"
            : "Lock center (disable panning)"
        }
      >
        {state.centerLocked ? (
          <>
            <Lock size={16} />
            <span className="text-sm font-medium">Locked</span>
          </>
        ) : (
          <>
            <Unlock size={16} />
            <span className="text-sm font-medium">Pan Mode</span>
          </>
        )}
      </button>
    </div>
  );
}
