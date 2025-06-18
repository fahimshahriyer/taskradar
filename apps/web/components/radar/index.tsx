"use client";
import { useState, useEffect } from "react";
import { RadarBlip } from "./radar-blip";
import { RadarControls } from "./radar-controls";
import type { Task } from "./types";

interface RadarProps {
  tasks: Task[];
  onTaskUpdate: (updatedTask: Task) => void;
}

export function Radar({ tasks: tasksProp, onTaskUpdate }: RadarProps) {
  const [now, setNow] = useState(new Date());
  const [hoveredBlipId, setHoveredBlipId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"time" | "priority" | "status">("time");
  const [showLabels, setShowLabels] = useState(true);
  const [showGrid, setShowGrid] = useState(true);

  // Use the passed tasks prop directly
  const tasks = tasksProp;

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Determine task position based on view mode
  const calculatePosition = (task: Task) => {
    const maxRadius = 400;
    const angle = getStableAngle(task.id);

    switch (viewMode) {
      case "time": {
        const timeDiff = task.dueDate.getTime() - now.getTime();
        const maxTimeDiff = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
        const radius = (timeDiff / maxTimeDiff) * maxRadius;
        return {
          x: radius * Math.cos(angle),
          y: radius * Math.sin(angle),
          angle,
        };
      }
      case "priority": {
        const priorityMap = { low: 0.3, medium: 0.6, high: 1 };
        const priorityRadius = priorityMap[task.priority] * maxRadius;
        return {
          x: priorityRadius * Math.cos(angle),
          y: priorityRadius * Math.sin(angle),
          angle,
        };
      }
      case "status": {
        const statusMap = { todo: 0.3, "in-progress": 0.6, done: 1 };
        const statusRadius = statusMap[task.status] * maxRadius;
        return {
          x: statusRadius * Math.cos(angle),
          y: statusRadius * Math.sin(angle),
          angle,
        };
      }
      default:
        return {
          x: 0,
          y: 0,
          angle,
        };
    }
  };

  // Generate stable angle for each task
  const getStableAngle = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = (hash << 5) - hash + id.charCodeAt(i);
      hash |= 0; // Convert to 32bit int
    }
    return (((hash % 360) + 360) % 360) * (Math.PI / 180); // 0 to 2PI
  };

  // Render grid circles
  const renderGrid = () => {
    if (!showGrid) return null;
    return (
      <div className="absolute inset-0">
        {[100, 200, 300, 400].map((radius) => (
          <div
            key={radius}
            className="absolute inset-0"
            style={{
              width: `${radius * 2}px`,
              height: `${radius * 2}px`,
              borderRadius: `${radius}px`,
              border: "1px dashed rgba(255, 255, 255, 0.1)",
              transform: "translate(-50%, -50%)",
              top: "50%",
              left: "50%",
            }}
          />
        ))}
      </div>
    );
  };

  // Render labels
  const renderLabels = () => {
    if (!showLabels) return null;

    const labelPositions = {
      time: [
        { text: "Today", radius: 100 },
        { text: "2 Days", radius: 200 },
        { text: "4 Days", radius: 300 },
        { text: "7 Days", radius: 400 },
      ],
      priority: [
        { text: "Low", radius: 120 },
        { text: "Medium", radius: 240 },
        { text: "High", radius: 360 },
      ],
      status: [
        { text: "Todo", radius: 120 },
        { text: "In Progress", radius: 240 },
        { text: "Done", radius: 360 },
      ],
    };

    return (
      <div className="absolute inset-0">
        {labelPositions[viewMode].map((label, index) => (
          <div
            key={index}
            className="absolute"
            style={{
              top: `calc(50% - ${label.radius}px)`,
              left: `calc(50% - ${label.radius}px)`,
              width: `${label.radius * 2}px`,
              height: `${label.radius * 2}px`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="absolute top-0 left-0 transform translate-x-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              {label.text}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="relative w-full h-full mx-auto my-auto overflow-hidden">
      <RadarControls
        viewMode={viewMode}
        showLabels={showLabels}
        showGrid={showGrid}
        onViewModeChange={setViewMode}
        onShowLabelsChange={setShowLabels}
        onShowGridChange={setShowGrid}
      />
      {renderGrid()}
      {renderLabels()}
      {/* Tasks */}
      <div className="absolute inset-0">
        {tasks.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            No tasks found
          </div>
        ) : (
          tasks.map((task: Task) => {
            const { x, y } = calculatePosition(task);
            return (
              <RadarBlip
                key={task.id}
                x={x}
                y={y}
                task={task}
                hovered={hoveredBlipId === task.id}
                onHover={() => setHoveredBlipId(task.id)}
                onLeave={() => setHoveredBlipId(null)}
                onTaskUpdate={onTaskUpdate}
              />
            );
          })
        )}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-primary" />
          </div>
          <span className="text-sm text-muted-foreground">
            {viewMode === "time" ? "Now" : "Center"}
          </span>
        </div>
      </div>
    </div>
  );
}
