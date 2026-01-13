import type { TaskCategory } from '@/types/task';
import type { BodyTransformationMode } from '@/types/mode';

/**
 * Workout priority levels
 * - primary: Main focus of the mode (missing these heavily impacts scores)
 * - secondary: Still important but not the main goal (lighter penalty)
 */
export type WorkoutPriority = 'primary' | 'secondary';

/**
 * Workout template for a specific day
 */
export interface WorkoutTemplate {
  name: string; // e.g., "[Fat Loss] Full Body Circuit"
  category: TaskCategory;
  priority: WorkoutPriority;
  description?: string; // Optional detailed description
}

/**
 * Weekly workout structure for a mode
 */
export interface ModeWorkoutPlan {
  mode: BodyTransformationMode;
  philosophy: string;
  workouts: {
    [day: number]: WorkoutTemplate[]; // day: 0-6 (Sunday-Saturday)
  };
}

/**
 * FAT LOSS MODE
 * Primary: Calorie burn & conditioning
 * Secondary: Muscle preservation
 */
const FAT_LOSS_PLAN: ModeWorkoutPlan = {
  mode: 'fatloss',
  philosophy: 'High-frequency training with emphasis on metabolic stress and calorie burn while preserving muscle mass',
  workouts: {
    1: [ // Monday
      {
        name: '[Fat Loss] Full Body Circuit',
        category: 'Workout',
        priority: 'primary',
        description: 'Compound lifts in circuit format with minimal rest',
      },
    ],
    2: [ // Tuesday
      {
        name: '[Fat Loss] HIIT Cardio 25min',
        category: 'Cardio',
        priority: 'primary',
        description: 'High intensity intervals for maximum calorie burn',
      },
    ],
    3: [ // Wednesday
      {
        name: '[Fat Loss] Upper Body Strength',
        category: 'Workout',
        priority: 'secondary',
        description: 'Maintain muscle mass with moderate volume',
      },
    ],
    4: [ // Thursday
      {
        name: '[Fat Loss] Lower Body + Conditioning',
        category: 'Workout',
        priority: 'primary',
        description: 'Leg work with cardio finisher',
      },
    ],
    5: [ // Friday
      {
        name: '[Fat Loss] Active Recovery or Cardio',
        category: 'Cardio',
        priority: 'secondary',
        description: 'Light cardio or active recovery session',
      },
    ],
    6: [ // Saturday
      {
        name: '[Fat Loss] Metabolic Conditioning',
        category: 'Workout',
        priority: 'primary',
        description: 'Circuit training focused on calorie expenditure',
      },
    ],
  },
};

/**
 * MUSCLE GAIN MODE
 * Primary: Hypertrophy & strength
 * Secondary: Cardiovascular health
 */
const MUSCLE_GAIN_PLAN: ModeWorkoutPlan = {
  mode: 'muscle',
  philosophy: 'Structured progressive overload with adequate recovery and minimal conditioning for health',
  workouts: {
    1: [ // Monday
      {
        name: '[Muscle] Push Day - Chest, Shoulders, Triceps',
        category: 'Workout',
        priority: 'primary',
        description: 'Heavy pressing movements with high volume',
      },
    ],
    2: [ // Tuesday
      {
        name: '[Muscle] Pull Day - Back & Biceps',
        category: 'Workout',
        priority: 'primary',
        description: 'Rowing and pulling movements for back development',
      },
    ],
    3: [ // Wednesday
      {
        name: '[Muscle] Light Cardio 15-20min',
        category: 'Cardio',
        priority: 'secondary',
        description: 'Keep cardiovascular health without impacting recovery',
      },
    ],
    4: [ // Thursday
      {
        name: '[Muscle] Leg Day - Quads, Hamstrings, Glutes',
        category: 'Workout',
        priority: 'primary',
        description: 'Compound leg movements with progressive overload',
      },
    ],
    5: [ // Friday
      {
        name: '[Muscle] Upper Body Accessories',
        category: 'Workout',
        priority: 'primary',
        description: 'Isolation work and weak point training',
      },
    ],
    6: [ // Saturday
      {
        name: '[Muscle] Active Recovery',
        category: 'Recovery',
        priority: 'secondary',
        description: 'Light activity, stretching, or mobility work',
      },
    ],
  },
};

/**
 * MAINTENANCE MODE
 * Primary: Balance & sustainability
 * Secondary: Consistent progress without burnout
 */
const MAINTENANCE_PLAN: ModeWorkoutPlan = {
  mode: 'maintenance',
  philosophy: 'Balanced approach for long-term consistency with moderate volume and recovery',
  workouts: {
    1: [ // Monday
      {
        name: '[Maintenance] Full Body Strength A',
        category: 'Workout',
        priority: 'primary',
        description: 'Balanced full-body session with compound lifts',
      },
    ],
    3: [ // Wednesday
      {
        name: '[Maintenance] Cardio & Conditioning',
        category: 'Cardio',
        priority: 'primary',
        description: 'Moderate intensity cardio for health',
      },
    ],
    5: [ // Friday
      {
        name: '[Maintenance] Full Body Strength B',
        category: 'Workout',
        priority: 'primary',
        description: 'Alternative full-body routine for variety',
      },
    ],
    0: [ // Sunday
      {
        name: '[Maintenance] Active Recovery or Leisure Activity',
        category: 'Recovery',
        priority: 'secondary',
        description: 'Enjoyable physical activity or rest',
      },
    ],
  },
};

/**
 * Get workout plan for a specific mode
 */
export const getWorkoutPlan = (mode: BodyTransformationMode): ModeWorkoutPlan => {
  switch (mode) {
    case 'fatloss':
      return FAT_LOSS_PLAN;
    case 'muscle':
      return MUSCLE_GAIN_PLAN;
    case 'maintenance':
      return MAINTENANCE_PLAN;
    default:
      return MAINTENANCE_PLAN;
  }
};

/**
 * Get all workout templates for a mode as a flat array
 */
export const getWorkoutTemplates = (mode: BodyTransformationMode): Array<{
  dayOfWeek: number;
  template: WorkoutTemplate;
}> => {
  const plan = getWorkoutPlan(mode);
  const templates: Array<{ dayOfWeek: number; template: WorkoutTemplate }> = [];

  Object.entries(plan.workouts).forEach(([day, workouts]) => {
    workouts.forEach((template) => {
      templates.push({
        dayOfWeek: parseInt(day),
        template,
      });
    });
  });

  return templates;
};

/**
 * Check if a category is primary for a given mode
 */
export const isPrimaryFocus = (
  category: TaskCategory,
  mode: BodyTransformationMode
): boolean => {
  const plan = getWorkoutPlan(mode);
  
  // Check if any workout with this category is marked as primary
  for (const workouts of Object.values(plan.workouts)) {
    for (const workout of workouts) {
      if (workout.category === category && workout.priority === 'primary') {
        return true;
      }
    }
  }
  
  return false;
};
