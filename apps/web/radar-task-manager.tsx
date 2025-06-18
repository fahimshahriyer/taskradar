"use client"
import { RadarProvider } from "./context/radar-context"
import { RadarCanvas } from "./components/radar-canvas"
import { ZoomControls } from "./components/zoom-controls"
import { CenterLockToggle } from "./components/center-lock-toggle"
import { TaskLegend } from "./components/task-legend"
import { sampleTasks } from "./data/sample-tasks"

export default function RadarTaskManager() {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <RadarProvider initialTasks={sampleTasks}>
        <div className="relative w-full h-full">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-20 bg-white/80 backdrop-blur-sm border-b border-gray-200">
            <div className="px-6 py-4">
              <h1 className="text-2xl font-bold text-gray-900">Radar Task Manager</h1>
              <p className="text-sm text-gray-600 mt-1">Tasks on your radar - closer to center means due sooner</p>
            </div>
          </div>

          {/* Main radar view */}
          <div className="pt-20 w-full h-full">
            <RadarCanvas />
          </div>

          {/* Controls */}
          <CenterLockToggle />
          <ZoomControls />
          <TaskLegend />

          {/* Instructions */}
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 max-w-xs z-10">
            <h3 className="text-sm font-medium text-gray-900 mb-2">How to use</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Hover over blips to see task details</li>
              <li>• Drag blips to reschedule tasks</li>
              <li>• Use zoom controls or mouse wheel</li>
              <li>• Toggle center lock to enable panning</li>
              <li>• Use Tab to navigate with keyboard</li>
            </ul>
          </div>
        </div>
      </RadarProvider>
    </div>
  )
}
