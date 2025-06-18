import { Task } from "../types";

export const mockTasks: Task[] = [
  {
    id: "1",
    title: "Review quarterly report",
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    priority: "high" as const,
  },
  {
    id: "2",
    title: "Team standup meeting",
    dueDate: new Date(Date.now() + 0.5 * 24 * 60 * 60 * 1000),
    priority: "medium" as const,
  },
  {
    id: "3",
    title: "Update project documentation",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    priority: "low" as const,
  },
  {
    id: "4",
    title: "Client presentation prep",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    priority: "high" as const,
  },
  {
    id: "5",
    title: "Code review session",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    priority: "medium" as const,
  },
  {
    id: "6",
    title: "Database optimization",
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    priority: "low" as const,
  },
  {
    id: "7",
    title: "Security audit",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    priority: "high" as const,
  },
  {
    id: "8",
    title: "Feature planning meeting",
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    priority: "medium" as const,
  },
];

export const timeRings = [
  { label: "Today", radius: 60, daysFromNow: 1, color: "#ef4444" },
  { label: "Tomorrow", radius: 100, daysFromNow: 2, color: "#f97316" },
  { label: "This Week", radius: 140, daysFromNow: 7, color: "#eab308" },
  { label: "Later", radius: 180, daysFromNow: 30, color: "#22c55e" },
];
