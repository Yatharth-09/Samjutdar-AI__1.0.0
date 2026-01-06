'use client';

import React from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/lib/constants';
import type { Task } from '@/types/task';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleTask,
  onDeleteTask,
}) => {
  if (tasks.length === 0) {
    return (
      <Card>
        <CardBody className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No tasks yet. Create one to get started!
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Today's Tasks ({tasks.length})
        </h2>
      </CardHeader>
      <CardBody>
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                task.done
                  ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => onToggleTask(task.id)}
                  className="w-5 h-5 rounded cursor-pointer"
                />
                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      task.done
                        ? 'text-gray-500 dark:text-gray-400 line-through'
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    {task.text}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {CATEGORY_LABELS[task.category]}
                  </p>
                </div>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDeleteTask(task.id)}
                className="ml-2"
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};
