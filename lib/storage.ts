import { STORAGE_KEYS } from './constants';
import type { Task, TasksByDate } from '@/types/task';
import type { BodyTransformationMode } from '@/types/mode';
import type { AnalyticsState } from '@/types/analytics';
import type { WeeklyTasksState } from '@/types/weeklyTask';
import type { WeeklyPlan } from '@/types/weeklyPlan';

/**
 * Client-side localStorage abstraction
 * Designed to be swappable with Firebase/backend later
 */

// Tasks
export const saveTasks = (tasks: TasksByDate): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }
};

export const getTasks = (): TasksByDate => {
  if (typeof window === 'undefined') return {};
  const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
  return stored ? JSON.parse(stored) : {};
};

// Body Mode
export const saveCurrentMode = (mode: BodyTransformationMode): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.CURRENT_MODE, mode);
  }
};

export const getCurrentMode = (): BodyTransformationMode => {
  if (typeof window === 'undefined') return 'maintenance';
  return (
    (localStorage.getItem(STORAGE_KEYS.CURRENT_MODE) as BodyTransformationMode) ||
    'maintenance'
  );
};

// Dark Mode
export const saveDarkMode = (isDark: boolean): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(isDark));
  }
};

export const getDarkMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
  return stored ? JSON.parse(stored) : false;
};

// Analytics
export const saveAnalytics = (analytics: AnalyticsState): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(analytics));
  }
};

export const getAnalytics = (): AnalyticsState | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
  return stored ? JSON.parse(stored) : null;
};

// Weekly Tasks
export const saveWeeklyTasks = (weeklyTasks: WeeklyTasksState): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.WEEKLY_TASKS, JSON.stringify(weeklyTasks));
  }
};

export const getWeeklyTasks = (): WeeklyTasksState => {
  if (typeof window === 'undefined') return {};
  const stored = localStorage.getItem(STORAGE_KEYS.WEEKLY_TASKS);
  return stored ? JSON.parse(stored) : {};
};

// Clear all data (for testing/reset)
export const clearAllData = (): void => {
  if (typeof window !== 'undefined') {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  }
};

// Saved Weekly Plans
export const saveWeeklyPlans = (plans: WeeklyPlan[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.SAVED_WEEKLY_PLANS, JSON.stringify(plans));
  }
};

export const getWeeklyPlans = (): WeeklyPlan[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEYS.SAVED_WEEKLY_PLANS);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};
