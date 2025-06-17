"use client";

import * as React from "react";
import {
  AudioWaveform,
  Blocks,
  Calendar,
  Command,
  Home,
  Inbox,
  MessageCircleQuestion,
  Radar,
  Satellite,
  Search,
  Settings2,
  Sparkles,
  Target,
  Trash2,
} from "lucide-react";

import { NavFavorites } from "@/components/nav-favorites";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavWorkspaces } from "@/components/nav-workspaces";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@workspace/ui/components/sidebar";

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
    {
      title: "Ask AI",
      url: "#",
      icon: Sparkles,
    },
    {
      title: "Calendar",
      url: "#",
      icon: Calendar,
      badge: "10",
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
    },
    {
      title: "Templates",
      url: "#",
      icon: Blocks,
    },
    {
      title: "Trash",
      url: "#",
      icon: Trash2,
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
  workspaces: [
    {
      name: "Personal Life Management",
      emoji: "🏠",
      pages: [
        {
          name: "Daily Journal & Reflection",
          url: "#",
          emoji: "📔",
        },
        {
          name: "Health & Wellness Tracker",
          url: "#",
          emoji: "🍏",
        },
        {
          name: "Personal Growth & Learning Goals",
          url: "#",
          emoji: "🌟",
        },
      ],
    },
    {
      name: "Professional Development",
      emoji: "💼",
      pages: [
        {
          name: "Career Objectives & Milestones",
          url: "#",
          emoji: "🎯",
        },
        {
          name: "Skill Acquisition & Training Log",
          url: "#",
          emoji: "🧠",
        },
        {
          name: "Networking Contacts & Events",
          url: "#",
          emoji: "🤝",
        },
      ],
    },
    {
      name: "Creative Projects",
      emoji: "🎨",
      pages: [
        {
          name: "Writing Ideas & Story Outlines",
          url: "#",
          emoji: "✍️",
        },
        {
          name: "Art & Design Portfolio",
          url: "#",
          emoji: "🖼️",
        },
        {
          name: "Music Composition & Practice Log",
          url: "#",
          emoji: "🎵",
        },
      ],
    },
    {
      name: "Home Management",
      emoji: "🏡",
      pages: [
        {
          name: "Household Budget & Expense Tracking",
          url: "#",
          emoji: "💰",
        },
        {
          name: "Home Maintenance Schedule & Tasks",
          url: "#",
          emoji: "🔧",
        },
        {
          name: "Family Calendar & Event Planning",
          url: "#",
          emoji: "📅",
        },
      ],
    },
    {
      name: "Travel & Adventure",
      emoji: "🧳",
      pages: [
        {
          name: "Trip Planning & Itineraries",
          url: "#",
          emoji: "🗺️",
        },
        {
          name: "Travel Bucket List & Inspiration",
          url: "#",
          emoji: "🌎",
        },
        {
          name: "Travel Journal & Photo Gallery",
          url: "#",
          emoji: "📸",
        },
      ],
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
    </Sidebar>
  );
}
