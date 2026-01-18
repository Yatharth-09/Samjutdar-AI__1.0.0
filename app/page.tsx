'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { BodyMode } from '@/components/dashboard/BodyMode';
import { TaskInput } from '@/components/dashboard/TaskInput';
import { TaskList } from '@/components/dashboard/TaskList';
import { AICoach } from '@/components/dashboard/AICoach';
import { WeeklyPlanner } from '@/components/dashboard/WeeklyPlanner';
import { getTasks, saveTasks, getCurrentMode, saveCurrentMode, getWeeklyTasks } from '@/lib/storage';
import { getDateString } from '@/lib/analytics';
import { generateCoachFeedback, selectCoachMessage } from '@/lib/ai';
import { generateDailyTasksFromWeekly } from '@/lib/weeklyTaskGenerator';
import type { Task, TasksByDate } from '@/types/task';
import type { BodyTransformationMode } from '@/types/mode';
import type { CoachFeedback } from '@/lib/ai';

export default function Dashboard() {
  const [allTasks, setAllTasks] = useState<TasksByDate>({});
  const [currentMode, setCurrentMode] = useState<BodyTransformationMode>('maintenance');
  const [coachFeedback, setCoachFeedback] = useState<CoachFeedback | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    setIsClient(true);
    const tasks = getTasks();
    const mode = getCurrentMode();
    const weeklyTasks = getWeeklyTasks();

    // Generate daily tasks from weekly templates
    const tasksWithGenerated = generateDailyTasksFromWeekly(weeklyTasks, tasks);

    // Save if new tasks were generated
    if (JSON.stringify(tasksWithGenerated) !== JSON.stringify(tasks)) {
      saveTasks(tasksWithGenerated);
    }

    setAllTasks(tasksWithGenerated);
    setCurrentMode(mode);
  }, []);

  // Update AI coach feedback when tasks change
  useEffect(() => {
    if (!isClient) return;

    const today = getDateString();
    const todaysTasks = allTasks[today] || [];
    const completed = todaysTasks.filter((t) => t.done).length;
    const total = todaysTasks.length;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    const feedback = generateCoachFeedback(
      todaysTasks,
      completionRate,
      currentMode
    );
    const selectedFeedback = selectCoachMessage(feedback);
    setCoachFeedback(selectedFeedback);
  }, [allTasks, currentMode, isClient]);

  const handleAddTask = (text: string, category: string) => {
    const today = getDateString();
    const newTask: Task = {
      id: uuidv4(),
      text,
      category: category as any,
      done: false,
      date: today,
      createdAt: Date.now(),
    };

    const updated = {
      ...allTasks,
      [today]: [...(allTasks[today] || []), newTask],
    };

    setAllTasks(updated);
    saveTasks(updated);
  };

  const handleToggleTask = (taskId: string) => {
    const today = getDateString();
    const updated = {
      ...allTasks,
      [today]: (allTasks[today] || []).map((task) =>
        task.id === taskId ? { ...task, done: !task.done } : task
      ),
    };

    setAllTasks(updated);
    saveTasks(updated);
  };

  const handleDeleteTask = (taskId: string) => {
    const today = getDateString();
    const updated = {
      ...allTasks,
      [today]: (allTasks[today] || []).filter((task) => task.id !== taskId),
    };

    setAllTasks(updated);
    saveTasks(updated);
  };

  const handleModeChange = (mode: BodyTransformationMode) => {
    setCurrentMode(mode);
    saveCurrentMode(mode);
  };

  const today = getDateString();
  const todaysTasks = allTasks[today] || [];

  return (
    <div className="space-y-8">
      {/* Mode Selector */}
      <BodyMode currentMode={currentMode} onModeChange={handleModeChange} />

      {/* Weekly Planner */}
      <WeeklyPlanner currentMode={currentMode} allTasks={allTasks} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <TaskInput onAddTask={handleAddTask} />
          <TaskList
            tasks={todaysTasks}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
          />
        </div>

        {/* Right Column - AI Coach */}
        <div>
          <AICoach feedback={coachFeedback} />
        </div>
      </div>

      {/* Analytics Section */}
    </div>
  );
}
