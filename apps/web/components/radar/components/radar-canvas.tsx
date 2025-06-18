"use client";

import type React from "react";
import { useRef, useEffect, useState, useMemo } from "react";
import { RadarRingComponent } from "./radar-ring";
import { TaskBlip } from "./task-blip";
import { useRadar } from "../context/radar-context";
import type { RadarRing, Position, Task } from "../types/";

export function RadarCanvas() {
  const {
    state,
    tasks,
    taskPositions,
    updateTask,
    updateTaskPosition,
    setPan,
  } = useRadar();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const centerX = dimensions.width / 2 + (state.centerLocked ? 0 : state.panX);
  const centerY = dimensions.height / 2 + (state.centerLocked ? 0 : state.panY);

  // Generate rings - each ring represents one day
  const radarRings = useMemo(() => {
    const rings: RadarRing[] = [];
    const baseRingSpacing = 60;

    const maxDistance =
      Math.sqrt(
        dimensions.width * dimensions.width +
          dimensions.height * dimensions.height
      ) / 2;
    const maxRadius = maxDistance + Math.abs(state.panX) + Math.abs(state.panY);

    let dayNumber = 1;

    while (true) {
      const currentRadius = dayNumber * baseRingSpacing * state.zoom;

      if (currentRadius > maxRadius) break;

      let label = "";
      if (dayNumber === 1) label = "Tomorrow";
      else if (dayNumber === 7) label = "1 Week";
      else if (dayNumber === 14) label = "2 Weeks";
      else if (dayNumber === 30) label = "1 Month";
      else if (dayNumber % 30 === 0) label = `${dayNumber / 30} Months`;
      else if (dayNumber % 7 === 0) label = `${dayNumber / 7} Weeks`;
      else label = `${dayNumber}d`;

      rings.push({
        id: `day-${dayNumber}`,
        label: label,
        radius: currentRadius / state.zoom,
        color: "#10b981",
        maxDays: dayNumber,
      });

      dayNumber++;
    }

    return rings;
  }, [dimensions, state.zoom, state.panX, state.panY]);

  // Generate radial lines
  const radialLines = useMemo(() => {
    const lines = [];
    const numberOfLines = 12; // 12 lines = 30 degrees apart
    const maxRadius =
      Math.sqrt(
        dimensions.width * dimensions.width +
          dimensions.height * dimensions.height
      ) / 2;
    const lineLength = maxRadius + Math.abs(state.panX) + Math.abs(state.panY);

    for (let i = 0; i < numberOfLines; i++) {
      const angle = (i * 360) / numberOfLines;
      const angleRad = (angle * Math.PI) / 180;

      const endX = centerX + lineLength * Math.cos(angleRad);
      const endY = centerY + lineLength * Math.sin(angleRad);

      lines.push({
        id: `radial-${i}`,
        angle: angle,
        startX: centerX,
        startY: centerY,
        endX: endX,
        endY: endY,
      });
    }

    return lines;
  }, [centerX, centerY, dimensions, state.panX, state.panY]);

  // Calculate automatic position based on due date
  const calculateAutomaticPosition = (task: Task): Position => {
    const now = new Date();
    const timeDiff = task.dueDate.getTime() - now.getTime();
    const daysDiff = Math.max(1, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));

    const baseRingSpacing = 60;
    const radius = daysDiff * baseRingSpacing * state.zoom;

    const angle = (task.id.charCodeAt(0) * 137.5) % 360;
    const angleRad = (angle * Math.PI) / 180;

    return {
      x: centerX + radius * Math.cos(angleRad),
      y: centerY + radius * Math.sin(angleRad),
    };
  };

  // Calculate position from relative coordinates (for user-positioned tasks)
  const calculatePositionFromRelative = (
    relativeDistance: number,
    relativeAngle: number
  ): Position => {
    const scaledDistance = relativeDistance * state.zoom;
    return {
      x: centerX + scaledDistance * Math.cos(relativeAngle),
      y: centerY + scaledDistance * Math.sin(relativeAngle),
    };
  };

  // Update task positions when radar changes
  useEffect(() => {
    tasks.forEach((task) => {
      const currentPosition = taskPositions[task.id];

      if (!currentPosition) {
        // No position stored - calculate initial position
        const initialPosition = calculateAutomaticPosition(task);
        updateTaskPosition(task.id, {
          ...initialPosition,
          isUserPositioned: false,
        });
      } else if (!currentPosition.isUserPositioned) {
        // Position exists but not user-positioned - recalculate based on due date
        const newPosition = calculateAutomaticPosition(task);
        updateTaskPosition(task.id, {
          ...newPosition,
          isUserPositioned: false,
        });
      } else if (
        currentPosition.relativeDistance !== undefined &&
        currentPosition.relativeAngle !== undefined
      ) {
        // User-positioned task with relative coordinates - scale with zoom
        const newPosition = calculatePositionFromRelative(
          currentPosition.relativeDistance,
          currentPosition.relativeAngle
        );
        updateTaskPosition(task.id, {
          ...newPosition,
          isUserPositioned: true,
          relativeDistance: currentPosition.relativeDistance,
          relativeAngle: currentPosition.relativeAngle,
        });
      }
    });
  }, [centerX, centerY, state.zoom]);

  const getTaskPosition = (task: Task): Position => {
    const position = taskPositions[task.id];
    return position
      ? { x: position.x, y: position.y }
      : { x: centerX, y: centerY };
  };

  const handleTaskDragEnd = (taskId: string, newPosition: Position) => {
    // Calculate relative position from center (unscaled)
    const deltaX = newPosition.x - centerX;
    const deltaY = newPosition.y - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = Math.atan2(deltaY, deltaX);

    // Store relative coordinates (unscaled distance)
    const relativeDistance = distance / state.zoom;
    const relativeAngle = angle;

    // Store the position with relative coordinates
    updateTaskPosition(taskId, {
      x: newPosition.x,
      y: newPosition.y,
      isUserPositioned: true,
      relativeDistance: relativeDistance,
      relativeAngle: relativeAngle,
    });

    // Calculate new due date based on dropped position
    const baseRingSpacing = 60;
    const days = Math.max(0, Math.round(relativeDistance / baseRingSpacing));

    const newDueDate =
      days === 0
        ? new Date()
        : new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    updateTask(taskId, { dueDate: newDueDate });

    console.log("Task dropped with relative positioning:", {
      taskId,
      screenPosition: newPosition,
      relativeDistance,
      relativeAngle: (relativeAngle * 180) / Math.PI, // Convert to degrees for readability
      calculatedDays: days,
      newDueDate: newDueDate.toLocaleDateString(),
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!state.centerLocked && !target.closest("[data-task-blip]")) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - state.panX, y: e.clientY - state.panY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning && !state.centerLocked) {
      setPan(e.clientX - panStart.x, e.clientY - panStart.y);
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Grid pattern calculations
  const gridSize = 40 * state.zoom;
  const gridOffsetX = (centerX % gridSize) - gridSize;
  const gridOffsetY = (centerY % gridSize) - gridSize;

  return (
    <div
      ref={containerRef}
      className={`w-full h-full bg-gray-900 relative overflow-hidden ${
        state.centerLocked ? "cursor-default" : "cursor-move"
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Grid Background */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <defs>
          <pattern
            id="grid"
            width={gridSize}
            height={gridSize}
            patternUnits="userSpaceOnUse"
            x={gridOffsetX}
            y={gridOffsetY}
          >
            <path
              d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
              fill="none"
              stroke="#374151"
              strokeWidth="0.5"
              opacity="0.2"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* SVG for radar rings, radial lines, and center */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      >
        {/* Radial lines */}
        {radialLines.map((line) => (
          <line
            key={line.id}
            x1={line.startX}
            y1={line.startY}
            x2={line.endX}
            y2={line.endY}
            stroke="#10b981"
            strokeWidth="1"
            strokeDasharray="4,8"
            opacity="0.3"
          />
        ))}

        {/* Day-based radar rings */}
        {radarRings.map((ring) => (
          <RadarRingComponent
            key={ring.id}
            ring={ring}
            centerX={centerX}
            centerY={centerY}
            zoom={state.zoom}
          />
        ))}

        {/* Prominent Center Point */}
        <defs>
          <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="1" />
            <stop offset="70%" stopColor="#10b981" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.3" />
          </radialGradient>
        </defs>

        {/* Center glow effect */}
        <circle
          cx={centerX}
          cy={centerY}
          r="20"
          fill="url(#centerGradient)"
          opacity="0.6"
        />
        <circle cx={centerX} cy={centerY} r="12" fill="#10b981" opacity="0.8" />
        <circle
          cx={centerX}
          cy={centerY}
          r="8"
          fill="#34d399"
          className="drop-shadow-lg"
        />
        <circle cx={centerX} cy={centerY} r="4" fill="#ffffff" />

        {/* Center label */}
        <text
          x={centerX}
          y={centerY + 35}
          textAnchor="middle"
          className="text-base font-bold fill-emerald-400"
          style={{
            textShadow:
              "0 0 8px rgba(16, 185, 129, 0.8), 0 2px 4px rgba(0,0,0,0.8)",
            fontSize: "16px",
          }}
        >
          TODAY
        </text>
      </svg>

      {/* Task blips */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 2 }}
      >
        {tasks.map((task) => (
          <div key={task.id} data-task-blip>
            <TaskBlip
              task={task}
              position={getTaskPosition(task)}
              onDragEnd={handleTaskDragEnd}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
