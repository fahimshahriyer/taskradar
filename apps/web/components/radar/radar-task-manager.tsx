"use client";
import { RadarProvider } from "./context/radar-context";
import { RadarCanvas } from "./components/radar-canvas";
import { ZoomControls } from "./components/zoom-control";
import { CenterLockToggle } from "./components/center-lock-toggle";
import { TaskLegend } from "./components/task-legend";
import { InformationBar } from "./components/information-bar";
import { TaskDetailsSidebar } from "./components/task-detail-sidebar";
import { sampleTasks } from "./data/mockData";
import { useRadar } from "./context/radar-context";

function RadarContent() {
  const { state, setSelectedTask } = useRadar();

  const handleCloseSidebar = () => {
    setSelectedTask(null);
  };

  return (
    <div className="relative w-full h-full">
      {/* Main radar view */}
      <div className="w-full h-full">
        <RadarCanvas />
      </div>

      {/* Controls */}
      <CenterLockToggle />
      <ZoomControls />
      <TaskLegend />
      <InformationBar />

      {/* Task Details Sidebar */}
      <TaskDetailsSidebar
        isOpen={!!state.selectedTask}
        onClose={handleCloseSidebar}
      />

      {/* Instructions */}
      <div className="absolute bottom-12 right-4 bg-gray-800/90 backdrop-blur-sm  border border-gray-700 rounded-lg p-3 max-w-xs z-10">
        <h3 className="text-sm font-medium text-gray-200 mb-2">How to use</h3>
        <ul className="text-xs text-gray-200 space-y-1">
          <li>• Click on tasks to see details</li>
          <li>• Drag tasks to reschedule</li>
          <li>• Use zoom controls or mouse wheel</li>
          <li>• Toggle center lock to enable panning</li>
          <li>• Use Tab to navigate with keyboard</li>
        </ul>
      </div>
    </div>
  );
}

export default function RadarTaskManager() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <RadarProvider>
        <RadarContent />
      </RadarProvider>
    </div>
  );
}
