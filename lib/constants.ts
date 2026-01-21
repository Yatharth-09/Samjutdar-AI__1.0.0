import type { TaskCategory } from '@/types/task';
import type { BodyTransformationMode as Mode, ModeConfig } from '@/types/mode';
import type { DailyQuest, QuestType } from '@/types/dailyQuest';
import type { LevelTitle } from '@/types/title';

// Task Categories
export const TASK_CATEGORIES: TaskCategory[] = [
  'Workout',
  'Cardio',
  'Diet',
  'Mindset',
  'Recovery',
];

export const CATEGORY_COLORS: Record<TaskCategory, string> = {
  Workout: 'bg-red-500',
  Cardio: 'bg-orange-500',
  Diet: 'bg-green-500',
  Mindset: 'bg-blue-500',
  Recovery: 'bg-purple-500',
};

export const CATEGORY_LABELS: Record<TaskCategory, string> = {
  Workout: '💪 Workout',
  Cardio: '🏃 Cardio',
  Diet: '🥗 Diet',
  Mindset: '🧠 Mindset',
  Recovery: '😴 Recovery',
};

export const CATEGORY_XP_REWARDS: Record<TaskCategory, number> = {
  Workout: 25,
  Cardio: 20,
  Diet: 15,
  Mindset: 10,
  Recovery: 15,
};

// Body Transformation Modes
export const BODY_MODES: Mode[] = ['fatloss', 'muscle', 'maintenance'];

export const MODE_CONFIGS: Record<Mode, ModeConfig> = {
  fatloss: {
    mode: 'fatloss',
    description: 'Fat Loss',
    primaryFocus: 'Cardio + Caloric Deficit',
    recoveryEmphasis: 'low',
    philosophy: 'High-frequency training with emphasis on metabolic stress and calorie burn while preserving muscle mass',
    primaryCategories: ['Cardio', 'Workout'],
    secondaryCategories: ['Diet', 'Recovery'],
  },
  muscle: {
    mode: 'muscle',
    description: 'Muscle Gain',
    primaryFocus: 'Heavy Lifting + Caloric Surplus',
    recoveryEmphasis: 'high',
    philosophy: 'Structured progressive overload with adequate recovery and minimal conditioning for health',
    primaryCategories: ['Workout'],
    secondaryCategories: ['Diet', 'Recovery', 'Cardio'],
  },
  maintenance: {
    mode: 'maintenance',
    description: 'Maintenance',
    primaryFocus: 'Balanced Training + Maintenance Diet',
    recoveryEmphasis: 'medium',
    philosophy: 'Balanced approach for long-term consistency with moderate volume and recovery',
    primaryCategories: ['Workout', 'Cardio'],
    secondaryCategories: ['Diet', 'Recovery', 'Mindset'],
  },
};

/**
 * Workout templates for AI-suggested weekly plans
 * Each template is organized by day and intensity
 */

export interface WorkoutTemplate {
  title: string;
  category: TaskCategory;
  intensity: 'low' | 'moderate' | 'high';
  description: string;
}

