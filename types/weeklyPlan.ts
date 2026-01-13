import type { TaskCategory } from './task';

export interface WeeklyPlanItem {
  text: string;
  category: TaskCategory;
}

export interface WeeklyPlan {
  id: string;
  name: string;
  /**
   * Snapshot of tasks for each day of week.
   * Keys are 0-6 (0=Sun).
   */
  days: Record<number, WeeklyPlanItem[]>;
  createdAt: number;
  updatedAt: number;
}
