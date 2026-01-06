import type { BodyTransformationMode } from '@/types/mode';
import type { Task } from '@/types/task';

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

  // Check for missing categories
  const allCategories = ['Workout', 'Cardio', 'Diet', 'Mindset', 'Recovery'];
  const missingCategories = allCategories.filter(
    (cat) => !categoryCount[cat] || categoryCount[cat] === 0
  );

  if (missingCategories.length > 0) {
    feedback.push({
      message: `⚠️ Missing tasks in: ${missingCategories.join(', ')}`,
      priority: 'low',
      category: 'insight',
    });
  }

  // Mode-specific insights
  if (currentMode === 'fatloss') {
    const cardioCount = categoryDone['Cardio'] || 0;
    if (cardioCount === 0 && categoryCount['Cardio'] > 0) {
      feedback.push({
        message:
          '🏃 Cardio incomplete. Critical for your fatloss mode targets.',
        priority: 'high',
        category: 'warning',
      });
    }
  } else if (currentMode === 'muscle') {
    const workoutCount = categoryDone['Workout'] || 0;
    if (workoutCount === 0 && categoryCount['Workout'] > 0) {
      feedback.push({
        message: '💪 Workout incomplete. Muscle gain requires consistency.',
        priority: 'high',
        category: 'warning',
      });
    }

    const recoveryCount = categoryDone['Recovery'] || 0;
    if (recoveryCount === 0 && categoryCount['Recovery'] > 0) {
      feedback.push({
        message: '😴 Recovery is crucial for muscle synthesis. Complete it!',
        priority: 'medium',
        category: 'insight',
      });
    }
  }

  // Recovery check for all modes
  const recoveryCount = categoryDone['Recovery'] || 0;
  if (recoveryCount === 0 && categoryCount['Recovery'] > 0) {
    feedback.push({
      message: '💤 Recovery task pending. Your body needs it.',
      priority: 'low',
      category: 'insight',
    });
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
