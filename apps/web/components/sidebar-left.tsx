import * as React from "react";
import {
  MessageCircleQuestion,
  Radar,
  Satellite,
  Search,
  Settings2,
  Target,
} from "lucide-react";

import { NavFavorites } from "@/components/nav-favorites";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@workspace/ui/components/sidebar";
import { NavUser } from "@/components/nav-user";

// This is sample data.
const data = {
  teams: [
    {
      name: "RadarVision Labs",
      logo: Radar, // suggest replacing with a radar icon component
      plan: "Pro",
    },
    {
      name: "OrbitWorks",
      logo: Satellite, // or a globe/tech icon
      plan: "Starter",
    },
    {
      name: "FocusNest",
      logo: Target, // or Bullseye icon for precision
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Search",
      url: "#",
      icon: Search,
    },
    {
      title: "Mission Control",
      url: "/missioncontrol",
      icon: Radar,
      isActive: true,
    },
    // {
    //   title: "Ask AI",
    //   url: "#",
    //   icon: Sparkles,
    // },
    // {
    //   title: "Calendar",
    //   url: "#",
    //   icon: Calendar,
    //   badge: "10",
    // },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
    },
    {
      title: "Help",
      url: "#",
      icon: MessageCircleQuestion,
    },
  ],
  favorites: [
    {
      name: "Radar Board: Work Projects & Deadlines",
      url: "#",
      emoji: "📌",
    },
    {
      name: "Life Admin: Errands & Personal Tasks",
      url: "#",
      emoji: "🧾",
    },
    {
      name: "Focus Zone: Health & Fitness Goals",
      url: "#",
      emoji: "🏃",
    },
    {
      name: "Radar Reads: Articles & Book Notes",
      url: "#",
      emoji: "📖",
    },
    {
      name: "Green Radar: Plant Care & Watering Schedule",
      url: "#",
      emoji: "🪴",
    },
    {
      name: "Language Radar: Vocab Practice & Milestones",
      url: "#",
      emoji: "🌍",
    },
    {
      name: "Home Tasks: Fixes, Renovation, Upkeep",
      url: "#",
      emoji: "🔧",
    },
    {
      name: "Money Radar: Bills, Budgets & Investments",
      url: "#",
      emoji: "💳",
    },
    {
      name: "Watchlist Radar: Films, Shows & Ratings",
      url: "#",
      emoji: "🎥",
    },
    {
      name: "Daily Pulse: Habits & Micro-goals",
      url: "#",
      emoji: "🧠",
    },
  ],
};

export function SidebarLeft({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
        <NavFavorites favorites={data.favorites} />
        {/* <NavWorkspaces workspaces={data.workspaces} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
