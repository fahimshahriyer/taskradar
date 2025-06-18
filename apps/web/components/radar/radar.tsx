'use client';

import { useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Task } from './types';

// Dynamically import the radar-2 component with no SSR
const RadarComponent = dynamic(() => import('./radar-2'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  ),
});

interface RadarProps {
  tasks: Task[];
  onTaskUpdate: (updatedTask: Task) => void;
}

export function Radar({ tasks, onTaskUpdate }: RadarProps) {
  const handleTaskUpdate = useCallback((taskId: string, newDueDate: Date) => {
    const updatedTask = tasks.find(task => task.id === taskId);
    if (updatedTask) {
      onTaskUpdate({ ...updatedTask, dueDate: newDueDate });
    }
  }, [tasks, onTaskUpdate]);

  return (
    <div className="w-full h-full">
      <RadarComponent 
        tasks={tasks} 
        onTaskUpdate={handleTaskUpdate} 
      />
    </div>
  );
}
