export interface Task {
  id: string;
  title: string;
  dueDate: Date;
  priority: "low" | "medium" | "high";
  description?: string;
}

export interface RadarRing {
  id: string;
  label: string;
  radius: number;
  color: string;
  maxDays: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface RadarState {
  zoom: number;
  panX: number;
  panY: number;
  centerLocked: boolean;
  selectedTask: string | null;
}
