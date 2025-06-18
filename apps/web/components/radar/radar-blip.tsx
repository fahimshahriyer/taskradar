import { GripVertical, Circle } from "lucide-react";

import type { Task } from "./types";

interface RadarBlipProps {
  x: number;
  y: number;
  task: Task;
  hovered?: boolean;
  onHover?: () => void;
  onLeave?: () => void;
  onTaskUpdate?: (updatedTask: Task) => void;
}

export function RadarBlip({ x, y, task, hovered = false, onHover, onLeave, onTaskUpdate }: RadarBlipProps) {
  const handleClick = () => {
    if (onTaskUpdate) {
      // For demonstration, toggle the task status
      const updatedTask: Task = {
        ...task,
        status: task.status === "todo" 
          ? "in-progress" 
          : task.status === "in-progress" 
          ? "done" 
          : "todo"
      };
      onTaskUpdate(updatedTask);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`absolute cursor-pointer transition-all duration-200 ${hovered ? "z-50 translate-x-4 shadow-xl" : "z-10"}`}
      style={{
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        transform: "translate(-50%, -50%)",
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className={`flex items-center gap-1 bg-background/50 rounded-lg p-2 hover:bg-background/70 transition-colors ${hovered ? "ring-2 ring-primary/60" : ""}`}>
        <GripVertical className="h-4 w-4 text-muted-foreground" />
        <div className="flex flex-col">
          <span className="text-sm font-medium line-clamp-1">
            {task.title}
          </span>
          <div className="flex items-center gap-1">
            <Circle className="h-2 w-2" />
            <span className="text-xs text-muted-foreground">
              {Math.round(
                (task.dueDate.getTime() - Date.now()) /
                  (24 * 60 * 60 * 1000)
              )}{" "}
              days
            </span>
          </div>
        </div>
      </div>
      {hovered && (
        <div className="absolute left-full top-1/2 ml-4 -translate-y-1/2 bg-background border border-muted rounded-lg shadow-lg px-4 py-2 min-w-[160px] text-xs z-50 animate-fade-in">
          <div className="font-semibold text-sm mb-1">{task.title}</div>
          <div className="mb-1">Due: {task.dueDate.toLocaleString()}</div>
          <div>Priority: <span className="capitalize">{task.priority}</span></div>
          <div>Status: <span className="capitalize">{task.status}</span></div>
        </div>
      )}
    </div>
  );
}
