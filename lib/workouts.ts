export type MuscleGroup =
  | 'Chest'
  | 'Back'
  | 'Legs'
  | 'Shoulders'
  | 'Arms'
  | 'Core'
  | 'Cardio';

export interface WorkoutCatalogItem {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
}

export const MUSCLE_GROUPS: MuscleGroup[] = [
  'Chest',
  'Back',
  'Legs',
  'Shoulders',
  'Arms',
  'Core',
  'Cardio',
];

export const WORKOUT_CATALOG: WorkoutCatalogItem[] = [
  // Chest
  { id: 'chest_bench_press', name: 'Bench Press', muscleGroup: 'Chest' },
  { id: 'chest_incline_bench_press', name: 'Incline Bench Press', muscleGroup: 'Chest' },
  { id: 'chest_decline_bench_press', name: 'Decline Bench Press', muscleGroup: 'Chest' },
  { id: 'chest_db_bench_press', name: 'Dumbbell Bench Press', muscleGroup: 'Chest' },
  { id: 'chest_incline_db_press', name: 'Incline Dumbbell Press', muscleGroup: 'Chest' },
  { id: 'chest_chest_press_machine', name: 'Chest Press (Machine)', muscleGroup: 'Chest' },
  { id: 'chest_push_ups', name: 'Push-Ups', muscleGroup: 'Chest' },
  { id: 'chest_dips', name: 'Chest Dips', muscleGroup: 'Chest' },
  { id: 'chest_cable_fly', name: 'Cable Fly', muscleGroup: 'Chest' },
  { id: 'chest_db_fly', name: 'Dumbbell Fly', muscleGroup: 'Chest' },
  { id: 'chest_pec_deck', name: 'Pec Deck', muscleGroup: 'Chest' },
  { id: 'chest_cable_crossover', name: 'Cable Crossover', muscleGroup: 'Chest' },
  { id: 'chest_landmine_press', name: 'Landmine Press', muscleGroup: 'Chest' },

  // Back
  { id: 'back_pull_ups', name: 'Pull-Ups', muscleGroup: 'Back' },
  { id: 'back_chin_ups', name: 'Chin-Ups', muscleGroup: 'Back' },
  { id: 'back_assisted_pull_ups', name: 'Assisted Pull-Ups', muscleGroup: 'Back' },
  { id: 'back_lat_pulldown', name: 'Lat Pulldown', muscleGroup: 'Back' },
  { id: 'back_close_grip_lat_pulldown', name: 'Close-Grip Lat Pulldown', muscleGroup: 'Back' },
  { id: 'back_barbell_row', name: 'Barbell Row', muscleGroup: 'Back' },
  { id: 'back_dumbbell_row', name: 'Dumbbell Row', muscleGroup: 'Back' },
  { id: 'back_single_arm_db_row', name: 'Single-Arm Dumbbell Row', muscleGroup: 'Back' },
  { id: 'back_seated_cable_row', name: 'Seated Cable Row', muscleGroup: 'Back' },
  { id: 'back_t_bar_row', name: 'T-Bar Row', muscleGroup: 'Back' },
  { id: 'back_chest_supported_row', name: 'Chest-Supported Row', muscleGroup: 'Back' },
  { id: 'back_inverted_row', name: 'Inverted Row', muscleGroup: 'Back' },
  { id: 'back_face_pulls', name: 'Face Pulls', muscleGroup: 'Back' },
  { id: 'back_straight_arm_pulldown', name: 'Straight-Arm Pulldown', muscleGroup: 'Back' },
  { id: 'back_back_extension', name: 'Back Extensions', muscleGroup: 'Back' },

  // Legs
  { id: 'legs_back_squat', name: 'Back Squat', muscleGroup: 'Legs' },
  { id: 'legs_front_squat', name: 'Front Squat', muscleGroup: 'Legs' },
  { id: 'legs_goblet_squat', name: 'Goblet Squat', muscleGroup: 'Legs' },
  { id: 'legs_hack_squat', name: 'Hack Squat', muscleGroup: 'Legs' },
  { id: 'legs_deadlift', name: 'Deadlift', muscleGroup: 'Legs' },
  { id: 'legs_romanian_deadlift', name: 'Romanian Deadlift', muscleGroup: 'Legs' },
  { id: 'legs_stiff_leg_deadlift', name: 'Stiff-Leg Deadlift', muscleGroup: 'Legs' },
  { id: 'legs_leg_press', name: 'Leg Press', muscleGroup: 'Legs' },
  { id: 'legs_walking_lunges', name: 'Walking Lunges', muscleGroup: 'Legs' },
  { id: 'legs_reverse_lunges', name: 'Reverse Lunges', muscleGroup: 'Legs' },
  { id: 'legs_bulgarian_split_squat', name: 'Bulgarian Split Squat', muscleGroup: 'Legs' },
  { id: 'legs_step_ups', name: 'Step-Ups', muscleGroup: 'Legs' },
  { id: 'legs_leg_extension', name: 'Leg Extensions', muscleGroup: 'Legs' },
  { id: 'legs_hamstring_curl', name: 'Hamstring Curls', muscleGroup: 'Legs' },
  { id: 'legs_glute_bridge', name: 'Glute Bridge', muscleGroup: 'Legs' },
  { id: 'legs_hip_thrust', name: 'Hip Thrust', muscleGroup: 'Legs' },
  { id: 'legs_hip_abduction', name: 'Hip Abduction (Machine)', muscleGroup: 'Legs' },
  { id: 'legs_hip_adduction', name: 'Hip Adduction (Machine)', muscleGroup: 'Legs' },
  { id: 'legs_calf_raises', name: 'Calf Raises', muscleGroup: 'Legs' },
  { id: 'legs_seated_calf_raises', name: 'Seated Calf Raises', muscleGroup: 'Legs' },

  // Shoulders
  { id: 'shoulders_overhead_press', name: 'Overhead Press', muscleGroup: 'Shoulders' },
  { id: 'shoulders_db_shoulder_press', name: 'Dumbbell Shoulder Press', muscleGroup: 'Shoulders' },
  { id: 'shoulders_arnold_press', name: 'Arnold Press', muscleGroup: 'Shoulders' },
  { id: 'shoulders_machine_shoulder_press', name: 'Shoulder Press (Machine)', muscleGroup: 'Shoulders' },
  { id: 'shoulders_lateral_raises', name: 'Lateral Raises', muscleGroup: 'Shoulders' },
  { id: 'shoulders_cable_lateral_raises', name: 'Cable Lateral Raises', muscleGroup: 'Shoulders' },
  { id: 'shoulders_front_raises', name: 'Front Raises', muscleGroup: 'Shoulders' },
  { id: 'shoulders_rear_delt_fly', name: 'Rear Delt Fly', muscleGroup: 'Shoulders' },
  { id: 'shoulders_upright_row', name: 'Upright Row', muscleGroup: 'Shoulders' },
  { id: 'shoulders_shrugs', name: 'Shrugs', muscleGroup: 'Shoulders' },

  // Arms
  { id: 'arms_bicep_curl', name: 'Bicep Curls', muscleGroup: 'Arms' },
  { id: 'arms_barbell_curl', name: 'Barbell Curl', muscleGroup: 'Arms' },
  { id: 'arms_preacher_curl', name: 'Preacher Curl', muscleGroup: 'Arms' },
  { id: 'arms_concentration_curl', name: 'Concentration Curl', muscleGroup: 'Arms' },
  { id: 'arms_hammer_curl', name: 'Hammer Curls', muscleGroup: 'Arms' },
  { id: 'arms_cable_curl', name: 'Cable Curl', muscleGroup: 'Arms' },
  { id: 'arms_tricep_pushdown', name: 'Tricep Pushdown', muscleGroup: 'Arms' },
  { id: 'arms_overhead_tricep_extension', name: 'Overhead Tricep Extension', muscleGroup: 'Arms' },
  { id: 'arms_skull_crushers', name: 'Skull Crushers', muscleGroup: 'Arms' },
  { id: 'arms_tricep_kickbacks', name: 'Tricep Kickbacks', muscleGroup: 'Arms' },
  { id: 'arms_close_grip_bench_press', name: 'Close-Grip Bench Press', muscleGroup: 'Arms' },
  { id: 'arms_dips', name: 'Dips', muscleGroup: 'Arms' },

  // Core
  { id: 'core_plank', name: 'Plank', muscleGroup: 'Core' },
  { id: 'core_side_plank', name: 'Side Plank', muscleGroup: 'Core' },
  { id: 'core_crunches', name: 'Crunches', muscleGroup: 'Core' },
  { id: 'core_sit_ups', name: 'Sit-Ups', muscleGroup: 'Core' },
  { id: 'core_bicycle_crunches', name: 'Bicycle Crunches', muscleGroup: 'Core' },
  { id: 'core_leg_raises', name: 'Leg Raises', muscleGroup: 'Core' },
  { id: 'core_hanging_knee_raises', name: 'Hanging Knee Raises', muscleGroup: 'Core' },
  { id: 'core_hanging_leg_raises', name: 'Hanging Leg Raises', muscleGroup: 'Core' },
  { id: 'core_dead_bug', name: 'Dead Bug', muscleGroup: 'Core' },
  { id: 'core_russian_twists', name: 'Russian Twists', muscleGroup: 'Core' },
  { id: 'core_mountain_climbers', name: 'Mountain Climbers', muscleGroup: 'Core' },
  { id: 'core_ab_wheel_rollout', name: 'Ab Wheel Rollout', muscleGroup: 'Core' },
  { id: 'core_cable_crunch', name: 'Cable Crunch', muscleGroup: 'Core' },
  { id: 'core_pallof_press', name: 'Pallof Press', muscleGroup: 'Core' },

  // Cardio
  { id: 'cardio_treadmill', name: 'Treadmill', muscleGroup: 'Cardio' },
  { id: 'cardio_running', name: 'Running', muscleGroup: 'Cardio' },
  { id: 'cardio_stationary_bike', name: 'Stationary Bike', muscleGroup: 'Cardio' },
  { id: 'cardio_cycling', name: 'Cycling', muscleGroup: 'Cardio' },
  { id: 'cardio_rower', name: 'Rowing Machine', muscleGroup: 'Cardio' },
  { id: 'cardio_jump_rope', name: 'Jump Rope', muscleGroup: 'Cardio' },
  { id: 'cardio_elliptical', name: 'Elliptical', muscleGroup: 'Cardio' },
  { id: 'cardio_stair_climber', name: 'Stair Climber', muscleGroup: 'Cardio' },
  { id: 'cardio_walking', name: 'Walking', muscleGroup: 'Cardio' },
  { id: 'cardio_hiit', name: 'HIIT Intervals', muscleGroup: 'Cardio' },
];
