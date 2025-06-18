"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  Flag,
  Edit3,
  Trash2,
  Save,
  AlertCircle,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@workspace/ui/components/sheet";
import { useRadar } from "../context/radar-context";
import type { Task } from "../types/";

interface TaskDetailsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TaskDetailsSidebar({
  isOpen,
  onClose,
}: TaskDetailsSidebarProps) {
  const { state, tasks, updateTask, currentTime } = useRadar();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Partial<Task>>({});

  const selectedTask = tasks.find((task) => task.id === state.selectedTask);

  if (!selectedTask) return null;

  const handleEdit = () => {
    setIsEditing(true);
    setEditedTask({
      title: selectedTask.title,
      description: selectedTask.description,
      priority: selectedTask.priority,
      dueDate: selectedTask.dueDate,
    });
  };

  const handleSave = () => {
    if (editedTask.title && editedTask.title.trim()) {
      updateTask(selectedTask.id, {
        ...editedTask,
        title: editedTask.title.trim(),
      });
      setIsEditing(false);
      setEditedTask({});
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTask({});
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${selectedTask.title}"?`)) {
      // TODO: Implement delete functionality
      console.log("Delete task:", selectedTask.id);
      onClose();
    }
  };

  const formatDueDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDueTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeRemaining = () => {
    const diffTime = selectedTask.dueDate.getTime() - currentTime.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays < 0)
      return { text: "Overdue", color: "text-red-500", urgent: true };
    if (diffDays < 1) {
      const hours = Math.ceil(diffDays * 24);
      return {
        text: `${hours} hours left`,
        color: "text-orange-500",
        urgent: true,
      };
    }
    if (diffDays < 7) {
      const days = Math.ceil(diffDays);
      return {
        text: `${days} days left`,
        color: "text-yellow-500",
        urgent: false,
      };
    }
    const days = Math.ceil(diffDays);
    return {
      text: `${days} days left`,
      color: "text-green-500",
      urgent: false,
    };
  };

  const timeRemaining = getTimeRemaining();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="min-w-[400px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Task Details</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 py-6 px-4">
          {/* Task Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Title
            </label>
            {isEditing ? (
              <Input
                value={editedTask.title || ""}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, title: e.target.value })
                }
                placeholder="Task title"
                className="text-lg font-semibold"
              />
            ) : (
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {selectedTask.title}
              </h3>
            )}
          </div>

          {/* Priority and Status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Flag className="h-4 w-4 text-gray-500" />
              {isEditing ? (
                <Select
                  value={editedTask.priority || selectedTask.priority}
                  onValueChange={(value) =>
                    setEditedTask({
                      ...editedTask,
                      priority: value as Task["priority"],
                    })
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge variant={getPriorityBadgeVariant(selectedTask.priority)}>
                  {selectedTask.priority} priority
                </Badge>
              )}
            </div>

            <div className={`flex items-center gap-1 ${timeRemaining.color}`}>
              {timeRemaining.urgent && <AlertCircle className="h-4 w-4" />}
              <span className="text-sm font-medium">{timeRemaining.text}</span>
            </div>
          </div>

          <Separator />

          {/* Due Date */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Due Date
              </span>
            </div>

            {isEditing ? (
              <Input
                type="datetime-local"
                value={
                  editedTask.dueDate
                    ? new Date(
                        editedTask.dueDate.getTime() -
                          editedTask.dueDate.getTimezoneOffset() * 60000
                      )
                        .toISOString()
                        .slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  setEditedTask({
                    ...editedTask,
                    dueDate: new Date(e.target.value),
                  })
                }
              />
            ) : (
              <div className="space-y-1">
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {formatDueDate(selectedTask.dueDate)}
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span>{formatDueTime(selectedTask.dueDate)}</span>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            {isEditing ? (
              <Textarea
                value={editedTask.description || ""}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, description: e.target.value })
                }
                placeholder="Add a description..."
                rows={4}
              />
            ) : (
              <div className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                {selectedTask.description || (
                  <span className="italic text-gray-400">
                    No description provided
                  </span>
                )}
              </div>
            )}
          </div>

          <Separator />

          {/* Task Stats */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Task Information
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Created</span>
                <div className="font-medium">Today</div>
              </div>
              <div>
                <span className="text-gray-500">Status</span>
                <div className="font-medium">
                  {timeRemaining.text.includes("Overdue")
                    ? "Overdue"
                    : "Pending"}
                </div>
              </div>
              <div>
                <span className="text-gray-500">Priority</span>
                <div className="flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full ${getPriorityColor(selectedTask.priority)}`}
                  />
                  <span className="font-medium capitalize">
                    {selectedTask.priority}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-gray-500">ID</span>
                <div className="font-mono text-xs">{selectedTask.id}</div>
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="pt-2">
          {isEditing ? (
            <div className="flex gap-2 w-full">
              <Button onClick={handleSave} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex gap-2 w-full">
              <Button onClick={handleEdit} variant="outline" className="flex-1">
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Task
              </Button>
              <Button onClick={handleDelete} variant="destructive" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
