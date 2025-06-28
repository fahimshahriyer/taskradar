import { Task } from "@/components/radar/types";

export interface TasksData {
  tasks: Task[];
}

export async function loadTasks(): Promise<Task[]> {
  try {
    const response = await fetch('/data/tasks.json');
    if (!response.ok) {
      throw new Error('Failed to load tasks');
    }
    const data: TasksData = await response.json();
    return data.tasks.map(task => ({
      ...task,
      dueDate: new Date(task.dueDate) // Ensure dueDate is a Date object
    }));
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [];
  }
}
