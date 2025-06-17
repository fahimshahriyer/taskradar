"use client";

import { useState } from "react";
import { Reorder } from "framer-motion";
import {
  Circle,
  LayoutDashboard,
  MessageCircle,
  Paperclip,
  Rows2,
  Rows4,
} from "lucide-react";

import { Card } from "@workspace/ui/components/card";
import { Progress } from "@workspace/ui/components/progress";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/toggle-group";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  attachments: number;
  comments: number;
  assignees: { initial: string; color: string }[];
}

export function KanbanColumn() {
  const [isLargeView, setIsLargeView] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "task-1",
      title: "Research recommended reading lists",
      description:
        "Look up top book recommendations in productivity, philosophy, and creativity genres.",
      priority: "medium",
      attachments: 1,
      comments: 3,
      assignees: [
        { initial: "F", color: "bg-indigo-200" },
        { initial: "J", color: "bg-yellow-200" },
      ],
    },
    {
      id: "task-2",
      title: "Summarize key ideas from 'Atomic Habits'",
      description:
        "Write down takeaways and reflections from chapters 1–5 in the book note template.",
      priority: "high",
      attachments: 2,
      comments: 6,
      assignees: [
        { initial: "A", color: "bg-green-200" },
        { initial: "S", color: "bg-pink-200" },
      ],
    },
    {
      id: "task-3",
      title: "Organize reading list by theme",
      description:
        "Group all saved books into categories like mindset, history, fiction, and biography.",
      priority: "low",
      attachments: 0,
      comments: 2,
      assignees: [{ initial: "M", color: "bg-purple-200" }],
    },
    {
      id: "task-4",
      title: "Add book highlights to Notion",
      description:
        "Transfer Kindle highlights and margin notes from 'Deep Work' into the digital notes system.",
      priority: "medium",
      attachments: 3,
      comments: 4,
      assignees: [
        { initial: "L", color: "bg-orange-200" },
        { initial: "N", color: "bg-blue-200" },
      ],
    },
    {
      id: "task-5",
      title: "Review and rate finished books",
      description:
        "Rate books you've read this quarter and write 1-line reviews for each.",
      priority: "low",
      attachments: 1,
      comments: 1,
      assignees: [
        { initial: "T", color: "bg-gray-200" },
        { initial: "Z", color: "bg-teal-200" },
      ],
    },
  ]);

  return (
    <div className="w-full h-full bg-muted/30 rounded-lg p-2 overflow-y-auto">
      {/* View switcher */}
      <div className="flex items-center justify-end mb-2">
        <ToggleGroup type="single">
          <ToggleGroupItem
            value="bold"
            aria-label="Toggle bold"
            onClick={() => setIsLargeView(false)}
          >
            <Rows4 className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="italic"
            aria-label="Toggle italic"
            onClick={() => setIsLargeView(true)}
          >
            <Rows2 className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <Reorder.Group
        axis="y"
        values={tasks}
        onReorder={setTasks}
        className="space-y-3"
      >
        {tasks.map((task) => (
          <Reorder.Item
            key={task.id}
            value={task}
            className="cursor-grab active:cursor-grabbing"
          >
            {isLargeView ? (
              <TaskCardLarge task={task} />
            ) : (
              // TODO: Implement small card view
              <TaskCardSmall task={task} />
            )}
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}

// Small Card

function TaskCardSmall({ task }: { task: Task }) {
  const priorityStyles = {
    low: {
      bg: "bg-green-50 dark:bg-green-800/10",
      text: "text-green-700 dark:text-green-300",
    },
    medium: {
      bg: "bg-amber-50 dark:bg-amber-800/10",
      text: "text-amber-700 dark:text-amber-300",
    },
    high: {
      bg: "bg-red-50 dark:bg-red-800/10",
      text: "text-red-700 dark:text-red-300",
    },
  };

  return (
    <Card className="p-3 gap-0 rounded-sm">
      <div className="p-1 space-y-2">
        {/* Title and description */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">{task.title}</h3>
          <p className="text-muted-foreground text-xs line-clamp-2">
            {task.description}
          </p>
        </div>
      </div>
    </Card>
  );
}

// Big Card
function TaskCardLarge({ task }: { task: Task }) {
  const priorityStyles = {
    low: {
      bg: "bg-green-50 dark:bg-green-800/10",
      text: "text-green-700 dark:text-green-300",
    },
    medium: {
      bg: "bg-amber-50 dark:bg-amber-800/10",
      text: "text-amber-700 dark:text-amber-300",
    },
    high: {
      bg: "bg-red-50 dark:bg-red-800/10",
      text: "text-red-700 dark:text-red-300",
    },
  };

  return (
    <Card className="p-3 gap-0 rounded-sm">
      <div className="p-1 space-y-2">
        {/* Top badges */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-primary/10 dark:bg-primary/5 text-primary px-3 py-1.5 rounded-md text-xs">
            <LayoutDashboard className="h-3 w-3" />
            <span>Dashboard</span>
          </div>

          <div
            className={`flex items-center gap-1.5 ${priorityStyles[task.priority].bg} ${priorityStyles[task.priority].text} px-3 py-1.5 rounded-md text-xs`}
          >
            <Circle className="h-3 w-3 fill-current" />
            <span className="capitalize">{task.priority}</span>
          </div>
        </div>

        {/* Title and description */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">{task.title}</h3>
          <p className="text-muted-foreground text-xs line-clamp-2">
            {task.description}
          </p>
        </div>

        {/* Divider */}
        {/* <div className="h-px bg-muted/10 dark:bg-muted/20"></div> */}
        <Progress
          value={33}
          className="h-0.5 my-3 "
          data-indicator-color="bg-red-500"
        />

        {/* Footer with assignees and stats */}
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {task.assignees.map((assignee, index) => (
              <div
                key={index}
                className={`${assignee.color} h-7 w-7 rounded-full flex items-center justify-center text-xs font-medium text-background border-2 border-background dark:border-muted/5 `}
              >
                {assignee.initial}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Paperclip className="h-3 w-3" />
              <span className="text-xs">{task.attachments}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-3 w-3" />
              <span className="text-xs">{task.comments}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
