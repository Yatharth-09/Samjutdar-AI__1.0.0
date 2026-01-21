'use client';

import { useState, useEffect } from 'react';
import { getDisciplineScore, saveDisciplineScore, getProgression } from '@/lib/storage';
import { getDateString } from '@/lib/analytics';
import type { DisciplineScoreState, DisciplineLevel } from '@/types/disciplineScore';
import type { TasksByDate } from '@/types/task';

export const useDisciplineScore = (allTasks: TasksByDate) => {
  const [disciplineScore, setDisciplineScore] = useState<DisciplineScoreState>({ score: 50, lastUpdatedDate: '' });
  const [isClient, setIsClient] = useState(false);

  // Initialize from storage
  useEffect(() => {
    setIsClient(true);
    const stored = getDisciplineScore();
    setDisciplineScore(stored);
  }, []);

  // Update discipline score daily
  useEffect(() => {
    if (!isClient) return;

    const today = getDateString(new Date());
    const yesterday = getDateString(new Date(Date.now() - 24 * 60 * 60 * 1000));

    // Only update once per day
    if (disciplineScore.lastUpdatedDate === today) {
      return;
    }

    // If we're updating for the first time or missed yesterday, calculate
    if (disciplineScore.lastUpdatedDate === '' || disciplineScore.lastUpdatedDate === yesterday) {
      updateDisciplineScore(today, yesterday);
    }
  }, [allTasks, isClient, disciplineScore.lastUpdatedDate]);

  const updateDisciplineScore = (today: string, yesterday: string) => {
    const yesterdayTasks = allTasks[yesterday] || [];
    const progression = getProgression();

    let scoreChange = 0;

    // Check if any tasks were completed yesterday
    const completedTasks = yesterdayTasks.filter((t) => t.done);
    const totalTasks = yesterdayTasks.length;

    if (totalTasks === 0) {
      // No tasks planned - neutral (no change)
      scoreChange = 0;
    } else if (completedTasks.length === 0) {
      // No tasks completed - penalty
      scoreChange = -1.0;
    } else if (completedTasks.length === totalTasks) {
      // All tasks completed - big bonus
      scoreChange = +1.5;
    } else {
      // Some tasks completed - small bonus
      scoreChange = +0.5;
    }

    // Streak bonus/penalty
    const streakLength = progression.streakLength ?? 0;
    const lastActiveDate = progression.lastActiveDate ?? '';

    if (lastActiveDate === yesterday && streakLength > 0) {
      // Active streak day - bonus
      scoreChange += 0.25;
    } else if (lastActiveDate !== yesterday && disciplineScore.lastUpdatedDate === yesterday) {
      // Missed a day - penalty
      scoreChange -= 0.5;
    }

    // Calculate new score and clamp between 0 and 100
    const newScore = Math.max(0, Math.min(100, disciplineScore.score + scoreChange));

    const newState: DisciplineScoreState = {
      score: Math.round(newScore * 10) / 10, // Round to 1 decimal place
      lastUpdatedDate: today,
    };

    setDisciplineScore(newState);
    saveDisciplineScore(newState);
  };

  // Get discipline level label
  const getDisciplineLevel = (score: number): DisciplineLevel => {
    if (score >= 81) return 'Elite Discipline';
    if (score >= 61) return 'Disciplined';
    if (score >= 31) return 'Building';
    return 'Unstable';
  };

  // Get color for discipline level
  const getDisciplineColor = (score: number): string => {
    if (score >= 81) return 'text-purple-600 dark:text-purple-400';
    if (score >= 61) return 'text-green-600 dark:text-green-400';
    if (score >= 31) return 'text-blue-600 dark:text-blue-400';
    return 'text-orange-600 dark:text-orange-400';
  };

  // Get progress bar color
  const getProgressBarColor = (score: number): string => {
    if (score >= 81) return 'bg-purple-500';
    if (score >= 61) return 'bg-green-500';
    if (score >= 31) return 'bg-blue-500';
    return 'bg-orange-500';
  };

  return {
    score: disciplineScore.score,
    level: getDisciplineLevel(disciplineScore.score),
    color: getDisciplineColor(disciplineScore.score),
    progressBarColor: getProgressBarColor(disciplineScore.score),
    lastUpdatedDate: disciplineScore.lastUpdatedDate,
    isClient,
  };
};
