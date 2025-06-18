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
  const { state, setSelectedTask } = useRadar();
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

  // Calculate current position based on drag state
  const currentPosition = isDragging ? dragPosition : position;

  // Calculate days remaining for display
  const daysRemaining = useMemo(() => {
    if (!task.dueDate) return 0;
    const now = new Date();
    const dueDate = new Date(task.dueDate);
    const diffTime = dueDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [task.dueDate]);

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

      // Update drag position based on initial position + delta
      setDragPosition({
        x: initialTaskPos.x + deltaX,
        y: initialTaskPos.y + deltaY,
      });
    },
    [isDragging, initialMousePos, initialTaskPos]
  );

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);
    // Pass the final drag position to the parent
    onDragEnd(task.id, dragPosition);
  }, [isDragging, onDragEnd, task.id, dragPosition]);

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

  return (
    <div
      className={`absolute transition-transform duration-200 ${
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
          isDragging ? "ring-2 ring-emerald-400/50 shadow-xl" : ""
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
            <span className="text-[10px] leading-none truncate">
              {isOverdue ? "Overdue" : `${daysRemaining} days`}
            </span>
          </div>
        </div>
      </div>

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
            <span>Due: {task.dueDate.toLocaleDateString()}</span>
            <span className="capitalize">{task.priority} priority</span>
          </div>
          {isOverdue && (
            <div className="text-xs text-red-400 mt-1 font-medium">
              ⚠️ This task is overdue
            </div>
          )}
        </div>
      )}
    </div>
  );
}
