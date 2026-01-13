import type { Task, TasksByDate } from '@/types/task';
import type { WeeklyTask, WeeklyTasksState } from '@/types/weeklyTask';

/**
 * Get today's date in YYYY-MM-DD format (local timezone)
 */
export const getTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get the day of week for a date string (0 = Sunday, 6 = Saturday)
 */
export const getDayOfWeek = (dateString: string): number => {
  return new Date(dateString + 'T00:00:00').getDay();
};

/**
 * Generate a unique task ID for a weekly task instance
 */
const generateTaskId = (weeklyTaskId: string, date: string): string => {
  return `weekly_${weeklyTaskId}_${date}`;
};

/**
 * Generate daily tasks from active weekly tasks
 * - Only generates tasks for today
 * - Prevents duplicates by checking existing tasks
 * - Only generates if weekly task is active and today matches daysOfWeek
 * 
 * @param weeklyTasks - All weekly task templates
 * @param existingTasks - Current tasks by date
 * @returns Updated tasks by date with newly generated tasks
 */
export const generateDailyTasksFromWeekly = (
  weeklyTasks: WeeklyTasksState,
  existingTasks: TasksByDate
): TasksByDate => {
  const today = getTodayDateString();
  const todayDayOfWeek = getDayOfWeek(today);
  
  // Clone existing tasks to avoid mutation
  const updatedTasks: TasksByDate = { ...existingTasks };
  
  // Ensure today's array exists
  if (!updatedTasks[today]) {
    updatedTasks[today] = [];
  }
  
  // Get existing task IDs for today (to prevent duplicates)
  const existingTaskIds = new Set(updatedTasks[today].map(task => task.id));
  
  // Process each weekly task
  Object.values(weeklyTasks).forEach((weeklyTask) => {
    // Skip if not active
    if (!weeklyTask.active) return;
    
    // Skip if today is not in daysOfWeek
    if (!weeklyTask.daysOfWeek.includes(todayDayOfWeek)) return;
    
    // Generate task ID for this instance
    const taskId = generateTaskId(weeklyTask.id, today);
    
    // Skip if task already exists (prevent duplicates)
    if (existingTaskIds.has(taskId)) return;
    
    // Create new daily task from weekly template
    const newTask: Task = {
      id: taskId,
      text: weeklyTask.text,
      category: weeklyTask.category,
      done: false,
      date: today,
      createdAt: Date.now(),
      weeklyTaskId: weeklyTask.id,
    };
    
    // Add to today's tasks
    updatedTasks[today].push(newTask);
  });
  
  return updatedTasks;
};
