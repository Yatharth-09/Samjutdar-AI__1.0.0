'use client';

import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getDailyQuests, saveDailyQuests, getProgression, saveProgression } from '@/lib/storage';
import { getDateString } from '@/lib/analytics';
import { QUEST_TEMPLATES } from '@/lib/constants';
import type { DailyQuest, DailyQuestsState } from '@/types/dailyQuest';
import type { Task, TasksByDate } from '@/types/task';

export const useDailyQuests = (allTasks: TasksByDate) => {
  const [quests, setQuests] = useState<DailyQuest[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Initialize quests from storage or generate new ones
  useEffect(() => {
    setIsClient(true);
    const stored = getDailyQuests();
    const today = getDateString(new Date());

    // If stored quests are from today, use them
    if (stored.lastQuestDate === today && stored.quests.length > 0) {
      setQuests(stored.quests);
    } else {
      // Generate new quests for today
      const newQuests = generateDailyQuests();
      const newState: DailyQuestsState = {
        quests: newQuests,
        lastQuestDate: today,
      };
      saveDailyQuests(newState);
      setQuests(newQuests);
    }
  }, []);

  // Update quest progress based on tasks
  useEffect(() => {
    if (!isClient || quests.length === 0) return;

    const today = getDateString(new Date());
    const todaysTasks = allTasks[today] || [];

    const updatedQuests = quests.map((quest) => {
      let newProgress = quest.progress;
      let newCompleted = quest.completed;

      if (quest.type === 'complete-tasks') {
        const completedTasks = todaysTasks.filter((t) => t.done).length;
        newProgress = completedTasks;
        newCompleted = completedTasks >= quest.target;
      } else if (quest.type === 'workout') {
        const workoutDone = todaysTasks
          .filter((t) => (t.category === 'Workout' || t.category === 'Cardio') && t.done)
          .length;
        newProgress = workoutDone;
        newCompleted = workoutDone >= quest.target;
      } else if (quest.type === 'recovery') {
        const recoveryDone = todaysTasks
          .filter((t) => t.category === 'Recovery' && t.done)
          .length;
        newProgress = recoveryDone;
        newCompleted = recoveryDone >= quest.target;
      }

      return {
        ...quest,
        progress: newProgress,
        completed: newCompleted,
      };
    });

    // Check for completed quests and award XP
    updatedQuests.forEach((updatedQuest) => {
      const originalQuest = quests.find((q) => q.id === updatedQuest.id);
      if (
        updatedQuest.completed &&
        !updatedQuest.xpAwarded &&
        (!originalQuest || !originalQuest.xpAwarded)
      ) {
        awardQuestXP(updatedQuest.xpReward);
        updatedQuest.xpAwarded = true;
      }
    });

    setQuests(updatedQuests);
    const newState: DailyQuestsState = {
      quests: updatedQuests,
      lastQuestDate: getDateString(new Date()),
    };
    saveDailyQuests(newState);
  }, [allTasks, isClient]);

  const awardQuestXP = useCallback((xpAmount: number) => {
    const progression = getProgression();
    let { currentLevel, currentXP } = progression;

    currentXP += xpAmount;

    const calculateXPForLevel = (level: number): number => {
      return 100 + (level - 1) * 50;
    };

    let xpRequired = calculateXPForLevel(currentLevel);
    while (currentXP >= xpRequired) {
      currentXP -= xpRequired;
      currentLevel += 1;
      xpRequired = calculateXPForLevel(currentLevel);
    }

    const newProgression = {
      ...progression,
      currentLevel,
      currentXP,
    };
    saveProgression(newProgression);
  }, []);

  const generateDailyQuests = (): DailyQuest[] => {
    // Pick 2-3 random quests from templates
    const numQuests = Math.random() > 0.5 ? 3 : 2;
    const shuffled = [...QUEST_TEMPLATES].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, numQuests);

    return selected.map((template) => ({
      id: uuidv4(),
      type: template.type,
      title: template.title,
      description: template.description,
      target: template.target,
      progress: 0,
      completed: false,
      xpReward: template.xpReward,
      xpAwarded: false,
    }));
  };

  return {
    quests,
    isClient,
  };
};
