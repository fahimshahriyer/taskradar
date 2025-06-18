"client";

import { useCallback } from "react";
import dynamic from "next/dynamic";
import { Task as Radar2Task } from "./radar/types";

// Dynamically import the D3 radar component with no SSR
const RadarComponent = dynamic(() => import("../radar-d3"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  ),
});

interface Task extends Omit<Radar2Task, "dueDate"> {
  dueDate: Date | string;
}

interface RadarProps {
  tasks: Task[];
  onTaskUpdate: (updatedTasks: Task[]) => void;
}

export function Radar({ tasks, onTaskUpdate }: RadarProps) {
  // Convert tasks to proper format for Radar2
  const formattedTasks = tasks.map((task) => ({
    ...task,
    dueDate:
      typeof task.dueDate === "string" ? new Date(task.dueDate) : task.dueDate,
  }));

  return (
    <div className="w-full h-full">
      <RadarComponent tasks={formattedTasks} onUpdate={onTaskUpdate} />
    </div>
  );
}
