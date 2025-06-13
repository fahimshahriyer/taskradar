"use client";
import { useState, useEffect } from "react";
import { Circle, GripVertical } from "lucide-react";

interface Task {
  id: string;
  title: string;
  dueDate: Date;
  priority: "low" | "medium" | "high";
  status: "todo" | "in-progress" | "done";
}

export function Radar() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [now, setNow] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Sample tasks
  useEffect(() => {
    setTasks([
      {
        id: "1",
        title: "Project Planning",
        dueDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        priority: "medium",
        status: "todo",
      },
      {
        id: "2",
        title: "UI Design",
        dueDate: new Date(now.getTime() + 48 * 60 * 60 * 1000), // 48 hours from now
        priority: "high",
        status: "in-progress",
      },
      {
        id: "3",
        title: "Code Review",
        dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        priority: "low",
        status: "todo",
      },
      {
        id: "4",
        id: "5",
        title: "Bug Fixing",
        dueDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        priority: "high",
        status: "in-progress",
      },
    ]);
  }, [now]);

  // Calculate task positions
  const calculatePosition = (task: Task) => {
    const timeDiff = task.dueDate.getTime() - now.getTime();
    const maxRadius = 200; // Maximum radius in pixels
    const maxTimeDiff = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    const angle = (Math.random() * 2 * Math.PI).toFixed(2); // Random angle between 0 and 2π
    const radius = (timeDiff / maxTimeDiff) * maxRadius;

    return {
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle),
      angle,
    };
  };

  return (
    <div className="relative w-full h-[600px] mx-auto my-auto max-w-3xl">
      <div className="absolute inset-0">
        {[100, 200, 300, 400].map((radius) => (
          <div
            key={radius}
            className="absolute inset-0"
            style={{
              width: `${radius * 2}px`,
              height: `${radius * 2}px`,
              borderRadius: `${radius}px`,
              border: "1px dashed rgba(255, 255, 255, 0.1)",
              transform: "translate(-50%, -50%)",
              top: "50%",
              left: "50%",
            }}
          />
        ))}
      </div>

      {/* Tasks */}
      <div className="absolute inset-0">
        {tasks.map((task) => {
          const { x, y } = calculatePosition(task);
          return (
            <div
              key={task.id}
              className="absolute cursor-pointer"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="flex items-center gap-1 bg-background/50 rounded-lg p-2 hover:bg-background/70 transition-colors">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium line-clamp-1">
                    {task.title}
                  </span>
                  <div className="flex items-center gap-1">
                    <Circle className="h-2 w-2" />
                    <span className="text-xs text-muted-foreground">
                      {Math.round(
                        (task.dueDate.getTime() - now.getTime()) /
                          (24 * 60 * 60 * 1000)
                      )}{" "}
                      days
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-primary" />
          </div>
          <span className="text-sm text-muted-foreground">Now</span>
        </div>
      </div>
    </div>
  );
}
