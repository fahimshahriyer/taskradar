"use client";
import { Circle } from "lucide-react";

export function TaskLegend() {
  const priorities = [
    { level: "high", color: "#ef4444", label: "High Priority" },
    { level: "medium", color: "#f59e0b", label: "Medium Priority" },
    { level: "low", color: "#10b981", label: "Low Priority" },
  ];

  return (
    <div className="absolute bottom-12 left-4 bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-lg shadow-xl p-2 z-50">
      <h3 className="text-sm font-medium text-gray-200 mb-2">
        Priority Legend
      </h3>
      <div className="space-y-1">
        {priorities.map((priority) => (
          <div key={priority.level} className="flex items-center gap-2">
            <Circle
              className="w-3 h-3"
              fill={priority.color}
              stroke={priority.color}
            />
            <span className="text-xs text-gray-400">{priority.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
