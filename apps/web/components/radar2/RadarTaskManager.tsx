import React, { useState } from 'react';
import { RadarContext } from './context/RadarContext';
import RadarCanvas from './components/RadarCanvas';
import { mockTasks } from './data/mockData';
import { Task } from './types';

interface RadarTaskManagerProps {
  tasks?: Task[];
  onTaskUpdate?: (taskId: string, newDueDate: Date) => void;
}

const RadarTaskManager: React.FC<RadarTaskManagerProps> = ({
  tasks: propTasks,
  onTaskUpdate,
}) => {
  const [internalTasks, setInternalTasks] = useState<Task[]>(
    propTasks || mockTasks
  );
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [centerLocked, setCenterLocked] = useState(true);

  const setPan = (x: number, y: number) => {
    setPanX(x);
    setPanY(y);
  };

  const updateTaskDueDate = (taskId: string, newDueDate: Date) => {
    setInternalTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, dueDate: newDueDate } : task
      )
    );
    if (onTaskUpdate) {
      onTaskUpdate(taskId, newDueDate);
    }
  };

  const contextValue = {
    zoom,
    panX,
    panY,
    centerLocked,
    setZoom,
    setPan,
    setCenterLocked,
    updateTaskDueDate,
  };

  return (
    <RadarContext.Provider value={contextValue}>
      <div className="w-full h-full bg-gray-900">
        <div className="h-full">
          <RadarCanvas tasks={internalTasks} />
        </div>
      </div>
    </RadarContext.Provider>
  );
};

export default RadarTaskManager;
