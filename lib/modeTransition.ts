import type { WeeklyTask, WeeklyTasksState } from '@/types/weeklyTask';
import type { BodyTransformationMode } from '@/types/mode';
import { getWorkoutTemplates } from './workoutTemplates';

/**
 * Handle mode transition:
 * 1. Auto-pause weekly tasks from the previous mode
 * 2. Generate new weekly tasks for the new mode
 * 3. Return updated weekly tasks state
 */
export const handleModeTransition = (
  newMode: BodyTransformationMode,
  existingWeeklyTasks: WeeklyTasksState
): {
  updatedWeeklyTasks: WeeklyTasksState;
  newTaskCount: number;
  pausedTaskCount: number;
} => {
  let pausedCount = 0;
  let newCount = 0;

  // Step 1: Auto-pause existing mode-specific workouts (tasks that start with mode prefix)
  const updatedTasks: WeeklyTasksState = { ...existingWeeklyTasks };
  
  Object.keys(updatedTasks).forEach((taskId) => {
    const task = updatedTasks[taskId];
    
    // Check if task name starts with a mode prefix like [Fat Loss], [Muscle], [Maintenance]
    const isModeSpecific = 
      task.text.startsWith('[Fat Loss]') ||
      task.text.startsWith('[Muscle]') ||
      task.text.startsWith('[Maintenance]');
    
    // Auto-pause if it's a mode-specific task and currently active
    if (isModeSpecific && task.active) {
      updatedTasks[taskId] = {
        ...task,
        active: false,
      };
      pausedCount++;
    }
  });

  // Step 2: Generate new weekly tasks for the new mode
  const workoutTemplates = getWorkoutTemplates(newMode);
  
  workoutTemplates.forEach(({ dayOfWeek, template }) => {
    // Check if a similar task already exists
    const existingTask = Object.values(updatedTasks).find(
      (task) => task.text === template.name && task.daysOfWeek.includes(dayOfWeek)
    );

    if (existingTask) {
      // If it exists but is paused, reactivate it
      if (!existingTask.active) {
        updatedTasks[existingTask.id] = {
          ...existingTask,
          active: true,
        };
      }
    } else {
      // Create new weekly task
      const newTaskId = `wt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newTask: WeeklyTask = {
        id: newTaskId,
        text: template.name,
        category: template.category,
        daysOfWeek: [dayOfWeek],
        active: true,
        createdAt: Date.now(),
      };

      updatedTasks[newTaskId] = newTask;
      newCount++;
    }
  });

  return {
    updatedWeeklyTasks: updatedTasks,
    newTaskCount: newCount,
    pausedTaskCount: pausedCount,
  };
};

/**
 * Check if user has any active mode-specific workouts
 */
export const hasActiveModeWorkouts = (weeklyTasks: WeeklyTasksState): boolean => {
  return Object.values(weeklyTasks).some((task) => {
    const isModeSpecific = 
      task.text.startsWith('[Fat Loss]') ||
      task.text.startsWith('[Muscle]') ||
      task.text.startsWith('[Maintenance]');
    
    return isModeSpecific && task.active;
  });
};
