import type { Task } from "../types";

export const sampleTasks: Task[] = [
  {
    id: "1",
    title: "Review quarterly reports",
    dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    priority: "high",
    description: "Review Q4 financial reports and prepare summary",
  },
  {
    id: "2",
    title: "Team standup meeting",
    dueDate: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
    priority: "medium",
    description: "Daily team standup at 9 AM",
  },
  {
    id: "3",
    title: "Update project documentation",
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    priority: "low",
    description: "Update README and API documentation",
  },
  {
    id: "4",
    title: "Client presentation prep",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
    priority: "high",
    description: "Prepare slides for client presentation",
  },
  {
    id: "5",
    title: "Code review for feature X",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    priority: "medium",
    description: "Review pull request for new authentication feature",
  },
  {
    id: "6",
    title: "Plan team building event",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    priority: "low",
    description: "Organize team building activities for next month",
  },
  {
    id: "7",
    title: "Database migration",
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
    priority: "high",
    description: "Migrate user data to new database schema",
  },
  {
    id: "8",
    title: "Performance optimization",
    dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 3 weeks from now
    priority: "medium",
    description: "Optimize API response times and database queries",
  },
];
