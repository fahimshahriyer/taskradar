"use client";

import { RadarProvider } from "./context/radar-context";
import { RadarCanvas } from "./components/radar-canvas";
import { ZoomControls } from "./components/zoom-control";
import { CenterLockToggle } from "./components/center-lock-toggle";
import { sampleTasks } from "./data/mockData";

export default function RadarTaskManager() {
  return (
    <RadarProvider>
      <div className="relative w-full h-full bg-gray-900 overflow-hidden select-none">
        <RadarCanvas />
        <ZoomControls />
        <CenterLockToggle />

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-lg shadow-xl p-4">
          <h3 className="text-sm font-semibold text-gray-200 mb-2">Priority</h3>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm"></div>
              <span className="text-xs text-gray-300">High</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm"></div>
              <span className="text-xs text-gray-300">Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm"></div>
              <span className="text-xs text-gray-300">Low</span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 right-4 bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-lg shadow-xl p-4 max-w-xs">
          <h3 className="text-sm font-semibold text-gray-200 mb-2">
            How to use
          </h3>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• Click a task to see details</li>
            <li>• Drag tasks to reschedule</li>
            <li>• Use zoom controls to scale</li>
            <li>• Toggle center lock to pan</li>
          </ul>
        </div>
      </div>
    </RadarProvider>
  );
}
