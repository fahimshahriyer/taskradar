import { Task } from "./types";

export const MAX_RADIUS_DAYS = 30; // Default maximum radius in days
export const INTERVAL_DAYS = 7; // Default interval between grid circles

export function calculatePosition(
  task: Task,
  now: Date,
  maxRadiusDays: number = MAX_RADIUS_DAYS
) {
  const timeDiff = task.dueDate.getTime() - now.getTime();
  const maxTimeDiff = maxRadiusDays * 24 * 60 * 60 * 1000;
  const radius = (timeDiff / maxTimeDiff) * 200; // 200px max radius

  // Generate stable angle based on task ID and category
  const angle = getStableAngle(task.id, task.category);

  return {
    x: radius * Math.cos(angle),
    y: radius * Math.sin(angle),
    angle,
    radius,
  };
}

export function calculatePriorityPosition(task: Task) {
  const priorityMap = {
    low: 50,
    medium: 100,
    high: 150,
  };

  const radius = priorityMap[task.priority] || 100;
  const angle = getStableAngle(task.id, task.category);

  return {
    x: radius * Math.cos(angle),
    y: radius * Math.sin(angle),
    angle,
    radius,
  };
}

export function calculateStatusPosition(task: Task) {
  const statusMap = {
    todo: 50,
    "in-progress": 100,
    done: 150,
  };

  const radius = statusMap[task.status] || 100;
  const angle = getStableAngle(task.id, task.category);

  return {
    x: radius * Math.cos(angle),
    y: radius * Math.sin(angle),
    angle,
    radius,
  };
}

export function getStableAngle(id: string, category?: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0; // Convert to 32bit int
  }

  // If category is provided, use it to influence angle
  if (category) {
    const categoryHash = category.charCodeAt(0);
    hash += categoryHash;
  }

  return (((hash % 360) + 360) % 360) * (Math.PI / 180); // 0 to 2PI
}

export function getDueDateFromPosition(
  x: number,
  y: number,
  now: Date,
  maxRadiusDays: number = MAX_RADIUS_DAYS
) {
  const radius = Math.sqrt(x * x + y * y);
  const maxRadius = 200; // 200px max radius
  const timeDiff = (radius / maxRadius) * maxRadiusDays * 24 * 60 * 60 * 1000;
  return new Date(now.getTime() + timeDiff);
}
