"use client";

import { Button } from "@workspace/ui/components/button";
import { ChevronLeft } from "lucide-react";

type Priority = 'high' | 'medium' | 'low';

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  labels?: string[];
  dueDate?: Date;
}

interface TaskDetailsProps {
  task: Task | null;
  onBack: () => void;
}

export function TaskDetails({ task, onBack }: TaskDetailsProps) {
  if (!task) return null;
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="-ml-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to board
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto p-4 space-y-6">
        <div>
          <h2 className="text-xl font-bold">{task.title}</h2>
          <div className="text-sm text-muted-foreground mt-1">
            {task.id}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Description</h3>
          <p className="text-sm">
            {task.description || "No description provided"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium mb-1">Priority</h3>
            <div className="text-sm capitalize">{task.priority}</div>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-1">Labels</h3>
            <div className="flex flex-wrap gap-1">
              {task.labels?.map((label) => (
                <span 
                  key={label} 
                  className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full"
                >
                  {label}
                </span>
              )) || "No labels"}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t">
        <Button className="w-full">Edit Task</Button>
      </div>
    </div>
  );
}
