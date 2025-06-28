import { Task } from "@/components/radar/types";
import { Calendar, MessageCircle, Paperclip, User } from "lucide-react";
import { Card } from "@workspace/ui/components/card";

type Priority = 'low' | 'medium' | 'high';

const getPriorityStyles = (priority: string = 'medium') => {
  const priorityMap: Record<Priority, { bg: string; text: string }> = {
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

  const normalizedPriority = priority.toLowerCase() as Priority;
  return priorityMap[normalizedPriority] || priorityMap.medium;
};

interface TaskDetailsProps {
  task: Task;
  onBack?: () => void;
  showBackButton?: boolean;
}

export function TaskDetails({ task, onBack, showBackButton = false }: TaskDetailsProps) {
  const priorityStyle = getPriorityStyles(task.priority);

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {showBackButton && onBack && (
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back
          </button>
        )}
        
        {/* Header */}
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">{task.title}</h2>
          <div className="flex items-center gap-2">
            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityStyle.bg} ${priorityStyle.text}`}>
              {task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : 'Normal'}
            </div>
            <span className="text-sm text-muted-foreground">
              {task.id}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h3 className="font-medium">Description</h3>
          <p className="text-muted-foreground">
            {task.description || "No description provided."}
          </p>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Due Date</p>
              <p className="text-sm font-medium">
                {new Date(task.dueDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Assignees</p>
              <div className="flex -space-x-2">
                {task.assignees?.length ? task.assignees.map((assignee, index) => (
                  <div
                    key={index}
                    className={`${assignee.color} h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium text-background border-2 border-background`}
                  >
                    {assignee.initial}
                  </div>
                )) : <span className="text-sm">Unassigned</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Comments & Attachments */}
        <div className="flex items-center gap-4 pt-2">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            <span>{task.comments || 0} comments</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Paperclip className="h-4 w-4" />
            <span>{task.attachments || 0} attachments</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
