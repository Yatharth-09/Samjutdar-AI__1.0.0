import type { BodyTransformationMode } from '@/types/mode';
import type { Task } from '@/types/task';
import type { WeeklyWorkoutPlan, SuggestedWorkout } from '@/types/weeklyTask';
import type { AnalyticsState } from '@/types/analytics';
import { MODE_CONFIGS, WORKOUT_TEMPLATES } from './constants';

/**
 * AI Coach logic (rule-based)
 * Generates feedback based on:
 * - Missed tasks
 * - Category imbalance
 * - Current body mode
 * - Completion patterns
 */

export interface CoachFeedback {
  message: string;
  priority: 'high' | 'medium' | 'low';
  category: 'encouragement' | 'warning' | 'insight';
}

export const generateCoachFeedback = (
  todaysTasks: Task[],
  completionRate: number,
  currentMode: BodyTransformationMode
): CoachFeedback[] => {
  const feedback: CoachFeedback[] = [];

  if (todaysTasks.length === 0) {
    feedback.push({
      message: "Let's start the day! Create your first task.",
      priority: 'low',
      category: 'encouragement',
    });
    return feedback;
  }

  // Check completion rate
  if (completionRate === 100) {
    const modeMsg =
      currentMode === 'fatloss'
        ? '🔥 Perfect day! Your caloric deficit is locked in.'
        : currentMode === 'muscle'
          ? '💪 Excellent! Your gains are building steadily.'
          : '✅ Perfect balance today!';

    feedback.push({
      message: modeMsg,
      priority: 'medium',
      category: 'encouragement',
    });
  } else if (completionRate >= 80) {
    feedback.push({
      message: '🎯 Almost there! Finish those remaining tasks.',
      priority: 'medium',
      category: 'encouragement',
    });
  } else if (completionRate >= 50) {
    feedback.push({
      message: '⚠️ You\'re at 50%. Push to complete more tasks today.',
      priority: 'high',
      category: 'warning',
    });
  } else {
    feedback.push({
      message:
        '🆘 Low completion rate. What\'s blocking you? Let\'s refocus.',
      priority: 'high',
      category: 'warning',
    });
  }

  // Category imbalance
  const categoryCount: Record<string, number> = {};
  todaysTasks.forEach((t) => {
    categoryCount[t.category] = (categoryCount[t.category] || 0) + 1;
  });

  const categoryDone: Record<string, number> = {};
  todaysTasks.forEach((t) => {
    if (t.done) {
      categoryDone[t.category] = (categoryDone[t.category] || 0) + 1;
    }
  });

  // Get mode config for priority checking
  const modeConfig = MODE_CONFIGS[currentMode];
  const primaryCategories = modeConfig.primaryCategories;
  const secondaryCategories = modeConfig.secondaryCategories;

  // Check primary focus categories (high severity for incomplete)
  primaryCategories.forEach((category) => {
    const total = categoryCount[category] || 0;
    const done = categoryDone[category] || 0;
    
    if (total > 0 && done === 0) {
      // Missing ALL tasks in primary category
      feedback.push({
        message: `🚨 ${category} incomplete! This is CRITICAL for ${modeConfig.description} mode.`,
        priority: 'high',
        category: 'warning',
      });
    } else if (total > 0 && done < total) {
      // Partially complete primary category
      feedback.push({
        message: `⚠️ ${done}/${total} ${category} tasks done. Complete the rest for optimal progress.`,
        priority: 'high',
        category: 'warning',
      });
    }
  });

  // Check secondary focus categories (lower severity for incomplete)
  secondaryCategories.forEach((category) => {
    const total = categoryCount[category] || 0;
    const done = categoryDone[category] || 0;
    
    if (total > 0 && done === 0) {
      // Missing secondary category tasks (lower priority)
      feedback.push({
        message: `💡 ${category} pending. Not critical but beneficial for overall health.`,
        priority: 'low',
        category: 'insight',
      });
    }
  });

  // Check for missing categories
  const allCategories = ['Workout', 'Cardio', 'Diet', 'Mindset', 'Recovery'];
  const categoriesWithTasks = Object.keys(categoryCount);
  const missingCategories = allCategories.filter(
    (cat) => !categoriesWithTasks.includes(cat)
  );

  if (missingCategories.length > 0 && completionRate < 100) {
    const missingPrimary = missingCategories.filter((cat) =>
      primaryCategories.includes(cat)
    );
    
    if (missingPrimary.length > 0) {
      feedback.push({
        message: `📋 Consider adding: ${missingPrimary.join(', ')} (primary focus areas)`,
        priority: 'medium',
        category: 'insight',
      });
    }
  }

  return feedback;
};

export const selectCoachMessage = (
  feedback: CoachFeedback[]
): CoachFeedback | null => {
  if (feedback.length === 0) return null;

  // Prioritize by priority level, then by category
  const priorityOrder = { high: 3, medium: 2, low: 1 };
  const categoryOrder = { warning: 3, encouragement: 2, insight: 1 };

  return feedback.sort((a, b) => {
    const priorityDiff =
      priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return categoryOrder[b.category] - categoryOrder[a.category];
  })[0];
};