export const WORKOUT_TEMPLATES: Record<Mode, Record<number, WorkoutTemplate[]>> = {
  fatloss: {
    // Monday: Upper Body Strength + Metabolic Stress
    1: [
      {
        title: 'Upper Body Strength Circuit',
        category: 'Workout',
        intensity: 'high',
        description: 'Chest, Back, Shoulders - 4 exercises, 3 sets, short rest',
      },
      {
        title: 'Cardio Finisher - 10 min HIIT',
        category: 'Cardio',
        intensity: 'high',
        description: 'Quick metabolic finisher - sprints, burpees, mountain climbers',
      },
    ],
    // Tuesday: Lower Body + Cardio
    2: [
      {
        title: 'Lower Body Strength',
        category: 'Workout',
        intensity: 'high',
        description: 'Squats, Lunges, Deadlifts - 4 exercises, 3 sets',
      },
      {
        title: 'Steady-State Cardio',
        category: 'Cardio',
        intensity: 'moderate',
        description: '20-30 min running, cycling, rowing',
      },
    ],
    // Wednesday: Active Recovery / Light Cardio
    3: [
      {
        title: 'Light Mobility & Stretching',
        category: 'Recovery',
        intensity: 'low',
        description: 'Dynamic stretches, foam rolling - 15 min',
      },
      {
        title: 'Low-Intensity Cardio Walk',
        category: 'Cardio',
        intensity: 'low',
        description: '30-45 min leisure walk or light jog',
      },
    ],
    // Thursday: Full Body Circuit
    4: [
      {
        title: 'Full Body Circuit',
        category: 'Workout',
        intensity: 'high',
        description: '6-8 compound movements, 2 rounds, minimal rest',
      },
    ],
    // Friday: Targeted Strength (weak points)
    5: [
      {
        title: 'Accessory Strength',
        category: 'Workout',
        intensity: 'moderate',
        description: 'Isolation exercises, high reps - abs, arms, shoulders',
      },
      {
        title: 'Cardio Finisher',
        category: 'Cardio',
        intensity: 'moderate',
        description: '10-15 min conditioning - battle ropes, jump rope, box jumps',
      },
    ],
    // Saturday: Active Recovery / Mobility
    6: [
      {
        title: 'Yoga or Stretching',
        category: 'Recovery',
        intensity: 'low',
        description: '30 min yoga, flexibility work - focus on tight areas',
      },
    ],
    // Sunday: Rest Day
    0: [
      {
        title: 'Complete Rest or Light Walk',
        category: 'Recovery',
        intensity: 'low',
        description: 'No structured training - focus on recovery',
      },
    ],
  },
  muscle: {
    // Monday: Chest & Triceps
    1: [
      {
        title: 'Chest & Triceps Strength',
        category: 'Workout',
        intensity: 'high',
        description: 'Heavy pressing movements, 4-6 reps, 4 sets',
      },
    ],
    // Tuesday: Back & Biceps
    2: [
      {
        title: 'Back & Biceps Strength',
        category: 'Workout',
        intensity: 'high',
        description: 'Deadlifts, rows, pull-ups, 4-6 reps, 4 sets',
      },
    ],
    // Wednesday: Active Recovery
    3: [
      {
        title: 'Mobility & Stretching',
        category: 'Recovery',
        intensity: 'low',
        description: 'Yoga, foam rolling, dynamic stretches - 30 min',
      },
      {
        title: 'Light Cardio',
        category: 'Cardio',
        intensity: 'low',
        description: '15 min walk or easy cycle',
      },
    ],
    // Thursday: Legs
    4: [
      {
        title: 'Lower Body Hypertrophy',
        category: 'Workout',
        intensity: 'high',
        description: 'Squats, leg press, leg curls - 6-8 reps, 3 sets',
      },
    ],
    // Friday: Shoulders & Arms (Hypertrophy)
    5: [
      {
        title: 'Shoulders & Arms',
        category: 'Workout',
        intensity: 'moderate',
        description: 'Lateral raises, cable curls, overhead press, 8-10 reps',
      },
    ],
    // Saturday: Full Body or Extra Volume
    6: [
      {
        title: 'Full Body Compound Day',
        category: 'Workout',
        intensity: 'moderate',
        description: 'Lighter compounds for volume, 8-10 reps',
      },
    ],
    // Sunday: Complete Rest
    0: [
      {
        title: 'Complete Rest Day',
        category: 'Recovery',
        intensity: 'low',
        description: 'No structured training - prioritize sleep and recovery',
      },
    ],
  },
  maintenance: {
    // Monday: Upper Body
    1: [
      {
        title: 'Upper Body Strength',
        category: 'Workout',
        intensity: 'moderate',
        description: 'Chest, Back, Shoulders - 3 exercises, 3 sets',
      },
    ],
    // Tuesday: Light Cardio
    2: [
      {
        title: 'Steady Cardio Session',
        category: 'Cardio',
        intensity: 'moderate',
        description: '20-30 min running, cycling, or rowing',
      },
    ],
    // Wednesday: Recovery / Mobility
    3: [
      {
        title: 'Yoga & Mobility',
        category: 'Recovery',
        intensity: 'low',
        description: '30 min flexible routine focusing on mobility',
      },
    ],
    // Thursday: Lower Body
    4: [
      {
        title: 'Lower Body Strength',
        category: 'Workout',
        intensity: 'moderate',
        description: 'Squats, deadlifts, lunges - 3 exercises, 3 sets',
      },
    ],
    // Friday: Mixed Cardio
    5: [
      {
        title: 'Cardio Variety',
        category: 'Cardio',
        intensity: 'low',
        description: '20 min leisurely activity - walk, swim, or easy cycling',
      },
    ],
    // Saturday: Optional Activity
    6: [
      {
        title: 'Active Rest or Sport',
        category: 'Recovery',
        intensity: 'low',
        description: 'Play a sport, hike, or any enjoyable activity',
      },
    ],
    // Sunday: Rest
    0: [
      {
        title: 'Rest Day',
        category: 'Recovery',
        intensity: 'low',
        description: 'Complete rest and recovery',
      },
    ],
  },
};

