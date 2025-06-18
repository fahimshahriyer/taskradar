export interface Task {
  id: string;
  title: string;
  dueDate: Date;
  priority: "low" | "medium" | "high";
}

export interface TimeRing {
  label: string;
  radius: number;
  daysFromNow: number;
  color: string;
}

export interface RadarContextType {
  zoom: number;
  panX: number;
  panY: number;
  centerLocked: boolean;
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  setCenterLocked: (locked: boolean) => void;
  updateTaskDueDate: (taskId: string, newDueDate: Date) => void;
}