/**
 * Generate AI-suggested weekly workout plan based on:
 * - Current body transformation mode
 * - Recovery score
 * - Completion consistency
 *
 * Returns a structured plan with 3-6 workouts depending on mode and recovery
 */
export const getSuggestedWeeklyPlan = (
  mode: BodyTransformationMode,
  analytics: AnalyticsState | null
): WeeklyWorkoutPlan => {
  const weekStartDate = getMonday(new Date());
  const recoveryScore = analytics?.recovery?.score || 75;
  const completionConsistency = analytics?.weekly?.overallCompletionRate || 50;

  // Get base templates for the mode
  const templates = WORKOUT_TEMPLATES[mode];
  const suggestedWorkouts: SuggestedWorkout[] = [];

  // Adaptation logic based on recovery and consistency
  let shouldReduceVolume = false;
  let shouldIncreaseChallenge = false;
  let shouldAddRecoveryDay = false;

  // Rule 1: Low recovery score (<60) → reduce volume, add recovery
  if (recoveryScore < 60) {
    shouldReduceVolume = true;
    shouldAddRecoveryDay = true;
  }

  // Rule 2: High consistency (>80%) → slightly increase challenge
  if (completionConsistency > 80) {
    shouldIncreaseChallenge = true;
  }

  // Rule 3: Low consistency (<50%) → reduce complexity, maintain frequency
  if (completionConsistency < 50) {
    shouldReduceVolume = true;
  }

  // Build suggested workouts for each day
  for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
    const dayTemplates = templates[dayOfWeek] || [];
    
    if (dayTemplates.length === 0) continue;

    // Apply adaptation rules to template selection
    let selectedTemplates = [...dayTemplates];

    // If recovery is low, filter out high intensity workouts and keep only 1
    if (shouldReduceVolume) {
      selectedTemplates = selectedTemplates.filter(
        (t) => t.intensity !== 'high'
      );
      // Keep at most one workout per day when reducing volume
      selectedTemplates = selectedTemplates.slice(0, 1);
    }

    // If consistency is high, keep more intense variations
    if (shouldIncreaseChallenge) {
      // Keep all templates if they pass filters
      selectedTemplates = dayTemplates;
    } else if (!shouldReduceVolume) {
      // Medium consistency: remove some high intensity but keep structure
      if (mode === 'fatloss' && dayOfWeek !== 0) {
        // For fat loss, limit to 2 workouts max per day unless high consistency
        selectedTemplates = selectedTemplates.slice(0, 2);
      }
    }

    // Convert selected templates to suggested workouts
    selectedTemplates.forEach((template, idx) => {
      const suggestedWorkout: SuggestedWorkout = {
        id: `sw_${weekStartDate}_${dayOfWeek}_${idx}_${Date.now()}`,
        title: template.title,
        category: template.category,
        intensity: template.intensity,
        primaryFocus:
          mode === 'fatloss'
            ? 'fatLoss'
            : mode === 'muscle'
              ? 'muscle'
              : 'balanced',
        dayOfWeek,
        description: template.description,
        isSuggested: true,
        weekStartDate,
      };

      suggestedWorkouts.push(suggestedWorkout);
    });
  }

  // If recovery is very low and no recovery day yet, ensure at least one
  if (
    shouldAddRecoveryDay &&
    !suggestedWorkouts.some((w) => w.category === 'Recovery')
  ) {
    const recoveryDay = 3; // Wednesday default
    suggestedWorkouts.push({
      id: `sw_${weekStartDate}_recovery_${Date.now()}`,
      title: 'Recovery & Mobility',
      category: 'Recovery',
      intensity: 'low',
      primaryFocus: 'balanced',
      dayOfWeek: recoveryDay,
      description: 'Stretching, foam rolling, yoga - prioritize recovery',
      isSuggested: true,
      weekStartDate,
    });
  }

  // Sort workouts by day of week for consistency
  suggestedWorkouts.sort((a, b) => a.dayOfWeek - b.dayOfWeek);

  return {
    id: `plan_${weekStartDate}_${Date.now()}`,
    weekStartDate,
    mode,
    workouts: suggestedWorkouts,
    recoveryScore,
    completionConsistency,
    createdAt: Date.now(),
  };
};

/**
 * Get Monday of the current week (YYYY-MM-DD format)
 */
export const getMonday = (date: Date): string => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
  const monday = new Date(d.setDate(diff));
  
  return monday.toISOString().split('T')[0];
};

/**
 * Check if the week has changed (to avoid regenerating suggestions mid-week)
 */
export const hasWeekChanged = (lastPlanDate: string | null): boolean => {
  if (!lastPlanDate) return true;

  const lastMonday = lastPlanDate;
  const currentMonday = getMonday(new Date());

  return lastMonday !== currentMonday;
};
