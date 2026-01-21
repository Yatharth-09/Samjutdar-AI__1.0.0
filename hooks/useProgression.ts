import { useState, useEffect, useCallback } from 'react';
import { getProgression, saveProgression, getSelectedTitle, saveSelectedTitle, type ProgressionState } from '@/lib/storage';
import { CATEGORY_XP_REWARDS, LEVEL_TITLES } from '@/lib/constants';
import { getDateString, getWeekStart } from '@/lib/analytics';
import type { TaskCategory, TasksByDate } from '@/types/task';
import type { LevelTitle } from '@/types/title';

const calculateXPForLevel = (level: number): number => {
  return 100 + (level - 1) * 50;
};

export const useProgression = () => {
  const [progression, setProgression] = useState<ProgressionState>({ currentLevel: 1, currentXP: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const stored = getProgression();
    setProgression(stored);
  }, []);

  const awardXP = useCallback((category: TaskCategory) => {
    const xpGained = CATEGORY_XP_REWARDS[category] || 0;

    setProgression((prev) => {
      const today = getDateString(new Date());
      const yesterday = getDateString(new Date(Date.now() - 24 * 60 * 60 * 1000));

      let {
        currentLevel,
        currentXP,
        streakLength = 0,
        lastActiveDate,
        lastStreakBonusAppliedDate = null,
        lastPerfectWeekAwardedWeekStart = null,
      } = prev;

      // Base XP for task completion
      currentXP += xpGained;

      // Streak update: a day counts if at least one task is completed
      const isNewActiveDay = lastActiveDate !== today;
      if (isNewActiveDay) {
        // Reset or increment streak depending on continuity
        if (lastActiveDate === yesterday) {
          streakLength = (streakLength ?? 0) + 1;
        } else {
          streakLength = 1; // new streak starting today
        }
        lastActiveDate = today;
      }

      // Apply daily streak bonus once per day (first completion only)
      if (lastStreakBonusAppliedDate !== today) {
        const bonusXP = Math.min(5 * (streakLength ?? 0), 50);
        if (bonusXP > 0) {
          currentXP += bonusXP;
          lastStreakBonusAppliedDate = today;
        }
      }

      // Level up calculation remains unchanged
      let xpRequired = calculateXPForLevel(currentLevel);
      while (currentXP >= xpRequired) {
        currentXP -= xpRequired;
        currentLevel += 1;
        xpRequired = calculateXPForLevel(currentLevel);
      }

      const newProgression: ProgressionState = {
        currentLevel,
        currentXP,
        streakLength,
        lastActiveDate,
        lastStreakBonusAppliedDate,
        lastPerfectWeekAwardedWeekStart,
      };
      saveProgression(newProgression);
      return newProgression;
    });
  }, []);

  // Check and award perfect-week bonus (+300 XP) once per week
  const applyCompletionBonuses = useCallback((allTasks: TasksByDate) => {
    setProgression((prev) => {
      let {
        currentLevel,
        currentXP,
        streakLength = 0,
        lastActiveDate,
        lastStreakBonusAppliedDate = null,
        lastPerfectWeekAwardedWeekStart = null,
      } = prev;

      const weekStart = getWeekStart(new Date());

      // Only award once per week
      const alreadyAwardedThisWeek = lastPerfectWeekAwardedWeekStart === weekStart;

      const allSevenDaysPerfect = (() => {
        const start = new Date(weekStart);
        for (let i = 0; i < 7; i++) {
          const d = new Date(start);
          d.setDate(start.getDate() + i);
          const dateStr = getDateString(d);
          const tasks = allTasks[dateStr] || [];
          if (tasks.length === 0) return false; // no planned tasks -> not perfect
          const allDone = tasks.every((t) => t.done);
          if (!allDone) return false;
        }
        return true;
      })();

      if (!alreadyAwardedThisWeek && allSevenDaysPerfect) {
        currentXP += 300;
        lastPerfectWeekAwardedWeekStart = weekStart;
        // Level calculation unchanged
        let xpRequired = calculateXPForLevel(currentLevel);
        while (currentXP >= xpRequired) {
          currentXP -= xpRequired;
          currentLevel += 1;
          xpRequired = calculateXPForLevel(currentLevel);
        }
      }

      const newProgression: ProgressionState = {
        currentLevel,
        currentXP,
        streakLength,
        lastActiveDate,
        lastStreakBonusAppliedDate,
        lastPerfectWeekAwardedWeekStart,
      };
      saveProgression(newProgression);
      return newProgression;
    });
  }, []);

  const xpRequired = calculateXPForLevel(progression.currentLevel);
  const xpProgress = progression.currentXP / xpRequired;

  // Get unlocked titles based on current level
  const getUnlockedTitles = (level: number): LevelTitle[] => {
    return LEVEL_TITLES.filter((title) => level >= title.minLevel);
  };

  // Get current title for level (highest unlocked)
  const getCurrentTitleForLevel = (level: number): LevelTitle => {
    const unlocked = getUnlockedTitles(level);
    return unlocked[unlocked.length - 1] || LEVEL_TITLES[0];
  };

  // Get selected or default title
  const getDisplayTitle = (): LevelTitle => {
    const titleState = getSelectedTitle();
    const unlockedTitles = getUnlockedTitles(progression.currentLevel);

    if (titleState.selectedTitleId) {
      const selectedTitle = LEVEL_TITLES.find((t) => t.id === titleState.selectedTitleId);
      const isUnlocked = unlockedTitles.some((t) => t.id === titleState.selectedTitleId);

      if (selectedTitle && isUnlocked) {
        return selectedTitle;
      }
    }

    // Default to highest unlocked
    return getCurrentTitleForLevel(progression.currentLevel);
  };

  const setSelectedTitle = useCallback((titleId: string) => {
    saveSelectedTitle({ selectedTitleId: titleId });
  }, []);

  return {
    currentLevel: progression.currentLevel,
    currentXP: progression.currentXP,
    xpRequired,
    xpProgress,
    awardXP,
    applyCompletionBonuses,
    title: getDisplayTitle().name,
    displayTitle: getDisplayTitle(),
    unlockedTitles: getUnlockedTitles(progression.currentLevel),
    allTitles: LEVEL_TITLES,
    setSelectedTitle,
    streakLength: progression.streakLength ?? 0,
    hasPerfectWeekThisWeek:
      (progression.lastPerfectWeekAwardedWeekStart ?? '') === getWeekStart(new Date()),
    isClient,
  };
};
