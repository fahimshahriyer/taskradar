"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { RadarState, Task } from "../types/";

interface TaskPosition {
  x: number;
  y: number;
  isUserPositioned?: boolean;
  // Store relative position for user-positioned tasks
  relativeDistance?: number; // Distance from center in unscaled units
  relativeAngle?: number; // Angle in radians
}

interface RadarContextType {
  state: RadarState;
  tasks: Task[];
  taskPositions: Record<string, TaskPosition>;
  currentTime: Date;
  timeOffset: number;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  updateTaskPosition: (taskId: string, position: TaskPosition) => void;
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  toggleCenterLock: () => void;
  setSelectedTask: (taskId: string | null) => void;
  setTimeOffset: (offset: number) => void;
  recalculatePositions: () => void;
}

const RadarContext = createContext<RadarContextType | undefined>(undefined);

type RadarAction =
  | { type: "SET_ZOOM"; payload: number }
  | { type: "SET_PAN"; payload: { x: number; y: number } }
  | { type: "TOGGLE_CENTER_LOCK" }
  | { type: "SET_SELECTED_TASK"; payload: string | null };

const radarReducer = (state: RadarState, action: RadarAction): RadarState => {
  switch (action.type) {
    case "SET_ZOOM":
      return { ...state, zoom: Math.max(0.3, Math.min(2, action.payload)) };
    case "SET_PAN":
      return state.centerLocked
        ? state
        : { ...state, panX: action.payload.x, panY: action.payload.y };
    case "TOGGLE_CENTER_LOCK":
      return {
        ...state,
        centerLocked: !state.centerLocked,
        panX: !state.centerLocked ? 0 : state.panX,
        panY: !state.centerLocked ? 0 : state.panY,
      };
    case "SET_SELECTED_TASK":
      return { ...state, selectedTask: action.payload };
    default:
      return state;
  }
};

const initialState: RadarState = {
  zoom: 0.8,
  panX: 0,
  panY: 0,
  centerLocked: true,
  selectedTask: null,
};

// Mock task data
const mockTasks: Task[] = [
  {
    id: "1",
    title: "Review quarterly reports",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    priority: "high",
    description: "Analyze Q4 performance metrics",
  },
  {
    id: "2",
    title: "Team standup meeting",
    dueDate: new Date(Date.now() + 8 * 60 * 60 * 1000),
    priority: "medium",
    description: "Daily sync with development team",
  },
  {
    id: "3",
    title: "Update project documentation",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    priority: "low",
    description: "Refresh API documentation",
  },
  {
    id: "4",
    title: "Client presentation prep",
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    priority: "high",
    description: "Prepare slides for client meeting",
  },
  {
    id: "5",
    title: "Code review",
    dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000),
    priority: "medium",
    description: "Review pull requests",
  },
  {
    id: "6",
    title: "Plan next sprint",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    priority: "medium",
    description: "Sprint planning session",
  },
];

export function RadarProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(radarReducer, initialState);
  const [tasks, setTasks] = React.useState<Task[]>(mockTasks);
  const [taskPositions, setTaskPositions] = React.useState<
    Record<string, TaskPosition>
  >({});
  const [timeOffset, setTimeOffset] = useState(0); // Time offset in minutes
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second, accounting for time offset
  useEffect(() => {
    const timeInterval = setInterval(() => {
      const now = new Date();
      const adjustedTime = new Date(now.getTime() + timeOffset * 60 * 1000);
      setCurrentTime(adjustedTime);
    }, 1000);

    return () => clearInterval(timeInterval);
  }, [timeOffset]);

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, ...updates } : task))
    );
  };

  const updateTaskPosition = (taskId: string, position: TaskPosition) => {
    setTaskPositions((prev) => ({
      ...prev,
      [taskId]: position,
    }));
  };

  const setZoom = (zoom: number) => {
    dispatch({ type: "SET_ZOOM", payload: zoom });
  };

  const setPan = (x: number, y: number) => {
    dispatch({ type: "SET_PAN", payload: { x, y } });
  };

  const toggleCenterLock = () => {
    dispatch({ type: "TOGGLE_CENTER_LOCK" });
  };

  const setSelectedTask = (taskId: string | null) => {
    dispatch({ type: "SET_SELECTED_TASK", payload: taskId });
  };

  // Function to trigger position recalculation
  const recalculatePositions = useCallback(() => {
    console.log(
      "Recalculating positions for time:",
      currentTime.toLocaleString()
    );

    // This will be called by the canvas component when needed
    // We expose this function so the canvas can trigger updates
  }, [currentTime]);

  return (
    <RadarContext.Provider
      value={{
        state,
        tasks,
        taskPositions,
        currentTime,
        timeOffset,
        updateTask,
        updateTaskPosition,
        setZoom,
        setPan,
        toggleCenterLock,
        setSelectedTask,
        setTimeOffset,
        recalculatePositions,
      }}
    >
      {children}
    </RadarContext.Provider>
  );
}

export function useRadar() {
  const context = useContext(RadarContext);
  if (context === undefined) {
    throw new Error("useRadar must be used within a RadarProvider");
  }
  return context;
}
