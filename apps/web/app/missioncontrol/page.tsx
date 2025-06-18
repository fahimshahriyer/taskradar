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
import dynamic from "next/dynamic";

// Dynamically import the radar2 component with no SSR
const Radar = dynamic(() => import("@/components/radar2"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  ),
});

export default function Page() {
  return (
    <SidebarProvider>
      <SidebarLeft />
      <SidebarInset className="flex flex-col bg-background">
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm px-4 py-3 border-b">
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
        <div className="flex flex-1 flex-col p-4">
          <div className="w-full h-full">
            <Radar />
          </div>
        </div>
      </SidebarInset>
      <SidebarRight />
    </SidebarProvider>
  );
}
