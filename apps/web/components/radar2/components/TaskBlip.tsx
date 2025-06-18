import React, { useState, useCallback, useEffect } from "react";
import { GripVertical } from "lucide-react";
import { RadarContextType, Task } from "../types";
import { useRadarContext } from "../context/RadarContext";
import { cartesianToPolar } from "../utils/radarUtils";

interface TaskBlipProps {
  task: Task;
  position: { x: number; y: number };
  onDragEnd: (taskId: string, newRadius: number) => void;
}

const TaskBlip: React.FC<TaskBlipProps> = ({ task, position, onDragEnd }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState(position);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const { zoom, panX, panY, centerLocked } =
    useRadarContext() as RadarContextType;

  // Calculate dimensions for the task blip
  const textWidth = 160; // Fixed width for consistent sizing
  const textHeight = 40; // Increased height to prevent clipping

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as SVGElement;
    if (!target.classList.contains("drag-handle")) return;

    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);

    const rect = (e.target as Element).closest("svg")?.getBoundingClientRect();
    if (!rect) return;

    const svgCenterX = rect.width / 2;
    const svgCenterY = rect.height / 2;

    const mouseRadarX =
      (e.clientX - rect.left - svgCenterX) / zoom - (centerLocked ? 0 : panX);
    const mouseRadarY =
      (e.clientY - rect.top - svgCenterY) / zoom - (centerLocked ? 0 : panY);

    setDragOffset({
      x: position.x - mouseRadarX,
      y: position.y - mouseRadarY,
    });
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const rect = document.querySelector("svg")?.getBoundingClientRect();
      if (!rect) return;

      const svgCenterX = rect.width / 2;
      const svgCenterY = rect.height / 2;

      const mouseRadarX =
        (e.clientX - rect.left - svgCenterX) / zoom - (centerLocked ? 0 : panX);
      const mouseRadarY =
        (e.clientY - rect.top - svgCenterY) / zoom - (centerLocked ? 0 : panY);

      const newX = mouseRadarX + dragOffset.x;
      const newY = mouseRadarY + dragOffset.y;

      setDragPosition({ x: newX, y: newY });
    },
    [isDragging, zoom, panX, panY, centerLocked, dragOffset]
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      const { radius } = cartesianToPolar(dragPosition.x, dragPosition.y);
      onDragEnd(task.id, radius);
      setIsDragging(false);
      setDragOffset({ x: 0, y: 0 });
    }
  }, [isDragging, dragPosition, task.id, onDragEnd]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "grabbing";
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = "";
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    if (!isDragging) {
      setDragPosition(position);
    }
  }, [position, isDragging]);

  const currentPosition = isDragging ? dragPosition : position;
  const daysRemaining = Math.round(
    (task.dueDate.getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000)
  );
  const isOverdue = daysRemaining < 0;

  return (
    <g
      className={`transition-transform duration-200 ${isDragging ? "opacity-80 scale-105" : "hover:scale-105"}`}
      style={{
        transform: `translate(${currentPosition.x}px, ${currentPosition.y}px)`,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onMouseDown={handleMouseDown}
    >
      <foreignObject
        x={-textWidth / 2}
        y={-textHeight / 2}
        width={textWidth}
        height={textHeight}
        className="pointer-events-none overflow-visible"
      >
        <div
          className={`flex items-center gap-2 bg-gray-800/90 backdrop-blur-sm rounded-lg p-1 border border-gray-700 shadow-lg transition-all duration-200 ${
            isDragging ? "ring-2 ring-blue-400/50" : ""
          }`}
          style={{ minHeight: "100%" }}
        >
          <GripVertical
            className={`h-3 w-3 text-gray-400 drag-handle transition-colors ${
              isDragging ? "text-blue-400" : ""
            }`}
          />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-gray-100 truncate">
              {task.title}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <div
                className={`w-2 h-2 rounded-full ${
                  task.priority === "high"
                    ? "bg-red-500"
                    : task.priority === "medium"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                }`}
              />
              <span className="text-[10px] leading-none">
                {isOverdue ? "Overdue" : `${daysRemaining} days`}
              </span>
            </div>
          </div>
        </div>
      </foreignObject>

      {/* Drag handle area (invisible but larger for better UX) */}
      <rect
        x={-textWidth / 2}
        y={-textHeight / 2}
        width={textWidth}
        height={textHeight}
        fill="transparent"
        className="drag-handle"
      />
    </g>
  );
};

export default TaskBlip;
