"use client";

import * as React from "react";
import { Check, ChevronsUpDown, LayoutList } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar";

export function ColumnSwitcher({
  columns,
  defaultColumn,
}: {
  columns: { id: string; title: string; icon?: React.ReactNode }[];
  defaultColumn: string;
}) {
  const [selectedColumn, setSelectedColumn] = React.useState(defaultColumn);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"></div>
              <div className="flex leading-none">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold mr-2">
                    {columns.find((c) => c.id === selectedColumn)?.title}
                  </h3>
                  <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium">
                    5
                  </span>
                </div>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[400px]" align="start">
            {columns.map((column) => (
              <DropdownMenuItem
                key={column.id}
                onClick={() => setSelectedColumn(column.id)}
                className={
                  selectedColumn === column.id ? "bg-sidebar-accent" : ""
                }
              >
                {selectedColumn === column.id && (
                  <Check className="mr-2 h-4 w-4" />
                )}
                {column.icon && (
                  <div className="mr-2 h-4 w-4">{column.icon}</div>
                )}
                {column.title}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
