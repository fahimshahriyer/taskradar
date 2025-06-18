export interface Task {
  id: string;
  title: string;
  dueDate: Date;
  priority: "low" | "medium" | "high";
  category: string; // Optional category for angular positioning
  status: "todo" | "in-progress" | "done";
  description: string;
  attachments: number;
  comments: number;
  assignees: Array<{
    initial: string;
    color: string;
  }>;
}

export interface RadarTaskViewProps {
  tasks: Task[];
  onTaskUpdate: (task: Task) => void;
  maxRadiusDays?: number; // Default 30 days
  intervalDays?: number; // Default 7 days for grid circles
  className?: string;
}
