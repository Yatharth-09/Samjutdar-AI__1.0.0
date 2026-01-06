'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { TASK_CATEGORIES, CATEGORY_LABELS } from '@/lib/constants';
import type { TaskCategory } from '@/types/task';

interface TaskInputProps {
  onAddTask: (text: string, category: TaskCategory) => void;
  isLoading?: boolean;
}

export const TaskInput: React.FC<TaskInputProps> = ({
  onAddTask,
  isLoading = false,
}) => {
  const [taskText, setTaskText] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Workout');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskText.trim()) {
      onAddTask(taskText.trim(), category);
      setTaskText('');
      setCategory('Workout');
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Add New Task
        </h2>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Task Description"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            placeholder="e.g., Complete morning workout"
            disabled={isLoading}
          />

          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value as TaskCategory)}
            options={TASK_CATEGORIES.map((cat) => ({
              value: cat,
              label: CATEGORY_LABELS[cat],
            }))}
            disabled={isLoading}
          />

          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={!taskText.trim() || isLoading}
            className="w-full"
          >
            Add Task
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};
