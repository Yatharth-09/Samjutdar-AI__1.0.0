import type { TaskCategory } from './task';

export interface DailyMetrics {
  date: string; // YYYY-MM-DD
  tasksCompleted: number;
  tasksTotal: number;
  completionRate: number; // 0-100
  categoryBreakdown: Record<TaskCategory, number>;
}

export interface WeeklyAnalytics {
  weekStart: string; // YYYY-MM-DD
  weekEnd: string; // YYYY-MM-DD
  dailyMetrics: DailyMetrics[];
  overallCompletionRate: number; // 0-100
  bestDay: string; // YYYY-MM-DD
  worstDay: string; // YYYY-MM-DD
  averageDaily: number; // avg completion rate
  streak: number; // consecutive days of 100% completion
}

export interface RecoveryMetrics {
  score: number; // 0-100
  lastRestDay: string | null; // YYYY-MM-DD or null
  workoutFrequency: number; // avg workouts per week
  recoveryTasksCompleted: number;
  recommendation: string;
}

export interface AnalyticsState {
  weekly: WeeklyAnalytics | null;
  recovery: RecoveryMetrics | null;
  lastUpdated: number; // timestamp
}
