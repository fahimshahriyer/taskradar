"use client"

import React, { createContext, useContext, useReducer, type ReactNode } from "react"
import type { RadarState, Task } from "../types/radar"

interface RadarContextType {
  state: RadarState
  tasks: Task[]
  updateTask: (taskId: string, updates: Partial<Task>) => void
  setZoom: (zoom: number) => void
  setPan: (x: number, y: number) => void
  toggleCenterLock: () => void
  setSelectedTask: (taskId: string | null) => void
}

const RadarContext = createContext<RadarContextType | undefined>(undefined)

type RadarAction =
  | { type: "SET_ZOOM"; payload: number }
  | { type: "SET_PAN"; payload: { x: number; y: number } }
  | { type: "TOGGLE_CENTER_LOCK" }
  | { type: "SET_SELECTED_TASK"; payload: string | null }

const radarReducer = (state: RadarState, action: RadarAction): RadarState => {
  switch (action.type) {
    case "SET_ZOOM":
      return { ...state, zoom: Math.max(0.5, Math.min(3, action.payload)) }
    case "SET_PAN":
      return { ...state, panX: action.payload.x, panY: action.payload.y }
    case "TOGGLE_CENTER_LOCK":
      return { ...state, centerLocked: !state.centerLocked, panX: 0, panY: 0 }
    case "SET_SELECTED_TASK":
      return { ...state, selectedTask: action.payload }
    default:
      return state
  }
}

const initialState: RadarState = {
  zoom: 1,
  panX: 0,
  panY: 0,
  centerLocked: true,
  selectedTask: null,
}

// Mock task data
const mockTasks: Task[] = [
  {
    id: "1",
    title: "Review quarterly reports",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
    priority: "high",
    description: "Analyze Q4 performance metrics",
  },
  {
    id: "2",
    title: "Team standup meeting",
    dueDate: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours
    priority: "medium",
    description: "Daily sync with development team",
  },
  {
    id: "3",
    title: "Update project documentation",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
    priority: "low",
    description: "Refresh API documentation",
  },
  {
    id: "4",
    title: "Client presentation prep",
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day
    priority: "high",
    description: "Prepare slides for client meeting",
  },
  {
    id: "5",
    title: "Code review",
    dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours
    priority: "medium",
    description: "Review pull requests",
  },
  {
    id: "6",
    title: "Plan next sprint",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
    priority: "medium",
    description: "Sprint planning session",
  },
]

export function RadarProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(radarReducer, initialState)
  const [tasks, setTasks] = React.useState<Task[]>(mockTasks)

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, ...updates } : task)))
  }

  const setZoom = (zoom: number) => {
    dispatch({ type: "SET_ZOOM", payload: zoom })
  }

  const setPan = (x: number, y: number) => {
    dispatch({ type: "SET_PAN", payload: { x, y } })
  }

  const toggleCenterLock = () => {
    dispatch({ type: "TOGGLE_CENTER_LOCK" })
  }

  const setSelectedTask = (taskId: string | null) => {
    dispatch({ type: "SET_SELECTED_TASK", payload: taskId })
  }

  return (
    <RadarContext.Provider
      value={{
        state,
        tasks,
        updateTask,
        setZoom,
        setPan,
        toggleCenterLock,
        setSelectedTask,
      }}
    >
      {children}
    </RadarContext.Provider>
  )
}

export function useRadar() {
  const context = useContext(RadarContext)
  if (context === undefined) {
    throw new Error("useRadar must be used within a RadarProvider")
  }
  return context
}
