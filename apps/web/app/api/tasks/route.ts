import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Task } from "@/components/radar/types";

export async function GET() {
  try {
    // Read from public directory
    const filePath = path.join(process.cwd(), "public", "data", "tasks.json");
    const fileContent = await fs.promises.readFile(filePath, "utf8");
    const data = JSON.parse(fileContent);

    if (!data || !data.tasks || !Array.isArray(data.tasks)) {
      throw new Error("Invalid tasks data format");
    }

    // Convert dueDate strings to Date objects and validate while preserving all other fields
    const tasks = data.tasks.map((task: any) => {
      const dueDate = new Date(task.dueDate);
      if (isNaN(dueDate.getTime())) {
        throw new Error(
          `Invalid date format for task ${task.id}: ${task.dueDate}`
        );
      }

      return {
        ...task,
        dueDate: dueDate,
      } as Task;
    }) as Task[];

    // Create a custom JSON serializer to handle Date objects
    const serializeTasks = (tasks: Task[]) =>
      JSON.stringify(tasks, (key, value) => {
        if (key === "dueDate" && value instanceof Date) {
          return value.toISOString();
        }
        return value;
      });

    return new NextResponse(serializeTasks(tasks), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error loading tasks:", error);
    return new NextResponse(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Failed to load tasks",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
