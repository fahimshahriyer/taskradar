"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@workspace/ui/components/sidebar";
import { Button } from "@workspace/ui/components/button";
import { Grid } from "lucide-react";
import { ColumnSwitcher } from "./column-switcher";
import { KanbanColumn } from "./kanban-column";

// This is sample data.
const data = {
  columns: [
    {
      id: "todo",
      title: "To Do",
      color: "#FF6B6B", // Red
      tasks: [
        {
          id: "task-1",
          title: "Design new feature",
          description: "Create wireframes and mockups for the new feature",
          priority: "high" as const,
          labels: ["design", "ui/ux"],
        },
        {
          id: "task-2",
          title: "Update documentation",
          description: "Update API documentation and user guides",
          priority: "medium" as const,
          labels: ["documentation"],
        },
      ],
    },
    {
      id: "in-progress",
      title: "In Progress",
      color: "#4ECDC4", // Teal
      tasks: [
        {
          id: "task-3",
          title: "Implement feature",
          description: "Code the new feature based on design specs",
          priority: "high" as const,
          labels: ["development"],
        },
      ],
    },
    {
      id: "done",
      title: "Done",
      color: "#8E44AD", // Purple
      tasks: [],
    },
  ],
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  calendars: [
    {
      name: "My Calendars",
      items: ["Personal", "Work", "Family"],
    },
    {
      name: "Favorites",
      items: ["Holidays", "Birthdays"],
    },
    {
      name: "Other",
      items: ["Travel", "Reminders", "Deadlines"],
    },
  ],
};

export function SidebarRight() {
  return (
    <Sidebar
      collapsible="none"
      className="sticky top-0 hidden h-svh border-l lg:flex w-[400px]"
    >
      <SidebarHeader className="border-sidebar-border h-16 border-b">
        <ColumnSwitcher columns={data.columns} defaultColumn="todo" />
      </SidebarHeader>
      <SidebarContent>
        <KanbanColumn />
      </SidebarContent>
      <SidebarFooter>
        <Button className="w-full h-12 text-lg font-semibold cursor-pointer" variant="outline">
          <Grid className="mr-2 h-5 w-5" />
          Go to Board
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
