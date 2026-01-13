import { useState, useEffect, useCallback } from 'react';
import type { WeeklyTask, WeeklyTasksState, WeeklyWorkoutPlan } from '@/types/weeklyTask';
import type { TaskCategory } from '@/types/task';
import type { BodyTransformationMode } from '@/types/mode';
import { getWeeklyTasks, saveWeeklyTasks } from '@/lib/storage';
import { getSuggestedWeeklyPlan, hasWeekChanged } from '@/lib/ai';
import type { AnalyticsState } from '@/types/analytics';
import { STORAGE_KEYS } from '@/lib/constants';

export const useWeeklyTasks = () => {
  const [weeklyTasks, setWeeklyTasks] = useState<WeeklyTasksState>({});
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyWorkoutPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load weekly tasks from localStorage on mount
  useEffect(() => {
    const stored = getWeeklyTasks();
    setWeeklyTasks(stored);
    
    // Load weekly plan if exists
    const storedPlan = localStorage.getItem(STORAGE_KEYS.WEEKLY_PLAN);
    if (storedPlan) {
      try {
        setWeeklyPlan(JSON.parse(storedPlan));
      } catch (e) {
        console.error('Failed to parse weekly plan:', e);
      }
    }
    
    setIsLoading(false);
  }, []);

  // Save to localStorage whenever weekly tasks change
  useEffect(() => {
    if (!isLoading) {
      saveWeeklyTasks(weeklyTasks);
    }
  }, [weeklyTasks, isLoading]);

  /**
   * Generate AI-suggested weekly plan based on mode and analytics
   * Only regenerates if a new week has started
   */
  const generateWeeklyPlan = useCallback(
    (mode: BodyTransformationMode, analytics: AnalyticsState | null): WeeklyWorkoutPlan => {
      // Check if plan already exists and week hasn't changed
      if (weeklyPlan && !hasWeekChanged(weeklyPlan.weekStartDate)) {
        return weeklyPlan;
      }

      // Generate new plan
      const newPlan = getSuggestedWeeklyPlan(mode, analytics);

      // Save to localStorage
      localStorage.setItem(STORAGE_KEYS.WEEKLY_PLAN, JSON.stringify(newPlan));
      setWeeklyPlan(newPlan);

      return newPlan;
    },
    [weeklyPlan]
  );

  /**
   * Add AI-suggested workouts as weekly tasks
   * Does NOT overwrite user-created tasks
   */
  const applySuggestedPlan = useCallback(
    (plan: WeeklyWorkoutPlan): void => {
      const newTasks: WeeklyTasksState = {};

      plan.workouts.forEach((workout) => {
        const id = `wt_${workout.id}`;

        // Only add if not already exists (preserve user tasks)
        if (!weeklyTasks[id]) {
          const newTask: WeeklyTask = {
            id,
            text: workout.title,
            category: workout.category,
            daysOfWeek: [workout.dayOfWeek],
            active: true,
            createdAt: Date.now(),
            isSuggested: true,
          };

          newTasks[id] = newTask;
        }
      });

      // Merge with existing tasks
      setWeeklyTasks((prev) => ({
        ...prev,
        ...newTasks,
      }));
    },
    [weeklyTasks]
  );

  /**
   * Clear all suggested workouts for the week
   */
  const clearSuggestedPlan = useCallback((): void => {
    setWeeklyTasks((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((key) => {
        if (updated[key].isSuggested) {
          delete updated[key];
        }
      });
      return updated;
    });

    // Clear from localStorage
    localStorage.removeItem(STORAGE_KEYS.WEEKLY_PLAN);
    setWeeklyPlan(null);
  }, []);

  /**
   * Convert AI suggested task to user-created task
   * (removes suggestion marker)
   */
  const acceptSuggestion = useCallback((id: string): void => {
    updateWeeklyTask(id, { isSuggested: false });
  }, []);

  /**
   * Add a new weekly task (user-created, not suggested)
   */
  const addWeeklyTask = (
    text: string,
    category: TaskCategory,
    daysOfWeek: number[]
  ): void => {
    const newTask: WeeklyTask = {
      id: `wt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text,
      category,
      daysOfWeek,
      active: true,
      createdAt: Date.now(),
      isSuggested: false,
    };

    setWeeklyTasks((prev) => ({
      ...prev,
      [newTask.id]: newTask,
    }));
  };

  /**
   * Update an existing weekly task
   */
  const updateWeeklyTask = (id: string, updates: Partial<WeeklyTask>): void => {
    setWeeklyTasks((prev) => {
      if (!prev[id]) return prev;

      return {
        ...prev,
        [id]: {
          ...prev[id],
          ...updates,
        },
      };
    });
  };

  /**
   * Toggle active status of a weekly task
   */
  const toggleWeeklyTaskActive = (id: string): void => {
    setWeeklyTasks((prev) => {
      if (!prev[id]) return prev;

      return {
        ...prev,
        [id]: {
          ...prev[id],
          active: !prev[id].active,
        },
      };
    });
  };

  /**
   * Delete a weekly task
   * Note: This does NOT delete past generated daily tasks
   */
  const deleteWeeklyTask = (id: string): void => {
    setWeeklyTasks((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  /**
   * Get all weekly tasks as an array
   */
  const getWeeklyTasksArray = (): WeeklyTask[] => {
    return Object.values(weeklyTasks);
  };

  /**
   * Get active weekly tasks only
   */
  const getActiveWeeklyTasks = (): WeeklyTask[] => {
    return Object.values(weeklyTasks).filter((task) => task.active);
  };

  /**
   * Get suggested tasks only
   */
  const getSuggestedTasks = (): WeeklyTask[] => {
    return Object.values(weeklyTasks).filter((task) => task.isSuggested);
  };

  /**
   * Get user-created (non-suggested) tasks
   */
  const getUserCreatedTasks = (): WeeklyTask[] => {
    return Object.values(weeklyTasks).filter((task) => !task.isSuggested);
  };

  return {
    weeklyTasks,
    weeklyPlan,
    isLoading,
    addWeeklyTask,
    updateWeeklyTask,
    toggleWeeklyTaskActive,
    deleteWeeklyTask,
    getWeeklyTasksArray,
    getActiveWeeklyTasks,
    generateWeeklyPlan,
    applySuggestedPlan,
    clearSuggestedPlan,
    acceptSuggestion,
    getSuggestedTasks,
    getUserCreatedTasks,
  };
};
