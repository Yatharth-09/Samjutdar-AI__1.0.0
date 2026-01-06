import type { TaskCategory } from '@/types/task';
import type { BodyTransformationMode as Mode, ModeConfig } from '@/types/mode';

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

// Body Transformation Modes
export const BODY_MODES: Mode[] = ['fatloss', 'muscle', 'maintenance'];

export const MODE_CONFIGS: Record<Mode, ModeConfig> = {
  fatloss: {
    mode: 'fatloss',
    description: 'Fat Loss',
    primaryFocus: 'Cardio + Caloric Deficit',
    recoveryEmphasis: 'low',
  },
  muscle: {
    mode: 'muscle',
    description: 'Muscle Gain',
    primaryFocus: 'Heavy Lifting + Caloric Surplus',
    recoveryEmphasis: 'high',
  },
  maintenance: {
    mode: 'maintenance',
    description: 'Maintenance',
    primaryFocus: 'Balanced Training + Maintenance Diet',
    recoveryEmphasis: 'medium',
  },
};

// Storage Keys
export const STORAGE_KEYS = {
  TASKS: 'ai_fitness_tasks',
  CURRENT_MODE: 'ai_fitness_mode',
  DARK_MODE: 'ai_fitness_dark_mode',
  ANALYTICS: 'ai_fitness_analytics',
} as const;

// App Config
export const APP_CONFIG = {
  APP_NAME: 'SAMJUTDAR AI',
  APP_VERSION: '1.0.0',
  MAX_TASKS_PER_DAY: 20,
  ANALYTICS_CACHE_DURATION: 60 * 60 * 1000, // 1 hour
} as const;
