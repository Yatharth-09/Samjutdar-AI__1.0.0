import type {
  DailyMetrics,
  WeeklyAnalytics,
  RecoveryMetrics,
} from '@/types/analytics';
import type { Task, TasksByDate } from '@/types/task';

/**
 * Analytics calculation logic
 * Pure functions that compute metrics from task data
 * Business logic lives here, NOT in components
 */

export const getDateString = (date: Date = new Date()): string => {
  return date.toISOString().split('T')[0];
};

export const getWeekStart = (date: Date = new Date()): string => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust for Sunday
  const weekStart = new Date(d.setDate(diff));
  return getDateString(weekStart);
};

export const getWeekEnd = (date: Date = new Date()): string => {
  const start = new Date(getWeekStart(date));
  const end = new Date(start.setDate(start.getDate() + 6));
  return getDateString(end);
};

export const getDailyMetrics = (tasks: Task[]): DailyMetrics | null => {
  if (tasks.length === 0) {
    return null;
  }

  const completed = tasks.filter((t) => t.done).length;
  const total = tasks.length;
  const completionRate = (completed / total) * 100;

  const categoryBreakdown: Record<string, number> = {};
  tasks.forEach((task) => {
    categoryBreakdown[task.category] =
      (categoryBreakdown[task.category] || 0) + (task.done ? 1 : 0);
  });

  return {
    date: tasks[0]?.date || getDateString(),
    tasksCompleted: completed,
    tasksTotal: total,
    completionRate: Math.round(completionRate),
    categoryBreakdown: categoryBreakdown as Record<string, number>,
  };
};

export const getWeeklyAnalytics = (
  allTasks: TasksByDate,
  dateOverride?: Date
): WeeklyAnalytics => {
  const now = dateOverride || new Date();
  const weekStart = getWeekStart(now);
  const weekEnd = getWeekEnd(now);

  const dailyMetrics: DailyMetrics[] = [];
  let totalCompletionRate = 0;
  let bestDay = '';
  let worstDay = '';
  let maxCompletion = -1;
  let minCompletion = 101;

  const current = new Date(weekStart);
  const end = new Date(weekEnd);
  end.setDate(end.getDate() + 1);

  while (current < end) {
    const dateStr = getDateString(current);
    const tasksForDay = allTasks[dateStr] || [];
    const metrics = getDailyMetrics(tasksForDay);

    if (metrics) {
      dailyMetrics.push(metrics);
      totalCompletionRate += metrics.completionRate;

      if (metrics.completionRate > maxCompletion) {
        maxCompletion = metrics.completionRate;
        bestDay = dateStr;
      }
      if (metrics.completionRate < minCompletion) {
        minCompletion = metrics.completionRate;
        worstDay = dateStr;
      }
    }

    current.setDate(current.getDate() + 1);
  }

  const overallCompletionRate =
    dailyMetrics.length > 0
      ? Math.round(totalCompletionRate / dailyMetrics.length)
      : 0;

  const streak = calculateStreak(allTasks);

  return {
    weekStart,
    weekEnd,
    dailyMetrics,
    overallCompletionRate,
    bestDay: bestDay || getDateString(),
    worstDay: worstDay || getDateString(),
    averageDaily: overallCompletionRate,
    streak,
  };
};

export const calculateStreak = (allTasks: TasksByDate): number => {
  let streak = 0;
  const today = new Date();
  const checkDate = new Date(today);

  while (true) {
    const dateStr = getDateString(checkDate);
    const tasksForDay = allTasks[dateStr];

    if (!tasksForDay || tasksForDay.length === 0) {
      break;
    }

    const completed = tasksForDay.filter((t) => t.done).length;
    const total = tasksForDay.length;

    if (completed === total && total > 0) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

export const getRecoveryMetrics = (
  allTasks: TasksByDate,
  mode: 'fatloss' | 'muscle' | 'maintenance'
): RecoveryMetrics => {
  const weeklyData = getWeeklyAnalytics(allTasks);
  const recoveryTasks = allTasks[getDateString(new Date())]?.filter(
    (t) => t.category === 'Recovery'
  ) || [];
  const recoveryCompleted = recoveryTasks.filter((t) => t.done).length;

  // Recovery score formula
  let score = 50; // base score

  // Add points for recovery tasks
  score += recoveryCompleted * 10;

  // Add points for overall completion (stability)
  score += (weeklyData.overallCompletionRate / 100) * 20;

  // Add points for streak
  score += Math.min(weeklyData.streak * 5, 30);

  // Adjust based on mode
  if (mode === 'muscle') {
    score += 10; // high recovery emphasis
  } else if (mode === 'fatloss') {
    score -= 5; // low recovery emphasis
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  let recommendation = '';
  if (score >= 80) {
    recommendation = 'Excellent recovery! Keep up the consistency.';
  } else if (score >= 60) {
    recommendation = 'Good recovery. Consider adding more recovery tasks.';
  } else if (score >= 40) {
    recommendation = 'Recovery could be improved. Prioritize rest and mindfulness.';
  } else {
    recommendation =
      'Recovery is critically low. Take a rest day and focus on recovery tasks.';
  }

  return {
    score,
    lastRestDay: null, // To be calculated from task history
    workoutFrequency:
      weeklyData.dailyMetrics.filter((d) => d.categoryBreakdown['Workout'] > 0)
        .length || 0,
    recoveryTasksCompleted: recoveryCompleted,
    recommendation,
  };
};
