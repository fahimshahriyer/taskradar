import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { Task } from "../types";
import { useRadarContext } from "../context/RadarContext";
import { polarToCartesian, getDaysFromNow } from "../utils/radarUtils";
import RadarRing from "./RadarRing";
import TaskBlip from "./TaskBlip";
import { timeRings } from "../data/mockData";
import ZoomControls from "./ZoomControls";
import CenterLockToggle from "./CenterLockToggle";

interface RadarCanvasProps {
  tasks: Task[];
}

const RadarCanvas: React.FC<RadarCanvasProps> = ({ tasks }) => {
  const { zoom, panX, panY, centerLocked, setPan, updateTaskDueDate } =
    useRadarContext();
  const svgRef = useRef<SVGSVGElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });

  // Calculate task positions with random angles to prevent overlap
  const taskPositions = useMemo(() => {
    const positions: {
      [key: string]: { x: number; y: number; angle: number };
    } = {};

    tasks.forEach((task) => {
      const daysFromNow = getDaysFromNow(task.dueDate);
      let radius = 50; // Default for overdue tasks

      // Find appropriate ring
      for (const ring of timeRings) {
        if (daysFromNow <= ring.daysFromNow) {
          radius = ring.radius - 10;
          break;
        }
      }

      // Use task ID to generate consistent but random-looking angle
      const seed = task.id
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const angle = ((seed * 137.5) % 360) * (Math.PI / 180); // Golden angle for good distribution

      const position = polarToCartesian(angle, radius);
      positions[task.id] = { ...position, angle };
    });

    return positions;
  }, [tasks]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (centerLocked) return;
    setIsPanning(true);
    setLastPanPoint({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isPanning || centerLocked) return;

      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;

      setPan(panX + deltaX / zoom, panY + deltaY / zoom);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    },
    [isPanning, centerLocked, lastPanPoint, panX, panY, zoom, setPan]
  );

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  useEffect(() => {
    if (isPanning) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isPanning, handleMouseMove, handleMouseUp]);

  const handleTaskDragEnd = (taskId: string, newRadius: number) => {
    // Convert radius back to days and create new due date
    let daysFromNow = 1;

    for (const ring of timeRings) {
      if (newRadius <= ring.radius) {
        daysFromNow = Math.max(0, ring.daysFromNow * (newRadius / ring.radius));
        break;
      }
    }

    const newDueDate = new Date();
    newDueDate.setDate(newDueDate.getDate() + Math.ceil(daysFromNow));
    updateTaskDueDate(taskId, newDueDate);
  };

  const transform = centerLocked
    ? `scale(${zoom})`
    : `translate(${panX}, ${panY}) scale(${zoom})`;

  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-900">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 800 600"
        className="cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        style={{
          cursor: centerLocked ? "default" : isPanning ? "grabbing" : "grab",
        }}
      >
        {/* Background grid */}
        <defs>
          <pattern
            id="grid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="#374151"
              strokeWidth="1"
              opacity="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Main radar group */}
        <g transform={`translate(400, 300) ${transform}`}>
          {/* Center point */}
          <circle cx={0} cy={0} r={4} fill="#e5e7eb" />
          <text x={8} y={-8} fill="#e5e7eb" fontSize="12" fontWeight="bold">
            NOW
          </text>

          {/* Radar rings */}
          {timeRings.map((ring, index) => (
            <RadarRing key={index} ring={ring} />
          ))}

          {/* Tasks */}
          {tasks.map((task) => {
            const position = taskPositions[task.id];
            return position ? (
              <TaskBlip
                key={task.id}
                task={task}
                position={position}
                onDragEnd={handleTaskDragEnd}
              />
            ) : null;
          })}
        </g>
      </svg>

      <ZoomControls />
      <CenterLockToggle />

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-4">
        <h3 className="font-bold text-sm mb-2 text-gray-200">Priority</h3>
        <div className="flex flex-col gap-2 text-xs text-gray-300">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Low</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadarCanvas;
