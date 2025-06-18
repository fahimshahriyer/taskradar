"use client";

import { SidebarLeft } from "@/components/sidebar-left";
import { SidebarRight } from "@/components/sidebar-right";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@workspace/ui/components/breadcrumb";
import {
  SidebarInset,
  SidebarProvider,
} from "@workspace/ui/components/sidebar";
import RadarTaskManager from "@/components/radar/radar-task-manager";

export default function Page() {
  return (
    <SidebarProvider>
      <SidebarLeft />
      <SidebarInset className="flex flex-col bg-background">
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm px-4 py-3 border-b h-16">
          <div className="flex items-center justify-between">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Mission Control</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col p-2">
          <div className="w-full h-full">
            <RadarTaskManager />
          </div>
        </div>
      </SidebarInset>
      <SidebarRight />
    </SidebarProvider>
  );
}