// Storage Keys
export const STORAGE_KEYS = {
  TASKS: 'ai_fitness_tasks',
  WEEKLY_TASKS: 'ai_fitness_weekly_tasks',
  CURRENT_MODE: 'ai_fitness_mode',
  DARK_MODE: 'ai_fitness_dark_mode',
  ANALYTICS: 'ai_fitness_analytics',
  WEEKLY_PLAN: 'ai_fitness_weekly_plan',
  SAVED_WEEKLY_PLANS: 'ai_fitness_saved_weekly_plans',
  PROGRESSION: 'ai_fitness_progression',
  DAILY_QUESTS: 'ai_fitness_daily_quests',
  SELECTED_TITLE: 'ai_fitness_selected_title',
  DISCIPLINE_SCORE: 'ai_fitness_discipline_score',
  PERSONAL_BESTS: 'ai_fitness_personal_bests',
} as const;

// App Config
export const APP_CONFIG = {
  APP_NAME: 'SAMJUTDAR AI',
  APP_VERSION: '1.0.0',
  MAX_TASKS_PER_DAY: 20,
  ANALYTICS_CACHE_DURATION: 60 * 60 * 1000, // 1 hour
} as const;

// Daily Quest Templates
export const QUEST_TEMPLATES: Array<Omit<DailyQuest, 'id' | 'progress' | 'completed' | 'xpAwarded'>> = [
  {
    type: 'complete-tasks' as QuestType,
    title: 'Task Master',
    description: 'Complete 3 tasks today',
    target: 3,
    xpReward: 40,
  },
  {
    type: 'complete-tasks' as QuestType,
    title: 'Productive Day',
    description: 'Complete 2 tasks today',
    target: 2,
    xpReward: 40,
  },
  {
    type: 'workout' as QuestType,
    title: 'Strength Builder',
    description: 'Complete a workout',
    target: 1,
    xpReward: 40,
  },
  {
    type: 'recovery' as QuestType,
    title: 'Recovery Warrior',
    description: 'Complete a recovery task',
    target: 1,
    xpReward: 40,
  },
];

// Level Titles
export const LEVEL_TITLES: LevelTitle[] = [
  {
    id: 'beginner',
    name: 'Beginner',
    minLevel: 1,
    maxLevel: 3,
    description: 'Just starting the journey',
  },
  {
    id: 'consistent',
    name: 'Consistent',
    minLevel: 4,
    maxLevel: 6,
    description: 'Building solid habits',
  },
  {
    id: 'relentless',
    name: 'Relentless',
    minLevel: 7,
    maxLevel: 9,
    description: 'Pushing through every challenge',
  },
  {
    id: 'athlete',
    name: 'Athlete',
    minLevel: 10,
    maxLevel: 14,
    description: 'Elite performance mindset',
  },
  {
    id: 'unbreakable',
    name: 'Unbreakable',
    minLevel: 15,
    maxLevel: 19,
    description: 'Unstoppable force of discipline',
  },
  {
    id: 'apex',
    name: 'Apex',
    minLevel: 20,
    maxLevel: null,
    description: 'The ultimate peak of dedication',
  },
];
