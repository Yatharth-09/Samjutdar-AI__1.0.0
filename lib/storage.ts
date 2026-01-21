import { STORAGE_KEYS } from './constants';
import type { Task, TasksByDate } from '@/types/task';
import type { BodyTransformationMode } from '@/types/mode';
import type { AnalyticsState } from '@/types/analytics';
import type { WeeklyTasksState } from '@/types/weeklyTask';
import type { WeeklyPlan } from '@/types/weeklyPlan';
import type { DailyQuestsState } from '@/types/dailyQuest';
import type { TitleState } from '@/types/title';
import type { DisciplineScoreState } from '@/types/disciplineScore';
import type { PersonalBestsState } from '@/types/personalBests';

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

// Progression (XP & Level)
export interface ProgressionState {
  currentLevel: number;
  currentXP: number;
  // Streak tracking (local-time based)
  streakLength?: number;
  lastActiveDate?: string; // last date with at least one completion (YYYY-MM-DD, local)
  lastStreakBonusAppliedDate?: string | null; // to ensure one bonus per day
  // Perfect-week tracking
  lastPerfectWeekAwardedWeekStart?: string | null; // week start (YYYY-MM-DD)
}

export const saveProgression = (progression: ProgressionState): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.PROGRESSION, JSON.stringify(progression));
  }
};

export const getProgression = (): ProgressionState => {
  if (typeof window === 'undefined') return { currentLevel: 1, currentXP: 0 };
  const stored = localStorage.getItem(STORAGE_KEYS.PROGRESSION);
  const base: ProgressionState = { currentLevel: 1, currentXP: 0 };
  try {
    const parsed = stored ? JSON.parse(stored) : base;
    return {
      currentLevel: parsed.currentLevel ?? base.currentLevel,
      currentXP: parsed.currentXP ?? base.currentXP,
      streakLength: parsed.streakLength ?? 0,
      lastActiveDate: parsed.lastActiveDate ?? undefined,
      lastStreakBonusAppliedDate: parsed.lastStreakBonusAppliedDate ?? null,
      lastPerfectWeekAwardedWeekStart: parsed.lastPerfectWeekAwardedWeekStart ?? null,
    };
  } catch {
    return base;
  }
};

// Daily Quests
export const saveDailyQuests = (quests: DailyQuestsState): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.DAILY_QUESTS, JSON.stringify(quests));
  }
};

export const getDailyQuests = (): DailyQuestsState => {
  if (typeof window === 'undefined') return { quests: [], lastQuestDate: '' };
  const stored = localStorage.getItem(STORAGE_KEYS.DAILY_QUESTS);
  if (!stored) return { quests: [], lastQuestDate: '' };
  try {
    const parsed = JSON.parse(stored);
    return {
      quests: parsed.quests ?? [],
      lastQuestDate: parsed.lastQuestDate ?? '',
    };
  } catch {
    return { quests: [], lastQuestDate: '' };
  }
};

// Selected Title
export const saveSelectedTitle = (titleState: TitleState): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.SELECTED_TITLE, JSON.stringify(titleState));
  }
};

export const getSelectedTitle = (): TitleState => {
  if (typeof window === 'undefined') return { selectedTitleId: null };
  const stored = localStorage.getItem(STORAGE_KEYS.SELECTED_TITLE);
  if (!stored) return { selectedTitleId: null };
  try {
    const parsed = JSON.parse(stored);
    return {
      selectedTitleId: parsed.selectedTitleId ?? null,
    };
  } catch {
    return { selectedTitleId: null };
  }
};

// Discipline Score
export const saveDisciplineScore = (disciplineScore: DisciplineScoreState): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.DISCIPLINE_SCORE, JSON.stringify(disciplineScore));
  }
};

export const getDisciplineScore = (): DisciplineScoreState => {
  if (typeof window === 'undefined') return { score: 50, lastUpdatedDate: '' };
  const stored = localStorage.getItem(STORAGE_KEYS.DISCIPLINE_SCORE);
  if (!stored) return { score: 50, lastUpdatedDate: '' };
  try {
    const parsed = JSON.parse(stored);
    return {
      score: parsed.score ?? 50,
      lastUpdatedDate: parsed.lastUpdatedDate ?? '',
    };
  } catch {
    return { score: 50, lastUpdatedDate: '' };
  }
};

// Personal Bests
const getDefaultPersonalBests = (): PersonalBestsState => ({
  mostTasksInDay: { value: 0, dateAchieved: '' },
  longestStreak: { value: 0, dateAchieved: '' },
  mostXPInDay: { value: 0, dateAchieved: '' },
  mostXPInWeek: { value: 0, dateAchieved: '' },
  mostPerfectWeeks: { value: 0, dateAchieved: '' },
  highestDisciplineScore: { value: 0, dateAchieved: '' },
});

export const savePersonalBests = (pbs: PersonalBestsState): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.PERSONAL_BESTS, JSON.stringify(pbs));
  }
};

export const getPersonalBests = (): PersonalBestsState => {
  if (typeof window === 'undefined') return getDefaultPersonalBests();
  const stored = localStorage.getItem(STORAGE_KEYS.PERSONAL_BESTS);
  if (!stored) return getDefaultPersonalBests();
  try {
    const parsed = JSON.parse(stored);
    const defaults = getDefaultPersonalBests();
    return {
      mostTasksInDay: parsed.mostTasksInDay ?? defaults.mostTasksInDay,
      longestStreak: parsed.longestStreak ?? defaults.longestStreak,
      mostXPInDay: parsed.mostXPInDay ?? defaults.mostXPInDay,
      mostXPInWeek: parsed.mostXPInWeek ?? defaults.mostXPInWeek,
      mostPerfectWeeks: parsed.mostPerfectWeeks ?? defaults.mostPerfectWeeks,
      highestDisciplineScore: parsed.highestDisciplineScore ?? defaults.highestDisciplineScore,
    };
  } catch {
    return getDefaultPersonalBests();
  }
};
