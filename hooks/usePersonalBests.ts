'use client';

import { useState, useEffect, useCallback } from 'react';
import { getPersonalBests, savePersonalBests, getProgression } from '@/lib/storage';
import { getDateString, getWeekStart } from '@/lib/analytics';
import type { PersonalBestsState, PersonalBest } from '@/types/personalBests';
import type { TasksByDate } from '@/types/task';

export const usePersonalBests = (allTasks: TasksByDate, disciplineScore: number) => {
  const [pbs, setPbs] = useState<PersonalBestsState | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Initialize from storage
  useEffect(() => {
    setIsClient(true);
    const stored = getPersonalBests();
    setPbs(stored);
  }, []);

  // Check and update PBs
  useEffect(() => {
    if (!isClient || !pbs) return;

    checkAndUpdatePBs();
  }, [allTasks, disciplineScore, isClient, pbs]);

  const checkAndUpdatePBs = useCallback(() => {
    if (!pbs) return;

    const today = getDateString(new Date());
    const progression = getProgression();
    let updated = false;
    const newPbs = { ...pbs };

    // 1. Most tasks completed in a single day
    const taskCounts = Object.entries(allTasks).map(([date, tasks]) => ({
      date,
      count: tasks.filter((t) => t.done).length,
    }));
    const maxTasksDay = taskCounts.reduce((max, curr) => 
      curr.count > max.count ? curr : max, 
      { date: '', count: 0 }
    );

    if (maxTasksDay.count > pbs.mostTasksInDay.value) {
      newPbs.mostTasksInDay = { value: maxTasksDay.count, dateAchieved: maxTasksDay.date };
      updated = true;
    }

    // 2. Longest streak ever achieved
    const currentStreak = progression.streakLength ?? 0;
    if (currentStreak > pbs.longestStreak.value) {
      newPbs.longestStreak = { value: currentStreak, dateAchieved: today };
      updated = true;
    }

    // 3. Highest XP earned in a single day (approximate from task categories)
    // We'll calculate based on completed tasks per day
    const xpPerDay = Object.entries(allTasks).map(([date, tasks]) => {
      const xp = tasks
        .filter((t) => t.done)
        .reduce((sum, t) => {
          const categoryXP: Record<string, number> = {
            Workout: 25,
            Cardio: 20,
            Diet: 15,
            Mindset: 10,
            Recovery: 15,
          };
          return sum + (categoryXP[t.category] || 0);
        }, 0);
      return { date, xp };
    });
    const maxXPDay = xpPerDay.reduce((max, curr) => 
      curr.xp > max.xp ? curr : max, 
      { date: '', xp: 0 }
    );

    if (maxXPDay.xp > pbs.mostXPInDay.value) {
      newPbs.mostXPInDay = { value: maxXPDay.xp, dateAchieved: maxXPDay.date };
      updated = true;
    }

    // 4. Most XP earned in a single week
    const weeklyXP = new Map<string, number>();
    Object.entries(allTasks).forEach(([date, tasks]) => {
      const weekStart = getWeekStart(new Date(date));
      const xp = tasks
        .filter((t) => t.done)
        .reduce((sum, t) => {
          const categoryXP: Record<string, number> = {
            Workout: 25,
            Cardio: 20,
            Diet: 15,
            Mindset: 10,
            Recovery: 15,
          };
          return sum + (categoryXP[t.category] || 0);
        }, 0);
      weeklyXP.set(weekStart, (weeklyXP.get(weekStart) || 0) + xp);
    });

    const maxWeekXP = Array.from(weeklyXP.entries()).reduce(
      (max, [week, xp]) => (xp > max.xp ? { week, xp } : max),
      { week: '', xp: 0 }
    );

    if (maxWeekXP.xp > pbs.mostXPInWeek.value) {
      newPbs.mostXPInWeek = { value: maxWeekXP.xp, dateAchieved: maxWeekXP.week };
      updated = true;
    }

    // 5. Most perfect weeks achieved (count weeks with all tasks done)
    const perfectWeeks = new Set<string>();
    Object.entries(allTasks).forEach(([date, tasks]) => {
      if (tasks.length > 0 && tasks.every((t) => t.done)) {
        const weekStart = getWeekStart(new Date(date));
        perfectWeeks.add(weekStart);
      }
    });

    const perfectWeekCount = perfectWeeks.size;
    if (perfectWeekCount > pbs.mostPerfectWeeks.value) {
      newPbs.mostPerfectWeeks = { value: perfectWeekCount, dateAchieved: today };
      updated = true;
    }

    // 6. Highest Discipline Score ever reached
    if (disciplineScore > pbs.highestDisciplineScore.value) {
      newPbs.highestDisciplineScore = { value: disciplineScore, dateAchieved: today };
      updated = true;
    }

    // Save if any PB was updated
    if (updated) {
      setPbs(newPbs);
      savePersonalBests(newPbs);
    }
  }, [pbs, allTasks, disciplineScore]);

  return {
    personalBests: pbs,
    isClient,
  };
};
