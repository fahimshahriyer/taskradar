"use client";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { useRadar } from "../context/radar-context";

export function InformationBar() {
  const { state, tasks, timeOffset, setTimeOffset, currentTime } = useRadar();

  const handleTimeBackward = () => {
    const newOffset = timeOffset - 60; // Go back 1 hour
    setTimeOffset(newOffset);
    console.log("Time moved backward to offset:", newOffset, "minutes");
  };

  const handleTimeForward = () => {
    const newOffset = timeOffset + 60; // Go forward 1 hour
    setTimeOffset(newOffset);
    console.log("Time moved forward to offset:", newOffset, "minutes");
  };

  const handleResetTime = () => {
    setTimeOffset(0); // Reset to current time
    console.log("Time reset to current time");
  };

  const getTimeOffsetDisplay = () => {
    if (timeOffset === 0) return "Real Time";
    const hours = Math.abs(timeOffset / 60);
    const direction = timeOffset > 0 ? "ahead" : "behind";
    if (hours < 24) {
      return `${hours}h ${direction}`;
    } else {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return `${days}d ${remainingHours}h ${direction}`;
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-sm border-t border-gray-700 px-4 py-2 z-50">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <div className="text-emerald-400 font-medium">
            {currentTime.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <div className="text-gray-400 font-mono">
            {currentTime.toLocaleTimeString()}
          </div>

          {/* Time offset indicator */}
          {timeOffset !== 0 && (
            <div className="text-xs text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded border border-yellow-400/20">
              {getTimeOffsetDisplay()}
            </div>
          )}
        </div>

        {/* Time control buttons */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-gray-700/50 rounded-lg p-1">
            <button
              onClick={handleTimeBackward}
              className="p-1 text-gray-400 hover:text-gray-200 hover:bg-gray-600/50 rounded transition-colors"
              title="Go back 1 hour"
            >
              <ChevronLeft size={10} />
            </button>

            <button
              onClick={handleResetTime}
              className="p-1 text-gray-400 hover:text-emerald-400 hover:bg-gray-600/50 rounded transition-colors"
              title="Reset to current time"
              disabled={timeOffset === 0}
            >
              <RotateCcw size={10} />
            </button>

            <button
              onClick={handleTimeForward}
              className="p-1 text-gray-400 hover:text-gray-200 hover:bg-gray-600/50 rounded transition-colors"
              title="Go forward 1 hour"
            >
              <ChevronRight size={10} />
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>{tasks.length} tasks</span>
            <span>Zoom: {Math.round(state.zoom * 100)}%</span>
            <span>{state.centerLocked ? "Locked" : "Pan Mode"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
