'use client';

import React from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import type { CoachFeedback } from '@/lib/ai';

interface AICoachProps {
  feedback: CoachFeedback | null;
  isLoading?: boolean;
}

const categoryEmoji: Record<CoachFeedback['category'], string> = {
  encouragement: '🌟',
  warning: '⚠️',
  insight: '💡',
};

const priorityColor: Record<CoachFeedback['priority'], string> = {
  high: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
  medium: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
  low: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
};

export const AICoach: React.FC<AICoachProps> = ({ feedback, isLoading }) => {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          🤖 AI Coach Feedback
        </h2>
      </CardHeader>
      <CardBody>
        {isLoading ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            Analyzing your progress...
          </p>
        ) : feedback ? (
          <div className={`p-4 rounded-lg border ${priorityColor[feedback.priority]}`}>
            <div className="flex gap-3">
              <span className="text-2xl">{categoryEmoji[feedback.category]}</span>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {feedback.message}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 capitalize">
                  {feedback.priority} Priority • {feedback.category}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            Complete some tasks to get coaching feedback!
          </p>
        )}
      </CardBody>
    </Card>
  );
};
