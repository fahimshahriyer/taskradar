"use client";

import React from "react";

interface RadarControlsProps {
  viewMode: 'time' | 'priority' | 'status';
  showLabels: boolean;
  showGrid: boolean;
  onViewModeChange: (mode: 'time' | 'priority' | 'status') => void;
  onShowLabelsChange: (show: boolean) => void;
  onShowGridChange: (show: boolean) => void;
}

export function RadarControls({
  viewMode,
  showLabels,
  showGrid,
  onViewModeChange,
  onShowLabelsChange,
  onShowGridChange,
}: RadarControlsProps) {
  return (
    <div className="absolute bottom-4 right-4 z-10 bg-background/95 backdrop-blur-sm rounded-lg p-4 border border-muted/20">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2">View Mode</label>
            <select
              value={viewMode}
              onChange={(e) => onViewModeChange(e.target.value as 'time' | 'priority' | 'status')}
              className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="time">Time-based</option>
              <option value="priority">Priority-based</option>
              <option value="status">Status-based</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm">
              <input
                type="checkbox"
                checked={showLabels}
                onChange={(e) => onShowLabelsChange(e.target.checked)}
                className="mr-2"
              />
              Show Labels
            </label>
            <label className="text-sm">
              <input
                type="checkbox"
                checked={showGrid}
                onChange={(e) => onShowGridChange(e.target.checked)}
                className="mr-2"
              />
              Show Grid
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
