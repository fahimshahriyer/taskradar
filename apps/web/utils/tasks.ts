import { Task } from "@/components/radar/types";

export const loadTasks = async (): Promise<Task[]> => {
  try {
    const response = await fetch("/api/tasks");
    if (!response.ok) {
      throw new Error("Failed to load tasks");
    }
    const data = await response.json();

    // The API returns tasks with ISO strings, convert dueDate to Date object
    return data.map((task: any) => ({
      ...task,
      dueDate: new Date(task.dueDate),
    })) as Task[];
  } catch (error) {
    console.error("Error loading tasks:", error);
    throw error;
  }
};
