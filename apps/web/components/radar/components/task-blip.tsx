"use client";

import type React from "react";
import { useState, useCallback, useEffect, useMemo } from "react";
import { GripVertical } from "lucide-react";
import type { Task, Position } from "../types/";
import { useRadar } from "../context/radar-context";

interface TaskBlipProps {
  task: Task;
  position: Position;
  onDragEnd: (taskId: string, newPosition: Position) => void;
}

export function TaskBlip({ task, position, onDragEnd }: TaskBlipProps) {
  const { state, currentTime, setSelectedTask, updateTask } = useRadar();
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState(position);
  const [initialMousePos, setInitialMousePos] = useState({ x: 0, y: 0 });
  const [initialTaskPos, setInitialTaskPos] = useState(position);

  // Update drag position when the calculated position changes (but not while dragging)
  useEffect(() => {
    if (!isDragging) {
      setDragPosition(position);
    }
  }, [position, isDragging]);

  // Memoized round function for consistent number formatting
  const round = useCallback((num: number) => parseFloat(num.toFixed(2)), []);

  // Calculate current position based on drag state with consistent rounding
  const currentPosition = useMemo(() => {
    const pos = isDragging ? dragPosition : position;
    // Ensure consistent number of decimal places for hydration
    const x = round(pos.x);
    const y = round(pos.y);
    return { x, y };
  }, [isDragging, dragPosition, position, round]);

  // Calculate radar center (assuming viewport center for now)
  const [radarCenter, setRadarCenter] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // This code only runs on the client side
    const updateRadarCenter = () => {
      setRadarCenter({
        x: round(window.innerWidth / 2),
        y: round(window.innerHeight / 2),
      });
    };

    // Set initial value
    updateRadarCenter();

    // Update on window resize with debounce
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateRadarCenter, 100);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, [round]);

  // Calculate real-time due date based on current drag position
  const calculateDueDateFromPosition = useCallback(
    (pos: Position) => {
      const deltaX = pos.x - radarCenter.x;
      const deltaY = pos.y - radarCenter.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Convert distance to days (same logic as in radar-canvas)
      const baseRingSpacing = 60;
      const zoom = state.zoom;
      const relativeDistance = distance / zoom;
      const days = Math.max(0, relativeDistance / baseRingSpacing);

      return new Date(currentTime.getTime() + days * 24 * 60 * 60 * 1000);
    },
    [radarCenter, state.zoom, currentTime]
  );

  // Get the effective due date (real-time during drag, or actual due date)
  const effectiveDueDate = useMemo(() => {
    if (isDragging) {
      return calculateDueDateFromPosition(dragPosition);
    }
    return task.dueDate;
  }, [isDragging, dragPosition, calculateDueDateFromPosition, task.dueDate]);

  // Calculate days remaining using the effective due date
  const daysRemaining = useMemo(() => {
    if (!effectiveDueDate) return 0;
    const diffTime = effectiveDueDate.getTime() - currentTime.getTime();
    return diffTime / (1000 * 60 * 60 * 24);
  }, [effectiveDueDate, currentTime]);

  const isOverdue = daysRemaining < 0;
  const isSelected = state.selectedTask === task.id;

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest(".drag-handle")) return;

    e.preventDefault();
    e.stopPropagation();

    // Store initial positions
    setInitialMousePos({ x: e.clientX, y: e.clientY });
    setInitialTaskPos(position);
    setDragPosition(position);
    setIsDragging(true);
    setSelectedTask(task.id);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      // Calculate the mouse movement delta
      const deltaX = e.clientX - initialMousePos.x;
      const deltaY = e.clientY - initialMousePos.y;

      // Update drag position based on initial position + delta with rounding
      const newDragPosition = {
        x: round(initialTaskPos.x + deltaX),
        y: round(initialTaskPos.y + deltaY),
      };

      setDragPosition(newDragPosition);

      // Calculate and update due date in real-time
      const newDueDate = calculateDueDateFromPosition(newDragPosition);
      updateTask(task.id, { dueDate: newDueDate });

      console.log(`🔄 Real-time update for ${task.title}:`, {
        position: newDragPosition,
        newDueDate: newDueDate.toLocaleString(),
        daysFromNow: (
          (newDueDate.getTime() - currentTime.getTime()) /
          (1000 * 60 * 60 * 24)
        ).toFixed(2),
      });
    },
    [
      isDragging,
      initialMousePos,
      initialTaskPos,
      round,
      calculateDueDateFromPosition,
      updateTask,
      task.id,
      task.title,
      currentTime,
    ]
  );

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);
    // Pass the final drag position to the parent
    onDragEnd(task.id, dragPosition);

    console.log(`✅ Final position for ${task.title}:`, {
      finalPosition: dragPosition,
      finalDueDate: task.dueDate.toLocaleString(),
    });
  }, [isDragging, onDragEnd, task.id, dragPosition, task.title, task.dueDate]);

  useEffect(() => {
    if (!isDragging) return;

    // Add event listeners to the document for smooth dragging
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleClick = (e: React.MouseEvent) => {
    if (!isDragging) {
      e.stopPropagation();
      setSelectedTask(isSelected ? null : task.id);
    }
  };

  // Format time remaining for display
  const formatTimeRemaining = (days: number) => {
    if (days < 0) return "Overdue";

    const totalHours = days * 24;
    if (totalHours < 1) {
      const minutes = Math.ceil(totalHours * 60);
      return `${minutes}m`;
    } else if (totalHours < 24) {
      const hours = Math.ceil(totalHours);
      return `${hours}h`;
    } else {
      const wholeDays = Math.ceil(days);
      return `${wholeDays}d`;
    }
  };

  return (
    <div
      className={`absolute transition-transform duration-100 ease-out ${
        isDragging ? "opacity-90 scale-105 z-50" : "hover:scale-105 z-0"
      } ${isSelected ? "z-20" : ""}`}
      style={{
        left: `${currentPosition.x}px`,
        top: `${currentPosition.y}px`,
        transform: "translate(-50%, -50%)",
        cursor: isDragging ? "grabbing" : "grab",
        pointerEvents: "auto",
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      <div
        className={`flex flex-col bg-gray-800/90 backdrop-blur-sm rounded-lg border border-gray-700 shadow-lg transition-all duration-200 ${
          isDragging
            ? "ring-2 ring-emerald-400/50 shadow-xl bg-emerald-900/20"
            : ""
        } ${isSelected ? "ring-2 ring-emerald-500/70" : ""}`}
      >
        <div className="w-full flex justify-center py-0.5 cursor-grabbing drag-handle">
          <GripVertical
            className={`h-3 w-3 text-gray-400 transition-colors transform rotate-90 ${
              isDragging ? "text-emerald-400" : "hover:text-gray-300"
            }`}
          />
        </div>
        <div className="px-2 pb-2">
          <div className="text-xs font-medium text-gray-100 truncate max-w-32">
            {task.title}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
            <div
              className={`w-2 h-2 rounded-full flex-shrink-0 ${
                task.priority === "high"
                  ? "bg-red-500"
                  : task.priority === "medium"
                    ? "bg-yellow-500"
                    : "bg-green-500"
              }`}
            />
            <span
              className={`text-[10px] leading-none truncate ${
                isDragging ? "text-emerald-300 font-medium" : ""
              } ${isOverdue ? "text-red-400" : ""}`}
            >
              {formatTimeRemaining(daysRemaining)}
            </span>
          </div>
        </div>
      </div>

      {/* Real-time drag feedback tooltip */}
      {isDragging && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-emerald-900/95 backdrop-blur-sm rounded-lg p-3 border border-emerald-500/50 shadow-xl z-40 min-w-48">
          <div className="text-sm font-medium text-emerald-100 mb-2">
            📅 Updating Due Date
          </div>
          <div className="text-xs text-emerald-200 mb-1">
            <strong>New due date:</strong>{" "}
            {effectiveDueDate.toLocaleDateString()} at{" "}
            {effectiveDueDate.toLocaleTimeString()}
          </div>
          <div className="text-xs text-emerald-300">
            <strong>Time from now:</strong> {formatTimeRemaining(daysRemaining)}
          </div>
          <div className="text-xs text-emerald-400 mt-2 opacity-75">
            Release to confirm
          </div>
        </div>
      )}

      {/* Enhanced tooltip for selected task */}
      {isSelected && !isDragging && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-gray-900/95 backdrop-blur-sm rounded-lg p-3 border border-gray-600 shadow-xl z-30 min-w-48">
          <div className="text-sm font-medium text-gray-100 mb-2">
            {task.title}
          </div>
          {task.description && (
            <div className="text-xs text-gray-300 mb-2">{task.description}</div>
          )}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Due: {effectiveDueDate.toLocaleDateString()}</span>
            <span className="capitalize">{task.priority} priority</span>
          </div>
          {isOverdue && (
            <div className="text-xs text-red-400 mt-1 font-medium">
              ⚠️ This task is overdue
            </div>
          )}
          <div className="text-xs text-gray-500 mt-1">
            Time remaining: {Math.ceil(Math.max(0, daysRemaining * 24))} hours
          </div>
        </div>
      )}
    </div>
  );
}
