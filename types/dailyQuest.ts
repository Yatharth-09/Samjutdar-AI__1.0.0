export type QuestType = 'complete-tasks' | 'workout' | 'recovery';

export interface DailyQuest {
  id: string;
  type: QuestType;
  title: string;
  description: string;
  target: number; // e.g., 3 tasks, 1 workout
  progress: number;
  completed: boolean;
  xpReward: number;
  xpAwarded: boolean; // Track if XP has been awarded
}

export interface DailyQuestsState {
  quests: DailyQuest[];
  lastQuestDate: string; // YYYY-MM-DD of last generation
}
